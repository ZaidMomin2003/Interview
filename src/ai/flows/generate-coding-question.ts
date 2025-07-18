// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview An AI agent for generating personalized coding questions.
 *
 * - generateCodingQuestion - A function that generates coding questions based on skill level and preferred technologies.
 * - GenerateCodingQuestionInput - The input type for the generateCodingQuestion function.
 * - GenerateCodingQuestionOutput - The return type for the generateCodingQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodingQuestionInputSchema = z.object({
  skillLevel: z
    .string()
    .describe("The user's coding skill level (e.g., beginner, intermediate, advanced)."),
  preferredLanguages: z
    .string()
    .describe('The user\`s preferred coding languages (e.g., JavaScript, Python, Java).'),
  desiredTopics: z
    .string()
    .describe('The desired coding topics (e.g., data structures, algorithms, web development).'),
});
export type GenerateCodingQuestionInput = z.infer<typeof GenerateCodingQuestionInputSchema>;

const GenerateCodingQuestionOutputSchema = z.object({
  question: z.string().describe('The generated coding question.'),
  topic: z.string().describe('The topic of the generated question'),
  difficulty: z.string().describe('The difficulty level of the generated question'),
});
export type GenerateCodingQuestionOutput = z.infer<typeof GenerateCodingQuestionOutputSchema>;

export async function generateCodingQuestion(input: GenerateCodingQuestionInput): Promise<GenerateCodingQuestionOutput> {
  return generateCodingQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodingQuestionPrompt',
  input: {schema: GenerateCodingQuestionInputSchema},
  output: {schema: GenerateCodingQuestionOutputSchema},
  prompt: `You are an expert coding question generator. Generate a coding question based on the user's skill level, preferred languages, and desired topics.

Skill Level: {{{skillLevel}}}
Preferred Languages: {{{preferredLanguages}}}
Desired Topics: {{{desiredTopics}}}

Make sure the coding question is challenging, but also appropriate for the user's stated skill level.
Return the topic and difficulty of the generated question as well.
`,
});

const generateCodingQuestionFlow = ai.defineFlow(
  {
    name: 'generateCodingQuestionFlow',
    inputSchema: GenerateCodingQuestionInputSchema,
    outputSchema: GenerateCodingQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
