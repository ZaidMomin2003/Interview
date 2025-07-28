'use server';
/**
 * @fileOverview A flow for generating coding questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CodingQuestionInputSchema = z.object({
  topic: z.string().describe('The topic for the coding question (e.g., Arrays, Linked Lists).'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the question.'),
});

export type CodingQuestionInput = z.infer<typeof CodingQuestionInputSchema>;

const CodingQuestionOutputSchema = z.object({
    title: z.string().describe('A short, descriptive title for the coding problem.'),
    question: z.string().describe('The full coding problem description, including examples.'),
    starter_code: z.string().describe('Boilerplate code for the user to start with, in JavaScript.'),
});

export type CodingQuestionOutput = z.infer<typeof CodingQuestionOutputSchema>;

const prompt = ai.definePrompt({
    name: 'codingQuestionPrompt',
    input: { schema: CodingQuestionInputSchema },
    output: { schema: CodingQuestionOutputSchema },
    prompt: `Generate a {{difficulty}} coding question about {{topic}}. Provide a clear problem statement, examples, and starter code in JavaScript.`,
});


const generateCodingQuestionFlow = ai.defineFlow(
  {
    name: 'generateCodingQuestionFlow',
    inputSchema: CodingQuestionInputSchema,
    outputSchema: CodingQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function generateCodingQuestion(input: CodingQuestionInput): Promise<CodingQuestionOutput> {
  return generateCodingQuestionFlow(input);
}

    