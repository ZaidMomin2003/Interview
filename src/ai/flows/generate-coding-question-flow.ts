
'use server';
/**
 * @fileOverview A flow for generating coding questions.
 */

import { ai } from '@/ai/genkit';
import { 
    CodingQuestionInputSchema, 
    CodingQuestionOutputSchema,
    type CodingQuestionInput,
    type CodingQuestionOutput
} from '@/ai/schemas';

export const codingQuestionPrompt = ai.definePrompt({
    name: 'codingQuestionPrompt',
    input: { schema: CodingQuestionInputSchema },
    output: { schema: CodingQuestionOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `Generate a {{difficulty}} coding question about {{topic}}. Provide a clear problem statement, examples, and starter code in JavaScript.`,
});
