"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { HealthData, ShareLink } from "@/lib/health/types";
import { buildPayload, encodePayload, type ShareOptions } from "@/lib/health/share";
import { formatDate, formatDateTime, newId, todayIso } from "@/lib/health/format";
import { CheckCircle2, Send } from "lucide-react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/client";
import { getUserId, type StoreMode } from "@/lib/health/store";
import { Btn, Field, Pill, Section, inputClass } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

function makeLongUrl(data: HealthData, opts: ShareOptions) {
  return `${window.location.origin}/share#${encodePayload(buildPayload(data, opts))}`;
}

function randomId() {
  const b = new Uint8Array(10);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

export function ConsentSection({
  data,
  update,
  mode,
}: {
  data: HealthData;
  update: Update;
  mode: StoreMode;
}) {
  const [opts, setOpts] = useState<ShareOptions>({
    medicines: true,
    labs: true,
    history: false,
    hours: 24,
    forName: "",
  });
  const [busy, setBusy] = useState(false);
  const [latest, setLatest] = useState<ShareLink | null>(null);

  const today = todayIso();

  const revokeConsent = (id: string, who: string) => {
    if (!window.confirm(`Stop ${who} from seeing your records?`)) return;
    update((d) => ({
      ...d,
      consents: d.consents.map((c) => (c.id === id ? { ...c, revoked: true } : c)),
    }));
    toast.success("Access removed");
  };

  const nothingPicked = !opts.medicines && !opts.labs && !opts.history;

  const createLink = async () => {
    if (nothingPicked) {
      toast.error("Pick at least one thing to share.");
      return;
    }
    setBusy(true);
    const payload = buildPayload(data, opts);
    let url: string;
    let shortId: string | undefined;
    const uid = getUserId();
    if (mode === "cloud" && uid) {
      shortId = randomId();
      try {
        await setDoc(doc(firebaseDb(), "shares", shortId), {
          uid,
          payload: JSON.stringify(payload),
          expiresAt: payload.expiresAt,
          revoked: false,
        });
      } catch (e) {
        console.error(e);
        toast.error("Could not make the link. Check your connection and try again.");
        setBusy(false);
        return;
      }
      url = `${window.location.origin}/share?id=${shortId}`;
    } else {
      url = makeLongUrl(data, opts);
    }
    const link: ShareLink = {
      id: newId(),
      forName: opts.forName?.trim() || undefined,
      shortId,
      createdAt: new Date().toISOString(),
      expiresAt: payload.expiresAt,
      url,
      revoked: false,
    };
    update((d) => ({ ...d, shareLinks: [link, ...d.shareLinks] }));
    setLatest(link);
    setBusy(false);
    toast.success("Link made");
  };

  const openPrintable = () => {
    if (nothingPicked) {
      toast.error("Pick at least one thing to share.");
      return;
    }
    window.open(makeLongUrl(data, opts), "_blank", "noopener");
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy. Select the link and copy it by hand.");
    }
  };

  const send = async (l: ShareLink) => {
    const text = `${data.patient.name}'s health summary${l.forName ? ` for ${l.forName}` : ""}. The link works until ${formatDateTime(l.expiresAt)}.`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "Health summary", text, url: l.url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${l.url}`)}`, "_blank", "noopener");
  };

  const revokeLink = async (l: ShareLink) => {
    if (l.shortId) {
      try {
        await updateDoc(doc(firebaseDb(), "shares", l.shortId), { revoked: true });
      } catch (e) {
        console.error(e);
        toast.error("Could not remove the link. Please try again.");
        return;
      }
    }
    update((d) => ({
      ...d,
      shareLinks: d.shareLinks.map((x) => (x.id === l.id ? { ...x, revoked: true } : x)),
    }));
    if (latest?.id === l.id) setLatest(null);
    toast.success(l.shortId ? "Link stopped. It no longer opens." : "Link removed from your list");
  };

  const check = (key: "medicines" | "labs" | "history", label: string) => (
    <label className="flex min-h-11 items-center gap-3">
      <input
        type="checkbox"
        checked={opts[key]}
        onChange={(e) => setOpts({ ...opts, [key]: e.target.checked })}
        className="size-6 accent-care"
      />
      {label}
    </label>
  );

  const LinkActions = ({ l }: { l: ShareLink }) => (
    <div className="mt-2 flex flex-wrap gap-3">
      <Btn onClick={() => void send(l)}>
        <Send className="size-5" aria-hidden /> Send
      </Btn>
      <Btn variant="outline" onClick={() => void copy(l.url)}>
        Copy link
      </Btn>
      <Btn variant="outline" onClick={() => window.open(l.url, "_blank", "noopener")}>
        Open
      </Btn>
      <Btn variant="danger" onClick={() => void revokeLink(l)}>
        Stop this link
      </Btn>
    </div>
  );

  const liveLinks = data.shareLinks.filter((l) => !l.revoked && new Date(l.expiresAt).getTime() >= Date.now());
  const oldLinks = data.shareLinks.filter((l) => l.revoked || new Date(l.expiresAt).getTime() < Date.now());

  return (
    <Section
      id="sharing"
      title="Share with my doctor"
      intro="Make a link for your doctor. It stops working on its own."
    >
      <div className="max-w-xl">
        <Field label="Who is this for?" htmlFor="share-for">
          <input
            id="share-for"
            value={opts.forName ?? ""}
            onChange={(e) => setOpts({ ...opts, forName: e.target.value })}
            placeholder="Dr. Rao"
            className={inputClass}
          />
        </Field>
        <fieldset className="mt-3">
          <legend className="font-semibold">What to share</legend>
          {check("medicines", "My medicines")}
          {check("labs", "My lab reports")}
          {check("history", "My history (visits, diagnoses, prescriptions)")}
        </fieldset>
        <div className="mt-3 max-w-xs">
          <Field label="Link works for" htmlFor="hours">
            <select
              id="hours"
              value={opts.hours}
              onChange={(e) => setOpts({ ...opts, hours: Number(e.target.value) })}
              className={inputClass}
            >
              <option value={1}>1 hour</option>
              <option value={24}>1 day</option>
              <option value={168}>7 days</option>
            </select>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Btn onClick={() => void createLink()} disabled={busy}>
            {busy ? "Making the link..." : "Make a share link"}
          </Btn>
          <Btn variant="outline" onClick={openPrintable}>
            Open printable summary
          </Btn>
        </div>
      </div>

      {latest && !latest.revoked && (
        <div role="status" className="mt-5 rounded-xl bg-tint p-5">
          <p className="flex items-center gap-2 text-lg font-extrabold text-care-deep">
            <CheckCircle2 className="size-5" aria-hidden /> Your link is ready
            {latest.forName ? ` for ${latest.forName}` : ""}
          </p>
          <p className="mt-1 break-all text-base text-ink-muted">
            {latest.url.length > 120 ? `${latest.url.slice(0, 60)}...` : latest.url}
          </p>
          <LinkActions l={latest} />
        </div>
      )}

      {liveLinks.length > 0 && (
        <>
          <h3 className="mt-8 text-xl font-bold">My share links</h3>
          <ul className="mt-2 space-y-3">
            {liveLinks.map((l) => (
              <li key={l.id} className="rounded-xl border border-line-soft p-4">
                <p className="text-lg font-bold">{l.forName ? `For ${l.forName}` : "Share link"}</p>
                <p>Made: {formatDateTime(l.createdAt)}</p>
                <p>Ends: {formatDateTime(l.expiresAt)}</p>
                <LinkActions l={l} />
              </li>
            ))}
          </ul>
        </>
      )}
      {oldLinks.length > 0 && (
        <details className="mt-4">
          <summary className="min-h-11 cursor-pointer py-2 text-base font-bold text-care-deep">
            Old links ({oldLinks.length})
          </summary>
          <ul className="mt-2 space-y-2">
            {oldLinks.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line-soft p-3">
                <span className="font-semibold">{l.forName ? `For ${l.forName}` : "Share link"}</span>
                <span className="text-ink-muted">{formatDateTime(l.createdAt)}</span>
                <Pill tone="neutral">{l.revoked ? "Stopped" : "Ended"}</Pill>
              </li>
            ))}
          </ul>
        </details>
      )}
      {mode === "local" && (
        <p className="mt-3 text-base text-ink-muted">
          Demo mode: the link holds your summary inside it, so it is long and cannot be stopped once
          sent. Signed-in accounts get a short link that can be stopped for real.
        </p>
      )}

      <h3 className="mt-10 text-xl font-bold">People and places with access</h3>
      {data.consents.length === 0 ? (
        <p className="mt-2 text-ink-muted">Nobody has standing access to your records.</p>
      ) : (
        <ul className="mt-2 space-y-3">
          {data.consents.map((c) => {
            const expired = c.until < today;
            const active = !c.revoked && !expired;
            return (
              <li key={c.id} className="rounded-xl border border-line-soft p-4">
                <p className="text-lg font-bold">{c.grantee}</p>
                <p>Can see: {c.scope}</p>
                <p>Until: {formatDate(c.until)}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {active ? (
                    <Btn variant="danger" onClick={() => revokeConsent(c.id, c.grantee)} aria-label={`Remove access for ${c.grantee}`}>
                      Remove access
                    </Btn>
                  ) : (
                    <Pill tone="neutral">{c.revoked ? "Access removed" : "Access ended"}</Pill>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
