import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// These values come from your Firebase project settings
// (Project settings -> General -> Your apps -> SDK setup and configuration).
// This is the CLIENT config — safe to expose in a frontend build,
// unlike the firebase-admin.json service account used by the backend.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
