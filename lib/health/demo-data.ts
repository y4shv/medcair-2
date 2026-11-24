// Fake demo data only. The patient, doctors, clinics and labs are made up.
import type {
  HealthData,
  HealthRecord,
  LabReport,
  Medicine,
} from "./types";
import { daysFromToday } from "./format";
import { withParsedRanges } from "./range";

const SUNRISE = "Sunrise Diagnostics (demo lab)";
const DIABETES = "Dr. Anita Rao, City Diabetes Centre";
const HEART = "Dr. Sanjay Mehta, Heart & BP Clinic";
const FAMILY = "Dr. Priya Nair, Lakeview Family Clinic";

export function buildDemoLabReports(): LabReport[] {
  return [
    {
      id: "lab-1",
      title: "HbA1c and blood sugar",
      source: SUNRISE,
      date: daysFromToday(-330),
      documentUrl: "/sample-reports/lab-1",
      results: [
        {
          name: "HbA1c",
          measures:
            "Your average blood sugar over the last 2 to 3 months.",
          value: "8.1",
          unit: "%",
          referenceRange: "4.0 - 5.6 %",
        },
        {
          name: "Fasting blood sugar",
          measures: "Your blood sugar after not eating for 8 hours.",
          value: "148",
          unit: "mg/dL",
          referenceRange: "70 - 99 mg/dL",
        },
      ],
    },
    {
      id: "lab-2",
      title: "Lipid profile (blood fats)",
      source: SUNRISE,
      date: daysFromToday(-240),
      documentUrl: "/sample-reports/lab-2",
      results: [
        {
          name: "LDL cholesterol",
          measures: "A type of fat in your blood, often called bad cholesterol.",
          value: "128",
          unit: "mg/dL",
          referenceRange: "Below 100 mg/dL",
        },
        {
          name: "HDL cholesterol",
          measures: "A type of fat in your blood, often called good cholesterol.",
          value: "41",
          unit: "mg/dL",
          referenceRange: "Above 40 mg/dL",
        },
        {
          name: "Triglycerides",
          measures: "Another type of fat in your blood.",
          value: "172",
          unit: "mg/dL",
          referenceRange: "Below 150 mg/dL",
        },
      ],
    },
    {
      id: "lab-3",
      title: "HbA1c, sugar and kidney check",
      source: "Lakeview Pathology (demo lab)",
      date: daysFromToday(-150),
      documentUrl: "/sample-reports/lab-3",
      results: [
        {
          name: "HbA1c",
          measures: "Your average blood sugar over the last 2 to 3 months.",
          value: "7.4",
          unit: "%",
          previousValue: "8.1",
          previousDate: daysFromToday(-330),
          referenceRange: "4.0 - 5.6 %",
        },
        {
          name: "Fasting blood sugar",
          measures: "Your blood sugar after not eating for 8 hours.",
          value: "132",
          unit: "mg/dL",
          previousValue: "148",
          previousDate: daysFromToday(-330),
          referenceRange: "70 - 99 mg/dL",
        },
        {
          name: "Serum creatinine",
          measures:
            "A waste product in your blood. It is used to check how the kidneys are working.",
          value: "0.9",
          unit: "mg/dL",
          referenceRange: "0.7 - 1.3 mg/dL",
        },
      ],
    },
    {
      id: "lab-4",
      title: "HbA1c and lipid profile",
      source: SUNRISE,
      date: daysFromToday(-28),
      documentUrl: "/sample-reports/lab-4",
      results: [
        {
          name: "HbA1c",
          measures: "Your average blood sugar over the last 2 to 3 months.",
          value: "7.1",
          unit: "%",
          previousValue: "7.4",
          previousDate: daysFromToday(-150),
          referenceRange: "4.0 - 5.6 %",
        },
        {
          name: "LDL cholesterol",
          measures: "A type of fat in your blood, often called bad cholesterol.",
          value: "104",
          unit: "mg/dL",
          previousValue: "128",
          previousDate: daysFromToday(-240),
          referenceRange: "Below 100 mg/dL",
        },
        {
          name: "Triglycerides",
          measures: "Another type of fat in your blood.",
          value: "151",
          unit: "mg/dL",
          previousValue: "172",
          previousDate: daysFromToday(-240),
          referenceRange: "Below 150 mg/dL",
        },
      ],
    },
  ];
}

