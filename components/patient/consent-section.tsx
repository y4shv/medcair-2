"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { HealthData, ShareLink } from "@/lib/health/types";
import { buildPayload, encodePayload, type ShareOptions } from "@/lib/health/share";
import { formatDate, formatDateTime, newId, todayIso } from "@/lib/health/format";
import { Btn, Field, Pill, Section, inputClass } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

function makeUrl(data: HealthData, opts: ShareOptions) {
  return `${window.location.origin}/share#${encodePayload(buildPayload(data, opts))}`;
}

export function ConsentSection({ data, update }: { data: HealthData; update: Update }) {
  const [opts, setOpts] = useState<ShareOptions>({
    medicines: true,
    labs: true,
    history: false,
    hours: 24,
  });

  const today = todayIso();

  const revokeConsent = (id: string) => {
    update((d) => ({
      ...d,
      consents: d.consents.map((c) => (c.id === id ? { ...c, revoked: true } : c)),
    }));
    toast.success("Access removed");
  };

  const createLink = () => {
    if (!opts.medicines && !opts.labs && !opts.history) {
      toast.error("Pick at least one thing to share.");
      return;
    }
    const url = makeUrl(data, opts);
    const link: ShareLink = {
      id: newId(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + opts.hours * 3600000).toISOString(),
      url,
      revoked: false,
    };
    update((d) => ({ ...d, shareLinks: [link, ...d.shareLinks] }));
    toast.success("Link made. You can copy it below.");
  };

  const openPrintable = () => {
    if (!opts.medicines && !opts.labs && !opts.history) {
      toast.error("Pick at least one thing to share.");
      return;
    }
    window.open(makeUrl(data, opts), "_blank", "noopener");
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy. Select the link and copy it by hand.");
    }
  };

  const revokeLink = (id: string) => {
    update((d) => ({
      ...d,
      shareLinks: d.shareLinks.map((l) => (l.id === id ? { ...l, revoked: true } : l)),
    }));
    toast.success("Link removed from your list");
  };

  const check = (key: "medicines" | "labs" | "history", label: string) => (
    <label className="flex min-h-11 items-center gap-3">
      <input
        type="checkbox"
        checked={opts[key]}
        onChange={(e) => setOpts({ ...opts, [key]: e.target.checked })}
        className="size-6 accent-indigo-600"
      />
      {label}
    </label>
  );

  return (
    <Section
      id="sharing"
      title="Who can see my records"
      intro="You decide who sees what, and for how long."
    >
      <h3 className="text-xl font-bold">People and places with access</h3>
      <ul className="mt-2 space-y-3">
        {data.consents.map((c) => {
          const expired = c.until < today;
          const active = !c.revoked && !expired;
          return (
            <li key={c.id} className="rounded-xl border border-gray-300 p-4">
              <p className="text-lg font-bold">{c.grantee}</p>
              <p>Can see: {c.scope}</p>
              <p>Until: {formatDate(c.until)}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {active ? (
                  <Btn variant="danger" onClick={() => revokeConsent(c.id)} aria-label={`Remove access for ${c.grantee}`}>
                    Remove access
                  </Btn>
                ) : (
                  <Pill tone="gray">{c.revoked ? "Access removed" : "Access ended"}</Pill>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-8 text-xl font-bold">Share with someone</h3>
      <p className="text-gray-700">
        Make a link that stops working on its own, or open a page you can print.
      </p>
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
        <Btn onClick={createLink}>Make a share link</Btn>
        <Btn variant="outline" onClick={openPrintable}>
          Open printable summary
        </Btn>
      </div>

      {data.shareLinks.length > 0 && (
        <>
          <h3 className="mt-8 text-xl font-bold">My share links</h3>
          <ul className="mt-2 space-y-3">
            {data.shareLinks.map((l) => {
              const expired = new Date(l.expiresAt).getTime() < Date.now();
              const live = !l.revoked && !expired;
              return (
                <li key={l.id} className="rounded-xl border border-gray-300 p-4">
                  <p>Made: {formatDateTime(l.createdAt)}</p>
                  <p>Ends: {formatDateTime(l.expiresAt)}</p>
                  {live ? (
                    <div className="mt-2 flex flex-wrap gap-3">
                      <Btn variant="outline" onClick={() => copy(l.url)}>
                        Copy link
                      </Btn>
                      <Btn variant="outline" onClick={() => window.open(l.url, "_blank", "noopener")}>
                        Open
                      </Btn>
                      <Btn variant="danger" onClick={() => revokeLink(l.id)}>
                        Remove link
                      </Btn>
                    </div>
                  ) : (
                    <p className="mt-2">
                      <Pill tone="gray">{l.revoked ? "Removed" : "Ended"}</Pill>
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-base text-gray-700">
            Note: in this prototype the link holds your summary inside it. Removing a link only
            removes it from this list. A link you already sent will still open until it ends.
          </p>
        </>
      )}
    </Section>
  );
}
