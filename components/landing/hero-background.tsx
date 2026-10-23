"use client";

import { FlowBackground } from "@/components/brand/flow-background";

// Ink theme. Canvas plus the "veil" that keeps the text side clean.
// The animation stops by itself for visitors who ask for reduced motion (see FlowBackground).
export function HeroBackground() {
  return (
    <>
      <FlowBackground theme="ink" />
      {/* Veil: ink at 92%, solid to 38% of the width, clear by 66%. Top to bottom on phones. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(12,32,47,.92)_0%,rgba(12,32,47,.92)_38%,rgba(12,32,47,0)_66%)] max-[900px]:bg-[linear-gradient(180deg,rgba(12,32,47,.92)_0%,rgba(12,32,47,.92)_45%,rgba(12,32,47,0)_80%)]"
      />
    </>
  );
}
