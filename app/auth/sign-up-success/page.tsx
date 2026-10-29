import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function Page() {
  return (
    <div className="min-h-screen bg-mist flex flex-col font-display">
      <nav className="w-full flex justify-center border-b border-line-soft h-16 bg-surface sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-7xl flex items-center p-3 px-5">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md rounded-[20px] border border-line-soft bg-surface p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-ink">Check your email</h1>
          <p className="mt-3 text-ink-muted">
            We sent a confirmation link to your email. Open it to finish
            creating your account, then sign in. If nothing arrives in a few
            minutes, check your spam folder.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-care px-5 font-semibold text-white hover:bg-care-deep"
          >
            Go to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
