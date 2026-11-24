"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firebaseAuth, hasFirebase } from "@/lib/firebase/client";
import { Loading } from "./ui";

/**
 * Sends signed-out visitors to the login page. Demo visitors (cookie set by /demo)
 * may stay: they only ever see fake data held in their browser. The real protection is
 * in firestore.rules and storage.rules, this just keeps people from seeing an empty shell.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const demo = document.cookie.split("; ").includes("medcair_demo=1");
      if (hasFirebase) {
        const auth = firebaseAuth();
        await auth.authStateReady();
        if (auth.currentUser) return !cancelled && setOk(true);
      }
      if (demo) return !cancelled && setOk(true);
      router.replace("/auth/login");
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return ok ? <>{children}</> : <Loading />;
}
