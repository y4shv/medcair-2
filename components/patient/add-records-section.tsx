"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { HealthData, HealthRecord, Medicine } from "@/lib/health/types";
import { newId, todayIso } from "@/lib/health/format";
import { buildSimulatedAbdmRecords } from "@/lib/health/demo-data";
import { Btn, Field, Section, inputClass } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

// Files are kept in this browser only, so keep them small.
const MAX_BYTES = 1.5 * 1024 * 1024;

export function AddRecordsSection({ data, update }: { data: HealthData; update: Update }) {
  return (
    <Section id="add" title="Add records" intro="Put new papers and medicines in one place.">
      <div className="space-y-8">
        <UploadForm update={update} />
        <PrescriptionForm update={update} />
        <AbdmDemo data={data} update={update} />
      </div>
    </Section>
  );
}

function UploadForm({ update }: { update: Update }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayIso());
  const [source, setSource] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [inputKey, setInputKey] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    if (file.size > MAX_BYTES) {
      toast.error("This file is too big. Please pick a file under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast.error("Could not read this file.");
    reader.onload = () => {
      const record: HealthRecord = {
        id: newId(),
        kind: "document",
        date,
        title: title.trim() || file.name,
        source: source.trim() || "Added by me",
        fileName: file.name,
        fileUrl: String(reader.result),
      };
      if (update((d) => ({ ...d, records: [record, ...d.records] }))) {
        toast.success("File added to your timeline");
        setTitle("");
        setSource("");
        setFile(null);
        setInputKey((k) => k + 1);
      } else {
        toast.error("Could not save the file. The browser storage may be full.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:max-w-xl">
      <h3 className="text-xl font-bold">Upload a PDF or photo</h3>
      <Field label="File (PDF or image)" htmlFor="up-file">
        <input
          key={inputKey}
          id="up-file"
          type="file"
          accept="application/pdf,image/*"
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className={inputClass}
        />
      </Field>
      <Field label="Name for this file" htmlFor="up-title">
        <input id="up-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blood test, March" className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date on the paper" htmlFor="up-date">
          <input id="up-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label="From (clinic or lab)" htmlFor="up-source">
          <input id="up-source" value={source} onChange={(e) => setSource(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Btn type="submit" className="sm:w-fit">
        Add file
      </Btn>
      <p className="text-base text-gray-300">
        The file is kept on this device only. The app does not read the numbers inside it yet.
      </p>
    </form>
  );
}

function PrescriptionForm({ update }: { update: Update }) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [howToTake, setHowToTake] = useState("");
  const [prescriber, setPrescriber] = useState("");
  const [date, setDate] = useState(todayIso());
  const [remaining, setRemaining] = useState("30");
  const [perDay, setPerDay] = useState("1");
  const [times, setTimes] = useState("08:00");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const med: Medicine = {
      id: newId(),
      name: name.trim(),
      dose: dose.trim(),
      howToTake: howToTake.trim() || `${perDay} time(s) a day`,
      prescriber: prescriber.trim() || "Added by me",
      reminderTimes: times
        .split(",")
        .map((t) => t.trim())
        .filter((t) => /^\d{1,2}:\d{2}$/.test(t))
        .map((t) => t.padStart(5, "0")),
      remaining: Math.max(0, Number(remaining) || 0),
      perDay: Math.max(1, Number(perDay) || 1),
    };
    const record: HealthRecord = {
      id: newId(),
      kind: "prescription",
      date,
      title: `${med.name} ${med.dose}`.trim(),
      source: med.prescriber,
      details: med.howToTake,
    };
    if (
      update((d) => ({
        ...d,
        medicines: [...d.medicines, med],
        records: [record, ...d.records],
      }))
    ) {
      toast.success("Medicine added");
      setName("");
      setDose("");
      setHowToTake("");
      setPrescriber("");
    } else {
      toast.error("Could not save. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:max-w-xl">
      <h3 className="text-xl font-bold">Type in a prescription</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Medicine name" htmlFor="rx-name">
          <input id="rx-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Strength (like 500 mg)" htmlFor="rx-dose">
          <input id="rx-dose" required value={dose} onChange={(e) => setDose(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="How to take it" htmlFor="rx-how">
        <input id="rx-how" value={howToTake} onChange={(e) => setHowToTake(e.target.value)} placeholder="1 tablet after food" className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Doctor or clinic" htmlFor="rx-by">
          <input id="rx-by" value={prescriber} onChange={(e) => setPrescriber(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Date on the prescription" htmlFor="rx-date">
          <input id="rx-date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="How many are left" htmlFor="rx-left">
          <input id="rx-left" type="number" min={0} required value={remaining} onChange={(e) => setRemaining(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Taken per day" htmlFor="rx-per">
          <input id="rx-per" type="number" min={1} required value={perDay} onChange={(e) => setPerDay(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Reminder times" htmlFor="rx-times">
          <input id="rx-times" value={times} onChange={(e) => setTimes(e.target.value)} placeholder="08:00, 20:00" className={inputClass} />
        </Field>
      </div>
      <Btn type="submit" className="sm:w-fit">
        Add medicine
      </Btn>
    </form>
  );
}

function AbdmDemo({ data, update }: { data: HealthData; update: Update }) {
  const fetchSimulated = () => {
    const { records, labReports } = buildSimulatedAbdmRecords();
    update((d) => ({
      ...d,
      abdmFetched: true,
      records: [...records, ...d.records],
      labReports: [...labReports, ...d.labReports],
    }));
    toast.success("Demo records added (simulated)");
  };

  return (
    <div className="rounded-xl border-2 border-amber-400/60 bg-amber-500/10 p-4 sm:max-w-xl">
      <h3 className="text-xl font-bold text-amber-100">Fetch from ABHA/ABDM (SIMULATED)</h3>
      <p className="mt-1 text-amber-100">
        This is a demo button. It does not connect to ABHA or ABDM. It adds fake sample records so
        you can see how fetched records would look.
      </p>
      <Btn
        variant="outline"
        className="mt-3 border-amber-400/60"
        onClick={fetchSimulated}
        disabled={data.abdmFetched}
      >
        {data.abdmFetched ? "Demo records already added" : "Add simulated records"}
      </Btn>
    </div>
  );
}
