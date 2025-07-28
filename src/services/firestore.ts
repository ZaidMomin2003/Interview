// src/services/firestore.ts
"use client";

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import type { AppUser } from '@/hooks/use-user-data';

const usersCollection = collection(db, 'users');

// Get a user's profile from Firestore
export async function getUserProfile(uid: string): Promise<AppUser | null> {
    try {
        const userDocRef = doc(usersCollection, uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data() as AppUser;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

// Create a new user profile in Firestore
export async function createUserProfile(userData: AppUser): Promise<void> {
    try {
        const userDocRef = doc(usersCollection, userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
}

// Update an existing user profile in Firestore
export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
    try {
        const userDocRef = doc(usersCollection, uid);
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
}
