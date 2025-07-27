// src/hooks/use-session-handler.ts
"use client";

import { useEffect } from 'react';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';

async function setSession(idToken: string | null) {
  if (idToken) {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } else {
    await fetch('/api/auth', {
      method: 'DELETE',
    });
  }
}

export function useSessionHandler() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const idToken = await firebaseUser.getIdToken();
                await setSession(idToken);
            } else {
                await setSession(null);
            }
            // We can refresh to make sure server components re-render with new auth state
            // This might not be necessary depending on the app's flow
            // router.refresh(); 
        });

        return () => unsubscribe();
    }, [user, loading, router]);
}
