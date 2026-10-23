// Types for the patient health record prototype.
// All dates are ISO strings: "YYYY-MM-DD" for days, full ISO for timestamps.

export interface PatientProfile {
  name: string;
  age: number;
  conditions: string[];
}

export type RecordKind = "visit" | "diagnosis" | "prescription" | "document";

export interface HealthRecord {
  id: string;
  kind: RecordKind;
  date: string;
  title: string;
  /** Who made this record: clinic, hospital, lab or "Added by me". */
  source: string;
  details?: string;
  /** Uploaded file (kept in this browser only for the prototype). */
  fileName?: string;
  fileUrl?: string;
  /** True when the entry came from the simulated ABHA/ABDM fetch. */
  simulated?: boolean;
}

export interface LabResult {
  name: string;
  /** Plain words: what this test measures. */
  measures: string;
  value: string;
  unit: string;
  previousValue?: string;
  previousDate?: string;
  /** Reference range exactly as printed on the report. */
  referenceRange: string;
  /**
   * Numbers parsed from referenceRange (see range.ts), kept next to the printed string.
   * "4.0 - 5.6 %" gives low 4 and high 5.6. "Below 100" gives high 100 only.
   * "Above 40" gives low 40 only. Missing when the string could not be read.
   */
  rangeLow?: number;
  rangeHigh?: number;
}

export interface LabReport {
  id: string;
  title: string;
  /** Lab or provider name. */
  source: string;
  date: string;
  /** Link to the original document. Missing for simulated entries. */
  documentUrl?: string;
  results: LabResult[];
  simulated?: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  dose: string;
  /** Short plain text, e.g. "1 tablet, twice a day". */
  howToTake: string;
  prescriber: string;
  /** For example "Diabetes". Taken from the prescription, not guessed. */
  forCondition?: string;
  /** 24h times like "08:00". */
  reminderTimes: string[];
  remaining: number;
  /** Units taken per day. Used for the refill estimate. */
  perDay: number;
  simulated?: boolean;
}

export type ReminderOption = "none" | "1d" | "2h";

export interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  /** "HH:MM" 24h, optional. */
  time?: string;
  place: string;
  notes?: string;
  reminder: ReminderOption;
}

export interface Consent {
  id: string;
  grantee: string;
  scope: string;
  /** Date the access ends. */
  until: string;
  revoked: boolean;
}

export interface ShareLink {
  id: string;
  createdAt: string;
  expiresAt: string;
  url: string;
  revoked: boolean;
}

export interface Caregiver {
  id: string;
  name: string;
  contact: string;
  status: "invited" | "active";
  invitedOn: string;
  revoked: boolean;
}

export interface HealthData {
  version: 1;
  patient: PatientProfile;
  records: HealthRecord[];
  labReports: LabReport[];
  medicines: Medicine[];
  appointments: Appointment[];
  consents: Consent[];
  shareLinks: ShareLink[];
  caregivers: Caregiver[];
  abdmFetched: boolean;
}
