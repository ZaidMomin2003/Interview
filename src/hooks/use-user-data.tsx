// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type AppUser } from './use-auth';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';


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
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getUserDocRef = useCallback((userId: string) => doc(db, 'userData', userId), []);

  useEffect(() => {
    const loadUserData = async () => {
        if (user) {
            const userDocRef = getUserDocRef(user.uid);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                const firestoreData = docSnap.data() as UserData;
                // Ensure timestamps are converted back to Date objects
                firestoreData.history = firestoreData.history.map((item: any) => ({
                    ...item,
                    timestamp: item.timestamp.toDate(),
                }));
                 // Sort history by most recent first upon loading
                firestoreData.history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
                setData(firestoreData);
            } else {
                // If no data exists, create an empty document for the new user
                await setDoc(userDocRef, { history: [], bookmarks: [] });
                setData({ history: [], bookmarks: [] });
            }
            setIsLoaded(true);
        } else {
            // Reset state when user logs out
            setData({ history: [], bookmarks: [] });
            setIsLoaded(false);
        }
    };
    
    loadUserData();
  }, [user, getUserDocRef]);


  const addHistoryItem = useCallback(async (item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => {
    if (!user) return;
    const newHistoryItem = {
        ...item,
        id: item.id || `hist-${Date.now()}`,
        timestamp: new Date(),
    };
    // Update local state immediately for responsiveness
    setData(prevData => ({
        ...prevData,
        history: [newHistoryItem, ...prevData.history]
    }));
    // Persist to Firestore
    const userDocRef = getUserDocRef(user.uid);
    await updateDoc(userDocRef, {
        history: arrayUnion(newHistoryItem)
    });
  }, [user, getUserDocRef]);

  const addBookmark = useCallback(async (item: Bookmark) => {
     if (!user || data.bookmarks.some(b => b.id === item.id)) return;
     setData(prevData => ({
        ...prevData,
        bookmarks: [item, ...prevData.bookmarks],
      }));
      const userDocRef = getUserDocRef(user.uid);
      await updateDoc(userDocRef, {
        bookmarks: arrayUnion(item)
      });
  }, [user, data.bookmarks, getUserDocRef]);

  const removeBookmark = useCallback(async (id: string) => {
    if (!user) return;
    const bookmarkToRemove = data.bookmarks.find(b => b.id === id);
    if (!bookmarkToRemove) return;
    
    setData(prevData => ({
      ...prevData,
      bookmarks: prevData.bookmarks.filter(b => b.id !== id),
    }));
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
     setData({ history: [], bookmarks: [] });
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
