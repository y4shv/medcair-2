import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Bell,
  CalendarDays,
  Clock,
  Eye,
  CheckCircle,
  FileText,
  FlaskConical,
  Pill,
  ShieldCheck,
  Syringe,
  Users,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PulseIcon } from "@/components/brand/pulse-icon";
import { HeroBackground } from "@/components/landing/hero-background";
import { RangeBar } from "@/components/patient/range-bar";
import { Pill as StatusPill } from "@/components/patient/ui";
import { analyseResult } from "@/lib/health/range";
import type { LabResult } from "@/lib/health/types";

const features = [
  {
    icon: FileText,
    title: "One health timeline",
    text: "Visits, diagnoses, prescriptions and lab reports in date order, each with who it came from.",
    cta: "Open timeline",
  },
  {
    icon: Pill,
    title: "My medicines",
    text: "All your medicines in one list, with reminder times and an estimate of when to refill.",
    cta: "See medicines",
  },
  {
    icon: FlaskConical,
    title: "Reports in plain words",
    text: "See what each test measures, your value, the last value and the range printed on the report.",
    cta: "Read a report",
  },
  {
    icon: ShieldCheck,
    title: "You choose who sees it",
    text: "See who has access, take it back any time, or share a link that ends on its own.",
    cta: "Manage sharing",
  },
  {
    icon: Users,
    title: "Caregiver access",
    text: "Let a family member look at your records. They can view only, not change.",
    cta: "Add a caregiver",
  },
  {
    icon: CalendarDays,
    title: "My appointments",
    text: "Write down your visits and get a reminder before each one.",
    cta: "Add a visit",
  },
];

const trust = [
  { icon: ShieldCheck, text: "You choose who sees it" },
  { icon: Clock, text: "Links that end on their own" },
  { icon: Eye, text: "Caregivers can view only" },
];

const records = [
  { icon: FileText, date: "MAY 12, 2023", title: "Lab Results" },
  { icon: Pill, date: "APR 28, 2023", title: "Prescription" },
  { icon: Syringe, date: "MAR 15, 2023", title: "Vaccination Record" },
];

// Made-up sample for the hero card. Not a real person's result.
const sample: LabResult = {
  name: "HbA1c",
  measures: "Your average blood sugar over the last 2 to 3 months.",
  value: "7.1",
  unit: "%",
  previousValue: "7.4",
  referenceRange: "4.0 - 5.6 %",
};

const cta =
  "inline-flex min-h-12 items-center justify-center rounded-xl px-7 text-base font-extrabold";
const navLink =
  "inline-flex min-h-11 items-center rounded-xl px-4 text-base font-bold text-white hover:bg-white/10";

