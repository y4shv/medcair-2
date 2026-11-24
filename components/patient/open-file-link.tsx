"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Opens an uploaded file. Private files get a short-lived signed link; demo files open directly. */
export function OpenFileLink({
  path,
  url,
  label,
  className,
}: {
  path?: string;
  url?: string;
  label: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  if (!path && !url) return null;

  if (!path && url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className={className}>
        {label}
        <ExternalLink className="size-4" aria-hidden />
      </a>
    );
  }

  const open = async () => {
    setBusy(true);
    const win = window.open("", "_blank");
    const { data, error } = await createClient()
      .storage.from("medical-documents")
      .createSignedUrl(path!, 300);
    setBusy(false);
    if (error || !data?.signedUrl) {
      win?.close();
      toast.error("Could not open the file.");
      return;
    }
    if (win) win.location.href = data.signedUrl;
    else window.location.href = data.signedUrl;
  };

  return (
    <button type="button" onClick={open} disabled={busy} className={className}>
      {busy ? "Opening..." : label}
      <ExternalLink className="size-4" aria-hidden />
    </button>
  );
}

export async function deleteStoredFile(path?: string) {
  if (!path) return;
  await createClient().storage.from("medical-documents").remove([path]);
}
