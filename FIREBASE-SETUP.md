# Firebase setup

1. Create a project at https://console.firebase.google.com.
2. **Authentication > Sign-in method**: turn on **Google** and **Email/Password**.
   Under Settings > Authorized domains, add your Vercel domain.
3. **Firestore Database**: create a database (production mode), then paste `firestore.rules`
   into the Rules tab and publish.
4. **Storage**: get started, then paste `storage.rules` into the Rules tab and publish.
   (Storage needs the Blaze plan on new projects. The free allowance is generous.)
5. **Project settings > Your apps > Web app**: copy the config into `.env.local` and into
   Vercel's environment variables (see `.env.example`).
6. Add `ANTHROPIC_API_KEY` to `.env.local` and Vercel for the AI features.

Data layout: Firestore `health_data/{uid}` holds one JSON string per patient; uploaded files
live in Storage under `{uid}/...`. Rules let only that user read or write them.

CLI alternative for the rules: `npm i -g firebase-tools && firebase login && firebase use <project> && firebase deploy --only firestore:rules,storage`.
