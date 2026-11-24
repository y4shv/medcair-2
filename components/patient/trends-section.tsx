"use client";

import { useMemo, useState } from "react";
import type { HealthData, LabResult } from "@/lib/health/types";
import { formatDate } from "@/lib/health/format";
import { analyseResult, withParsedRange } from "@/lib/health/range";
import { Pill, Section } from "./ui";

interface Point {
  date: string;
  value: number;
  raw: string;
  low?: number;
  high?: number;
  result: LabResult;
}
interface Series {
  key: string;
  name: string;
  unit: string;
  measures: string;
  points: Point[];
}

function buildSeries(data: HealthData): Series[] {
  const map = new Map<string, Series>();
  for (const rep of data.labReports) {
    for (const raw of rep.results) {
      const res = withParsedRange(raw);
      const v = parseFloat(res.value);
      if (!Number.isFinite(v)) continue;
      const key = `${res.name.trim().toLowerCase()}|${res.unit.trim().toLowerCase()}`;
      const s = map.get(key) ?? { key, name: res.name, unit: res.unit, measures: res.measures, points: [] };
      s.points.push({ date: rep.date, value: v, raw: res.value, low: res.rangeLow, high: res.rangeHigh, result: res });
      map.set(key, s);
    }
  }
  const all = [...map.values()];
  all.forEach((s) => s.points.sort((a, b) => a.date.localeCompare(b.date)));
  // Tests with the most readings first, then newest.
  return all.sort(
    (a, b) =>
      b.points.length - a.points.length ||
      b.points[b.points.length - 1].date.localeCompare(a.points[a.points.length - 1].date),
  );
}

const W = 640;
const H = 230;
const PAD = { l: 52, r: 24, t: 18, b: 34 };

function Chart({ s }: { s: Series }) {
  const [hover, setHover] = useState<number | null>(null);
  const pts = s.points;
  const last = pts[pts.length - 1];
  const low = last.low;
  const high = last.high;

  const t = pts.map((p) => new Date(`${p.date}T00:00:00`).getTime());
  const t0 = t[0];
  const t1 = t[t.length - 1];
  const nums = [...pts.map((p) => p.value), ...(low !== undefined ? [low] : []), ...(high !== undefined ? [high] : [])];
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  const span = max - min || Math.abs(max) || 1;
  min -= span * 0.15;
  max += span * 0.15;
  if (pts.every((p) => p.value >= 0) && min < 0) min = 0;

  const x = (i: number) => PAD.l + (t1 === t0 ? (W - PAD.l - PAD.r) / 2 : ((t[i] - t0) / (t1 - t0)) * (W - PAD.l - PAD.r));
  const y = (v: number) => PAD.t + (1 - (v - min) / (max - min)) * (H - PAD.t - PAD.b);
  const fmt = (n: number) => String(Math.round(n * 10) / 10);
  const ticks = [min, (min + max) / 2, max];
  const path = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const bandTop = high !== undefined ? y(high) : PAD.t;
  const bandBottom = low !== undefined ? y(low) : H - PAD.b;
  const label = `${s.name} over time${s.unit ? ` in ${s.unit}` : ""}. ${pts
    .map((p) => `${formatDate(p.date)}: ${p.raw}`)
    .join("; ")}.${last.result.referenceRange ? ` Printed range ${last.result.referenceRange}.` : ""}`;

  const hp = hover !== null ? pts[hover] : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
        {ticks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="stroke-range-track" strokeWidth={1} />
            <text x={PAD.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-muted text-[12px]">
              {fmt(v)}
            </text>
          </g>
        ))}
        {(low !== undefined || high !== undefined) && (
          <rect
            x={PAD.l}
            width={W - PAD.l - PAD.r}
            y={Math.min(bandTop, bandBottom)}
            height={Math.max(2, Math.abs(bandBottom - bandTop))}
            className="fill-range-band"
            opacity={0.18}
          />
        )}
        {pts.length > 1 && <path d={path} fill="none" className="stroke-care" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.value)} r={5} className="fill-care stroke-surface" strokeWidth={2} />
            <circle
              cx={x(i)}
              cy={y(p.value)}
              r={16}
              fill="transparent"
              tabIndex={0}
              aria-label={`${formatDate(p.date)}: ${p.raw} ${s.unit}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
            />
          </g>
        ))}
        <text x={x(pts.length - 1)} y={y(last.value) - 12} textAnchor={pts.length > 1 ? "end" : "middle"} className="fill-ink text-[13px] font-bold">
          {last.raw}
        </text>
        <text x={PAD.l} y={H - 8} className="fill-ink-muted text-[12px]">
          {formatDate(pts[0].date)}
        </text>
        {pts.length > 1 && (
          <text x={W - PAD.r} y={H - 8} textAnchor="end" className="fill-ink-muted text-[12px]">
            {formatDate(last.date)}
          </text>
        )}
      </svg>
      {hp && hover !== null && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-lg bg-ink px-3 py-1.5 text-sm font-bold text-white shadow-card"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(hp.value) / H) * 100 - 16}%` }}
        >
          {hp.raw} {s.unit} · {formatDate(hp.date)}
        </div>
      )}
      {(low !== undefined || high !== undefined) && (
        <p className="text-sm text-ink-muted">
          <b className="text-[#2E6B47]">Green band</b> = range printed on the report: {last.result.referenceRange}
        </p>
      )}
    </div>
  );
}

