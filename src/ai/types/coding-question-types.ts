/**
 * @fileOverview Defines the data structures (schemas and types) for the Coding Gym feature.
 */

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
