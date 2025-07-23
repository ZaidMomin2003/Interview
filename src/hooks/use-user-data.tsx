// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type AppUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';


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

interface UserData {
  history: HistoryItem[];
  bookmarks: Bookmark[];
}

type UserDataContextType = {
  history: HistoryItem[];
  bookmarks: Bookmark[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => void;
  addBookmark: (item: Bookmark) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearData: () => void;
};

const UserDataContext = createContext<UserDataContextType>({
  history: [],
  bookmarks: [],
  addHistoryItem: () => {},
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
  clearData: () => {},
});


export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>({ history: [], bookmarks: [] });
  
  const getUserDocRef = useCallback((userId: string) => doc(db, 'userData', userId), []);

  useEffect(() => {
    if (!user) {
      setData({ history: [], bookmarks: [] });
      return;
    }

    const userDocRef = getUserDocRef(user.uid);
    
    // Set up a real-time listener. This is the SINGLE source of truth for our local state.
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        // Ensure timestamps are converted back to Date objects
        const history = (firestoreData.history || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp.toDate(),
        }));
        // Sort history by most recent first upon loading/update
        history.sort((a: HistoryItem, b: HistoryItem) => b.timestamp.getTime() - a.timestamp.getTime());
        
        setData({
          history: history,
          bookmarks: firestoreData.bookmarks || [],
        });
      } else {
        // If no data exists, create an empty document for the new user.
        // The listener will then pick up this new empty state.
        setDoc(userDocRef, { history: [], bookmarks: [] });
      }
    }, (error) => {
      console.error("Error listening to user data:", error);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
    
  }, [user, getUserDocRef]);


  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => {
    if (!user) return;
    const userDocRef = getUserDocRef(user.uid);
    
    try {
        const docSnap = await getDoc(userDocRef);
        const currentData = docSnap.exists() ? docSnap.data() as UserData : { history: [], bookmarks: [] };

        const newHistoryItem = {
            ...item,
            id: item.id || `hist-${Date.now()}`,
            timestamp: new Date(),
        };

        const updatedHistory = [newHistoryItem, ...currentData.history];

        await setDoc(userDocRef, { ...currentData, history: updatedHistory }, { merge: true });
    } catch(e) {
        console.error("Failed to add history item:", e);
    }
  }, [user, getUserDocRef]);

  const addBookmark = useCallback(async (item: Bookmark) => {
     if (!user) return;
     const userDocRef = getUserDocRef(user.uid);

     try {
        const docSnap = await getDoc(userDocRef);
        const currentData = docSnap.exists() ? docSnap.data() as UserData : { history: [], bookmarks: [] };
        
        if (currentData.bookmarks.some(b => b.id === item.id)) {
            return; // Avoid duplicates
        }

        const updatedBookmarks = [item, ...currentData.bookmarks];
        await setDoc(userDocRef, { ...currentData, bookmarks: updatedBookmarks }, { merge: true });
     } catch(e) {
        console.error("Failed to add bookmark:", e);
     }
  }, [user, getUserDocRef]);

  const removeBookmark = useCallback(async (id: string) => {
    if (!user) return;
    const userDocRef = getUserDocRef(user.uid);
    
    try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) return;

        const currentData = docSnap.data() as UserData;
        const updatedBookmarks = currentData.bookmarks.filter(b => b.id !== id);
        
        await updateDoc(userDocRef, { bookmarks: updatedBookmarks });

    } catch (e) {
        console.error("Failed to remove bookmark:", e);
    }
  }, [user, getUserDocRef]);
  
  const isBookmarked = useCallback((id: string) => {
    return data.bookmarks.some(b => b.id === id);
  }, [data.bookmarks]);
  
  const clearData = useCallback(async () => {
     if (!user) return;
     const userDocRef = getUserDocRef(user.uid);
     await setDoc(userDocRef, { history: [], bookmarks: [] });
  }, [user, getUserDocRef]);


  return (
    <UserDataContext.Provider value={{ ...data, addHistoryItem, addBookmark, removeBookmark, isBookmarked, clearData }}>
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
