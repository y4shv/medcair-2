"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { clearStore, flushSave } from "@/lib/health/store";

const links = [
  { href: "/patient/dashboard", label: "My health" },
  { href: "/patient/appointments", label: "My appointments" },
];

export function PatientNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      await flushSave();
      await createClient().auth.signOut();
    } catch {
      // No Supabase set up (local demo). Just go to the login page.
    }
    clearStore();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-surface print:hidden">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-7 gap-y-3 px-6 py-3">
        <Link href="/" className="flex items-center" aria-label="medcAIr home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="order-last flex w-full flex-wrap gap-2 sm:order-none sm:w-auto sm:flex-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-4 text-base",
                  active
                    ? "bg-tint font-extrabold text-care-deep"
                    : "font-bold text-ink hover:bg-tint",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="ml-auto min-h-11 rounded-xl border-[1.5px] border-line-control bg-surface px-4 text-base font-bold text-ink hover:bg-tint"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
