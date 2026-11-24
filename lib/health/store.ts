"use client";

// Health data store with two modes:
//  - "cloud": a signed-in patient. Data lives in the Supabase `health_data` table
//    (one JSON document per user, protected by Row Level Security).
//  - "local": demo visitors (no account) and a missing Supabase setup. Fake demo
//    data lives in this browser's localStorage only.
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";
import type { HealthData } from "./types";
import { buildDemoData } from "./demo-data";
import { withParsedRanges } from "./range";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";

const KEY = "medcair.health.v1";

export type StoreMode = "cloud" | "local";

let cache: HealthData | null = null;
let mode: StoreMode = "local";
let loadedFor: string | null = null; // user id, or "local"
let loading: Promise<void> | null = null;
let userId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let modeSnapshot: StoreMode = "local";
let loadError = false;
const listeners = new Set<() => void>();

function normalise(d: HealthData): HealthData {
  return {
    ...d,
    records: d.records ?? [],
    labReports: withParsedRanges(d.labReports ?? []),
    medicines: d.medicines ?? [],
    appointments: d.appointments ?? [],
    consents: d.consents ?? [],
    shareLinks: d.shareLinks ?? [],
    caregivers: d.caregivers ?? [],
  };
}

function readLocal(): HealthData {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HealthData;
      if (parsed?.version === 1) return normalise(parsed);
    }
  } catch {
    // Fall through to demo data.
  }
  return buildDemoData();
}

function persistLocal(next: HealthData): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

export function emptyHealthData(name: string): HealthData {
  return {
    version: 1,
    patient: { name, age: 0, conditions: [] },
    records: [],
    labReports: [],
    medicines: [],
    appointments: [],
    consents: [],
    shareLinks: [],
    caregivers: [],
    abdmFetched: false,
  };
}

async function saveCloud(data: HealthData) {
  if (!userId) return;
  const { error } = await createClient()
    .from("health_data")
    .upsert({ user_id: userId, data });
  if (error) {
    console.error("Saving health data failed", error);
    toast.error("Could not save your changes. Check your connection and try again.");
  }
}

function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    if (cache) void saveCloud(cache);
  }, 400);
}

/** Save any pending change right now (used before navigating away or calling the AI). */
export async function flushSave() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
    if (cache && mode === "cloud") await saveCloud(cache);
  }
}

async function load() {
  if (!hasEnvVars) {
    mode = "local";
    userId = null;
    cache = readLocal();
    loadedFor = "local";
    return;
  }
  const supabase = createClient();
  const { data: sess } = await supabase.auth.getSession();
  const user = sess.session?.user ?? null;

  if (!user) {
    mode = "local";
    userId = null;
    cache = readLocal();
    loadedFor = "local";
    return;
  }

  mode = "cloud";
  userId = user.id;
  const { data: row, error } = await supabase
    .from("health_data")
    .select("data")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Loading health data failed", error);
    toast.error(
      "Could not load your records. The database may not be set up yet (see supabase/migrations).",
    );
    // Keep the cache empty so nothing can overwrite real data that failed to load.
    cache = null;
    loadError = true;
    loadedFor = null;
    return;
  }

  if (row?.data && (row.data as HealthData).version === 1) {
    cache = normalise(row.data as HealthData);
  } else {
    cache = emptyHealthData(displayName(user));
    await saveCloud(cache);
  }
  loadedFor = user.id;
}

function displayName(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): string {
  const meta = user.user_metadata ?? {};
  const n = (meta.full_name ?? meta.name) as string | undefined;
  return n?.trim() || user.email?.split("@")[0] || "My health";
}

async function ensureLoaded() {
  if (loading) return loading;
  loading = (async () => {
    try {
      let uid: string | null = null;
      if (hasEnvVars) {
        const { data } = await createClient().auth.getSession();
        uid = data.session?.user.id ?? null;
      }
      if (loadedFor !== null && loadedFor === (uid ?? "local") && cache) return;
      // A different person (or first visit): drop whatever was cached.
      if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
      }
      cache = null;
      loadError = false;
      emit();
      await load();
    } finally {
      modeSnapshot = mode;
      loading = null;
      emit();
    }
  })();
  return loading;
}

function getSnapshot(): HealthData | null {
  return cache;
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function emit() {
  listeners.forEach((l) => l());
}

/**
 * Returns the data (null until loaded), an `update` function, a `reset`
 * function (demo mode only) and the current `mode`. `update` returns false if
 * the data could not be saved (for example a file too big for the browser).
 */
export function useHealthData() {
  const data = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const currentMode = useSyncExternalStore(subscribe, () => modeSnapshot, () => "local" as StoreMode);

  const failed = useSyncExternalStore(subscribe, () => loadError, () => false);

  useEffect(() => {
    void ensureLoaded();
  }, []);

  const update = useCallback((fn: (d: HealthData) => HealthData): boolean => {
    const current = getSnapshot();
    if (!current) return false;
    const next = fn(current);
    if (mode === "local") {
      if (!persistLocal(next)) return false;
      cache = next;
    } else {
      cache = next;
      scheduleSave();
    }
    emit();
    return true;
  }, []);

  const reset = useCallback(() => {
    if (mode !== "local") return;
    const fresh = buildDemoData();
    persistLocal(fresh);
    cache = fresh;
    emit();
  }, []);

  return { data, update, reset, mode: currentMode, failed };
}

export function getUserId() {
  return userId;
}

/** Forget everything held in memory (call when logging out). */
export function clearStore() {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  cache = null;
  loadedFor = null;
  userId = null;
  loadError = false;
  emit();
}
