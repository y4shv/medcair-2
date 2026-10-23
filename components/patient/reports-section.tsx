"use client";

import { ExternalLink } from "lucide-react";
import type { HealthData } from "@/lib/health/types";
import { formatDate } from "@/lib/health/format";
import { Pill as Tag, Section } from "./ui";

export function ReportsSection({ data }: { data: HealthData }) {
  const reports = [...data.labReports].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Section id="reports" title="My reports in plain words">
      <p
        role="note"
        className="mb-4 rounded-lg border-2 border-gray-900 bg-gray-100 p-3 font-bold"
      >
        This is a summary of your report, not medical advice.
      </p>
      {reports.length === 0 ? (
        <p>No lab reports yet.</p>
      ) : (
        <ul className="space-y-5">
          {reports.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-300 p-4">
              <p className="font-semibold text-gray-700">{formatDate(r.date)}</p>
              <p className="text-xl font-bold">{r.title}</p>
              <p>From: {r.source}</p>
              {r.simulated && (
                <p className="mt-1">
                  <Tag tone="amber">Simulated demo entry</Tag>
                </p>
              )}
              {r.documentUrl ? (
                <a
                  href={r.documentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-indigo-700 underline"
                >
                  Open the original report <ExternalLink className="size-4" aria-hidden />
                </a>
              ) : (
                <p className="mt-2 text-gray-700">No original document on file.</p>
              )}
              <div className="mt-3 space-y-3">
                {r.results.map((res) => (
                  <div key={res.name} className="rounded-lg bg-gray-50 p-3">
                    <p className="text-lg font-bold">{res.name}</p>
                    <p className="text-gray-800">What it measures: {res.measures}</p>
                    <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-3">
                      <div>
                        <dt className="text-sm font-semibold text-gray-700">Your value</dt>
                        <dd className="text-lg font-bold">
                          {res.value} {res.unit}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-semibold text-gray-700">Last time</dt>
                        <dd className="text-lg">
                          {res.previousValue
                            ? `${res.previousValue} ${res.unit}${res.previousDate ? ` (${formatDate(res.previousDate)})` : ""}`
                            : "No earlier value"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-semibold text-gray-700">
                          Range printed on the report
                        </dt>
                        <dd className="text-lg">{res.referenceRange}</dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-base text-gray-700">
                Talk to your doctor about what these numbers mean for you.
              </p>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
