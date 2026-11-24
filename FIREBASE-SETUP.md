# Firebase setup (free Spark plan, no billing needed)

1. Create a project at https://console.firebase.google.com.
2. **Authentication > Sign-in method**: turn on **Google** and **Email/Password**.
   Under Settings > Authorized domains, add your Vercel domain.
3. **Firestore Database**: create a database (production mode), then paste `firestore.rules`
   into the Rules tab and publish.
4. **Project settings > Your apps > Web app**: copy the config into `.env.local` and into
   Vercel's environment variables (see `.env.example`).
5. Get a free key at https://aistudio.google.com/apikey and add `GEMINI_API_KEY` to `.env.local` and Vercel for the AI features.

Data layout: Firestore `health_data/{uid}` holds one JSON string per patient. Uploaded files
(PDFs up to 5 MB, photos shrunk automatically) are stored in Firestore too, as base64 pieces under
`user_files/{uid}/files/`, because Firebase Storage needs the paid Blaze plan. Rules let only
that user read or write them. Free Firestore limits: 1 GiB stored, 50k reads and 20k writes a day.

CLI alternative for the rules: `npm i -g firebase-tools && firebase login && firebase use <project> && firebase deploy --only firestore:rules`.
