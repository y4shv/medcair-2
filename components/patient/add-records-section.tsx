"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { HealthData, HealthRecord, Medicine } from "@/lib/health/types";
import { newId, todayIso } from "@/lib/health/format";
import { applyExtraction } from "@/lib/health/ingest";
import type { Extraction } from "@/lib/ai/extract-schema";
import { getUserId, type StoreMode } from "@/lib/health/store";
import { firebaseAuth } from "@/lib/firebase/client";
import { ALLOWED_TYPES, MAX_FILE_BYTES, prepareFile, saveFile } from "@/lib/health/files";
import { buildSimulatedAbdmRecords } from "@/lib/health/demo-data";
import { Btn, Field, Section, inputClass } from "./ui";

type Update = (fn: (d: HealthData) => HealthData) => boolean;

// Files are kept in this browser only, so keep them small.
const MAX_BYTES = 1.5 * 1024 * 1024;

export function AddRecordsSection({
  data,
  update,
  mode,
}: {
  data: HealthData;
  update: Update;
  mode: StoreMode;
}) {
  return (
    <Section id="add" title="Add records" intro="Put new papers and medicines in one place.">
      <div className="space-y-8">
        <UploadForm update={update} mode={mode} />
        <PrescriptionForm update={update} />
        <ProfileForm data={data} update={update} />
        {mode === "local" && <AbdmDemo data={data} update={update} />}
      </div>
    </Section>
  );
}


function UploadForm({ update, mode }: { update: Update; mode: StoreMode }) {
  const cloud = mode === "cloud";
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [useAi, setUseAi] = useState(true);
  const [busy, setBusy] = useState<"" | "uploading" | "reading">("");
  const [result, setResult] = useState("");
  const [inputKey, setInputKey] = useState(0);

  const finish = () => {
    setTitle("");
    setSource("");
    setDate("");
    setFile(null);
    setInputKey((k) => k + 1);
  };

  const submitLocal = (f: File) => {
    if (f.size > MAX_BYTES) {
      toast.error("This file is too big. Please pick a file under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => toast.error("Could not read this file.");
    reader.onload = () => {
      const ok = update((d) =>
        applyExtraction(d, null, { name: f.name, url: String(reader.result) }, {
          title: title.trim() || f.name,
          date: date || todayIso(),
          source: source.trim(),
        }),
      );
      if (ok) {
        toast.success("File added to your timeline");
        finish();
      } else {
        toast.error("Could not save the file. The browser storage may be full.");
      }
    };
    reader.readAsDataURL(f);
  };

  const submitCloud = async (f: File) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      toast.error("Please pick a PDF (under 5 MB) or a JPG, PNG or WebP photo.");
      return;
    }
    if (f.type === "application/pdf" && f.size > MAX_FILE_BYTES) {
      toast.error("This PDF is too big. Please pick a PDF under 5 MB, or upload photos of the pages.");
      return;
    }
    const uid = getUserId();
    if (!uid) {
      toast.error("Please sign in again.");
      return;
    }
    setResult("");
    setBusy("uploading");
    let path = "";
    let storedName = f.name;
    try {
      const prepared = await prepareFile(f);
      storedName = prepared.name;
      path = await saveFile(uid, prepared.blob, prepared.mime, prepared.name);
    } catch (err) {
      setBusy("");
      console.error(err);
      toast.error(
        (err as Error).message === "too-big"
          ? "This file is too big even after shrinking. Please pick a smaller one."
          : "Could not save the file. Firestore may not be set up yet.",
      );
      return;
    }

    let extraction: Extraction | null = null;
    let note = "";
    if (useAi) {
      setBusy("reading");
      try {
        const token = await firebaseAuth().currentUser?.getIdToken();
        const res = await fetch("/api/ai/extract", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
          body: JSON.stringify({ path }),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok) extraction = body.extraction as Extraction;
        else note = body.error || "The AI could not read this file.";
      } catch {
        note = "Could not reach the AI. The file was saved without reading it.";
      }
    }

    const ok = update((d) =>
      applyExtraction(d, extraction, { path, name: storedName }, {
        title: title.trim(),
        date: date,
        source: source.trim(),
      }),
    );
    setBusy("");
    if (!ok) {
      toast.error("Could not save. Please try again.");
      return;
    }
    if (extraction) {
      const labs = extraction.labResults.length;
      const meds = extraction.medicines.length;
      const bits = [labs && `${labs} lab result${labs === 1 ? "" : "s"}`, meds && `${meds} medicine${meds === 1 ? "" : "s"}`].filter(Boolean);
      setResult(
        bits.length
          ? `The AI found ${bits.join(" and ")} and added them. Please check them against your paper.`
          : "File saved. The AI did not find lab results or medicines in it.",
      );
      toast.success("File added and read");
    } else {
      setResult(note ? `File saved. ${note}` : "File saved to your timeline.");
      toast.success("File added to your timeline");
    }
    finish();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || busy) return;
    if (cloud) void submitCloud(file);
    else submitLocal(file);
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:max-w-xl">
      <h3 className="text-xl font-bold">Upload a PDF or photo</h3>
      <Field label="File (PDF or photo)" htmlFor="up-file">
        <input
          key={inputKey}
          id="up-file"
          type="file"
          accept={cloud ? "application/pdf,image/png,image/jpeg,image/webp,image/gif" : "application/pdf,image/*"}
          required
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className={inputClass}
        />
      </Field>
      <Field label="Name for this file (optional)" htmlFor="up-title">
        <input id="up-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blood test, March" className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={useAi && cloud ? "Date on the paper (optional)" : "Date on the paper"} htmlFor="up-date">
          <input id="up-date" type="date" required={!(useAi && cloud)} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </Field>
        <Field label="From (clinic or lab, optional)" htmlFor="up-source">
          <input id="up-source" value={source} onChange={(e) => setSource(e.target.value)} className={inputClass} />
        </Field>
      </div>
      {cloud && (
        <label className="flex min-h-11 items-start gap-3 text-base">
          <input
            type="checkbox"
            checked={useAi}
            onChange={(e) => setUseAi(e.target.checked)}
            className="mt-1 size-5 accent-[var(--care)]"
          />
          <span>
            <b>Read this file with AI.</b> It finds the test results and medicines and fills in your
            timeline, graphs and summary. Leave the date empty to use the date on the paper.
          </span>
        </label>
      )}
      <Btn type="submit" className="sm:w-fit" disabled={!!busy}>
        {busy === "uploading" ? "Uploading..." : busy === "reading" ? "Reading your file..." : "Add file"}
      </Btn>
      <div aria-live="polite" className="text-base">
        {busy === "reading" && <p className="text-ink-muted">The AI is reading your file. This can take up to a minute.</p>}
        {result && <p className="font-semibold text-care-deep">{result}</p>}
      </div>
      <p className="text-base text-ink-muted">
        {cloud
          ? "Your file is stored privately in your account. Only you can open it. The AI reads it only to fill in these records, and can make mistakes, so check the numbers."
          : "Demo mode: the file stays in this browser only and is not read. Create an account to store files safely and read them with AI."}
      </p>
    </form>
  );
}

