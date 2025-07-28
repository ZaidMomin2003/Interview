// src/services/firestore.ts
"use server";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs, orderBy, query } from 'firebase/firestore';
import type { CoreUser, AppUser } from '@/hooks/use-user-data';

export interface HistoryItem {
  id: string;
  type: 'resume' | 'coding' | 'interview' | 'notes';
  title: string;
  timestamp: number;
  content: any; 
}

export interface Note {
    id: string;
    title: string;
    content: string;
    timestamp: number;
}

/**
 * Gets all user data, including history and notes.
 */
export async function getUserData(coreUser: CoreUser): Promise<AppUser> {
  if (!coreUser?.uid) {
    throw new Error("Invalid user provided.");
  }

  const userDocRef = doc(db, 'users', coreUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const dbData = userDocSnap.data();
    
    // Fetch subcollections
    const historyColRef = collection(db, 'users', coreUser.uid, 'history');
    const historyQuery = query(historyColRef, orderBy('timestamp', 'desc'));
    const historySnapshot = await getDocs(historyQuery);
    const history = historySnapshot.docs.map(d => ({id: d.id, ...d.data()})) as HistoryItem[];

    const notesColRef = collection(db, 'users', coreUser.uid, 'notes');
    const notesQuery = query(notesColRef, orderBy('timestamp', 'desc'));
    const notesSnapshot = await getDocs(notesQuery);
    const notes = notesSnapshot.docs.map(d => ({id: d.id, ...d.data()})) as Note[];

    return {
      ...coreUser,
      ...dbData,
      history,
      notes,
    } as AppUser;
  } else {
    // Document doesn't exist, create it with default values
    const newUserData: AppUser = {
      ...coreUser,
      pomodoroSettings: {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
      },
      history: [],
      notes: [],
    };
    await setDoc(userDocRef, { 
        pomodoroSettings: newUserData.pomodoroSettings 
    });
    return newUserData;
  }
}

/**
 * Updates the main user document.
 */
export async function updateUserData(uid: string, data: Partial<Omit<AppUser, 'history' | 'notes'>>): Promise<void> {
   if (!uid) {
    throw new Error("User ID is required to update data.");
  }
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, data);
}

/**
 * Adds a new item to the user's history subcollection.
 */
export async function addHistoryItem(uid: string, item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> {
    if (!uid) {
        throw new Error("User ID is required.");
    }
    const historyColRef = collection(db, 'users', uid, 'history');
    const newDocRef = doc(historyColRef); // Auto-generates ID
    await setDoc(newDocRef, {
        ...item,
        timestamp: Date.now()
    });
}

    