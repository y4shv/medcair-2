import Link from "next/link";
import ShaderBackground from "@/components/ui/shader-background";
import {
  Activity,
  CalendarDays,
  FileText,
  FlaskConical,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "One health timeline",
    text: "Visits, diagnoses, prescriptions and lab reports in date order, each with who it came from.",
  },
  {
    icon: Pill,
    title: "My medicines",
    text: "All your medicines in one list, with reminder times and an estimate of when to refill.",
  },
  {
    icon: FlaskConical,
    title: "Reports in plain words",
    text: "See what each test measures, your value, the last value and the range printed on the report.",
  },
  {
    icon: ShieldCheck,
    title: "You choose who sees it",
    text: "See who has access, take it back any time, or share a link that ends on its own.",
  },
  {
    icon: Users,
    title: "Caregiver access",
    text: "Let a family member look at your records. They can view only, not change.",
  },
  {
    icon: CalendarDays,
    title: "My appointments",
    text: "Write down your visits and get a reminder before each one.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen font-display text-lg text-white">
      <ShaderBackground />

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-green-700 text-white">
              <Activity className="size-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">medcAIr</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="rounded-lg px-3 py-2 text-base font-semibold hover:bg-white/10">
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="rounded-lg bg-green-700 px-4 py-2 text-base font-bold text-white hover:bg-green-600"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:pt-28">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
            All your health records, in one place.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-200">
            Keep your prescriptions, medicines and lab reports together. Understand your reports in
            simple words. Share them only with people you choose.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/auth/sign-up"
              className="rounded-xl bg-green-700 px-8 py-4 text-lg font-bold text-white hover:bg-green-600"
            >
              Get started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl border-2 border-white/60 px-8 py-4 text-lg font-bold hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20">
          <h2 className="mb-8 text-center text-3xl font-extrabold">What you can do</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border border-white/20 bg-black/40 p-6 backdrop-blur-md">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-green-700">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                  <p className="text-gray-200">{f.text}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/50 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-6xl space-y-2 px-4 text-base text-gray-300">
          <p>
            medcAIr is a student prototype (IIT Delhi, Strategic Design Management). It uses fake
            demo data only. It does not give medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
