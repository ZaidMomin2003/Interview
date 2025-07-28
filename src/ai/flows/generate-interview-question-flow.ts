'use server';
/**
 * @fileOverview A flow for generating interview questions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const InterviewQuestionInputSchema = z.object({
  role: z.string().describe('The job role the user is interviewing for (e.g., Senior Frontend Engineer).'),
  level: z.enum(['Entry-Level', 'Mid-Level', 'Senior', 'Staff']).describe('The seniority level of the role.'),
  type: z.enum(['Technical', 'Behavioral']).describe('The type of interview question.'),
});

export type InterviewQuestionInput = z.infer<typeof InterviewQuestionInputSchema>;

const InterviewQuestionOutputSchema = z.object({
  question: z.string().describe('The generated interview question.'),
});

export type InterviewQuestionOutput = z.infer<typeof InterviewQuestionOutputSchema>;

const prompt = ai.definePrompt({
    name: 'interviewQuestionPrompt',
    input: { schema: InterviewQuestionInputSchema },
    output: { schema: InterviewQuestionOutputSchema },
    prompt: `Generate a {{type}} interview question for a {{level}} {{role}}. The question should be realistic and challenging for that level.`,
});

const generateInterviewQuestionFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionFlow',
    inputSchema: InterviewQuestionInputSchema,
    outputSchema: InterviewQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateInterviewQuestion(input: InterviewQuestionInput): Promise<InterviewQuestionOutput> {
  return generateInterviewQuestionFlow(input);
}

    