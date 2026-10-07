"use client";

// Prototype data store. Everything lives in this browser's localStorage.
// TODO: replace with Supabase tables + Storage once the data model is agreed.
import { useCallback, useSyncExternalStore } from "react";
import type { HealthData } from "./types";
import { buildDemoData } from "./demo-data";

const KEY = "medcair.health.v1";

let cache: HealthData | null = null;
const listeners = new Set<() => void>();

function read(): HealthData {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HealthData;
      if (parsed?.version === 1) return parsed;
    }
  } catch {
    // Fall through to demo data.
  }
  return buildDemoData();
}

function persist(next: HealthData): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false;
  }
}

function getSnapshot(): HealthData | null {
  if (!cache) cache = read();
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
 * Returns the data (null on the server and first render), an `update`
 * function and a `reset` function. `update` returns false if the browser
 * could not save (for example a file that is too big).
 */
export function useHealthData() {
  const data = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const update = useCallback((fn: (d: HealthData) => HealthData): boolean => {
    const current = getSnapshot();
    if (!current) return false;
    const next = fn(current);
    if (!persist(next)) return false;
    cache = next;
    emit();
    return true;
  }, []);

  const reset = useCallback(() => {
    const fresh = buildDemoData();
    persist(fresh);
    cache = fresh;
    emit();
  }, []);

  return { data, update, reset };
}
