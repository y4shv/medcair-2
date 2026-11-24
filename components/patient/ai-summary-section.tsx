"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import type { AiSummary, HealthData } from "@/lib/health/types";
import { flushSave, type StoreMode } from "@/lib/health/store";
import { formatDateTime } from "@/lib/health/format";
import { Btn, Section } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

export function AiSummarySection({
  data,
  update,
  mode,
}: {
  data: HealthData;
  update: Update;
  mode: StoreMode;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const summary = data.aiSummary;
  const empty = data.labReports.length + data.medicines.length + data.records.length === 0;

  const generate = async () => {
    setBusy(true);
    setError("");
    try {
      await flushSave(); // the server reads the saved copy
      const res = await fetch("/api/ai/summary", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "Could not write the summary.");
        return;
      }
      update((d) => ({ ...d, aiSummary: body.summary as AiSummary }));
      toast.success("Summary ready");
    } catch {
      setError("Could not reach the AI. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      id="summary"
      title="My health in plain words"
      intro="An AI reads all your records and writes a short summary you can understand."
    >
      {mode === "local" ? (
        <p className="text-base">
          The AI summary needs an account so your records can be stored safely.{" "}
          <Link href="/auth/sign-up" className="font-bold text-care underline">
            Create a free account
          </Link>
          .
        </p>
      ) : (
        <>
          {summary ? (
            <div className="space-y-5">
              <p className="text-lg">{summary.overview}</p>
              {summary.keyPoints.length > 0 && (
                <div>
                  <h3 className="text-lg font-extrabold">Worth noticing</h3>
                  <ul className="mt-1 list-disc space-y-1.5 pl-6">
                    {summary.keyPoints.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}
              {summary.questionsForDoctor.length > 0 && (
                <div className="rounded-xl bg-tint p-4">
                  <h3 className="text-lg font-extrabold">Questions you could ask your doctor</h3>
                  <ul className="mt-1 list-disc space-y-1.5 pl-6">
                    {summary.questionsForDoctor.map((k, i) => (
                      <li key={i}>{k}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-sm text-ink-muted">
                Written by AI on {formatDateTime(summary.generatedAt)}. It can make mistakes and is not medical
                advice. Talk to your doctor about what these numbers mean for you.
              </p>
            </div>
          ) : (
            <p className="text-base text-ink-muted">
              {empty ? "Add a report or medicine first, then ask for a summary." : "No summary yet."}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Btn onClick={generate} disabled={busy || empty}>
              <Sparkles className="size-5" aria-hidden />
              {busy ? "Writing your summary..." : summary ? "Update summary" : "Write my summary"}
            </Btn>
            {error && (
              <p role="alert" className="font-semibold text-status-critical">
                {error}
              </p>
            )}
          </div>
        </>
      )}
    </Section>
  );
}
