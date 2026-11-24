"use client";

import { ArrowDown, ArrowUp, Equal, ExternalLink } from "lucide-react";
import { OpenFileLink } from "./open-file-link";
import type { HealthData, LabResult } from "@/lib/health/types";
import { formatDate } from "@/lib/health/format";
import { analyseResult } from "@/lib/health/range";
import { Pill, Section } from "./ui";
import { RangeBar } from "./range-bar";

const trendIcon = { lower: ArrowDown, higher: ArrowUp, same: Equal } as const;

function ResultRow({ res }: { res: LabResult }) {
  const view = analyseResult(res);
  const Trend = view?.trend ? trendIcon[view.trend.dir] : null;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-5 border-t border-line-soft py-6">
      <div className="min-w-0 flex-[1_1_220px]">
        <h4 className="text-[19px] font-extrabold">{res.name}</h4>
        <p className="text-base text-ink-muted">{res.measures}</p>
      </div>
      <div className="flex min-w-0 flex-[1_1_340px] flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
          <p className="num text-[34px] font-bold leading-[1.1] tracking-tight">
            {res.value}{" "}
            <span className="text-lg font-semibold text-ink-muted">{res.unit}</span>
          </p>
          {view && (
            <Pill tone={view.status.kind === "within" ? "ok" : "watch"}>{view.statusText}</Pill>
          )}
        </div>
        {view ? (
          <>
            {view.trend && Trend ? (
              <p className="flex items-center gap-1.5 text-[15px] font-bold text-care-deep">
                <Trend className="size-4 shrink-0" strokeWidth={2.6} aria-hidden />
                <span className="num">{view.trend.text}</span>
              </p>
            ) : (
              <p className="text-[15px] font-bold text-ink-muted">No earlier value to compare.</p>
            )}
            <RangeBar view={view} printed={res.referenceRange} />
          </>
        ) : (
          <>
            <p className="text-base text-ink-muted">
              Range printed on the report:{" "}
              <span className="font-bold text-ink">{res.referenceRange}</span>. This range could not be
              drawn as a bar.
            </p>
            <p className="text-base text-ink-muted">
              Last time:{" "}
              {res.previousValue
                ? `${res.previousValue} ${res.unit}${res.previousDate ? ` (${formatDate(res.previousDate)})` : ""}`
                : "No earlier value"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function ReportsSection({ data }: { data: HealthData }) {
  const reports = [...data.labReports].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Section
      id="reports"
      title="My reports in plain words"
      intro="The printed range is the range your lab printed on your report. We show where your number sits, and never say if it is good or bad."
    >
      <p
        role="note"
        className="mb-2 flex items-start gap-2 rounded-xl bg-status-info-bg p-3 text-[15px] font-bold text-status-info lg:hidden"
      >
        This is a summary of your report, not medical advice.
      </p>
      {reports.length === 0 ? (
        <p>No lab reports yet.</p>
      ) : (
        <div className="space-y-8">
          {reports.map((r) => (
            <article key={r.id} id={`report-${r.id}`} aria-label={r.title} className="scroll-mt-40">
              <p className="text-base text-ink-muted">
                {formatDate(r.date)} · {r.title} · From: {r.source}
              </p>
              {r.simulated && (
                <p className="mt-2">
                  <Pill tone="info">Simulated demo entry</Pill>
                </p>
              )}
              {r.documentUrl && !r.documentPath ? (
                <a
                  href={r.documentUrl}
                  className="mt-1.5 inline-flex min-h-11 items-center gap-1 text-base font-bold text-care underline hover:text-care-deep"
                >
                  Open the original report <ExternalLink className="size-4" aria-hidden />
                </a>
              ) : r.documentPath ? (
                <OpenFileLink
                  path={r.documentPath}
                  label="Open the original report"
                  className="mt-1.5 inline-flex min-h-11 items-center gap-1 text-base font-bold text-care underline hover:text-care-deep"
                />
              ) : (
                <p className="mt-1.5 text-base text-ink-muted">No original document on file.</p>
              )}
              <div className="mt-4">
                {r.results.map((res) => (
                  <ResultRow key={res.name} res={res} />
                ))}
              </div>
            </article>
          ))}
          <p className="border-t border-line-soft pt-4 text-base text-ink-muted">
            Talk to your doctor about what these numbers mean for you.
          </p>
        </div>
      )}
    </Section>
  );
}
