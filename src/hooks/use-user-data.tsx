// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type AppUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';


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
    
    // Set up a real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as UserData;
        // Ensure timestamps are converted back to Date objects
        firestoreData.history = (firestoreData.history || []).map((item: any) => ({
            ...item,
            timestamp: item.timestamp.toDate(),
        }));
        // Sort history by most recent first upon loading/update
        firestoreData.history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setData({
          history: firestoreData.history || [],
          bookmarks: firestoreData.bookmarks || [],
        });
      } else {
        // If no data exists, create an empty document for the new user
        setDoc(userDocRef, { history: [], bookmarks: [] });
        setData({ history: [], bookmarks: [] });
      }
    }, (error) => {
      console.error("Error listening to user data:", error);
      // Handle error, maybe set state to an error state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
    
  }, [user, getUserDocRef]);


  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => {
    if (!user) return;
    const newHistoryItem = {
        ...item,
        id: item.id || `hist-${Date.now()}`,
        timestamp: new Date(),
    };
    
    const userDocRef = getUserDocRef(user.uid);
    try {
        await updateDoc(userDocRef, {
            history: arrayUnion(newHistoryItem)
        });
    } catch(e) {
        // If the document doesn't exist, set it first
        await setDoc(userDocRef, { history: [newHistoryItem], bookmarks: [] }, { merge: true });
    }
  }, [user, getUserDocRef]);

  const addBookmark = useCallback(async (item: Bookmark) => {
     if (!user || data.bookmarks.some(b => b.id === item.id)) return;
     
      const userDocRef = getUserDocRef(user.uid);
      try {
        await updateDoc(userDocRef, {
            bookmarks: arrayUnion(item)
        });
      } catch(e) {
        await setDoc(userDocRef, { bookmarks: [item] }, { merge: true });
      }
  }, [user, data.bookmarks, getUserDocRef]);

  const removeBookmark = useCallback(async (id: string) => {
    if (!user) return;
    const bookmarkToRemove = data.bookmarks.find(b => b.id === id);
    if (!bookmarkToRemove) return;
    
    const userDocRef = getUserDocRef(user.uid);
    await updateDoc(userDocRef, {
        bookmarks: arrayRemove(bookmarkToRemove)
    });
  }, [user, data.bookmarks, getUserDocRef]);
  
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
