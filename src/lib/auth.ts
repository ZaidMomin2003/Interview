// src/lib/auth.ts
import 'server-only';
import { cookies } from 'next/headers';
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type User } from 'firebase/auth';
import { firebaseConfig } from './firebase-server-config';

// Initialize a new Firebase app on the server.
const app = getApps().length ? getApp('server-auth') : initializeApp(firebaseConfig, 'server-auth');
const auth = getAuth(app);


export async function getCurrentUser(): Promise<User | null> {
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
        return null;
    }

    try {
        const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
        const user = await auth.getUser(decodedIdToken.uid);
        return user;
    } catch (error) {
        console.error('Error verifying session cookie:', error);
        return null;
    }
}
