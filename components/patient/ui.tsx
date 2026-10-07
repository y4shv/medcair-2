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
      className="scroll-mt-32 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {intro && <p className="mt-1 text-gray-700">{intro}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export const inputClass =
  "w-full rounded-lg border-2 border-gray-400 bg-white px-3 py-2.5 text-lg text-gray-900 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/30";

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
        variant === "primary" && "bg-green-700 text-white hover:bg-green-800",
        variant === "outline" &&
          "border-2 border-gray-400 bg-white text-gray-900 hover:bg-gray-100",
        variant === "danger" &&
          "border-2 border-red-700 bg-white text-red-800 hover:bg-red-50",
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
        tone === "gray" && "bg-gray-200 text-gray-900",
        tone === "amber" && "bg-amber-100 text-amber-900",
        tone === "green" && "bg-green-100 text-green-900",
      )}
    >
      {children}
    </span>
  );
}

export function Loading() {
  return <p className="p-6 text-lg">Loading your records...</p>;
}