export function TrendsSection({ data }: { data: HealthData }) {
  const series = useMemo(() => buildSeries(data), [data]);
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? series : series.slice(0, 6);

  return (
    <Section
      id="trends"
      title="My numbers over time"
      intro="Each test from your reports as a graph, so you can see how a number moved between reports."
    >
      {series.length === 0 ? (
        <p>No numbers to draw yet. Upload a lab report and the graphs appear here.</p>
      ) : (
        <>
          <div className="grid gap-5 lg:grid-cols-2">
            {shown.map((s) => {
              const lastP = s.points[s.points.length - 1];
              const view = analyseResult(lastP.result);
              return (
                <article key={s.key} aria-label={s.name} className="rounded-xl border border-line-soft p-4">
                  <h3 className="text-lg font-extrabold">{s.name}</h3>
                  <p className="text-sm text-ink-muted">{s.measures}</p>
                  <div className="my-2 flex flex-wrap items-center gap-3">
                    <p className="num text-2xl font-bold">
                      {lastP.raw} <span className="text-base font-semibold text-ink-muted">{s.unit}</span>
                    </p>
                    {view && <Pill tone={view.status.kind === "within" ? "ok" : "watch"}>{view.statusText}</Pill>}
                  </div>
                  {s.points.length < 2 && (
                    <p className="text-sm text-ink-muted">Only one reading so far. A line appears after a second report.</p>
                  )}
                  <Chart s={s} />
                  <details className="mt-2">
                    <summary className="min-h-11 cursor-pointer py-2 text-base font-bold text-care-deep">Show as a table</summary>
                    <table className="w-full text-left text-base">
                      <thead>
                        <tr className="text-ink-muted">
                          <th className="py-1 pr-4">Date</th>
                          <th className="py-1">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...s.points].reverse().map((p, i) => (
                          <tr key={i} className="border-t border-line-soft">
                            <td className="py-1 pr-4">{formatDate(p.date)}</td>
                            <td className="num py-1">
                              {p.raw} {s.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                </article>
              );
            })}
          </div>
          {series.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-4 min-h-11 rounded-xl border-[1.5px] border-line-control bg-surface px-4 text-base font-bold hover:bg-tint"
            >
              {showAll ? "Show fewer tests" : `Show all ${series.length} tests`}
            </button>
          )}
        </>
      )}
    </Section>
  );
}
