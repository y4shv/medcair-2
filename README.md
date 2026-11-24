# medcAIr

A patient health-record app. Patients keep their visits, prescriptions and lab reports in one place,
upload PDFs or photos that an AI reads for them, see their numbers as graphs, get a plain-language
summary, and share a time-limited summary with a doctor or caregiver.

## Features
- Sign in with Google or email and password (Firebase Auth), plus a no-account demo at `/demo`.
- Upload a PDF or photo. Gemini reads it and fills in lab results, medicines and diagnoses.
- Timeline, medicines with refill estimates, reports with range bars, trend graphs per test.
- AI summary of all records with questions to ask the doctor (not medical advice).
- Appointments, consents, caregivers and share links.

## Stack
Next.js (App Router), Tailwind, Firebase Auth + Firestore (free Spark plan), Google Gemini API.

## Run it
```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```
Open http://localhost:3000. Setup steps for Firebase are in [FIREBASE-SETUP.md](FIREBASE-SETUP.md).

## Environment variables
See `.env.example`. The `NEXT_PUBLIC_FIREBASE_*` values come from the Firebase console;
`GEMINI_API_KEY` is a free key from https://aistudio.google.com/apikey.

## How data is stored
- `health_data/{uid}`: one JSON document per patient (Firestore).
- `user_files/{uid}/files/*`: uploaded files as base64 pieces (Firestore), because Firebase Storage needs a paid plan.
- Both are protected by `firestore.rules`: only the signed-in owner can read or write.
- Demo visitors use fake data kept in their own browser.

## Deploy (Vercel)
1. Import the repo in Vercel.
2. Add the environment variables from `.env.local` in Project > Settings > Environment Variables.
3. In Firebase console > Authentication > Settings > Authorized domains, add your Vercel domain.
4. Redeploy.

Note: free Gemini usage may be used by Google to improve its products. Do not upload real patient
documents on the free tier.
