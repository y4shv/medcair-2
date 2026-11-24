"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Public web config from Firebase console > Project settings > Your apps. Safe to expose:
// access is controlled by firestore.rules and storage.rules, not by hiding these.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const hasFirebase = Boolean(config.apiKey && config.projectId && config.appId);

function app() {
  return getApps().length ? getApp() : initializeApp(config);
}

export const firebaseAuth = () => getAuth(app());
export const firebaseDb = () => getFirestore(app());
export const firebaseStorage = () => getStorage(app());

/** Best friendly text for a Firebase auth error. */
export function authErrorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "The email or password is not right.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in.";
    case "auth/weak-password":
      return "Please use a password with at least 6 characters.";
    case "auth/invalid-email":
      return "That email address does not look right.";
    case "auth/too-many-requests":
      return "Too many tries. Please wait a few minutes and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "The Google window was closed before finishing.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google window. Allow pop-ups and try again.";
    case "auth/unauthorized-domain":
      return "This site's address is not allowed in Firebase yet (Authentication > Settings > Authorized domains).";
    case "auth/operation-not-allowed":
      return "This sign-in method is not switched on in Firebase yet.";
    default:
      return e instanceof Error ? e.message : "Something went wrong. Please try again.";
  }
}
