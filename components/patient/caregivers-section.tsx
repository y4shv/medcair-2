"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Caregiver, HealthData } from "@/lib/health/types";
import { formatDate, newId, todayIso } from "@/lib/health/format";
import { Btn, Field, Pill, Section, inputClass } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

// TODO: no invite message is sent and caregivers cannot log in yet.
// Real caregiver access needs accounts, an invite email/SMS and server checks.
export function CaregiversSection({ data, update }: { data: HealthData; update: Update }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const invite = (e: React.FormEvent) => {
    e.preventDefault();
    const c: Caregiver = {
      id: newId(),
      name: name.trim(),
      contact: contact.trim(),
      status: "invited",
      invitedOn: todayIso(),
      revoked: false,
    };
    update((d) => ({ ...d, caregivers: [c, ...d.caregivers] }));
    toast.success("Caregiver added to your list");
    setName("");
    setContact("");
  };

  const revoke = (id: string) => {
    update((d) => ({
      ...d,
      caregivers: d.caregivers.map((c) => (c.id === id ? { ...c, revoked: true } : c)),
    }));
    toast.success("Caregiver access removed");
  };

  return (
    <Section
      id="caregivers"
      title="My caregivers"
      intro="A caregiver is a family member or friend who helps you. They can only look. They cannot change anything."
    >
      <ul className="space-y-3">
        {data.caregivers.map((c) => (
          <li key={c.id} className="rounded-xl border border-gray-300 p-4">
            <p className="text-lg font-bold">{c.name}</p>
            <p>{c.contact}</p>
            <p>Added: {formatDate(c.invitedOn)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Pill tone="green">View only</Pill>
              {c.revoked ? (
                <Pill tone="gray">Access removed</Pill>
              ) : (
                <>
                  <Pill tone={c.status === "active" ? "green" : "amber"}>
                    {c.status === "active" ? "Has access" : "Invited"}
                  </Pill>
                  <Btn variant="danger" onClick={() => revoke(c.id)} aria-label={`Remove access for ${c.name}`}>
                    Remove access
                  </Btn>
                </>
              )}
            </div>
          </li>
        ))}
        {data.caregivers.length === 0 && <li>No caregivers yet.</li>}
      </ul>

      <h3 className="mt-8 text-xl font-bold">Invite a caregiver</h3>
      <form onSubmit={invite} className="mt-2 grid gap-4 sm:max-w-md">
        <Field label="Name" htmlFor="cg-name">
          <input id="cg-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Phone or email" htmlFor="cg-contact">
          <input id="cg-contact" required value={contact} onChange={(e) => setContact(e.target.value)} className={inputClass} />
        </Field>
        <Btn type="submit" className="sm:w-fit">
          Invite (view only)
        </Btn>
      </form>
      <p className="mt-3 text-base text-gray-700">
        Note: in this prototype no message is sent. This only saves the invite in your list.
      </p>
    </Section>
  );
}
