// src/services/firestore.ts
'use server';

import { db as clientDb } from '@/lib/firebase';
import { getAdminApp } from '@/lib/firebase-server-config';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';
import type { AppUser, CodingSession, CodingQuestionWithSolution } from '@/ai/schemas';
import { redirect } from 'next/navigation';

// --- Client-side functions ---
const usersCollectionRef = collection(clientDb, 'users');
const codingSessionsCollectionRef = collection(clientDb, 'coding_sessions');

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

export async function createUserProfile(userData: AppUser): Promise<void> {
    try {
        const userDocRef = doc(usersCollectionRef, userData.uid);
        await setDoc(userDocRef, userData);
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
}

export async function updateUserProfile(uid: string, data: Partial<AppUser>): Promise<void> {
    try {
        const userDocRef = doc(usersCollectionRef, uid);
        await updateDoc(userDocRef, data);
    } catch (error) {
        console.error("Error updating user profile:", error);
    }
}


// --- Coding Session Functions (SERVER-SIDE) ---
const adminApp = getAdminApp();
const adminDb = adminApp ? getAdminFirestore(adminApp) : null;

export async function getCodingSession(sessionId: string): Promise<CodingSession | null> {
    if (!adminDb) {
        console.error("Admin DB not initialized");
        return null;
    }
    try {
        const sessionDocRef = adminDb.collection('coding_sessions').doc(sessionId);
        const sessionDoc = await sessionDocRef.get();
        if (sessionDoc.exists) {
            const data = sessionDoc.data() as Omit<CodingSession, 'id'>;
            // Ensure questions array exists
            if (!data.questions) {
                data.questions = [];
            }
            return { id: sessionDoc.id, ...data };
        }
        return null;
    } catch (error) {
        console.error("Error fetching coding session with Admin SDK:", error);
        return null; // Return null on error, let the client handle it.
    }
}

export async function updateCodingSessionSolutions(sessionId: string, solutions: Record<string, string>): Promise<void> {
    if (!adminDb) throw new Error("Admin DB not initialized");
    try {
        const sessionDocRef = adminDb.collection('coding_sessions').doc(sessionId);
        const session = await getCodingSession(sessionId);
        if (!session) throw new Error("Session not found");

        const updatedQuestions = session.questions.map(q => ({
            ...q,
            userSolution: solutions[q.id] || q.userSolution || '',
        }));

        await sessionDocRef.update({ questions: updatedQuestions });
    } catch (error) {
        console.error("Error updating solutions:", error);
        throw error;
    }
}

export async function updateCodingSessionFeedback(sessionId: string, questions: CodingQuestionWithSolution[]): Promise<void> {
    if (!adminDb) throw new Error("Admin DB not initialized");
    try {
        const sessionDocRef = adminDb.collection('coding_sessions').doc(sessionId);
        await sessionDocRef.update({ 
            questions: questions,
            status: 'completed'
        });
    } catch (error) {
        console.error("Error updating feedback:", error);
        throw error;
    }
}
