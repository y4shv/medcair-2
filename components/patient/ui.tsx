import { AlertTriangle, CheckCircle2, Info, OctagonAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// Small shared building blocks so every section looks the same.

export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-40 rounded-xl border border-line-soft bg-surface p-5 shadow-card sm:p-7"
    >
      <h2 className="text-2xl font-extrabold">{title}</h2>
      {intro && <p className="mt-1 text-ink-muted">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export const inputClass =
  "w-full min-h-11 rounded-xl border-[1.5px] border-line-control bg-surface px-3 py-2.5 text-base text-ink placeholder:text-ink-muted focus:border-care focus:outline-none focus:ring-2 focus:ring-care/30";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-base font-bold">
        {label}
      </label>
      {children}
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "danger";
};

export function Btn({ variant = "primary", className, ...props }: BtnProps) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-base font-bold disabled:opacity-50",
        variant === "primary" && "bg-care text-white hover:bg-care-deep",
        variant === "outline" &&
          "border-[1.5px] border-line-control bg-surface text-ink hover:bg-tint",
        variant === "danger" &&
          "border-[1.5px] border-line-control bg-surface text-status-critical hover:bg-status-critical-bg",
        className,
      )}
    />
  );
}

export type Tone = "neutral" | "ok" | "watch" | "critical" | "info";

const toneClass: Record<Tone, string> = {
  neutral: "bg-tint text-care-deep",
  ok: "bg-status-ok-bg text-status-ok",
  watch: "bg-status-watch-bg text-status-watch",
  critical: "bg-status-critical-bg text-status-critical",
  info: "bg-status-info-bg text-status-info",
};

const toneIcon = {
  ok: CheckCircle2,
  watch: AlertTriangle,
  critical: OctagonAlert,
  info: Info,
} as const;

/** Status chip. Always icon plus words, never colour alone. Neutral has no icon. */
export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const Icon = tone === "neutral" ? null : toneIcon[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold",
        toneClass[tone],
      )}
    >
      {Icon && <Icon className="size-4" strokeWidth={2.6} aria-hidden />}
      {children}
    </span>
  );
}

export function Loading({ failed }: { failed?: boolean }) {
  if (failed)
    return (
      <p role="alert" className="p-6 text-lg">
        Could not load your records. Please refresh the page. If this keeps happening, the database
        setup may be incomplete.
      </p>
    );
  return <p className="p-6 text-lg">Loading your records...</p>;
}
