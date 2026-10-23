"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import type { Appointment } from "@/lib/health/types";
import { dueReminders } from "@/lib/health/reminders";
import { formatDate, formatTime } from "@/lib/health/format";

// TODO: reminders only show inside the app for now. SMS/push is not set up.
export function ReminderBanner({
  appointments,
  link = true,
}: {
  appointments: Appointment[];
  link?: boolean;
}) {
  const due = dueReminders(appointments);
  if (due.length === 0) return null;

  return (
    <div
      role="status"
      className="rounded-2xl bg-tint p-5"
    >
      <p className="flex items-center gap-2 text-xl font-bold text-care-deep">
        <Bell className="size-6" aria-hidden /> Reminder
      </p>
      <ul className="mt-2 space-y-1 text-lg text-care-deep">
        {due.map((a) => (
          <li key={a.id}>
            You see {a.doctorName} on {formatDate(a.date)}
            {a.time ? ` at ${formatTime(a.time)}` : ""}, at {a.place}.
          </li>
        ))}
      </ul>
      {link && (
        <Link
          href="/patient/appointments"
          className="mt-2 inline-flex min-h-11 items-center font-bold text-care-deep underline"
        >
          See my appointments
        </Link>
      )}
    </div>
  );
}
