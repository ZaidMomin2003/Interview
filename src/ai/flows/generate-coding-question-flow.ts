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

const prompt = ai.definePrompt({
    name: 'codingQuestionPrompt',
    input: { schema: CodingQuestionInputSchema },
    output: { schema: CodingQuestionOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
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
