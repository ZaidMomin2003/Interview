// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
// We are not using getAuth anymore in the dummy version, but other files might import it.
// To prevent breaking imports, we can create a dummy auth object.
// import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  // It's okay for these to be undefined in the dummy setup
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if the config is valid, otherwise create a dummy app
const app = !getApps().length && firebaseConfig.apiKey ? initializeApp(firebaseConfig) : (getApps()[0] || null);

// Dummy auth object to prevent errors in other parts of the app that might import it.
const auth = {};

export { app, auth };