'use server';
/**
 * @fileOverview A flow for creating a new coding practice session.
 */

import { ai } from '@/ai/genkit';
import { generateCodingQuestion } from './generate-coding-question-flow';
import { 
    CreateCodingSessionInputSchema, 
    CreateCodingSessionOutputSchema,
    type CreateCodingSessionInput,
    type CreateCodingSessionOutput,
    type CodingSession
} from '@/ai/schemas';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const createCodingSessionFlow = ai.defineFlow(
  {
    name: 'createCodingSessionFlow',
    inputSchema: CreateCodingSessionInputSchema,
    outputSchema: CreateCodingSessionOutputSchema,
  },
  async (input) => {
    const { topic, difficulty, numberOfQuestions, userId } = input;

    // Generate N questions in parallel
    const questionPromises = Array.from({ length: numberOfQuestions }, () => 
        generateCodingQuestion({ topic, difficulty })
    );
    const generatedQuestions = await Promise.all(questionPromises);

    // Create session object for Firestore
    const sessionData: Omit<CodingSession, 'id'> = {
        userId,
        topic,
        difficulty: difficulty,
        questions: generatedQuestions.map(q => ({ ...q, id: crypto.randomUUID(), userSolution: '' })),
        createdAt: Date.now(),
        status: 'in-progress' as const,
    };

    // Directly add the document to Firestore from the server flow
    const docRef = await addDoc(collection(db, 'coding_sessions'), sessionData);

    return { sessionId: docRef.id };
  }
);

export async function createCodingSession(input: CreateCodingSessionInput): Promise<CreateCodingSessionOutput> {
  return createCodingSessionFlow(input);
}
