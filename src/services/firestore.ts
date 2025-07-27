// src/services/firestore.ts
"use server";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { CoreUser, AppUser } from '@/hooks/use-user-data';

/**
 * The "messenger" function to get user data.
 * It checks if a user document exists and creates it if it doesn't.
 * @param coreUser - The basic user object from Firebase Auth.
 * @returns The full AppUser profile.
 */
export async function getUserData(coreUser: CoreUser): Promise<AppUser> {
  if (!coreUser?.uid) {
    throw new Error("Invalid user provided.");
  }

  const userDocRef = doc(db, 'users', coreUser.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    // Document exists, return its data merged with auth data
    const dbData = userDocSnap.data();
    return {
      ...coreUser,
      ...dbData,
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
    };
    // Use setDoc to create the new document
    await setDoc(userDocRef, { 
        // Only store non-auth related data in firestore
        pomodoroSettings: newUserData.pomodoroSettings 
    });
    return newUserData;
  }
}

/**
 * The "messenger" function to update user data.
 * @param uid - The user's unique ID.
 * @param data - The data to update in the user's document.
 */
export async function updateUserData(uid: string, data: Partial<AppUser>): Promise<void> {
   if (!uid) {
    throw new Error("User ID is required to update data.");
  }
  const userDocRef = doc(db, 'users', uid);
  // Use updateDoc for better performance and to avoid overwriting the whole document
  await updateDoc(userDocRef, data);
}
