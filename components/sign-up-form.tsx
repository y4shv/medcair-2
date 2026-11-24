"use client";

import { cn } from "@/lib/utils";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { authErrorMessage, firebaseAuth, hasFirebase } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleButton, OrDivider } from "@/components/google-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      if (!hasFirebase) throw new Error("Sign-up is not set up on this site yet.");
      const cred = await createUserWithEmailAndPassword(firebaseAuth(), email, password);
      await updateProfile(cred.user, { displayName: fullName.trim() });
      router.push("/patient/dashboard");
    } catch (error: unknown) {
      setError(authErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-display", className)} {...props}>
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-ink">Create Account</CardTitle>
          <CardDescription className="text-ink-muted">Sign up to get started with medcAIr</CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleButton />
          <OrDivider />
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-ink font-semibold">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border-2 border-line-control focus:border-primary focus:ring-primary/20 text-ink bg-surface"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-ink font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-line-control focus:border-primary focus:ring-primary/20 text-ink bg-surface"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-ink font-semibold">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-line-control focus:border-primary focus:ring-primary/20 text-ink bg-surface"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password" className="text-ink font-semibold">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="border-2 border-line-control focus:border-primary focus:ring-primary/20 text-ink bg-surface"
                />
              </div>
              {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-6 text-lg shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm">
              <span className="text-ink-muted">Already have an account? </span>
              <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
            <div className="mt-3 text-center text-sm">
              <Link
                href="/demo"
                className="text-ink-muted hover:text-ink font-semibold underline underline-offset-4"
              >
                Or try the demo with fake data, no account needed
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
