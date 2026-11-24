import Link from "next/link";
import { Logo } from "@/components/brand/logo";

/** Same page frame as login and sign-up: mist background, logo bar, centred card. */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mist flex flex-col font-display">
      <nav className="w-full flex justify-center border-b border-line-soft h-16 bg-surface sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-7xl flex items-center p-3 px-5">
          <Link href="/" className="flex items-center gap-2" aria-label="medcAIr home">
            <Logo />
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
