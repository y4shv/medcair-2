"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarDays, MapPin, Trash2 } from "lucide-react";
import { useHealthData } from "@/lib/health/store";
import { formatDate, formatTime, newId, todayIso } from "@/lib/health/format";
import { appointmentStart, reminderLabels } from "@/lib/health/reminders";
import type { Appointment, ReminderOption } from "@/lib/health/types";
import { ReminderBanner } from "@/components/patient/reminder-banner";
import { Btn, Field, Loading, Pill, Section, inputClass } from "@/components/patient/ui";

// TODO: The professor has not decided yet whether booking stays in the product.
// For now this page only lets the patient LOG appointments they already have.
// If booking comes back, add it here (slots, clinic search) as a separate flow.

export default function AppointmentsPage() {
  const { data, update } = useHealthData();
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState<ReminderOption>("1d");

  if (!data) return <Loading />;

  const sorted = [...data.appointments].sort(
    (a, b) => appointmentStart(a).getTime() - appointmentStart(b).getTime(),
  );
  const now = Date.now();
  const upcoming = sorted.filter((a) => appointmentStart(a).getTime() >= now);
  const past = sorted.filter((a) => appointmentStart(a).getTime() < now).reverse();

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const appt: Appointment = {
      id: newId(),
      doctorName: doctorName.trim(),
      date,
      time: time || undefined,
      place: place.trim(),
      notes: notes.trim() || undefined,
      reminder,
    };
    if (update((d) => ({ ...d, appointments: [...d.appointments, appt] }))) {
      toast.success("Appointment saved");
      setDoctorName("");
      setDate("");
      setTime("");
      setPlace("");
      setNotes("");
    } else {
      toast.error("Could not save. Please try again.");
    }
  };

  const remove = (id: string) => {
    update((d) => ({ ...d, appointments: d.appointments.filter((a) => a.id !== id) }));
    toast.success("Appointment removed");
  };

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 pb-16 pt-8">
      <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">My appointments</h1>
      <ReminderBanner appointments={data.appointments} link={false} />

      <Section
        id="add"
        title="Add an appointment"
        intro="Write down a visit you have already planned with a doctor."
      >
        <form onSubmit={add} className="grid gap-4">
          <Field label="Doctor's name" htmlFor="doctor">
            <input
              id="doctor"
              required
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Dr. Anita Rao"
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date" htmlFor="date">
              <input
                id="date"
                type="date"
                required
                min={todayIso()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Time (optional)" htmlFor="time">
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Place" htmlFor="place">
            <input
              id="place"
              required
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Clinic or hospital name"
              className={inputClass}
            />
          </Field>
          <Field label="Notes (optional)" htmlFor="notes">
            <textarea
              id="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Things to carry or ask"
              className={inputClass}
            />
          </Field>
          <Field label="Remind me" htmlFor="reminder">
            <select
              id="reminder"
              value={reminder}
              onChange={(e) => setReminder(e.target.value as ReminderOption)}
              className={inputClass}
            >
              {(Object.keys(reminderLabels) as ReminderOption[]).map((k) => (
                <option key={k} value={k}>
                  {reminderLabels[k]}
                </option>
              ))}
            </select>
          </Field>
          <Btn type="submit" className="sm:w-fit">
            Save appointment
          </Btn>
        </form>
      </Section>

      <Section id="upcoming" title="Coming up">
        {upcoming.length === 0 ? (
          <p>You have no appointments saved.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} a={a} onRemove={remove} />
            ))}
          </ul>
        )}
      </Section>

      {past.length > 0 && (
        <Section id="past" title="Earlier">
          <ul className="space-y-3">
            {past.map((a) => (
              <AppointmentCard key={a.id} a={a} onRemove={remove} />
            ))}
          </ul>
        </Section>
      )}
    </main>
  );
}

function AppointmentCard({
  a,
  onRemove,
}: {
  a: Appointment;
  onRemove: (id: string) => void;
}) {
  return (
    <li className="rounded-xl border border-line-soft p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xl font-bold">{a.doctorName}</p>
          <p className="mt-1 flex items-center gap-2">
            <CalendarDays className="size-5" aria-hidden />
            {formatDate(a.date)}
            {a.time ? ` at ${formatTime(a.time)}` : ""}
          </p>
          <p className="mt-1 flex items-center gap-2">
            <MapPin className="size-5" aria-hidden />
            {a.place}
          </p>
          {a.notes && <p className="mt-2 text-ink">Notes: {a.notes}</p>}
          <p className="mt-2">
            <Pill tone={a.reminder === "none" ? "neutral" : "ok"}>
              Reminder: {reminderLabels[a.reminder]}
            </Pill>
          </p>
        </div>
        <Btn variant="outline" onClick={() => onRemove(a.id)} aria-label={`Remove appointment with ${a.doctorName}`}>
          <Trash2 className="size-5" aria-hidden /> Remove
        </Btn>
      </div>
    </li>
  );
}
