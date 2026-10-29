import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Where Supabase sends people back after "Continue with Google".
// It trades the one-time `code` in the URL for a login session (stored in cookies).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Only allow a path on this site, so the link can't be used to bounce people elsewhere.
  const rawNext = searchParams.get("next") ?? "/patient/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/patient/dashboard";

  const providerError = searchParams.get("error_description") ?? searchParams.get("error");
  if (providerError) {
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(providerError)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // On Vercel the request can arrive through a proxy, so prefer the public host.
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocal = process.env.NODE_ENV === "development";
      const base = !isLocal && forwardedHost ? `https://${forwardedHost}` : origin;
      return NextResponse.redirect(`${base}${next}`);
    }
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent("No sign-in code was returned")}`);
}
