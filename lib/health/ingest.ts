import type { Extraction } from "@/lib/ai/extract-schema";
import type { HealthData, HealthRecord, LabReport, Medicine } from "./types";
import { newId, todayIso } from "./format";
import { withParsedRanges } from "./range";

const key = (s: string) => s.trim().toLowerCase();

/** For every result, point "last time" at the most recent earlier report with the same test. */
export function relinkPrevious(reports: LabReport[]): LabReport[] {
  const sorted = [...reports].sort((a, b) => a.date.localeCompare(b.date));
  return reports.map((rep) => ({
    ...rep,
    results: rep.results.map((res) => {
      let prev: { value: string; date: string } | undefined;
      for (const other of sorted) {
        if (other.id === rep.id || other.date >= rep.date) continue;
        const hit = other.results.find((r) => key(r.name) === key(res.name));
        if (hit && Number.isFinite(parseFloat(hit.value))) prev = { value: hit.value, date: other.date };
      }
      return prev ? { ...res, previousValue: prev.value, previousDate: prev.date } : res;
    }),
  }));
}

export interface UploadedFile {
  path?: string;
  name: string;
  /** Used only in demo mode, where there is no storage. */
  url?: string;
}

/** Turns what the AI read from a document into timeline entries, lab results and medicines. */
export function applyExtraction(
  data: HealthData,
  ex: Extraction | null,
  file: UploadedFile,
  fallback: { title: string; date: string; source: string },
): HealthData {
  const date = ex?.date || fallback.date || todayIso();
  const title = fallback.title || ex?.title || file.name;
  const source = fallback.source || ex?.source || "Added by me";
  const fileFields = { fileName: file.name, filePath: file.path, fileUrl: file.url };

  const next: HealthData = { ...data };
  const labResults = (ex?.labResults ?? []).filter((r) => r.name && r.value);
  const meds = (ex?.medicines ?? []).filter((m) => m.name);

  if (labResults.length > 0) {
    const report: LabReport = {
      id: newId(),
      title: ex?.title || title,
      source,
      date,
      documentPath: file.path,
      documentUrl: file.url,
      results: labResults.map((r) => ({
        name: r.name,
        measures: r.measures || "A measurement from your report.",
        value: r.value,
        unit: r.unit,
        referenceRange: r.referenceRange,
      })),
    };
    next.labReports = relinkPrevious(withParsedRanges([report, ...data.labReports]));
  }

  if (meds.length > 0) {
    const newMeds: Medicine[] = meds.map((m) => ({
      id: newId(),
      name: m.name,
      dose: m.dose,
      howToTake: m.howToTake || "As written on the prescription",
      prescriber: m.prescriber || source,
      forCondition: m.forCondition || undefined,
      reminderTimes: [],
      remaining: m.quantity,
      perDay: Math.max(1, m.perDay || 1),
    }));
    next.medicines = [...data.medicines, ...newMeds];
  }

  // Keep one timeline entry for the file itself unless a lab report already carries it.
  if (labResults.length === 0) {
    const kind: HealthRecord["kind"] =
      meds.length > 0 ? "prescription" : ex?.documentType === "visit_summary" ? "visit" : "document";
    const bits = [ex?.summary, ex?.diagnoses?.length ? `Diagnoses on the paper: ${ex.diagnoses.join(", ")}` : ""]
      .filter(Boolean)
      .join(" ");
    next.records = [
      { id: newId(), kind, date, title, source, details: bits || undefined, ...fileFields },
      ...data.records,
    ];
  } else if (ex?.diagnoses?.length) {
    next.records = [
      {
        id: newId(),
        kind: "diagnosis",
        date,
        title: ex.diagnoses.join(", "),
        source,
        details: "Written on the uploaded report.",
      },
      ...data.records,
    ];
  }
  return next;
}
