// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, CoreUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import type { OnboardingData } from '@/app/(app)/onboarding/page';
import { auth } from '@/lib/firebase';
import { updateProfile } from "firebase/auth";

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
  removeBookmark: (id: string) => Promise<void>;
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
  const [loading, setLoading] = useState(true);
  
  const getUserDocRef = useCallback((userId: string) => doc(db, 'users', userId), []);

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

    const userDocRef = getUserDocRef(coreUser.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        // Ensure timestamps are converted back to Date objects
        const history = (firestoreData.history || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp instanceof Timestamp ? item.timestamp.toDate() : new Date(item.timestamp),
        }));
        history.sort((a: HistoryItem, b: HistoryItem) => b.timestamp.getTime() - a.timestamp.getTime());
        
        const interviewDate = firestoreData.interviewDate;

        setProfile({
          ...firestoreData,
          uid: coreUser.uid,
          email: coreUser.email,
          displayName: coreUser.displayName,
          photoURL: coreUser.photoURL,
          history,
          interviewDate: interviewDate ? (interviewDate instanceof Timestamp ? interviewDate.toDate() : new Date(interviewDate)) : undefined,
          bookmarks: firestoreData.bookmarks || [],
        });

      } else {
        // If no data exists, create a basic document for the new user.
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
      setLoading(false);
    }, (error) => {
      console.error("Error listening to user data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
    
  }, [coreUser, authLoading, getUserDocRef]);


  const updateUserProfile = async (data: Partial<OnboardingData & { photoURL?: string }>) => {
    if (!coreUser) throw new Error("User not authenticated");

    const userDocRef = getUserDocRef(coreUser.uid);

    // If updating displayName or photoURL, also update the Firebase Auth profile
    if (auth.currentUser) {
        const authUpdateData: { displayName?: string; photoURL?: string } = {};
        if (data.displayName) authUpdateData.displayName = data.displayName;
        if (data.photoURL) authUpdateData.photoURL = data.photoURL;
        if (Object.keys(authUpdateData).length > 0) {
            await updateProfile(auth.currentUser, authUpdateData);
        }
    }
    
    // Update Firestore document
    await setDoc(userDocRef, data, { merge: true });
  };


  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => {
    if (!coreUser || !profile) return;
    const userDocRef = getUserDocRef(coreUser.uid);
    
    const newHistoryItem = {
        ...item,
        id: item.id || `hist-${Date.now()}`,
        timestamp: new Date(),
    };
    // Fetch latest profile to avoid race conditions
    const currentHistory = profile.history || [];
    const updatedHistory = [newHistoryItem, ...currentHistory];
    await updateDoc(userDocRef, { history: updatedHistory });
  }, [coreUser, profile, getUserDocRef]);

  const addBookmark = useCallback(async (item: Bookmark) => {
     if (!coreUser || !profile) return;
     const userDocRef = getUserDocRef(coreUser.uid);
     
     const currentBookmarks = profile.bookmarks || [];
     if (currentBookmarks.some(b => b.id === item.id)) return;

     const updatedBookmarks = [item, ...currentBookmarks];
     await updateDoc(userDocRef, { bookmarks: updatedBookmarks });
  }, [coreUser, profile, getUserDocRef]);

  const removeBookmark = useCallback(async (id: string) => {
    if (!coreUser || !profile) return;
    const userDocRef = getUserDocRef(coreUser.uid);
    
    const updatedBookmarks = (profile.bookmarks || []).filter(b => b.id !== id);
    await updateDoc(userDocRef, { bookmarks: updatedBookmarks });
  }, [coreUser, profile, getUserDocRef]);
  
  const isBookmarked = useCallback((id: string) => {
    return profile?.bookmarks?.some(b => b.id === id) || false;
  }, [profile]);
  
  const clearData = useCallback(async () => {
     if (!coreUser) return;
     const userDocRef = getUserDocRef(coreUser.uid);
     await updateDoc(userDocRef, { history: [], bookmarks: [] });
  }, [coreUser, getUserDocRef]);

  return (
    <UserDataContext.Provider value={{ profile, loading, addHistoryItem, addBookmark, removeBookmark, isBookmarked, updateUserProfile, clearData }}>
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
