"use client";

// File storage without Firebase Storage (which needs a paid plan): files are kept in Firestore
// at user_files/{uid}/files/{fileId} (details) and .../files/{fileId}.{n} (base64 pieces).
// A Firestore document holds at most 1 MiB, so files are cut into pieces of 700,000 characters.
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, query, where, documentId } from "firebase/firestore";
import { firebaseDb } from "@/lib/firebase/client";
import { newId } from "./format";

export const CHUNK = 700_000; // multiple of 4 so every piece is valid base64 on its own
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp", "image/gif"];

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = () => reject(r.error);
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.readAsDataURL(blob);
  });
}

/** Shrinks a photo to at most 1800 px and JPEG quality ~0.8 so it stays small. PDFs pass through. */
export async function prepareFile(file: File): Promise<{ blob: Blob; mime: string; name: string }> {
  if (!file.type.startsWith("image/")) return { blob: file, mime: file.type, name: file.name };
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  let blob: Blob | null = null;
  for (const q of [0.82, 0.7, 0.55]) {
    blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", q));
    if (blob && blob.size <= MAX_FILE_BYTES) break;
  }
  if (!blob) throw new Error("Could not read this photo.");
  return { blob, mime: "image/jpeg", name: file.name.replace(/\.[^.]+$/, "") + ".jpg" };
}

/** Saves a file and returns its path ("uid/fileId"). */
export async function saveFile(uid: string, blob: Blob, mime: string, name: string): Promise<string> {
  if (blob.size > MAX_FILE_BYTES) throw new Error("too-big");
  const id = newId();
  const b64 = await toBase64(blob);
  const pieces = Math.max(1, Math.ceil(b64.length / CHUNK));
  const db = firebaseDb();
  for (let i = 0; i < pieces; i++) {
    await setDoc(doc(db, "user_files", uid, "files", `${id}.${i}`), {
      data: b64.slice(i * CHUNK, (i + 1) * CHUNK),
    });
  }
  // Details last, so a half-uploaded file never looks complete.
  await setDoc(doc(db, "user_files", uid, "files", id), {
    name,
    mime,
    size: blob.size,
    pieces,
    createdAt: new Date().toISOString(),
  });
  return `${uid}/${id}`;
}

function parts(path: string) {
  const [uid, id] = path.split("/");
  return { uid, id };
}

export async function loadFileBlob(path: string): Promise<Blob> {
  const { uid, id } = parts(path);
  const db = firebaseDb();
  const meta = await getDoc(doc(db, "user_files", uid, "files", id));
  if (!meta.exists()) throw new Error("missing");
  const { mime, pieces } = meta.data() as { mime: string; pieces: number };
  let b64 = "";
  for (let i = 0; i < pieces; i++) {
    const p = await getDoc(doc(db, "user_files", uid, "files", `${id}.${i}`));
    b64 += String(p.data()?.data ?? "");
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function deleteFile(path?: string) {
  if (!path) return;
  const { uid, id } = parts(path);
  const db = firebaseDb();
  try {
    const snap = await getDocs(
      query(
        collection(db, "user_files", uid, "files"),
        where(documentId(), ">=", id),
        where(documentId(), "<=", `${id}.`),
      ),
    );
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  } catch {
    // Already gone.
  }
}
