// src/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { firebaseAdminConfig } from './firebase-server-config';
import { doc, getDoc, getFirestore } from 'firebase-admin/firestore';
import type { AppUser } from '@/hooks/use-user-data';

let adminApp: App | undefined;

if (!getApps().length) {
  if (firebaseAdminConfig.projectId && firebaseAdminConfig.clientEmail && firebaseAdminConfig.privateKey) {
    adminApp = initializeApp({
      credential: cert({
        projectId: firebaseAdminConfig.projectId,
        clientEmail: firebaseAdminConfig.clientEmail,
        privateKey: firebaseAdminConfig.privateKey,
      }),
    });
  } else {
    // A fallback for local development or environments where server-side auth is not configured.
    // This will prevent crashes, but server-side user lookups will fail.
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

const adminAuth = adminApp ? getAuth(adminApp) : undefined;
const adminDb = adminApp ? getFirestore(adminApp) : undefined;

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!adminAuth || !adminDb) {
    // This condition might be met if initialization failed or was skipped.
    return null;
  }
  
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDocRef = adminDb.collection('users').doc(decodedToken.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists) {
        // This can happen if the user document hasn't been created yet.
        // We can return the basic auth info.
        return {
          uid: decodedToken.uid,
          email: decodedToken.email || null,
          displayName: decodedToken.name || null,
          photoURL: decodedToken.picture || null,
        } as AppUser;
    }

    const dbData = userDoc.data()!;
    
    return {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        displayName: decodedToken.name || null,
        photoURL: decodedToken.picture || null,
        ...dbData
    } as AppUser

  } catch (error) {
    if ((error as any).code === 'auth/id-token-expired' || (error as any).code === 'auth/session-cookie-expired') {
        // The cookie is expired. This is not a server error.
    } else {
        console.error('Error verifying session cookie:', error);
    }
    return null;
  }
}
