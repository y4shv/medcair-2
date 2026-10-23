"use client";

import { FileText, FlaskConical, Pill, Stethoscope, ClipboardList } from "lucide-react";
import type { HealthData } from "@/lib/health/types";
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
  }));
  const fromLabs: Entry[] = data.labReports.map((l) => ({
    id: l.id,
    date: l.date,
    kindLabel: "Lab report",
    icon: FlaskConical,
    title: l.title,
    source: l.source,
    simulated: l.simulated,
  }));
  return [...fromRecords, ...fromLabs].sort((a, b) => b.date.localeCompare(a.date));
}

export function HealthTimeline({ data }: { data: HealthData }) {
  const entries = buildTimeline(data);

  return (
    <Section
      id="timeline"
      title="My health timeline"
      intro="Visits, diagnoses, prescriptions and lab reports. Newest first."
    >
      {entries.length === 0 ? (
        <p>No records yet. Use Add records below.</p>
      ) : (
        <ol className="space-y-4 border-l-4 border-indigo-600 pl-4">
          {entries.map((e) => {
            const Icon = e.icon;
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-[29px] top-1 flex size-6 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                <p className="font-semibold text-gray-700">
                  {formatDate(e.date)} · {e.kindLabel}
                </p>
                <p className="text-xl font-bold">{e.title}</p>
                <p>From: {e.source}</p>
                {e.details && <p className="text-gray-800">{e.details}</p>}
                {e.fileUrl && (
                  <a
                    href={e.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-indigo-700 underline"
                  >
                    Open file{e.fileName ? `: ${e.fileName}` : ""}
                  </a>
                )}
                {e.simulated && (
                  <p className="mt-1">
                    <Tag tone="amber">Simulated demo entry</Tag>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </Section>
  );
}
