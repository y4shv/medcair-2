"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { decodePayload, type SharePayload } from "@/lib/health/share";
import { firebaseDb, hasFirebase } from "@/lib/firebase/client";
import { formatDate, formatDateTime } from "@/lib/health/format";

// Read-only summary a patient chooses to show someone. Opens without login.
// Short links (?id=...) load a stored copy from Firestore that the patient can stop.
// Old long links carry the summary after the # instead.

export default function SharePage() {
  const [state, setState] = useState<
    { kind: "loading" } | { kind: "bad" } | { kind: "expired" } | { kind: "ok"; p: SharePayload }
  >({ kind: "loading" });

  useEffect(() => {
    (async () => {
      const id = new URLSearchParams(window.location.search).get("id");
      let p: SharePayload | null = null;
      if (id && hasFirebase) {
        try {
          const snap = await getDoc(doc(firebaseDb(), "shares", id));
          if (snap.exists()) p = JSON.parse(String(snap.data().payload)) as SharePayload;
        } catch {
          // Stopped, missing or blocked by the rules: shown as a link that does not work.
        }
      } else if (!id) {
        p = decodePayload(window.location.hash);
      }
      if (!p) setState({ kind: "bad" });
      else if (new Date(p.expiresAt).getTime() < Date.now()) setState({ kind: "expired" });
      else setState({ kind: "ok", p });
    })();
  }, []);

  if (state.kind === "loading") return <main className="p-6 text-lg">Loading...</main>;
  if (state.kind === "bad")
    return (
      <main className="mx-auto max-w-2xl p-6 text-lg">
        <h1 className="text-2xl font-bold">This link does not work</h1>
        <p className="mt-2">The link may be wrong, or the patient may have stopped it. Ask the patient for a new one.</p>
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
    <main className="mx-auto max-w-3xl p-6 text-lg text-ink">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 print:hidden">
        <p className="font-semibold">Shared by the patient. View only.</p>
        <button
          onClick={() => window.print()}
          className="min-h-11 rounded-lg bg-care px-4 py-2 font-bold text-white hover:bg-care-deep"
        >
          Print
        </button>
      </div>

      <h1 className="text-3xl font-bold">Health summary{p.forName ? ` for ${p.forName}` : ""}</h1>
      <p className="mt-1">
        {p.patient.name}{p.patient.age ? `, ${p.patient.age} years` : ""}
      </p>
      {p.patient.conditions.length > 0 && (
        <p>Known conditions: {p.patient.conditions.join(", ")}</p>
      )}
      <p className="mt-1 text-base text-ink-muted">
        Made on {formatDateTime(p.generatedAt)}. Link works until {formatDateTime(p.expiresAt)}.
      </p>
      <p className="mt-3 rounded-lg border-2 border-ink bg-tint p-3 font-bold">
        This is a summary made by the patient from their own records. It is not medical advice.
      </p>

      {p.medicines && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold">Medicines</h2>
          <ul className="mt-2 space-y-2">
            {p.medicines.map((m) => (
              <li key={m.name} className="border-b border-line-soft pb-2">
                <span className="font-bold">
                  {m.name} {m.dose}
                </span>
                : {m.howToTake}
                <br />
                <span className="text-base text-ink-muted">Prescribed by: {m.prescriber}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {p.labs && (
        <section className="mt-6">
          <h2 className="text-2xl font-bold">Lab reports</h2>
          {[...p.labs].sort((a, b) => b.date.localeCompare(a.date)).map((l, i) => (
            <div key={i} className="mt-3">
              <p className="font-bold">
                {formatDate(l.date)}: {l.title}
              </p>
              <p className="text-base text-ink-muted">{l.source}</p>
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