export default function Home() {
  const view = analyseResult(sample)!;

  return (
    <div className="min-h-screen bg-mist font-display text-ink">
      <header className="on-dark absolute inset-x-0 top-0 z-20 h-[65px] border-b border-white/15 bg-[rgba(11,30,44,.7)] backdrop-blur-sm">
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-x-5 px-6">
          <Link href="/" aria-label="medcAIr home" className="flex items-center">
            <Logo onDark />
          </Link>
          <span className="flex-1" />
          <nav aria-label="Main" className="flex items-center gap-1">
            <Link href="/patient/dashboard" className={`${navLink} max-[900px]:hidden`}>
              My dashboard
            </Link>
            <Link href="/auth/login" className={`${navLink} max-[900px]:hidden`}>
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 text-base font-extrabold text-ink hover:bg-mint-pale"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
      <section className="on-dark relative min-h-[760px] overflow-hidden bg-[linear-gradient(135deg,#0F2A3D_0%,#0B2233_55%,#0A3A4A_100%)] pt-[65px] text-white max-[900px]:min-h-0">
        <HeroBackground />

        <div className="relative z-[2] mx-auto grid max-w-[1200px] items-center gap-10 px-6 pb-24 pt-[72px] min-[901px]:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] max-[900px]:pb-36 max-[900px]:pt-12">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-extrabold uppercase tracking-[0.12em] text-mint-pale">
              <PulseIcon />
              Your health records
            </span>
            <h1 className="mt-[18px] text-[42px] font-extrabold leading-[1.05] tracking-[-0.02em] min-[901px]:text-[60px]">
              Your Health, <span className="text-mint">Simplified &amp; Secure.</span>
            </h1>
            <p className="mt-5 max-w-[440px] text-[20px] text-ink-soft">
              Keep your prescriptions, medicines and lab reports together. Understand your reports
              in simple words. Share them only with people you choose.
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-3.5">
              <Link href="/auth/sign-up" className={`${cta} bg-white text-ink hover:bg-mint-pale`}>
                Get started
              </Link>
              <Link
                href="/patient/dashboard"
                className={`${cta} border-[1.5px] border-white bg-transparent text-white hover:bg-white/10`}
              >
                Open my dashboard
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex min-h-11 items-center px-2 text-base font-bold text-mint-pale underline underline-offset-[3px] hover:text-white"
              >
                Log in
              </Link>
            </div>
            <ul className="mt-[34px] flex flex-wrap gap-x-[22px] gap-y-2.5 text-[15px] font-bold text-ink-soft">
              {trust.map((t) => {
                const Icon = t.icon;
                return (
                  <li key={t.text} className="flex items-center gap-2">
                    <Icon className="size-5 shrink-0 text-mint" strokeWidth={2.4} aria-hidden />
                    {t.text}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Static samples with made-up data. Not interactive. */}
          <div className="relative min-h-[420px] max-[900px]:min-h-0">
            <div
              role="group"
              aria-label="Sample lab result. Example only, not a real person's data."
              className="ml-auto max-w-[470px] rounded-[22px] text-ink border border-line-soft bg-surface px-[26px] py-6 shadow-[0_1px_2px_rgba(15,42,61,.06),0_18px_48px_rgba(15,42,61,.16)] max-[900px]:mx-auto"
            >
              <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">
                Sample result · 25 Sept 2026
              </p>
              <p className="mt-0.5 text-xl font-extrabold">{sample.name}</p>
              <p className="text-[15px] text-ink-muted">{sample.measures}</p>
              <div className="mt-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="num text-[40px] font-bold leading-[1.1] tracking-[-0.02em]">
                  {sample.value}{" "}
                  <span className="text-xl font-semibold text-ink-muted">{sample.unit}</span>
                </p>
                <StatusPill tone="watch">{view.statusText}</StatusPill>
              </div>
              <p className="mt-2.5 flex items-center gap-1.5 text-[15px] font-bold text-care-deep">
                <ArrowDown className="size-4 shrink-0" strokeWidth={2.6} aria-hidden />
                <span className="num">Lower than last time: 7.4 %</span>
              </p>
              <div className="mt-2.5">
                <RangeBar view={view} printed={sample.referenceRange} />
              </div>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-ink-muted">
                <span className="inline-block size-2.5 rounded-full bg-mint" aria-hidden />
                Sample records shown. Fake demo data only.
              </p>
            </div>
            <div
              role="group"
              aria-label="Sample next appointment. Example only."
              className="absolute -bottom-3 left-0 max-w-[290px] rounded-[22px] text-ink border border-line-soft bg-surface px-5 py-4 shadow-[0_1px_2px_rgba(15,42,61,.06),0_18px_48px_rgba(15,42,61,.16)] max-[900px]:relative max-[900px]:bottom-auto max-[900px]:mx-auto max-[900px]:-mt-1.5"
            >
              <p className="flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.08em] text-care-deep">
                <Bell className="size-[18px]" strokeWidth={2.2} aria-hidden />
                Next appointment
              </p>
              <p className="mt-1 text-xl font-extrabold">24 Oct, 10:30 am</p>
              <p className="text-[15px] text-ink-muted">Dr. Anita Rao · City Diabetes Centre</p>
            </div>
          </div>
        </div>
      </section>

        <section className="mx-auto max-w-[1120px] px-6 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-care-deep">
              <PulseIcon />
              Features
            </p>
            <h2 className="mb-3 text-[32px] font-extrabold leading-tight">What you can do</h2>
            <p className="text-[17px] text-ink-muted">
              Everything you need to manage your health in one secure place.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex flex-col rounded-xl border border-line-soft bg-surface p-7 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="relative mb-5 flex size-12 items-center justify-center rounded-full bg-tint text-care">
                    <Icon className="size-6" strokeWidth={2} aria-hidden />
                    <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-mint" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-xl font-extrabold">{f.title}</h3>
                  <p className="mb-5 text-base text-ink-muted">{f.text}</p>
                  <Link
                    href="/patient/dashboard"
                    className="mt-auto inline-flex min-h-11 items-center gap-1.5 text-base font-bold text-care-deep underline underline-offset-4 hover:text-care"
                  >
                    {f.cta} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="on-dark relative overflow-hidden bg-[linear-gradient(135deg,#0F2A3D_0%,#0B2233_55%,#0A3A4A_100%)] text-white">
          <Image
            src="/brand/mark.svg"
            alt=""
            aria-hidden="true"
            width={420}
            height={420}
            className="pointer-events-none absolute -right-16 top-1/2 size-[420px] -translate-y-1/2 opacity-[0.08] max-[900px]:-right-24 max-[900px]:size-[300px]"
          />
          <div className="relative mx-auto max-w-[1120px] px-6 py-16 sm:py-20">
            <h2 className="max-w-[560px] text-4xl font-extrabold leading-[1.1] tracking-[-0.01em]">
              You choose who sees it
            </h2>
            <ul className="mt-6 space-y-3 text-[17px] font-semibold">
              {[
                "You decide who can see your records",
                "Share with a link that ends on its own",
                "Automatic health history timeline",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <CheckCircle className="size-5 shrink-0 text-mint" aria-hidden /> {t}
                </li>
              ))}
            </ul>
            <Link href="/auth/sign-up" className={`${cta} mt-8 bg-mint text-ink hover:bg-mint-pale`}>
              Get Started Free
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] px-6 py-20">
          <div className="grid items-center gap-10 rounded-xl border border-line-soft bg-surface p-7 shadow-card sm:p-12 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-care-deep">
                <PulseIcon />
                Your records
              </p>
              <h2 className="text-[32px] font-extrabold leading-tight">
                Your Medical Records, Secure and Portable.
              </h2>
              <Link
                href="/patient/dashboard"
                className="inline-flex min-h-11 items-center gap-1.5 text-base font-bold text-care-deep underline underline-offset-4 hover:text-care"
              >
                Open my dashboard <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <figure aria-labelledby="records-caption" className="rounded-xl bg-mist p-6">
              <ul className="space-y-3">
                {records.map((r) => {
                  const Icon = r.icon;
                  return (
                    <li
                      key={r.title}
                      className="flex items-center gap-4 rounded-xl border border-line-soft bg-surface p-4"
                    >
                      <div className="flex size-11 items-center justify-center rounded-full bg-tint text-care">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ink-muted">{r.date}</p>
                        <p className="text-base font-extrabold">{r.title}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <figcaption
                id="records-caption"
                className="mt-4 flex items-center gap-2 text-sm text-ink-muted"
              >
                <span className="size-2.5 rounded-full bg-mint" aria-hidden />
                Sample records shown.
              </figcaption>
            </figure>
          </div>
        </section>
      </main>

      <footer className="on-dark bg-ink">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-6 py-10">
          <Logo onDark />
          <p className="max-w-3xl text-sm text-ink-soft">
            medcAIr is a student prototype (IIT Delhi, Strategic Design Management). It uses fake
            demo data only. It does not give medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
