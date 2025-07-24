/**
 * @fileOverview Defines the data structures (schemas and types) for the Coding Gym feature.
 */

import {z} from 'genkit';

export const MCQSchema = z.object({
  question: z.string().describe('The multiple choice question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 potential answers for the question.'),
  answer: z.string().describe('The correct answer from the options array.'),
  explanation: z
    .string()
    .describe(
      'A detailed explanation of why the answer is correct.'
    ),
});
export type MCQ = z.infer<typeof MCQSchema>;

export const GenerateMCQInputSchema = z.object({
  topic: z.string().describe('The programming topic for the questions (e.g., Arrays, Dynamic Programming).'),
  difficulty: z
    .string()
    .describe('The difficulty level of the questions (e.g., Easy, Medium, Hard).'),
  count: z.number().int().min(1).max(5).describe('The number of questions to generate.'),
});
export type GenerateMCQInput = z.infer<
  typeof GenerateMCQInputSchema
>;

export const GenerateMCQOutputSchema = z.object({
  questions: z
    .array(MCQSchema)
    .describe('The array of generated multiple choice questions.'),
});
export type GenerateMCQOutput = z.infer<
  typeof GenerateMCQOutputSchema
>;