function buildRecords(): HealthRecord[] {
  return [
    {
      id: "rec-1",
      kind: "diagnosis",
      date: daysFromToday(-1500),
      title: "Type 2 diabetes",
      source: DIABETES,
    },
    {
      id: "rec-2",
      kind: "diagnosis",
      date: daysFromToday(-1100),
      title: "High blood pressure",
      source: HEART,
    },
    {
      id: "rec-3",
      kind: "visit",
      date: daysFromToday(-345),
      title: "Diabetes check-up",
      source: DIABETES,
      details: "Yearly review. Blood tests were asked for.",
    },
    {
      id: "rec-4",
      kind: "prescription",
      date: daysFromToday(-345),
      title: "Metformin 500 mg",
      source: DIABETES,
      details: "1 tablet, twice a day, after food.",
    },
    {
      id: "rec-5",
      kind: "visit",
      date: daysFromToday(-300),
      title: "Blood pressure check",
      source: HEART,
    },
    {
      id: "rec-6",
      kind: "prescription",
      date: daysFromToday(-300),
      title: "Amlodipine 5 mg and Telmisartan 40 mg",
      source: HEART,
      details: "Amlodipine once a day. Telmisartan once a day.",
    },
    {
      id: "rec-7",
      kind: "visit",
      date: daysFromToday(-235),
      title: "Family doctor visit",
      source: FAMILY,
      details: "Talked about the lipid profile report.",
    },
    {
      id: "rec-8",
      kind: "prescription",
      date: daysFromToday(-235),
      title: "Atorvastatin 10 mg",
      source: FAMILY,
      details: "1 tablet at night.",
    },
    {
      id: "rec-9",
      kind: "visit",
      date: daysFromToday(-145),
      title: "Diabetes follow-up",
      source: DIABETES,
    },
    {
      id: "rec-10",
      kind: "visit",
      date: daysFromToday(-60),
      title: "Blood pressure follow-up",
      source: HEART,
    },
  ];
}

function buildMedicines(): Medicine[] {
  return [
    {
      id: "med-1",
      name: "Metformin",
      dose: "500 mg",
      howToTake: "1 tablet, twice a day, after food",
      prescriber: DIABETES,
      forCondition: "Diabetes",
      reminderTimes: ["08:30", "20:30"],
      remaining: 9,
      perDay: 2,
    },
    {
      id: "med-2",
      name: "Amlodipine",
      dose: "5 mg",
      howToTake: "1 tablet, once a day",
      prescriber: HEART,
      forCondition: "Blood pressure",
      reminderTimes: ["08:00"],
      remaining: 22,
      perDay: 1,
    },
    {
      id: "med-3",
      name: "Telmisartan",
      dose: "40 mg",
      howToTake: "1 tablet, once a day",
      prescriber: HEART,
      forCondition: "Blood pressure",
      reminderTimes: ["08:00"],
      remaining: 40,
      perDay: 1,
    },
    {
      id: "med-4",
      name: "Atorvastatin",
      dose: "10 mg",
      howToTake: "1 tablet, at night",
      prescriber: FAMILY,
      forCondition: "High cholesterol",
      reminderTimes: ["21:00"],
      remaining: 14,
      perDay: 1,
    },
  ];
}

export function buildDemoData(): HealthData {
  return {
    version: 1,
    patient: {
      name: "Ramesh Verma (demo patient)",
      age: 58,
      conditions: ["Type 2 diabetes", "High blood pressure"],
    },
    records: buildRecords(),
    labReports: withParsedRanges(buildDemoLabReports()),
    medicines: buildMedicines(),
    appointments: [
      {
        id: "apt-1",
        doctorName: "Dr. Anita Rao",
        date: daysFromToday(1),
        time: "10:30",
        place: "City Diabetes Centre, Room 4",
        notes: "Bring the last 3 blood reports.",
        reminder: "1d",
      },
      {
        id: "apt-2",
        doctorName: "Dr. Sanjay Mehta",
        date: daysFromToday(18),
        time: "17:00",
        place: "Heart & BP Clinic",
        notes: "Carry the home blood pressure diary.",
        reminder: "1d",
      },
    ],
    consents: [
      {
        id: "con-1",
        grantee: DIABETES,
        scope: "Prescriptions and lab reports",
        until: daysFromToday(30),
        revoked: false,
      },
      {
        id: "con-2",
        grantee: SUNRISE,
        scope: "Lab reports from this lab",
        until: daysFromToday(7),
        revoked: false,
      },
      {
        id: "con-3",
        grantee: FAMILY,
        scope: "Full health timeline",
        until: daysFromToday(90),
        revoked: false,
      },
    ],
    shareLinks: [],
    caregivers: [
      {
        id: "care-1",
        name: "Neha Verma (daughter)",
        contact: "neha.demo@example.com",
        status: "active",
        invitedOn: daysFromToday(-40),
        revoked: false,
      },
    ],
    abdmFetched: false,
  };
}

/** Mock records used by the SIMULATED "Fetch from ABHA/ABDM" button. */
export function buildSimulatedAbdmRecords() {
  const source = "Simulated ABDM demo hospital";
  const records: HealthRecord[] = [
    {
      id: `sim-visit-${Date.now()}`,
      kind: "visit",
      date: daysFromToday(-90),
      title: "Eye check-up (simulated)",
      source,
      details: "Yearly eye test for people with diabetes.",
      simulated: true,
    },
  ];
  const labReports: LabReport[] = [
    {
      id: `sim-lab-${Date.now()}`,
      title: "Urine albumin test (simulated)",
      source,
      date: daysFromToday(-90),
      simulated: true,
      results: [
        {
          name: "Urine albumin",
          measures: "A protein that can show up in urine.",
          value: "18",
          unit: "mg/L",
          referenceRange: "Below 20 mg/L",
        },
      ],
    },
  ];
  return { records, labReports: withParsedRanges(labReports) };
}