function ProfileForm({ data, update }: { data: HealthData; update: Update }) {
  const [name, setName] = useState(data.patient.name);
  const [age, setAge] = useState(data.patient.age ? String(data.patient.age) : "");
  const [conditions, setConditions] = useState(data.patient.conditions.join(", "));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = update((d) => ({
      ...d,
      patient: {
        name: name.trim() || d.patient.name,
        age: Math.max(0, Math.round(Number(age) || 0)),
        conditions: conditions.split(",").map((c) => c.trim()).filter(Boolean),
      },
    }));
    if (ok) toast.success("Details saved");
    else toast.error("Could not save. Please try again.");
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:max-w-xl">
      <h3 className="text-xl font-bold">About me</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Field label="Name" htmlFor="me-name">
            <input id="me-name" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <Field label="Age" htmlFor="me-age">
          <input id="me-age" type="number" min={0} max={120} value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} />
        </Field>
      </div>
      <Field label="Health conditions (separate with commas)" htmlFor="me-cond">
        <input id="me-cond" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Type 2 diabetes, High blood pressure" className={inputClass} />
      </Field>
      <Btn type="submit" variant="outline" className="sm:w-fit">
        Save my details
      </Btn>
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
    <div className="rounded-xl bg-status-info-bg p-5 sm:max-w-xl">
      <h3 className="text-xl font-bold text-status-info">Fetch from ABHA/ABDM (SIMULATED)</h3>
      <p className="mt-1 text-status-info">
        This is a demo button. It does not connect to ABHA or ABDM. It adds fake sample records so
        you can see how fetched records would look.
      </p>
      <Btn
        variant="outline"
        className="mt-3"
        onClick={fetchSimulated}
        disabled={data.abdmFetched}
      >
        {data.abdmFetched ? "Demo records already added" : "Add simulated records"}
      </Btn>
    </div>
  );
}
