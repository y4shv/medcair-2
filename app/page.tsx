import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import ShaderBackground from "@/components/ui/shader-background";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  FileText,
  FlaskConical,
  Pill,
  ShieldCheck,
  Syringe,
  Users,
} from "lucide-react";

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

const records = [
  { icon: FileText, date: "MAY 12, 2023", title: "Lab Results", shift: "sm:translate-x-12" },
  { icon: Pill, date: "APR 28, 2023", title: "Prescription", shift: "sm:-translate-x-4" },
  { icon: Syringe, date: "MAR 15, 2023", title: "Vaccination Record", shift: "sm:translate-x-8" },
];

export default function Home() {
  return (
    <div className="on-dark relative min-h-screen font-display text-white">
      <ShaderBackground />

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-ink">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 lg:px-8">
          <Link href="/" aria-label="medcAIr home" className="flex items-center">
            <Logo onDark />
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/patient/dashboard"
              className="inline-flex min-h-11 items-center rounded-xl px-4 text-base font-bold text-white hover:bg-white/10"
            >
              My dashboard
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex min-h-11 items-center rounded-xl px-4 text-base font-bold text-white hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex min-h-11 items-center rounded-xl bg-care px-5 text-base font-extrabold text-white ring-1 ring-white/30 hover:bg-care-deep"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Every block of text sits on a solid ink panel, never directly on the wave animation. */}
      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-ink px-6 py-16 text-center md:px-16 md:py-24">
          <div className="mx-auto max-w-4xl space-y-8">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-extrabold uppercase tracking-widest text-white">
              Your health records
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
              Your Health, <br />
              <span className="text-mint">Simplified &amp; Secure.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/85">
              Keep your prescriptions, medicines and lab reports together. Understand your reports
              in simple words. Share them only with people you choose.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex min-h-12 items-center rounded-xl bg-care px-8 text-base font-extrabold text-white ring-1 ring-white/30 hover:bg-care-deep"
              >
                Get started
              </Link>
              <Link
                href="/patient/dashboard"
                className="inline-flex min-h-12 items-center rounded-xl border-2 border-white/70 px-8 text-base font-extrabold hover:bg-white/10"
              >
                Open my dashboard
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex min-h-12 items-center rounded-xl border-2 border-white/70 px-8 text-base font-extrabold hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-ink px-6 py-16 md:px-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-extrabold">What you can do</h2>
            <p className="text-white/85">Everything you need to manage your health in one secure place.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-white/15 bg-white/5 p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-full bg-white/10 text-mint">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                  <p className="mb-6 text-base leading-relaxed text-white/85">{f.text}</p>
                  <Link
                    href="/patient/dashboard"
                    className="inline-flex min-h-11 items-center gap-1 text-base font-bold text-white underline underline-offset-4 hover:text-mint"
                  >
                    {f.cta} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid items-center gap-12 rounded-3xl bg-ink p-8 md:p-16 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">
              Your Medical Records, <br />
              Secure and Portable.
            </h2>
            <ul className="space-y-3 text-base font-medium">
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
            <Link
              href="/auth/sign-up"
              className="inline-flex min-h-12 items-center rounded-xl bg-white px-8 text-base font-extrabold text-ink hover:bg-tint"
            >
              Get Started Free
            </Link>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-8">
            {records.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className={`flex items-center gap-4 rounded-xl bg-white p-4 ${r.shift}`}>
                  <div className="flex size-10 items-center justify-center rounded bg-tint text-care-deep">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink-muted">{r.date}</p>
                    <p className="text-base font-bold text-ink">{r.title}</p>
                  </div>
                </div>
              );
            })}
            <p className="pt-2 text-sm text-white/80">Sample records shown.</p>
          </div>
        </section>
      </main>

      <footer className="bg-ink py-8">
        <div className="mx-auto max-w-7xl px-4 text-base text-white/85 sm:px-6 lg:px-8">
          medcAIr is a student prototype (IIT Delhi, Strategic Design Management). It uses fake demo
          data only. It does not give medical advice.
        </div>
      </footer>
    </div>
  );
}
