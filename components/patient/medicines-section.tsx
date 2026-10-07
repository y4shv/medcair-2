"use client";

import { Clock } from "lucide-react";
import type { HealthData } from "@/lib/health/types";
import { estimateRefill, formatDate, formatTime } from "@/lib/health/format";
import { Pill as Tag, Section } from "./ui";

export function MedicinesSection({ data }: { data: HealthData }) {
  return (
    <Section
      id="medicines"
      title="My medicines"
      intro="Medicines from all your prescriptions, in one list."
    >
      {data.medicines.length === 0 ? (
        <p>No medicines yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.medicines.map((m) => {
            const { daysLeft, refillBy } = estimateRefill(m.remaining, m.perDay);
            const low = daysLeft <= 7;
            return (
              <li key={m.id} className="rounded-xl border border-gray-300 p-4">
                <p className="text-xl font-bold">
                  {m.name} <span className="font-semibold">{m.dose}</span>
                </p>
                <p>{m.howToTake}</p>
                <p className="mt-1 text-gray-800">
                  Prescribed by: {m.prescriber}
                </p>
                {m.forCondition && (
                  <p className="text-gray-800">For: {m.forCondition}</p>
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
                  {low && <Tag tone="amber">Refill soon</Tag>}
                </p>
                {m.simulated && (
                  <p className="mt-1">
                    <Tag tone="amber">Simulated demo entry</Tag>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-base text-gray-700">
        Reminder times are shown here only. This app does not send alerts yet.
        The refill date is an estimate from the count and doses per day.
      </p>
    </Section>
  );
}
