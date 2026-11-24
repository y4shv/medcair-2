"use client";

import { cn } from "@/lib/utils";
import { sendPasswordResetEmail } from "firebase/auth";
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
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!hasFirebase) throw new Error("Password reset is not set up on this site yet.");
      await sendPasswordResetEmail(firebaseAuth(), email);
      setSuccess(true);
    } catch (error: unknown) {
      setError(authErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 font-display", className)} {...props}>
      {success ? (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-ink">Check Your Email</CardTitle>
            <CardDescription className="text-ink-muted">Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base text-ink-muted">
              If you registered using your email and password, you will receive
              a password reset email.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-ink">Reset Your Password</CardTitle>
            <CardDescription className="text-ink-muted">
              Type in your email and we&apos;ll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
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
                {error && <p className="text-sm text-status-critical font-semibold">{error}</p>}
                <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90 font-semibold py-6 text-lg shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset email"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
