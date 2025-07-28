// src/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { firebaseAdminConfig } from './firebase-server-config';
import type { AppUser } from '@/hooks/use-user-data';

let adminApp: App | undefined = getApps().find(a => a.name === 'admin');

// This logic is needed to prevent re-initializing the app on every hot-reload
if (!adminApp && firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
    try {
        adminApp = initializeApp({
          credential: cert({
            projectId: firebaseAdminConfig.projectId,
            clientEmail: firebaseAdminConfig.clientEmail,
            privateKey: firebaseAdminConfig.privateKey,
          }),
        }, 'admin');
    } catch(e) {
        console.error("Failed to initialize firebase-admin", e);
    }
}

const adminAuth = adminApp ? getAuth(adminApp) : null;

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!adminAuth) {
    console.warn("Firebase Admin is not initialized. Skipping user check.");
    return null;
  }
  
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Since we are not using firestore, we return a basic user object.
    // The full profile will be loaded from local storage on the client.
    return {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
    } as AppUser;

  } catch (error) {
    if ((error as any).code === 'auth/id-token-expired' || (error as any).code === 'auth/session-cookie-expired') {
        // The cookie is expired. This is not a server error.
    } else {
        console.error('Error verifying session cookie:', error);
    }
    return null;
  }
}
