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
import { SectionNav } from "@/components/patient/section-nav";
import { DashboardAside } from "@/components/patient/dashboard-aside";

export default function PatientDashboard() {
  const { data, update, reset } = useHealthData();

  if (!data) return <Loading />;

  return (
    <>
      <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 pb-16 pt-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">{data.patient.name}</h1>
            <p className="text-ink-muted">
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
        <SectionNav />

        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-6">
            <ReminderBanner appointments={data.appointments} />
            <HealthTimeline data={data} />
            <MedicinesSection data={data} />
            <ReportsSection data={data} />
            <ConsentSection data={data} update={update} />
            <CaregiversSection data={data} update={update} />
            <AddRecordsSection data={data} update={update} />
          </div>
          <DashboardAside appointments={data.appointments} />
        </div>
      </main>
    </>
  );
}
