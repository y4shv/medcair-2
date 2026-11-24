"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { deleteFile, loadFileBlob } from "@/lib/health/files";

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
    try {
      const url = URL.createObjectURL(await loadFileBlob(path!));
      setBusy(false);
      if (win) win.location.href = url;
      else window.location.href = url;
    } catch {
      setBusy(false);
      win?.close();
      toast.error("Could not open the file.");
    }
  };

  return (
    <button type="button" onClick={open} disabled={busy} className={className}>
      {busy ? "Opening..." : label}
      <ExternalLink className="size-4" aria-hidden />
    </button>
  );
}

export const deleteStoredFile = deleteFile;
