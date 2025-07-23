// src/hooks/use-user-data.tsx
"use client";

import { useState, useEffect, useContext, createContext, ReactNode, useCallback } from 'react';
import { useAuth, type AppUser } from './use-auth';

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

const USER_DATA_STORAGE_PREFIX = 'userData_';

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<UserData>({ history: [], bookmarks: [] });
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getStorageKey = useCallback((userId: string) => `${USER_DATA_STORAGE_PREFIX}${userId}`, []);

  useEffect(() => {
    if (user) {
      const storedData = localStorage.getItem(getStorageKey(user.uid));
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // Ensure date objects are correctly parsed
        parsedData.history = parsedData.history.map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
        }));
        setData(parsedData);
      } else {
        setData({ history: [], bookmarks: [] });
      }
      setIsLoaded(true);
    } else {
      setIsLoaded(false);
      setData({ history: [], bookmarks: [] });
    }
  }, [user, getStorageKey]);

  useEffect(() => {
    if (user && isLoaded) {
      localStorage.setItem(getStorageKey(user.uid), JSON.stringify(data));
    }
  }, [data, user, isLoaded, getStorageKey]);


  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'> & { id?: string }) => {
    setData(prevData => ({
      ...prevData,
      history: [{ ...item, id: item.id || `hist-${Date.now()}`, timestamp: new Date() }, ...prevData.history],
    }));
  }, []);

  const addBookmark = useCallback((item: Bookmark) => {
    setData(prevData => {
      // Avoid duplicates
      if (prevData.bookmarks.some(b => b.id === item.id)) {
        return prevData;
      }
      return {
        ...prevData,
        bookmarks: [item, ...prevData.bookmarks],
      };
    });
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setData(prevData => ({
      ...prevData,
      bookmarks: prevData.bookmarks.filter(b => b.id !== id),
    }));
  }, []);
  
  const isBookmarked = useCallback((id: string) => {
    return data.bookmarks.some(b => b.id === id);
  }, [data.bookmarks]);
  
  const clearData = useCallback(() => {
     setData({ history: [], bookmarks: [] });
     if (user) {
        localStorage.removeItem(getStorageKey(user.uid));
     }
  }, [user, getStorageKey]);


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
