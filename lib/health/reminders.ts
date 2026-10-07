import type { Appointment, ReminderOption } from "./types";

export const reminderLabels: Record<ReminderOption, string> = {
  none: "No reminder",
  "1d": "1 day before",
  "2h": "2 hours before",
};

const HOURS: Record<ReminderOption, number> = { none: 0, "1d": 24, "2h": 2 };

export function appointmentStart(a: Appointment): Date {
  return new Date(`${a.date}T${a.time || "09:00"}:00`);
}

/** Appointments whose reminder window has started and not yet passed. */
export function dueReminders(appointments: Appointment[], now = new Date()) {
  return appointments
    .filter((a) => {
      if (a.reminder === "none") return false;
      const start = appointmentStart(a).getTime();
      const from = start - HOURS[a.reminder] * 3600000;
      return now.getTime() >= from && now.getTime() < start;
    })
    .sort((a, b) => appointmentStart(a).getTime() - appointmentStart(b).getTime());
}
