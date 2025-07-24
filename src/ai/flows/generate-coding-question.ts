'use server';
/**
 * @fileOverview A flow for generating coding questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CodingQuestionSchema = z.object({
  question: z.string().describe('The coding challenge question text.'),
  solution: z
    .string()
    .describe(
      'A detailed solution for the question, including code examples in a relevant language.'
    ),
});
export type CodingQuestion = z.infer<typeof CodingQuestionSchema>;

export const GenerateCodingQuestionInputSchema = z.object({
  topic: z.string().describe('The programming topic for the questions (e.g., Arrays, Dynamic Programming).'),
  difficulty: z
    .string()
    .describe('The difficulty level of the questions (e.g., Easy, Medium, Hard).'),
  count: z.number().int().min(1).max(5).describe('The number of questions to generate.'),
});
export type GenerateCodingQuestionInput = z.infer<
  typeof GenerateCodingQuestionInputSchema
>;

export const GenerateCodingQuestionOutputSchema = z.object({
  questions: z
    .array(CodingQuestionSchema)
    .describe('The array of generated coding questions.'),
});
export type GenerateCodingQuestionOutput = z.infer<
  typeof GenerateCodingQuestionOutputSchema
>;

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
