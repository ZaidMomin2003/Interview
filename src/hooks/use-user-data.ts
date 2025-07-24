
// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type CoreUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, onSnapshot, Timestamp, updateDoc, arrayUnion, arrayRemove, getDoc, DocumentData } from 'firebase/firestore';
import type { OnboardingData } from '@/app/(app)/onboarding/page';
import { auth } from '@/lib/firebase';
import { updateProfile as updateAuthProfile } from "firebase/auth";

export interface HistoryItem {
  id: string;
  type: 'AI Interview' | 'Coding Challenge' | 'Resume Optimization' | 'Notes Generation';
  description: string;
  timestamp: Date;
  count?: number; // Optional: To track number of questions generated, etc.
}

export interface Bookmark {
  id: string;
  type: 'interview' | 'coding-question' | 'note';
  title: string;
  description?: string;
  href: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string;
  link: string;
}

export interface PortfolioHackathon {
  id: string;
  name: string;
  role: string;
  achievement: string;
}

export interface PortfolioCertificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface PortfolioData {
  slug: string;
  theme: 'light' | 'dark';
  includeDashboardStats: boolean;
  projects: PortfolioProject[];
  hackathons: PortfolioHackathon[];
  certificates: PortfolioCertificate[];
}

export interface PlanData {
  name: 'Cadet' | 'Gladiator' | 'Champion' | 'Legend';
  interviews: number;
  codingQuestions: number;
  notes: number;
}

export interface SyncData {
    endTime: number | null;
    isTimerRunning: boolean;
    syncedNumber: number;
}


// The full user profile, combining auth data with our custom data.
export interface AppUser extends Partial<OnboardingData> {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  history: HistoryItem[];
  bookmarks: Bookmark[];
  portfolio: PortfolioData;
  plan: PlanData;
  sync: SyncData;
}

type UserDataContextType = {
  profile: AppUser | null;
  loading: boolean;
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => Promise<void>;
  addBookmark: (item: Bookmark) => Promise<void>;
  removeBookmark: (item: Bookmark) => Promise<void>;
  isBookmarked: (id: string) => boolean;
  updateUserProfile: (data: Partial<OnboardingData & { photoURL?: string }>) => Promise<void>;
  updatePortfolio: (data: Partial<PortfolioData>) => Promise<void>;
  updateSyncData: (data: Partial<SyncData>) => Promise<void>;
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
  updatePortfolio: async () => {},
  updateSyncData: async () => {},
  clearData: async () => {},
});

const defaultPortfolio: PortfolioData = {
    slug: '',
    theme: 'dark',
    includeDashboardStats: true,
    projects: [],
    hackathons: [],
    certificates: [],
};

const defaultPlan: PlanData = {
    name: 'Cadet',
    interviews: 10,
    codingQuestions: 60,
    notes: 30,
};

const defaultSync: SyncData = {
    endTime: null,
    isTimerRunning: false,
    syncedNumber: 0,
};


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
            portfolio: { ...defaultPortfolio, slug: authData.displayName?.toLowerCase().replace(/\s+/g, '-') || authData.uid, ...dbData.portfolio },
            plan: { ...defaultPlan, ...dbData.plan },
            sync: { ...defaultSync, ...dbData.sync },
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
          history: [],
          bookmarks: [],
          portfolio: {
            ...defaultPortfolio,
            slug: coreUser.displayName?.toLowerCase().replace(/\s+/g, '-') || coreUser.uid,
          },
          plan: defaultPlan,
          sync: defaultSync,
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

  const updatePortfolio = useCallback(async (data: Partial<PortfolioData>) => {
    if (!coreUser) throw new Error("User not authenticated");
    const userDocRef = doc(db, 'users', coreUser.uid);
    const docSnap = await getDoc(userDocRef);
    if(docSnap.exists()){
        const currentPortfolio = docSnap.data().portfolio || {};
        await updateDoc(userDocRef, { portfolio: { ...currentPortfolio, ...data } });
    }
  }, [coreUser]);

  const updateSyncData = useCallback(async (data: Partial<SyncData>) => {
    if (!coreUser) throw new Error("User not authenticated");
    const userDocRef = doc(db, 'users', coreUser.uid);
    const docSnap = await getDoc(userDocRef);
    if(docSnap.exists()){
        const currentSync = docSnap.data().sync || {};
        await updateDoc(userDocRef, { sync: { ...currentSync, ...data } });
    }
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
    await updateDoc(userDocRef, { bookmarks: arrayUnion(item) });
  }, [coreUser]);

  const removeBookmark = useCallback(async (item: Bookmark) => {
    if (!coreUser) return;
    const userDocRef = doc(db, 'users', coreUser.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const currentBookmarks = docSnap.data().bookmarks || [];
        const bookmarkToRemove = currentBookmarks.find((b: Bookmark) => b.id === item.id);
        if(bookmarkToRemove){
            await updateDoc(userDocRef, { bookmarks: arrayRemove(bookmarkToRemove) });
        }
    }
  }, [coreUser]);

  const isBookmarked = (id: string) => {
    return !!profile?.bookmarks?.some(b => b.id === id);
  };
  
  const clearData = useCallback(async () => {
     if (!coreUser) return;
     const userDocRef = doc(db, 'users', coreUser.uid);
     await updateDoc(userDocRef, { history: [], bookmarks: [] });
  }, [coreUser]);

  return (
    <UserDataContext.Provider value={{ profile, loading, addHistoryItem, addBookmark, removeBookmark, isBookmarked, updateUserProfile, updatePortfolio, updateSyncData, clearData }}>
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
