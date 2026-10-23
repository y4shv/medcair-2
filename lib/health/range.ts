import type { LabReport, LabResult } from "./types";
import { formatDate } from "./format";

// Reads the range printed on a report ("4.0 - 5.6 %", "Below 100 mg/dL", "Above 40 mg/dL")
// into numbers, and works out where a value sits. Wording stays factual: it never says
// good, bad, better or worse, and it never gives advice.

export interface ParsedRange {
  low?: number;
  high?: number;
}

const NUM = String.raw`(\d+(?:[.,]\d+)?)`;

function toNumber(s: string): number {
  return parseFloat(s.replace(",", "."));
}

export function parseRange(printed: string): ParsedRange | null {
  const text = printed.trim();
  const between = text.match(new RegExp(String.raw`${NUM}\s*(?:-|–|—|to)\s*${NUM}`, "i"));
  if (between) {
    const a = toNumber(between[1]);
    const b = toNumber(between[2]);
    return { low: Math.min(a, b), high: Math.max(a, b) };
  }
  const below = text.match(new RegExp(String.raw`(?:below|under|less than|up to|<=?)\s*${NUM}`, "i"));
  if (below) return { high: toNumber(below[1]) };
  const above = text.match(new RegExp(String.raw`(?:above|over|more than|greater than|>=?)\s*${NUM}`, "i"));
  if (above) return { low: toNumber(above[1]) };
  return null;
}

/** Fill rangeLow/rangeHigh next to the printed string. Keeps numbers already stored. */
export function withParsedRange(r: LabResult): LabResult {
  if (r.rangeLow !== undefined || r.rangeHigh !== undefined) return r;
  const p = parseRange(r.referenceRange);
  if (!p) return r;
  return { ...r, rangeLow: p.low, rangeHigh: p.high };
}

export function withParsedRanges(reports: LabReport[]): LabReport[] {
  return reports.map((rep) => ({ ...rep, results: rep.results.map(withParsedRange) }));
}

export type RangeStatus =
  | { kind: "within" }
  | { kind: "outside"; side: "above" | "below"; just: boolean };

export interface ResultView {
  value: number;
  previous?: number;
  low?: number;
  high?: number;
  status: RangeStatus;
  statusText: string;
  trend: { dir: "lower" | "higher" | "same"; text: string } | null;
  bar: { min: number; max: number; band: [number, number]; you: number; last?: number };
  ariaLabel: string;
}

const clamp01 = (n: number) => Math.min(100, Math.max(0, n));

/** Returns null when the value or the range cannot be read as numbers. */
export function analyseResult(res: LabResult): ResultView | null {
  const r = withParsedRange(res);
  const value = parseFloat(r.value);
  const previous = r.previousValue !== undefined ? parseFloat(r.previousValue) : undefined;
  const { rangeLow: low, rangeHigh: high } = r;
  if (!Number.isFinite(value) || (low === undefined && high === undefined)) return null;
  const prev = previous !== undefined && Number.isFinite(previous) ? previous : undefined;

  // Status against the printed range.
  let status: RangeStatus = { kind: "within" };
  if (high !== undefined && (low !== undefined ? value > high : value >= high)) {
    const bound = high;
    status = { kind: "outside", side: "above", just: (value - bound) / Math.abs(bound || NaN) <= 0.1 };
  } else if (low !== undefined && (high !== undefined ? value < low : value <= low)) {
    const bound = low;
    status = { kind: "outside", side: "below", just: (bound - value) / Math.abs(bound || NaN) <= 0.1 };
  }
  const statusText =
    status.kind === "within"
      ? "Within the printed range"
      : `${status.just ? "Just " : ""}${status.side === "above" ? (status.just ? "above" : "Above") : status.just ? "below" : "Below"} the printed range`;

  // Trend against the previous value.
  let trend: ResultView["trend"] = null;
  if (prev !== undefined) {
    const when = r.previousDate ? ` on ${formatDate(r.previousDate)}` : "";
    const was = `${r.previousValue} ${r.unit}${when}`;
    if (value < prev) trend = { dir: "lower", text: `Lower than last time: ${was}` };
    else if (value > prev) trend = { dir: "higher", text: `Higher than last time: ${was}` };
    else trend = { dir: "same", text: `Same as last time: ${was}` };
  }

  // Bar domain: min and max of every number we show, padded 20% each side.
  const nums = [low, high, value, prev].filter((n): n is number => n !== undefined);
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  const span = max - min || Math.abs(max) || 1;
  const pad = span * 0.2;
  const allPositive = nums.every((n) => n > 0);
  min = min - pad;
  max = max + pad;
  if (allPositive) min = Math.max(0, min);
  const pos = (v: number) => clamp01(((v - min) / (max - min)) * 100);
  const band: [number, number] = [low !== undefined ? pos(low) : 0, high !== undefined ? pos(high) : 100];

  const unit = r.unit ? ` ${r.unit}` : "";
  const fmt = (n: number) => String(Math.round(n * 100) / 100);
  const ariaLabel =
    `Range bar from ${fmt(min)} to ${fmt(max)}${unit}. Printed range ${r.referenceRange}. ` +
    `Your value ${r.value}${unit}.` +
    (prev !== undefined ? ` Last time ${r.previousValue}${unit}.` : " No earlier value.");

  return {
    value,
    previous: prev,
    low,
    high,
    status,
    statusText,
    trend,
    bar: { min, max, band, you: pos(value), last: prev !== undefined ? pos(prev) : undefined },
    ariaLabel,
  };
}
