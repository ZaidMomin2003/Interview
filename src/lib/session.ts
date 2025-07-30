// src/lib/session.ts
import 'server-only';
import { cookies } from 'next/headers';
import { getAuth } from 'firebase-admin/auth';
import { getAdminApp } from './firebase-server-config';
import type { AppUser, HistoryItem } from '@/hooks/use-user-data';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const adminApp = getAdminApp();
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

    const user = userDoc.data() as AppUser;

    // --- FIX: Serialize Firestore Timestamps ---
    // Convert any Firestore Timestamps to plain numbers before returning.
     if (user.history) {
        user.history = user.history.map(item => {
            if (item.timestamp && typeof item.timestamp === 'object' && 'toMillis' in item.timestamp) {
                return { ...item, timestamp: (item.timestamp as Timestamp).toMillis() };
            }
            return item;
        });
    }

    if (user.reminders) {
        user.reminders = user.reminders.map(item => {
             if (item.date && typeof item.date === 'object' && 'toMillis' in item.date) {
                return { ...item, date: (item.date as unknown as Timestamp).toMillis() };
            }
            return item;
        });
    }

    return user;

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
        if (!user.portfolio.isPublic) {
            return null;
        }

        // --- FIX: Serialize Firestore Timestamps ---
        // Convert any Firestore Timestamps to plain numbers before returning.
        if (user.history) {
            user.history = user.history.map(item => {
                if (item.timestamp && typeof item.timestamp === 'object' && 'toMillis' in item.timestamp) {
                    return { ...item, timestamp: (item.timestamp as Timestamp).toMillis() };
                }
                return item;
            });
        }
        
        return user;

    } catch (error) {
        console.error('Error fetching user portfolio:', error);
        return null;
    }
}
