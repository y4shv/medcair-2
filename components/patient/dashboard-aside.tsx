import Link from "next/link";
import { Bell, Info } from "lucide-react";
import type { Appointment } from "@/lib/health/types";
import { appointmentStart } from "@/lib/health/reminders";
import { formatDate, formatTime } from "@/lib/health/format";

function nextAppointment(appointments: Appointment[], now = new Date()) {
  return appointments
    .filter((a) => appointmentStart(a).getTime() >= now.getTime())
    .sort((a, b) => appointmentStart(a).getTime() - appointmentStart(b).getTime())[0];
}

export function DashboardAside({ appointments }: { appointments: Appointment[] }) {
  const next = nextAppointment(appointments);

  return (
    <aside className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
      <div className="flex flex-col gap-2.5 rounded-xl bg-tint p-6">
        <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.06em] text-care-deep">
          <Bell className="size-5" strokeWidth={2.2} aria-hidden />
          Next appointment
        </p>
        {next ? (
          <>
            <p className="text-2xl font-extrabold leading-tight">
              {formatDate(next.date)}
              {next.time ? `, ${formatTime(next.time)}` : ""}
            </p>
            <p className="text-base">
              {next.doctorName}
              <br />
              {next.place}
            </p>
          </>
        ) : (
          <p className="text-base">You have no upcoming appointment written down.</p>
        )}
        <Link
          href="/patient/appointments"
          className="mt-1.5 inline-flex min-h-12 items-center justify-center rounded-xl bg-care text-base font-extrabold text-white hover:bg-care-deep"
        >
          See my appointments
        </Link>
      </div>

      <div
        role="note"
        className="flex items-start gap-3 rounded-xl bg-status-info-bg px-6 py-5 text-status-info"
      >
        <Info className="mt-0.5 size-[22px] shrink-0" strokeWidth={2.4} aria-hidden />
        <p className="text-[15px] font-bold">
          This is a summary of your report, not medical advice. Student prototype: every record here
          is fake demo data.
        </p>
      </div>
    </aside>
  );
}
