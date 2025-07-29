// src/lib/firebase-server-config.ts
import 'server-only';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

// This configuration is used for client-side Firebase SDK
export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This configuration is used for server-side authentication with Firebase Admin.
export const firebaseAdminConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};


// --- Centralized Firebase Admin Initialization ---

// This function initializes and returns the Firebase Admin app instance.
// It ensures that the app is initialized only once (singleton pattern).
export function getAdminApp(): App | null {
    const appName = 'firebase-admin-app';
    const alreadyCreated = getApps().find(app => app.name === appName);

    if (alreadyCreated) {
        return alreadyCreated;
    }
    
    if (firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
        try {
            return initializeApp({
              credential: cert({
                projectId: firebaseAdminConfig.projectId,
                clientEmail: firebaseAdminConfig.clientEmail,
                privateKey: firebaseAdminConfig.privateKey,
              }),
            }, appName);
        } catch(e) {
            console.error("Failed to initialize firebase-admin", e);
            return null;
        }
    }
    
    console.warn("Firebase Admin environment variables are not set. Server-side auth will not work.");
    return null;
}
