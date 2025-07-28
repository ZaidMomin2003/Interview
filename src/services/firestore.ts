// src/services/firestore.ts
"use server";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, orderBy, query, writeBatch } from 'firebase/firestore';
import type { CoreUser, AppUser } from '@/hooks/use-user-data';
import type { Portfolio } from '@/ai/schemas';

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
 * Gets all user data, including history, notes, and portfolio.
 */
export async function getUserData(coreUser: CoreUser): Promise<AppUser> {
  if (!coreUser?.uid) {
    throw new Error("Invalid user provided.");
  }
  
  const userDocRef = doc(db, 'users', coreUser.uid);
  const portfolioDocRef = doc(db, 'portfolios', coreUser.uid);

  const [userDocSnap, portfolioDocSnap] = await Promise.all([
    getDoc(userDocRef),
    getDoc(portfolioDocRef)
  ]);

  let userData = { ...coreUser } as AppUser;

  if (userDocSnap.exists()) {
    userData = { ...userData, ...userDocSnap.data() };
  } else {
     // User document doesn't exist, set defaults
    userData.pomodoroSettings = { pomodoro: 25, shortBreak: 5, longBreak: 15 };
  }

  if (portfolioDocSnap.exists()) {
    userData.portfolio = portfolioDocSnap.data() as Portfolio;
  } else {
    // Portfolio doesn't exist, create a default structure
    userData.portfolio = {
        isPublic: false,
        displayName: coreUser.displayName || '',
        bio: '',
        location: '',
        skills: [],
        projects: [],
        socials: { github: '', linkedin: '', twitter: '', website: '' }
    };
  }

  // Create documents if they don't exist
  const batch = writeBatch(db);
  if (!userDocSnap.exists()) {
    batch.set(userDocRef, { pomodoroSettings: userData.pomodoroSettings });
  }
  if (!portfolioDocSnap.exists()) {
    batch.set(portfolioDocRef, userData.portfolio);
  }
  await batch.commit();


  // Fetch subcollections
  const historyColRef = collection(db, 'users', coreUser.uid, 'history');
  const historyQuery = query(historyColRef, orderBy('timestamp', 'desc'));
  const historySnapshot = await getDocs(historyQuery);
  userData.history = historySnapshot.docs.map(d => ({id: d.id, ...d.data()})) as HistoryItem[];

  const notesColRef = collection(db, 'users', coreUser.uid, 'notes');
  const notesQuery = query(notesColRef, orderBy('timestamp', 'desc'));
  const notesSnapshot = await getDocs(notesQuery);
  userData.notes = notesSnapshot.docs.map(d => ({id: d.id, ...d.data()})) as Note[];

  return userData;
}

/**
 * Updates the main user document (e.g., pomodoro settings).
 */
export async function updateUserData(uid: string, data: Partial<Omit<AppUser, 'history' | 'notes' | 'portfolio'>>): Promise<void> {
   if (!uid) throw new Error("User ID is required.");
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, data);
}

/**
 * Updates the user's portfolio document.
 */
export async function updatePortfolioData(uid: string, data: Portfolio): Promise<void> {
  if (!uid) throw new Error("User ID is required.");
  const portfolioDocRef = doc(db, 'portfolios', uid);
  // Using set with merge:true is safer as it creates the doc if it doesn't exist.
  await setDoc(portfolioDocRef, data, { merge: true });
}

/**
 * Gets a user's portfolio, but only if it's public.
 */
export async function getPublicPortfolio(uid: string): Promise<(Portfolio & {photoURL?: string | null}) | null> {
    if (!uid) return null;
    const portfolioDocRef = doc(db, 'portfolios', uid);
    const userDocRef = doc(db, 'users', uid); // to get photoURL
    
    const [portfolioSnap, userSnap] = await Promise.all([getDoc(portfolioDocRef), getDoc(userDocRef)]);

    if (portfolioSnap.exists() && portfolioSnap.data().isPublic) {
        const portfolioData = portfolioSnap.data() as Portfolio;
        const photoURL = userSnap.exists() ? (userSnap.data().photoURL || null) : null;
        return { ...portfolioData, photoURL };
    }
    return null;
}

/**
 * Adds a new item to the user's history subcollection.
 */
export async function addHistoryItem(uid: string, item: Omit<HistoryItem, 'id' | 'timestamp'>): Promise<void> {
    if (!uid) throw new Error("User ID is required.");
    const historyColRef = collection(db, 'users', uid, 'history');
    const newDocRef = doc(historyColRef); // Auto-generates ID
    await setDoc(newDocRef, {
        ...item,
        timestamp: Date.now()
    });
}
