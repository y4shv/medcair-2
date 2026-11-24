"use client";

import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { HealthData } from "@/lib/health/types";
import { estimateRefill, formatDate, formatTime, todayIso } from "@/lib/health/format";
import { Pill as Tag, Section } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

const groups = [
  { label: "Morning", from: 0, to: 12 },
  { label: "Afternoon", from: 12, to: 17 },
  { label: "Evening and night", from: 17, to: 24 },
];

/** Every dose for today in time order, grouped, with a tick box for each one. */
function TodayBox({ data, update }: { data: HealthData; update: Update }) {
  const today = todayIso();
  const taken = data.dosesTaken?.[today] ?? [];

  const byTime = new Map<string, HealthData["medicines"]>();
  for (const m of data.medicines) {
    for (const t of m.reminderTimes) byTime.set(t, [...(byTime.get(t) ?? []), m]);
  }
  const times = [...byTime.keys()].sort();
  const noTime = data.medicines.filter((m) => m.reminderTimes.length === 0);
  if (times.length === 0 && noTime.length === 0) return null;

  const toggle = (key: string) =>
    update((d) => {
      const cur = d.dosesTaken?.[today] ?? [];
      const next = cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key];
      return { ...d, dosesTaken: { [today]: next } }; // only today is kept
    });

  const total = times.reduce((n, t) => n + byTime.get(t)!.length, 0);
  const done = times.reduce((n, t) => n + byTime.get(t)!.filter((m) => taken.includes(`${m.id}@${t}`)).length, 0);

  return (
    <div className="mb-6 rounded-xl bg-tint p-5" aria-labelledby="today-title">
      <h3 id="today-title" className="text-xl font-extrabold text-care-deep">
        Today, {formatDate(today)}
      </h3>
      {total > 0 && (
        <p className="mt-0.5 text-base text-ink-muted">
          {done} of {total} doses ticked off
        </p>
      )}
      {groups.map((g) => {
        const gt = times.filter((t) => {
          const h = Number(t.split(":")[0]);
          return h >= g.from && h < g.to;
        });
        if (gt.length === 0) return null;
        return (
          <div key={g.label} className="mt-3">
            <p className="text-sm font-extrabold uppercase tracking-[0.06em] text-care-deep">{g.label}</p>
            <ul className="mt-1 divide-y divide-line-soft">
              {gt.flatMap((t) =>
                byTime.get(t)!.map((m) => {
                  const key = `${m.id}@${t}`;
                  return (
                    <li key={key}>
                      <label className="flex min-h-12 items-center gap-3 py-1">
                        <input
                          type="checkbox"
                          checked={taken.includes(key)}
                          onChange={() => toggle(key)}
                          className="size-6 accent-care"
                        />
                        <span className="num w-20 shrink-0 text-lg font-bold">{formatTime(t)}</span>
                        <span className={taken.includes(key) ? "text-ink-muted line-through" : ""}>
                          <b>{m.name}</b> {m.dose}
                          <span className="text-ink-muted"> · {m.howToTake}</span>
                        </span>
                      </label>
                    </li>
                  );
                }),
              )}
            </ul>
          </div>
        );
      })}
      {noTime.length > 0 && (
        <p className="mt-3 text-base text-ink-muted">
          No time set: {noTime.map((m) => `${m.name} ${m.dose}`.trim()).join(", ")}
        </p>
      )}
    </div>
  );
}

export function MedicinesSection({ data, update }: { data: HealthData; update: Update }) {
  return (
    <Section
      id="medicines"
      title="My medicines"
      intro="Medicines from all your prescriptions, in one list."
    >
      {data.medicines.length === 0 ? (
        <p>No medicines yet.</p>
      ) : (
        <>
        <TodayBox data={data} update={update} />
        <h3 className="mb-3 text-xl font-bold">All my medicines</h3>
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.medicines.map((m) => {
            const { daysLeft, refillBy } = estimateRefill(m.remaining, m.perDay);
            const low = daysLeft <= 7;
            return (
              <li key={m.id} className="rounded-xl border border-line-soft p-4">
                <p className="text-xl font-bold">
                  {m.name} <span className="font-semibold">{m.dose}</span>
                </p>
                <p>{m.howToTake}</p>
                <p className="mt-1 text-ink">
                  Prescribed by: {m.prescriber}
                </p>
                {m.forCondition && (
                  <p className="text-ink">For: {m.forCondition}</p>
                )}
                <p className="mt-2 flex flex-wrap items-center gap-2">
                  <Clock className="size-5" aria-hidden />
                  {m.reminderTimes.length > 0
                    ? m.reminderTimes.map((t) => formatTime(t)).join(", ")
                    : "No reminder times set"}
                </p>
                <p className="mt-2 font-semibold">
                  {m.remaining} left (about {daysLeft} days)
                </p>
                <p>
                  Estimated refill by: {formatDate(refillBy)}{" "}
                  {low && <Tag tone="watch">Refill soon</Tag>}
                </p>
                {!m.simulated && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm(`Remove ${m.name} from your medicines?`)) return;
                      update((d) => ({ ...d, medicines: d.medicines.filter((x) => x.id !== m.id) }));
                      toast.success("Medicine removed");
                    }}
                    className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-base font-bold text-status-critical hover:underline"
                    aria-label={`Remove ${m.name}`}
                  >
                    <Trash2 className="size-4" aria-hidden /> Remove
                  </button>
                )}
                {m.simulated && (
                  <p className="mt-1">
                    <Tag tone="info">Simulated demo entry</Tag>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        </>
      )}
      <p className="mt-4 text-base text-ink-muted">
        Reminder times are shown here only. This app does not send alerts yet.
        The refill date is an estimate from the count and doses per day.
      </p>
    </Section>
  );
}
