"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/patient/dashboard", label: "My health" },
  { href: "/patient/appointments", label: "My appointments" },
];

export function PatientNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    try {
      await createClient().auth.signOut();
    } catch {
      // No Supabase set up (local demo). Just go to the login page.
    }
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Activity className="size-5" />
          </span>
          medcAIr
        </Link>
        <nav className="flex flex-1 flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-base font-semibold",
                pathname === l.href
                  ? "bg-indigo-500/30 text-indigo-100"
                  : "text-gray-100 hover:bg-white/10",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="rounded-lg border-2 border-white/20 px-3 py-2 text-base font-semibold hover:bg-white/10"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
