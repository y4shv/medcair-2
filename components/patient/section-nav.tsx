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
  const [top, setTop] = useState(0);

  // Stay just under the page header, whatever height it has on this screen.
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const set = () => setTop(header.getBoundingClientRect().height);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

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
    <div className="sticky z-30 bg-mist/95 backdrop-blur print:hidden" style={{ top }}>
    <nav
      aria-label="Sections"
      className="mx-auto flex max-w-[1120px] gap-2.5 overflow-x-auto px-6 pb-3 pt-4 [scrollbar-width:none]"
    >
      {sections.map((s) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            onClick={() => setActive(s.id)}
            aria-current={on ? "true" : undefined}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center rounded-full border-[1.5px] px-[18px] text-base",
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
    </div>
  );
}
