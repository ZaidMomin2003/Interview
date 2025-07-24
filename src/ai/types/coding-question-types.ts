/**
 * @fileOverview Defines the data structures (schemas and types) for the Coding Gym feature.
 */

import {z} from 'genkit';

export const GenerateCodingQuestionInputSchema = z.object({
  topic: z
    .string()
    .describe(
      'The programming topic for the question (e.g., Arrays, Dynamic Programming).'
    ),
  difficulty: z
    .string()
    .describe(
      'The difficulty level of the question (e.g., Easy, Medium, Hard).'
    ),
  language: z
    .string()
    .describe('The programming language for the solution (e.g., Python, JavaScript).'),
});
export type GenerateCodingQuestionInput = z.infer<
  typeof GenerateCodingQuestionInputSchema
>;

export const GenerateCodingQuestionOutputSchema = z.object({
  title: z.string().describe('The title of the generated coding question.'),
  description: z
    .string()
    .describe('The detailed description of the problem statement.'),
  solution: z
    .string()
    .describe(
      'The code solution in the requested language, including an explanation.'
    ),
});
export type GenerateCodingQuestionOutput = z.infer<
  typeof GenerateCodingQuestionOutputSchema
>;
