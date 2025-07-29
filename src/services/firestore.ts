// src/services/firestore.ts
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import type { AppUser, CodingSession, CodingQuestionWithSolution } from '@/hooks/use-user-data';

const usersCollectionRef = collection(db, 'users');
const codingSessionsCollectionRef = collection(db, 'coding_sessions');

// Get a user's profile from Firestore
export async function getUserProfile(uid: string): Promise<AppUser | null> {
    try {
        const userDocRef = doc(usersCollectionRef, uid);
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
        const userDocRef = doc(usersCollectionRef, userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
}

// Update an existing user profile in Firestore
export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
    try {
        const userDocRef = doc(usersCollectionRef, uid);
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
}


// --- Coding Session Functions ---

export async function createNewCodingSession(sessionData: Omit<CodingSession, 'id'>): Promise<string> {
    const docRef = await addDoc(codingSessionsCollectionRef, sessionData);
    return docRef.id;
}

export async function getCodingSession(sessionId: string): Promise<CodingSession | null> {
    try {
        const sessionDocRef = doc(codingSessionsCollectionRef, sessionId);
        const sessionDoc = await getDoc(sessionDocRef);
        if (sessionDoc.exists()) {
            return { id: sessionDoc.id, ...sessionDoc.data() } as CodingSession;
        }
        return null;
    } catch (error) {
        console.error("Error fetching coding session:", error);
        return null;
    }
}

export async function updateCodingSessionSolutions(sessionId: string, solutions: Record<string, string>): Promise<void> {
    try {
        const sessionDocRef = doc(codingSessionsCollectionRef, sessionId);
        const session = await getCodingSession(sessionId);
        if (!session) throw new Error("Session not found");

        const updatedQuestions = session.questions.map(q => ({
            ...q,
            userSolution: solutions[q.id] || q.userSolution || '',
        }));

        await updateDoc(sessionDocRef, { questions: updatedQuestions });
    } catch (error) {
        console.error("Error updating solutions:", error);
        throw error;
    }
}

export async function updateCodingSessionFeedback(sessionId: string, questions: CodingQuestionWithSolution[]): Promise<void> {
    try {
        const sessionDocRef = doc(codingSessionsCollectionRef, sessionId);
        await updateDoc(sessionDocRef, { 
            questions: questions,
            status: 'completed'
        });
    } catch (error) {
        console.error("Error updating feedback:", error);
        throw error;
    }
}
