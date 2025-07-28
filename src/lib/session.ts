// src/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { firebaseAdminConfig } from './firebase-server-config';
import { doc, getDoc, getFirestore, getDocs } from 'firebase-admin/firestore';
import type { AppUser } from '@/hooks/use-user-data';
import { type Portfolio } from '@/services/firestore';

let adminApp: App;

// This logic is needed to prevent re-initializing the app on every hot-reload
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
    
    const userDocRef = doc(adminDb, 'users', decodedToken.uid);
    const portfolioDocRef = doc(adminDb, 'portfolios', decodedToken.uid);

    const [userDoc, portfolioDoc] = await Promise.all([
      getDoc(userDocRef),
      getDoc(portfolioDocRef)
    ]);
    
    const dbData = userDoc.exists() ? userDoc.data() : {};
    const portfolioData = portfolioDoc.exists() ? portfolioDoc.data() : {};

    // Fetch subcollections
    const historyColRef = adminDb.collection('users').doc(decodedToken.uid).collection('history');
    const historyQuery = historyColRef.orderBy('timestamp', 'desc');
    const historySnapshot = await getDocs(historyQuery);
    const history = historySnapshot.docs.map(d => ({id: d.id, ...d.data()}));

    const notesColRef = adminDb.collection('users').doc(decodedToken.uid).collection('notes');
    const notesQuery = notesColRef.orderBy('timestamp', 'desc');
    const notesSnapshot = await getDocs(notesQuery);
    const notes = notesSnapshot.docs.map(d => ({id: d.id, ...d.data()}));

    return {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        displayName: decodedToken.name || (portfolioData as Portfolio)?.displayName || null,
        photoURL: decodedToken.picture || null,
        ...dbData,
        portfolio: portfolioData as Portfolio,
        history,
        notes,
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
