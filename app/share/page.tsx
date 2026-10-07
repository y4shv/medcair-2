"use client";

import { useEffect, useState } from "react";
import { decodePayload, type SharePayload } from "@/lib/health/share";
import { formatDate, formatDateTime } from "@/lib/health/format";

// Read-only summary a patient chooses to show someone. Opens without login.
// The data is inside the link (after the #), nothing is loaded from a server.

export default function SharePage() {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "bad" } | { kind: "expired" } | { kind: "ok"; p: SharePayload }
  >({ kind: "loading" });

  useEffect(() => {
    const p = decodePayload(window.location.hash);
    if (!p) setState({ kind: "bad" });
    else if (new Date(p.expiresAt).getTime() < Date.now()) setState({ kind: "expired" });
    else setState({ kind: "ok", p });
  }, []);

  if (state.kind === "loading") return <main className="p-6 text-lg">Loading...</main>;
  if (state.kind === "bad")
    return (
      <main className="mx-auto max-w-2xl p-6 text-lg">
        <h1 className="text-2xl font-bold">This link does not work</h1>
        <p className="mt-2">The link may be cut short or wrong. Ask the patient for a new one.</p>
      </main>
    );
  if (state.kind === "expired")
    return (
      <main className="mx-auto max-w-2xl p-6 text-lg">
        <h1 className="text-2xl font-bold">This link has expired</h1>
        <p className="mt-2">Ask the patient for a new link.</p>
      </main>
    );

  const { p } = state;
  return (
    <main className="mx-auto max-w-3xl bg-white p-6 text-lg text-gray-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <p className="font-semibold">Shared by the patient. View only.</p>
        <button
          onClick={() => window.print()}
          className="min-h-11 rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800"
        >
          Print
        </button>
      </div>

      <h1 className="text-3xl font-bold">Health summary</h1>
      <p className="mt-1">
        {p.patient.name}, {p.patient.age} years
      </p>
      {p.patient.conditions.length > 0 && (
        <p>Known conditions: {p.patient.conditions.join(", ")}</p>
      )}
      <p className="mt-1 text-base text-gray-700">
        Made on {formatDateTime(p.generatedAt)}. Link works until {formatDateTime(p.expiresAt)}.
      </p>
      <p className="mt-3 rounded-lg border-2 border-gray-900 bg-gray-100 p-3 font-bold">
        This is a summary made by the patient from their own records. It is not medical advice.
      </p>

      {p.medicines && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold">Medicines</h2>
          <ul className="mt-2 space-y-2">
            {p.medicines.map((m) => (
              <li key={m.name} className="border-b border-gray-300 pb-2">
                <span className="font-bold">
                  {m.name} {m.dose}
                </span>
                : {m.howToTake}
                <br />
                <span className="text-base text-gray-700">Prescribed by: {m.prescriber}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.labs && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold">Lab reports</h2>
          {p.labs.map((l, i) => (
            <div key={i} className="mt-3">
              <p className="font-bold">
                {formatDate(l.date)}: {l.title}
              </p>
              <p className="text-base text-gray-700">{l.source}</p>
              <ul className="mt-1 list-disc pl-6">
                {l.results.map((r) => (
                  <li key={r.name}>
                    {r.name}: <b>{r.value} {r.unit}</b> (range on report: {r.range})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {p.history && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold">History</h2>
          <ul className="mt-2 space-y-1">
            {p.history.map((h, i) => (
              <li key={i}>
                {formatDate(h.date)} · {h.kind}: <b>{h.title}</b> ({h.source})
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
