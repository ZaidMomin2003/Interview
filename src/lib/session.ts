// src/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { firebaseAdminConfig } from './firebase-server-config';
import type { AppUser } from '@/hooks/use-user-data';
import { getFirestore } from 'firebase-admin/firestore';

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
const adminDb = adminApp ? getFirestore(adminApp) : null;

export async function getCurrentUser(): Promise<AppUser | null> {
  if (!adminAuth || !adminDb) {
    console.warn("Firebase Admin is not initialized. Skipping user check.");
    return null;
  }
  
  const sessionCookie = cookies().get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Fetch the full user profile from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
        return null;
    }

    return userDoc.data() as AppUser;

  } catch (error) {
    if ((error as any).code === 'auth/id-token-expired' || (error as any).code === 'auth/session-cookie-expired') {
        // The cookie is expired. This is not a server error.
    } else {
        console.error('Error verifying session cookie:', error);
    }
    return null;
  }
}

export async function getUserPortfolio(userId: string): Promise<AppUser | null> {
    if (!adminDb) {
        console.warn("Firebase Admin (Firestore) is not initialized. Cannot fetch portfolio.");
        return null;
    }
    try {
        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return null;
        }
        const user = userDoc.data() as AppUser;
        // Only return if the portfolio is public
        return user.portfolio.isPublic ? user : null;

    } catch (error) {
        console.error('Error fetching user portfolio:', error);
        return null;
    }
}
