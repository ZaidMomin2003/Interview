'use server';
/**
 * @fileOverview A flow for generating coding questions.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateCodingQuestionInputSchema,
  GenerateCodingQuestionOutput,
  GenerateCodingQuestionOutputSchema,
  GenerateCodingQuestionInput,
} from '@/ai/types/coding-question-types';

const prompt = ai.definePrompt({
  name: 'generateCodingQuestionPrompt',
  input: {schema: GenerateCodingQuestionInputSchema},
  output: {schema: GenerateCodingQuestionOutputSchema},
  prompt: `
    You are an expert interviewer at a top tech company.
    Your task is to generate a coding question on the topic of "{{topic}}" with a difficulty level of "{{difficulty}}".
    You must provide:
    1. A 'title' for the question.
    2. A 'description' of the problem, including any constraints.
    3. A 'solution' in the language requested ({{language}}) with an explanation of the approach.
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
