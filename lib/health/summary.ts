import type { HealthData } from "./types";

const kindLabels = {
  visit: "Visit",
  diagnosis: "Diagnosis",
  prescription: "Prescription",
  document: "Document",
} as const;

/** Plain rows for the shared summary: records plus lab reports, newest first. */
export function buildTimelineRows(data: HealthData) {
  const rows = [
    ...data.records.map((r) => ({
      date: r.date,
      kind: kindLabels[r.kind],
      title: r.title,
      source: r.source,
    })),
    ...data.labReports.map((l) => ({
      date: l.date,
      kind: "Lab report",
      title: l.title,
      source: l.source,
    })),
  ];
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}
