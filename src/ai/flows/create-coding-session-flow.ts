'use server';
/**
 * @fileOverview A flow for creating a new coding practice session.
 */

import { ai } from '@/ai/genkit';
import { generateCodingQuestion } from './generate-coding-question-flow';
import { createNewCodingSession } from '@/services/firestore';
import { 
    CreateCodingSessionInputSchema, 
    CreateCodingSessionOutputSchema,
    type CreateCodingSessionInput,
    type CreateCodingSessionOutput
} from '@/ai/schemas';

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
    const sessionData = {
        userId,
        topic,
        difficulty,
        questions: generatedQuestions.map(q => ({ ...q, id: crypto.randomUUID(), userSolution: '' })),
        createdAt: Date.now(),
        status: 'in-progress' as const,
    };

    const sessionId = await createNewCodingSession(sessionData);

    return { sessionId };
  }
);

export async function createCodingSession(input: CreateCodingSessionInput): Promise<CreateCodingSessionOutput> {
  return createCodingSessionFlow(input);
}
