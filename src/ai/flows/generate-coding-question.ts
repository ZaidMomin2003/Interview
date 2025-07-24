'use server';
/**
 * @fileOverview A flow for generating coding questions.
 */

import {ai} from '@/ai/genkit';
import {
  CodingQuestionSchema,
  GenerateCodingQuestionInput,
  GenerateCodingQuestionInputSchema,
  GenerateCodingQuestionOutput,
  GenerateCodingQuestionOutputSchema,
} from '@/ai/types/coding-question-types';

const prompt = ai.definePrompt({
  name: 'generateCodingQuestionPrompt',
  input: {schema: GenerateCodingQuestionInputSchema},
  output: {schema: GenerateCodingQuestionOutputSchema},
  prompt: `
    You are an expert interviewer at a top tech company.
    Generate {{count}} coding question(s) on the topic of "{{topic}}" with a difficulty level of "{{difficulty}}".

    For each question:
    1. Provide a clear and concise problem statement.
    2. Provide a detailed, step-by-step solution. The solution should explain the thought process, algorithm, and time/space complexity.
    3. Include a complete code example for the solution in a suitable language like Python or JavaScript.
  `,
});

const generateCodingQuestionFlow = ai.defineFlow(
  {
    name: 'generateCodingQuestionFlow',
    inputSchema: GenerateCodingQuestionInputSchema,
    outputSchema: GenerateCodingQuestionOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateCodingQuestion(
  input: GenerateCodingQuestionInput
): Promise<GenerateCodingQuestionOutput> {
  return generateCodingQuestionFlow(input);
}
