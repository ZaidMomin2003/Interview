'use server';
/**
 * @fileOverview An AI agent that summarizes an interview transcript.
 *
 * - summarizeInterview - A function that takes a transcript and provides feedback.
 * - SummarizeInterviewInput - The input type for the function.
 * - SummarizeInterviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { InterviewMessageSchema } from '@/ai/types/interview-types';

export const SummarizeInterviewInputSchema = z.object({
  messages: z.array(InterviewMessageSchema),
});
export type SummarizeInterviewInput = z.infer<typeof SummarizeInterviewInputSchema>;

export const SummarizeInterviewOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the candidate\'s performance, highlighting strengths and areas for improvement.'),
});
export type SummarizeInterviewOutput = z.infer<typeof SummarizeInterviewOutputSchema>;

export async function summarizeInterview(
  input: SummarizeInterviewInput
): Promise<SummarizeInterviewOutput> {
  return summarizeInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInterviewPrompt',
  input: {schema: SummarizeInterviewInputSchema},
  output: {schema: SummarizeInterviewOutputSchema},
  prompt: `You are an expert career coach. You have just observed a mock interview. Your task is to provide a concise, constructive summary of the candidate's performance based on the interview transcript.

Focus on:
- **Clarity of Communication:** How well did the candidate articulate their thoughts?
- **Problem-Solving:** Did they demonstrate strong analytical and problem-solving skills?
- **Technical Knowledge:** Did their answers reflect a solid understanding of the subject matter?
- **Key Strengths:** What did they do particularly well?
- **Areas for Improvement:** What specific, actionable advice can you offer?

Keep the summary brief and to the point.

Interview Transcript:
{{#each messages}}
  {{#if (eq this.role 'model')}}
    Interviewer: {{{this.content}}}
  {{else}}
    Candidate: {{{this.content}}}
  {{/if}}
{{/each}}
`,
});

const summarizeInterviewFlow = ai.defineFlow(
  {
    name: 'summarizeInterviewFlow',
    inputSchema: SummarizeInterviewInputSchema,
    outputSchema: SummarizeInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
