// src/ai/flows/get-code-feedback.ts
'use server';

/**
 * @fileOverview Provides AI-powered feedback on code solutions.
 *
 * - getCodeFeedback - A function that analyzes code and provides feedback.
 * - GetCodeFeedbackInput - The input type for the getCodeFeedback function.
 * - GetCodeFeedbackOutput - The return type for the getCodeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCodeFeedbackInputSchema = z.object({
  code: z.string().describe('The code to analyze.'),
  language: z.string().describe('The programming language of the code.'),
  problemDescription: z
    .string()
    .describe('The description of the coding problem solved by the code.'),
});
export type GetCodeFeedbackInput = z.infer<typeof GetCodeFeedbackInputSchema>;

const GetCodeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('The AI-powered feedback on the code.'),
  improvements: z
    .string()
    .describe('Suggestions for improving the code, if any.'),
});
export type GetCodeFeedbackOutput = z.infer<typeof GetCodeFeedbackOutputSchema>;

export async function getCodeFeedback(input: GetCodeFeedbackInput): Promise<GetCodeFeedbackOutput> {
  return getCodeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCodeFeedbackPrompt',
  input: {schema: GetCodeFeedbackInputSchema},
  output: {schema: GetCodeFeedbackOutputSchema},
  prompt: `You are an expert coding mentor. You will provide feedback to the user to improve their coding skills.

  Problem Description: {{{problemDescription}}}

  You will review the code below and provide feedback in terms of potential improvements and more efficient approaches, if any.

  Language: {{{language}}}
  Code: {{{code}}}`,
});

const getCodeFeedbackFlow = ai.defineFlow(
  {
    name: 'getCodeFeedbackFlow',
    inputSchema: GetCodeFeedbackInputSchema,
    outputSchema: GetCodeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
