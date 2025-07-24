'use server';
/**
 * @fileOverview A flow for generating Multiple Choice Questions.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateMCQInputSchema,
  GenerateMCQOutput,
  GenerateMCQOutputSchema,
  GenerateMCQInput,
} from '@/ai/types/coding-question-types';

const prompt = ai.definePrompt({
  name: 'generateMCQPrompt',
  input: {schema: GenerateMCQInputSchema},
  output: {schema: GenerateMCQOutputSchema},
  prompt: `
    You are an expert interviewer at a top tech company.
    Generate {{count}} Multiple Choice Question(s) on the topic of "{{topic}}" with a difficulty level of "{{difficulty}}".

    For each question:
    1. Provide a clear and concise question.
    2. Provide exactly 4 potential options.
    3. Clearly indicate the correct option letter (e.g., "A", "B", "C", or "D").
    4. Provide a detailed explanation of why the correct answer is right and the other options are wrong.
  `,
});

const generateMCQFlow = ai.defineFlow(
  {
    name: 'generateMCQFlow',
    inputSchema: GenerateMCQInputSchema,
    outputSchema: GenerateMCQOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateMCQ(
  input: GenerateMCQInput
): Promise<GenerateMCQOutput> {
  return generateMCQFlow(input);
}
