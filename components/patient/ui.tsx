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
      className="scroll-mt-32 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-lg backdrop-blur-xl sm:p-6"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {intro && <p className="mt-1 text-gray-300">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export const inputClass =
  "w-full rounded-lg border-2 border-white/20 bg-white/10 px-3 py-2.5 text-lg text-white placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30";

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
      <label htmlFor={htmlFor} className="font-semibold">
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
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-base font-bold disabled:opacity-50",
        variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-500",
        variant === "outline" &&
          "border-2 border-white/20 bg-white/5 text-white hover:bg-white/10",
        variant === "danger" &&
          "border-2 border-red-400 bg-white/5 text-red-300 hover:bg-red-500/10",
        className,
      )}
    />
  );
}

export function Pill({
  children,
  tone = "gray",
}: {
  children: React.ReactNode;
  tone?: "gray" | "amber" | "green";
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-sm font-semibold",
        tone === "gray" && "bg-white/15 text-white",
        tone === "amber" && "bg-amber-500/20 text-amber-200",
        tone === "green" && "bg-green-500/20 text-green-200",
      )}
    >
      {children}
    </span>
  );
}

export function Loading() {
  return <p className="p-6 text-lg">Loading your records...</p>;
}
