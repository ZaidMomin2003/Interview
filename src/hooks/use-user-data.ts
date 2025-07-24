// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, Timestamp, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import type { OnboardingData } from '@/app/(app)/onboarding/page';
import { auth } from '@/lib/firebase';
import { updateProfile as updateAuthProfile } from "firebase/auth";

export interface HistoryItem {
  id: string;
  type: 'AI Interview' | 'Coding Challenge' | 'Resume Optimization' | 'Notes Generation';
  description: string;
  timestamp: Date;
}

export interface Bookmark {
  id: string;
  type: 'interview' | 'coding-question' | 'note';
  title: string;
  description?: string;
  href: string;
}

// The full user profile, combining auth data with our custom data.
export interface AppUser extends Partial<OnboardingData> {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  history: HistoryItem[];
  bookmarks: Bookmark[];
}

type UserDataContextType = {
  profile: AppUser | null;
  loading: boolean;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  addBookmark: (item: Bookmark) => Promise<void>;
  removeBookmark: (item: Bookmark) => Promise<void>;
  isBookmarked: (id: string) => boolean;
  updateUserProfile: (data: Partial<OnboardingData & { photoURL?: string }>) => Promise<void>;
  clearData: () => Promise<void>;
};

const UserDataContext = createContext<UserDataContextType>({
  profile: null,
  loading: true,
  addHistoryItem: async () => {},
  addBookmark: async () => {},
  removeBookmark: async () => {},
  isBookmarked: () => false,
  updateUserProfile: async () => {},
  clearData: async () => {},
});

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user: coreUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [firestoreLoading, setFirestoreLoading] = useState(true);

  useEffect(() => {
    if (!coreUser) {
      setProfile(null);
      setFirestoreLoading(false);
      return;
    }

    setFirestoreLoading(true);
    const userDocRef = doc(db, 'users', coreUser.uid);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        
        // This function correctly reconstructs the profile on every update.
        const buildProfile = (authData: CoreUser, dbData: any): AppUser => {
            const history = (dbData.history || []).map((item: any) => ({
                ...item,
                timestamp: item.timestamp instanceof Timestamp ? item.timestamp.toDate() : new Date(item.timestamp),
            })).sort((a: HistoryItem, b: HistoryItem) => b.timestamp.getTime() - a.timestamp.getTime());

            const interviewDate = dbData.interviewDate;

            return {
                ...dbData,
                uid: authData.uid,
                email: authData.email,
                displayName: authData.displayName,
                photoURL: authData.photoURL,
                history,
                interviewDate: interviewDate ? (interviewDate instanceof Timestamp ? interviewDate.toDate() : new Date(interviewDate)) : undefined,
                bookmarks: dbData.bookmarks || [],
            } as AppUser;
        }

        setProfile(buildProfile(coreUser, firestoreData));

      } else {
        // If doc doesn't exist, create it for the new user.
        const initialProfileData = {
          uid: coreUser.uid,
          email: coreUser.email,
          displayName: coreUser.displayName,
          photoURL: coreUser.photoURL,
          history: [],
          bookmarks: [],
        };
        setDoc(userDocRef, initialProfileData);
        setProfile(initialProfileData as AppUser);
      }
      setFirestoreLoading(false);
    }, (error) => {
      console.error("Error listening to user data:", error);
      setFirestoreLoading(false);
    });

    return () => unsubscribe();
  }, [coreUser]);

  const updateUserProfile = useCallback(async (data: Partial<OnboardingData & { photoURL?: string }>) => {
    if (!coreUser) throw new Error("User not authenticated");
    const userDocRef = doc(db, 'users', coreUser.uid);

    if (auth.currentUser) {
        const authUpdateData: { displayName?: string; photoURL?: string } = {};
        if (data.displayName && data.displayName !== auth.currentUser.displayName) {
          authUpdateData.displayName = data.displayName;
        }
        if (data.photoURL && data.photoURL !== auth.currentUser.photoURL) {
          authUpdateData.photoURL = data.photoURL;
        }
        if (Object.keys(authUpdateData).length > 0) {
            await updateAuthProfile(auth.currentUser, authUpdateData);
        }
    }
    
    const dataToSave: any = { ...data };
    if (data.interviewDate) {
        dataToSave.interviewDate = Timestamp.fromDate(data.interviewDate);
    }
    
    await setDoc(userDocRef, dataToSave, { merge: true });
  }, [coreUser]);

  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    if (!coreUser) return;
    const userDocRef = doc(db, 'users', coreUser.uid);
    const newHistoryItem = { ...item, id: `hist-${Date.now()}-${Math.random()}`, timestamp: new Date() };
    await updateDoc(userDocRef, { history: arrayUnion(newHistoryItem) });
  }, [coreUser]);

  const addBookmark = useCallback(async (item: Bookmark) => {
    if (!coreUser) return;
    const userDocRef = doc(db, 'users', coreUser.uid);
     // No local check, rely on Firestore's atomicity.
    await updateDoc(userDocRef, { bookmarks: arrayUnion(item) });
  }, [coreUser]);

  const removeBookmark = useCallback(async (item: Bookmark) => {
    if (!coreUser) return;
    const userDocRef = doc(db, 'users', coreUser.uid);
    // Find the exact bookmark to remove from the current profile state
    const bookmarkToRemove = profile?.bookmarks.find(b => b.id === item.id);
    if(bookmarkToRemove){
      await updateDoc(userDocRef, { bookmarks: arrayRemove(bookmarkToRemove) });
    }
  }, [coreUser, profile?.bookmarks]);

  const isBookmarked = useCallback((id: string) => {
    return !!profile?.bookmarks?.some(b => b.id === id);
  }, [profile?.bookmarks]);
  
  const clearData = useCallback(async () => {
     if (!coreUser) return;
     const userDocRef = doc(db, 'users', coreUser.uid);
     await updateDoc(userDocRef, { history: [], bookmarks: [] });
  }, [coreUser]);

  return (
    <UserDataContext.Provider value={{ profile, loading: authLoading || firestoreLoading, addHistoryItem, addBookmark, removeBookmark, isBookmarked, updateUserProfile, clearData }}>
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
