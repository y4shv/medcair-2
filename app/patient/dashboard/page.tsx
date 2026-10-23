"use client";

import { toast } from "sonner";
import { useHealthData } from "@/lib/health/store";
import { ReminderBanner } from "@/components/patient/reminder-banner";
import { HealthTimeline } from "@/components/patient/health-timeline";
import { MedicinesSection } from "@/components/patient/medicines-section";
import { ReportsSection } from "@/components/patient/reports-section";
import { ConsentSection } from "@/components/patient/consent-section";
import { CaregiversSection } from "@/components/patient/caregivers-section";
import { AddRecordsSection } from "@/components/patient/add-records-section";
import { Btn, Loading } from "@/components/patient/ui";

const sections = [
  { id: "timeline", label: "Timeline" },
  { id: "medicines", label: "Medicines" },
  { id: "reports", label: "Reports" },
  { id: "sharing", label: "Sharing" },
  { id: "caregivers", label: "Caregivers" },
  { id: "add", label: "Add records" },
];

export default function PatientDashboard() {
  const { data, update, reset } = useHealthData();

  if (!data) return <Loading />;

  return (
    <>
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{data.patient.name}</h1>
            <p className="text-gray-100">
              {data.patient.age} years · {data.patient.conditions.join(", ")}
            </p>
          </div>
          <Btn
            variant="outline"
            onClick={() => {
              reset();
              toast.success("Demo data reset");
            }}
          >
            Reset demo data
          </Btn>
        </div>
        <nav aria-label="Sections" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-full border-2 border-white/20 bg-white/5 px-4 py-1.5 text-base font-semibold hover:bg-white/10"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <p className="rounded-lg border-2 border-amber-400/60 bg-amber-500/10 p-3 text-base font-semibold text-amber-100">
          Student prototype. All records on this page are fake demo data.
        </p>

        <ReminderBanner appointments={data.appointments} />
        <HealthTimeline data={data} />
        <MedicinesSection data={data} />
        <ReportsSection data={data} />
        <ConsentSection data={data} update={update} />
        <CaregiversSection data={data} update={update} />
        <AddRecordsSection data={data} update={update} />
      </main>
    </>
  );
}
