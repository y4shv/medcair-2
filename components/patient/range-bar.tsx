import type { ResultView } from "@/lib/health/range";

// Horizontal bar: green band = range printed on the report, filled dot = your value,
// hollow dot = last time. All meaning is also given in words next to the bar.
export function RangeBar({ view, printed }: { view: ResultView; printed: string }) {
  const { bar } = view;
  const [bandFrom, bandTo] = bar.band;
  const bandWidth = Math.max(bandTo - bandFrom, 1.5);

  return (
    <div className="flex flex-col gap-2">
      <div role="img" aria-label={view.ariaLabel} className="relative h-10">
        <div className="absolute inset-x-0 top-[22px] h-2.5 rounded-[5px] bg-range-track" />
        <div
          className="absolute top-[22px] h-2.5 rounded-[5px] bg-range-band"
          style={{ left: `${bandFrom}%`, width: `${bandWidth}%` }}
        />
        {bar.last !== undefined && (
          <div
            className="absolute top-[19px] size-4 -translate-x-1/2 rounded-full border-2 border-line-control bg-surface"
            style={{ left: `${bar.last}%` }}
          />
        )}
        <div
          className="absolute top-[17px] size-4 -translate-x-1/2 rounded-full border-[3px] border-white bg-care shadow-[0_0_0_1px_var(--care)]"
          style={{ left: `${bar.you}%` }}
        />
        <div
          className="absolute top-0 -translate-x-1/2 text-sm font-extrabold text-care-deep"
          style={{ left: `${Math.min(92, Math.max(8, bar.you))}%` }}
        >
          You
        </div>
      </div>
      <div className="flex flex-wrap gap-x-[18px] gap-y-1 text-sm text-ink-muted">
        <span>
          <b className="text-[#2E6B47]">Green band</b> = range printed on the report: {printed}
        </span>
        {bar.last !== undefined && <span>Hollow dot = last time</span>}
      </div>
    </div>
  );
}
