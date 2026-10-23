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
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white print:hidden">
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
                  ? "bg-indigo-100 text-indigo-900"
                  : "text-gray-800 hover:bg-gray-100",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="rounded-lg border-2 border-gray-300 px-3 py-2 text-base font-semibold hover:bg-gray-100"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
