"use client";

import { FileText, FlaskConical, Pill, Stethoscope, ClipboardList, Trash2 } from "lucide-react";
import type { HealthData } from "@/lib/health/types";
import { toast } from "sonner";
import { OpenFileLink, deleteStoredFile } from "./open-file-link";
import { formatDate } from "@/lib/health/format";
import { Pill as Tag, Section } from "./ui";

type Entry = {
  id: string;
  date: string;
  kindLabel: string;
  icon: React.ElementType;
  title: string;
  source: string;
  details?: string;
  simulated?: boolean;
  fileUrl?: string;
  fileName?: string;
  filePath?: string;
  type: "record" | "lab";
};

export function buildTimeline(data: HealthData): Entry[] {
  const fromRecords: Entry[] = data.records.map((r) => ({
    id: r.id,
    date: r.date,
    kindLabel:
      r.kind === "visit"
        ? "Visit"
        : r.kind === "diagnosis"
          ? "Diagnosis"
          : r.kind === "prescription"
            ? "Prescription"
            : "Document",
    icon:
      r.kind === "visit"
        ? Stethoscope
        : r.kind === "diagnosis"
          ? ClipboardList
          : r.kind === "prescription"
            ? Pill
            : FileText,
    title: r.title,
    source: r.source,
    details: r.details,
    simulated: r.simulated,
    fileUrl: r.fileUrl,
    fileName: r.fileName,
    filePath: r.filePath,
    type: "record",
  }));
  const fromLabs: Entry[] = data.labReports.map((l) => ({
    id: l.id,
    date: l.date,
    kindLabel: "Lab report",
    icon: FlaskConical,
    title: l.title,
    source: l.source,
    simulated: l.simulated,
    filePath: l.documentPath,
    fileUrl: l.documentUrl,
    fileName: l.title,
    type: "lab",
  }));
  return [...fromRecords, ...fromLabs].sort((a, b) => b.date.localeCompare(a.date));
}

type Update = (fn: (d: HealthData) => HealthData) => boolean;

export function HealthTimeline({ data, update }: { data: HealthData; update: Update }) {
  const entries = buildTimeline(data);

  const remove = async (e: Entry) => {
    if (!window.confirm(`Remove "${e.title}" from your records?${e.filePath ? " The uploaded file is deleted too." : ""}`)) return;
    update((d) => ({
      ...d,
      records: e.type === "record" ? d.records.filter((r) => r.id !== e.id) : d.records,
      labReports: e.type === "lab" ? d.labReports.filter((l) => l.id !== e.id) : d.labReports,
    }));
    await deleteStoredFile(e.filePath);
    toast.success("Removed");
  };

  return (
    <Section
      id="timeline"
      title="My health timeline"
      intro="Visits, diagnoses, prescriptions and lab reports. Newest first."
    >
      {entries.length === 0 ? (
        <p>No records yet. Use Add records below.</p>
      ) : (
        <ol className="space-y-4 border-l-4 border-care pl-4">
          {entries.map((e) => {
            const Icon = e.icon;
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-[29px] top-1 flex size-6 items-center justify-center rounded-full bg-care text-white">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <p className="font-semibold text-ink-muted">
                  {formatDate(e.date)} · {e.kindLabel}
                </p>
                <p className="text-xl font-bold">{e.title}</p>
                <p>From: {e.source}</p>
                {e.details && <p className="text-ink">{e.details}</p>}
                {(e.filePath || e.fileUrl) && (
                  <OpenFileLink
                    path={e.filePath}
                    url={e.fileUrl}
                    label={e.type === "lab" ? "Open original report" : `Open file${e.fileName ? `: ${e.fileName}` : ""}`}
                    className="inline-flex min-h-11 items-center gap-1 font-semibold text-care-deep underline"
                  />
                )}
                {e.simulated && (
                  <p className="mt-1">
                    <Tag tone="info">Simulated demo entry</Tag>
                  </p>
                )}
                {!e.simulated && (
                  <button
                    type="button"
                    onClick={() => void remove(e)}
                    className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-base font-bold text-status-critical hover:underline"
                    aria-label={`Remove ${e.title}`}
                  >
                    <Trash2 className="size-4" aria-hidden /> Remove
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
