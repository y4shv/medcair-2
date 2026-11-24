"use client";

import { toast } from "sonner";
import { useHealthData } from "@/lib/health/store";
import { HealthTimeline } from "@/components/patient/health-timeline";
import { MedicinesSection } from "@/components/patient/medicines-section";
import { ReportsSection } from "@/components/patient/reports-section";
import { ConsentSection } from "@/components/patient/consent-section";
import { CaregiversSection } from "@/components/patient/caregivers-section";
import { TrendsSection } from "@/components/patient/trends-section";
import { AiSummarySection } from "@/components/patient/ai-summary-section";
import { AddRecordsSection } from "@/components/patient/add-records-section";
import { Loading } from "@/components/patient/ui";
import { FlowBackground } from "@/components/brand/flow-background";
import { BackToTop } from "@/components/patient/back-to-top";
import { SectionNav } from "@/components/patient/section-nav";
import { DashboardAside } from "@/components/patient/dashboard-aside";

export default function PatientDashboard() {
  const { data, update, reset, mode, failed } = useHealthData();

  if (!data) return <Loading failed={failed} />;

  return (
    <>
      {/* Ink band behind the name, with a still (never animated) copy of the flow lines. */}
      <div className="on-dark relative overflow-hidden bg-[linear-gradient(135deg,#0F2A3D_0%,#07506B_100%)] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-30 [mask-image:linear-gradient(90deg,transparent_25%,black_80%)] sm:w-3/5"
        >
          <FlowBackground theme="ink" animate={false} />
        </div>
        <div className="relative mx-auto flex max-w-[1120px] flex-wrap items-start justify-between gap-3 px-6 py-8">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">{data.patient.name}</h1>
            <p className="text-ink-soft">
              {[
                data.patient.age ? `${data.patient.age} years` : "",
                data.patient.conditions.join(", "),
              ]
                .filter(Boolean)
                .join(" · ") || "Add your details under Add records"}
            </p>
          </div>
          {mode === "local" && (
            <button
              type="button"
              onClick={() => {
                reset();
                toast.success("Demo data reset");
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border-[1.5px] border-white bg-transparent px-4 text-base font-bold text-white hover:bg-white/10"
            >
              Reset demo data
            </button>
          )}
        </div>
      </div>
      <SectionNav />
      <BackToTop />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-6 px-6 pb-16 pt-4">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-6">
            <AiSummarySection data={data} update={update} mode={mode} />
            <TrendsSection data={data} />
            <HealthTimeline data={data} update={update} />
            <MedicinesSection data={data} update={update} />
            <ReportsSection data={data} />
            <ConsentSection data={data} update={update} mode={mode} />
            <CaregiversSection data={data} update={update} />
            <AddRecordsSection data={data} update={update} mode={mode} />
          </div>
          <DashboardAside appointments={data.appointments} />
        </div>
      </main>
    </>
  );
}
