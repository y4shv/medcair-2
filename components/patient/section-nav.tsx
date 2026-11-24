"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const sections = [
  { id: "summary", label: "AI summary" },
  { id: "trends", label: "Graphs" },
  { id: "timeline", label: "Timeline" },
  { id: "medicines", label: "Medicines" },
  { id: "reports", label: "Reports" },
  { id: "sharing", label: "Sharing" },
  { id: "caregivers", label: "Caregivers" },
  { id: "add", label: "Add records" },
];

// Jump links to each section. The chip for the section on screen is filled.
export function SectionNav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="flex flex-wrap gap-2.5">
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={() => setActive(s.id)}
            aria-current={on ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border-[1.5px] px-[18px] text-base",
              on
                ? "border-care bg-care font-extrabold text-white"
                : "border-line-control bg-surface font-bold text-ink hover:bg-tint",
            )}
          >
            {s.label}
          </a>
        );
      })}
    </nav>
  );
}
