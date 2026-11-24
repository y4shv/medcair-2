import type { HealthData } from "./types";
import { buildTimelineRows } from "./summary";

// Signed-in patients get a short link (/share?id=...) backed by a Firestore copy that can be
// revoked for real. Demo visitors get a long link that carries the summary after the #.

export interface SharePayload {
  v: 1;
  generatedAt: string;
  expiresAt: string;
  /** Who the link was made for. */
  forName?: string;
  patient: { name: string; age: number; conditions: string[] };
  medicines?: { name: string; dose: string; howToTake: string; prescriber: string }[];
  labs?: {
    title: string;
    source: string;
    date: string;
    results: { name: string; value: string; unit: string; range: string }[];
  }[];
  history?: { date: string; kind: string; title: string; source: string }[];
}

export interface ShareOptions {
  medicines: boolean;
  labs: boolean;
  history: boolean;
  hours: number;
  forName?: string;
}

export function buildPayload(data: HealthData, opts: ShareOptions): SharePayload {
  const now = new Date();
  const payload: SharePayload = {
    v: 1,
    generatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + opts.hours * 3600000).toISOString(),
    forName: opts.forName?.trim() || undefined,
    patient: {
      name: data.patient.name,
      age: data.patient.age,
      conditions: data.patient.conditions,
    },
  };
  if (opts.medicines) {
    payload.medicines = data.medicines.map((m) => ({
      name: m.name,
      dose: m.dose,
      howToTake: m.howToTake,
      prescriber: m.prescriber,
    }));
  }
  if (opts.labs) {
    payload.labs = data.labReports.map((l) => ({
      title: l.title,
      source: l.source,
      date: l.date,
      results: l.results.map((r) => ({
        name: r.name,
        value: r.value,
        unit: r.unit,
        range: r.referenceRange,
      })),
    }));
  }
  if (opts.history) payload.history = buildTimelineRows(data);
  return payload;
}

export function encodePayload(p: SharePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(p));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodePayload(hash: string): SharePayload | null {
  try {
    const b64 = hash.replace(/^#/, "").replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as SharePayload;
    return parsed?.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}
