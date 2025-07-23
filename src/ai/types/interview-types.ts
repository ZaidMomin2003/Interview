/**
 * @fileOverview Defines the data structures (schemas and types) for the AI interview feature.
 */

import {z} from 'genkit';

export const InterviewMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type InterviewMessage = z.infer<typeof InterviewMessageSchema>;

export const InterviewTurnInputSchema = z.object({
  topic: z.string().describe('The main topic for the interview (e.g., System Design, React).'),
  difficulty: z
    .string()
    .describe(
      'The difficulty level of the interview (e.g., entry-level, senior).'
    ),
  messages: z
    .array(InterviewMessageSchema)
    .describe('The history of the conversation so far.'),
});
export type InterviewTurnInput = z.infer<typeof InterviewTurnInputSchema>;

export const InterviewTurnOutputSchema = z.object({
  audioDataUri: z.string().describe('The base64 encoded data URI of the generated audio response.'),
  text: z.string().describe('The text content of the AI\'s response.'),
});
export type InterviewTurnOutput = z.infer<typeof InterviewTurnOutputSchema>;

export const SummarizeInterviewInputSchema = z.object({
  messages: z.array(InterviewMessageSchema),
});
export type SummarizeInterviewInput = z.infer<typeof SummarizeInterviewInputSchema>;

export const SummarizeInterviewOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the candidate\'s performance, highlighting strengths and areas for improvement.'),
});
export type SummarizeInterviewOutput = z.infer<typeof SummarizeInterviewOutputSchema>;
