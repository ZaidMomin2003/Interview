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
    type CodingSession,
    CodingQuestionOutput
} from '@/ai/schemas';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-server-config';

// Ensure we use the Admin SDK for server-side database writes
const adminApp = getAdminApp();
const db = adminApp ? getFirestore(adminApp) : null;

const createCodingSessionFlow = ai.defineFlow(
  {
    name: 'createCodingSessionFlow',
    inputSchema: CreateCodingSessionInputSchema,
    outputSchema: CreateCodingSessionOutputSchema,
  },
  async (input) => {
    if (!db) {
      throw new Error("Firestore Admin SDK is not initialized.");
    }
    
    const { topic, difficulty, numberOfQuestions, userId } = input;

    // Generate N questions sequentially to avoid hitting API rate limits
    const generatedQuestions: CodingQuestionOutput[] = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        const question = await generateCodingQuestion({ topic, difficulty });
        generatedQuestions.push(question);
    }

    // Create session object for Firestore
    const sessionData: Omit<CodingSession, 'id'> = {
        userId,
        topic,
        difficulty: difficulty,
        questions: generatedQuestions.map(q => ({ ...q, id: crypto.randomUUID(), userSolution: '' })),
        createdAt: Date.now(),
        status: 'in-progress' as const,
    };

    // Directly add the document to Firestore from the server flow using the Admin SDK
    const docRef = await db.collection('coding_sessions').add(sessionData);

    return { sessionId: docRef.id };
  }
);

export async function createCodingSession(input: CreateCodingSessionInput): Promise<CreateCodingSessionOutput> {
  return createCodingSessionFlow(input);
}
