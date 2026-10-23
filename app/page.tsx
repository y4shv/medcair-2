import Link from "next/link";
import ShaderBackground from "@/components/ui/shader-background";
import {
  Activity,
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
  { icon: FileText, date: "MAY 12, 2023", title: "Lab Results", tone: "bg-blue-100 text-blue-600", shift: "translate-x-12" },
  { icon: Pill, date: "APR 28, 2023", title: "Prescription", tone: "bg-purple-100 text-purple-600", shift: "-translate-x-4" },
  { icon: Syringe, date: "MAR 15, 2023", title: "Vaccination Record", tone: "bg-indigo-100 text-indigo-600", shift: "translate-x-8" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen font-display text-white">
      <ShaderBackground />

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/80 text-white backdrop-blur">
              <Activity className="size-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">medcAIr</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/patient/dashboard" className="text-sm font-semibold text-gray-200 hover:text-white">
              My dashboard
            </Link>
            <Link href="/auth/login" className="text-sm font-semibold text-gray-200 hover:text-white">
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[70vh] items-center overflow-hidden pb-24 pt-28">
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl space-y-8 text-center">
              <span className="inline-block rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] backdrop-blur-md">
                Your health records
              </span>
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight drop-shadow-xl md:text-7xl">
                Your Health, <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Simplified &amp; Secure.
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-indigo-100/80">
                Keep your prescriptions, medicines and lab reports together. Understand your reports
                in simple words. Share them only with people you choose.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/sign-up"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-blue-500 hover:to-indigo-500"
                >
                  Get started
                </Link>
                <Link
                  href="/patient/dashboard"
                  className="rounded-xl border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold backdrop-blur hover:bg-white/10"
                >
                  Open my dashboard
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-xl border border-white/30 bg-white/5 px-8 py-4 text-sm font-bold backdrop-blur hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-extrabold">What you can do</h2>
              <p className="text-gray-300">Everything you need to manage your health in one secure place.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-colors hover:bg-white/10"
                  >
                    <div className="mb-6 flex size-12 items-center justify-center rounded-full border border-white/10 bg-indigo-500/20 text-indigo-300">
                      <Icon className="size-6" aria-hidden />
                    </div>
                    <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-gray-300">{f.text}</p>
                    <Link
                      href="/patient/dashboard"
                      className="flex items-center gap-1 text-sm font-bold text-indigo-300 hover:text-white"
                    >
                      {f.cta} <ArrowRight className="size-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 overflow-hidden rounded-3xl border border-white/10 bg-indigo-950/40 p-8 backdrop-blur-xl md:p-16 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-4xl font-extrabold leading-tight">
                  Your Medical Records, <br />
                  Secure and Portable.
                </h2>
                <ul className="space-y-3 text-sm font-medium">
                  {[
                    "You decide who can see your records",
                    "Share with a link that ends on its own",
                    "Automatic health history timeline",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <CheckCircle className="size-5 text-indigo-300" /> {t}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/sign-up"
                  className="inline-block rounded-xl bg-white px-8 py-3 text-sm font-bold text-slate-900 shadow-lg transition-colors hover:bg-gray-100"
                >
                  Get Started Free
                </Link>
              </div>
              <div className="space-y-4 rounded-2xl border border-white/10 bg-black/30 p-8">
                {records.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.title} className={`flex items-center gap-4 rounded-xl bg-white/90 p-4 shadow-lg ${r.shift}`}>
                      <div className={`flex size-10 items-center justify-center rounded ${r.tone}`}>
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500">{r.date}</p>
                        <p className="text-sm font-bold text-slate-900">{r.title}</p>
                      </div>
                    </div>
                  );
                })}
                <p className="pt-2 text-xs text-gray-400">Sample records shown.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 text-sm text-gray-400 sm:px-6 lg:px-8">
          medcAIr is a student prototype (IIT Delhi, Strategic Design Management). It uses fake demo
          data only. It does not give medical advice.
        </div>
      </footer>
    </div>
  );
}
