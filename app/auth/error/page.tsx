import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-base text-ink-muted">
          Code error: {params.error}
        </p>
      ) : (
        <p className="text-base text-ink-muted">
          An unspecified error occurred.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <AuthShell>
      <Card className="border-0 shadow-lg bg-white font-display">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-ink">Sorry, something went wrong.</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense>
            <ErrorContent searchParams={searchParams} />
          </Suspense>
          <Link
            href="/auth/login"
            className="inline-flex min-h-11 items-center rounded-lg bg-care px-5 font-semibold text-white hover:bg-care-deep"
          >
            Go to sign in
          </Link>
        </CardContent>
      </Card>
    </AuthShell>
  );
}
