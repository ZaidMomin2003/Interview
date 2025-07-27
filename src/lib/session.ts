// src/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { firebaseAdminConfig } from './firebase-server-config';
import { doc, getDoc, getFirestore } from 'firebase-admin/firestore';
import type { AppUser } from '@/hooks/use-user-data';

let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: firebaseAdminConfig.projectId,
      clientEmail: firebaseAdminConfig.clientEmail,
      privateKey: firebaseAdminConfig.privateKey,
    }),
  });
} else {
  adminApp = getApps()[0];
}

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export async function getCurrentUser(): Promise<AppUser | null> {
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
        };
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
    console.error('Error verifying session cookie:', error);
    return null;
  }
}
