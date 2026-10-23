import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function Page() {
  return (
    <div className="min-h-screen bg-mist flex flex-col font-display">
      {/* Navbar */}
      <nav className="w-full flex justify-center border-b border-line-soft h-16 bg-surface  sticky top-0 z-50 shadow-sm">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex gap-5 items-center font-semibold">
            <Link href={"/"} className="flex items-center gap-2 group">
              <Logo />
            </Link>
          </div>
        </div>
      </nav>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
