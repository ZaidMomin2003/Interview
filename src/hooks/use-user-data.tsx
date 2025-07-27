// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, Timestamp, updateDoc, arrayUnion, arrayRemove, getDoc, DocumentData } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { updateProfile as updateAuthProfile } from "firebase/auth";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

type UserDataContextType = {
  profile: AppUser | null;
  loading: boolean;
};

const UserDataContext = createContext<UserDataContextType>({
  profile: null,
  loading: true,
});

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: coreUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
        setLoading(true);
        return;
    }

    if (!coreUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', coreUser.uid);

    const buildProfile = (authData: CoreUser, dbData: DocumentData): AppUser => {
        return {
            ...dbData,
            uid: authData.uid,
            email: authData.email,
            displayName: authData.displayName,
            photoURL: authData.photoURL,
        } as AppUser;
    }

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const dbData = docSnap.data();
        setProfile(buildProfile(coreUser, dbData));
      } else {
        const initialProfileData: Partial<AppUser> = {
          uid: coreUser.uid,
          email: coreUser.email,
          displayName: coreUser.displayName,
          photoURL: coreUser.photoURL,
        };
        setDoc(userDocRef, initialProfileData, { merge: true });
        setProfile(buildProfile(coreUser, initialProfileData));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to user data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [coreUser, authLoading]);


  return (
    <UserDataContext.Provider value={{ profile, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
