// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, CoreUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, onSnapshot, Timestamp, FieldValue, arrayUnion, arrayRemove } from 'firebase/firestore';
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
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => Promise<void>;
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
  
  const getUserDocRef = useCallback((userId: string) => doc(db, 'users', userId), []);

  useEffect(() => {
    if (!coreUser) {
      setProfile(null);
      return;
    }

    const userDocRef = getUserDocRef(coreUser.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        const history = (firestoreData.history || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp instanceof Timestamp ? item.timestamp.toDate() : new Date(item.timestamp),
        }));
        history.sort((a: HistoryItem, b: HistoryItem) => b.timestamp.getTime() - a.timestamp.getTime());
        
        const interviewDate = firestoreData.interviewDate;

        // Construct a completely new profile object from the database snapshot and core auth info.
        // This avoids merging with a stale `prevProfile` and is the definitive fix.
        setProfile({
          ...firestoreData,
          uid: coreUser.uid,
          email: coreUser.email,
          displayName: coreUser.displayName,
          photoURL: coreUser.photoURL,
          history,
          interviewDate: interviewDate ? (interviewDate instanceof Timestamp ? interviewDate.toDate() : new Date(interviewDate)) : undefined,
          bookmarks: firestoreData.bookmarks || [],
        } as AppUser);


      } else {
        // If the document doesn't exist, create it for the first time.
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
    }, (error) => {
      console.error("Error listening to user data:", error);
    });

    return () => unsubscribe();
    
  }, [coreUser, getUserDocRef]);


  const updateUserProfile = async (data: Partial<OnboardingData & { photoURL?: string }>) => {
    if (!coreUser) throw new Error("User not authenticated");

    const userDocRef = getUserDocRef(coreUser.uid);

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
    
    // Use setDoc with merge:true which is safer than updateDoc for creating/updating.
    await setDoc(userDocRef, dataToSave, { merge: true });
  };


  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => {
    if (!coreUser) return;
    const userDocRef = getUserDocRef(coreUser.uid);
    
    const newHistoryItem = {
        ...item,
        id: item.id || `hist-${Date.now()}`,
        timestamp: new Date(),
    };
    
    // Rely on arrayUnion to atomically add the item.
    await updateDoc(userDocRef, {
        history: arrayUnion(newHistoryItem)
    });
  }, [coreUser, getUserDocRef]);

  const addBookmark = useCallback(async (item: Bookmark) => {
     if (!coreUser) return;
     const userDocRef = getUserDocRef(coreUser.uid);
     // Rely on arrayUnion's idempotency. It won't add a duplicate if the exact object exists.
     await updateDoc(userDocRef, {
        bookmarks: arrayUnion(item)
     });
  }, [coreUser, getUserDocRef]);

  const removeBookmark = useCallback(async (item: Bookmark) => {
    if (!coreUser) return;
    const userDocRef = getUserDocRef(coreUser.uid);
    // Use arrayRemove for atomic deletion from the array.
    await updateDoc(userDocRef, {
        bookmarks: arrayRemove(item)
    });
  }, [coreUser, getUserDocRef]);
  
  const isBookmarked = useCallback((id: string) => {
    // This function now directly uses the 'profile' state variable,
    // which is guaranteed to be up-to-date by the onSnapshot listener.
    return !!profile?.bookmarks?.some(b => b.id === id);
  }, [profile]);
  
  const clearData = useCallback(async () => {
     if (!coreUser) return;
     const userDocRef = getUserDocRef(coreUser.uid);
     await updateDoc(userDocRef, { history: [], bookmarks: [] });
  }, [coreUser, getUserDocRef]);

  return (
    <UserDataContext.Provider value={{ profile, loading: authLoading || !profile, addHistoryItem, addBookmark, removeBookmark, isBookmarked, updateUserProfile, clearData }}>
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
