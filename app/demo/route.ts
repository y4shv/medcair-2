import { NextResponse } from "next/server";

// Opens the patient area without an account. The dashboard only ever shows the
// fake demo data held in this browser, so nothing private is exposed.
export function GET(request: Request) {
  const { origin } = new URL(request.url);
  const res = NextResponse.redirect(`${origin}/patient/dashboard`);
  res.cookies.set("medcair_demo", "1", {
    path: "/",
    maxAge: 60 * 60 * 24,
    sameSite: "lax",
  });
  return res;
}
