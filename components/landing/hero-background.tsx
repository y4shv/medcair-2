"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { FlowBackground } from "@/components/brand/flow-background";

const KEY = "medcair.hero.paused";

// Canvas, the "veil" that keeps the text side clean, and the pause/play control.
export function HeroBackground() {
  // null until the saved choice is read, so a remembered "paused" never flashes one animated frame.
  const [saved, setSaved] = useState<boolean | null>(null);
  const paused = saved ?? false;

  useEffect(() => {
    try {
      setSaved(window.localStorage.getItem(KEY) === "1");
    } catch {
      // Storage can be blocked. The choice just won't be remembered.
      setSaved(false);
    }
  }, []);

  const toggle = () => {
    const next = !paused;
    setSaved(next);
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      // Ignore.
    }
  };

  return (
    <>
      <FlowBackground theme="light" paused={saved === null || paused} />
      {/* Veil: mist at 94%, solid to 38% of the width, clear by 66%. Top to bottom on phones. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,248,250,.94)_0%,rgba(244,248,250,.94)_38%,rgba(244,248,250,0)_66%)] max-[900px]:bg-[linear-gradient(180deg,rgba(244,248,250,.94)_0%,rgba(244,248,250,.94)_45%,rgba(244,248,250,0)_80%)]"
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={paused}
        className="absolute bottom-[18px] right-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-xl border-[1.5px] border-line-control bg-surface px-4 text-sm font-bold text-ink hover:bg-tint aria-pressed:border-care aria-pressed:bg-care aria-pressed:text-white aria-pressed:hover:bg-care-deep"
      >
        {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
        {paused ? "Play background animation" : "Pause background animation"}
      </button>
    </>
  );
}
