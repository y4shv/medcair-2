import { z } from "zod";

// What the AI reads out of an uploaded document. Everything is optional-ish
// because real documents are messy; the client drops what it cannot use.
const str = z.string().trim().max(500);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .nullable()
  .optional()
  .catch(null);

export const extractionSchema = z.object({
  documentType: z.enum(["lab_report", "prescription", "visit_summary", "other"]).catch("other"),
  title: str.catch("").default(""),
  date,
  source: str.catch("").default(""),
  summary: z.string().trim().max(1500).catch("").default(""),
  labResults: z
    .array(
      z.object({
        name: str,
        measures: str.catch("").default(""),
        value: str,
        unit: str.catch("").default(""),
        referenceRange: str.catch("").default(""),
      }),
    )
    .catch([])
    .default([]),
  medicines: z
    .array(
      z.object({
        name: str,
        dose: str.catch("").default(""),
        howToTake: str.catch("").default(""),
        prescriber: str.catch("").default(""),
        forCondition: str.catch("").default(""),
        perDay: z.coerce.number().min(0).max(24).catch(1).default(1),
        quantity: z.coerce.number().min(0).max(10000).catch(0).default(0),
      }),
    )
    .catch([])
    .default([]),
  diagnoses: z.array(str).catch([]).default([]),
});

export type Extraction = z.infer<typeof extractionSchema>;

export const summarySchema = z.object({
  overview: z.string().trim().max(2000),
  keyPoints: z.array(z.string().trim().max(400)).max(8).catch([]).default([]),
  questionsForDoctor: z.array(z.string().trim().max(300)).max(6).catch([]).default([]),
});
