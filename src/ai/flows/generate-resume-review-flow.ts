'use server';
/**
 * @fileOverview A flow for reviewing a resume against a job description.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ResumeReviewInputSchema = z.object({
  resume: z.string().describe('The full text of the user\'s resume.'),
  jobDescription: z.string().describe('The full text of the target job description.'),
});

export type ResumeReviewInput = z.infer<typeof ResumeReviewInputSchema>;

const ResumeReviewOutputSchema = z.object({
  review: z.string().describe('Actionable feedback on how to improve the resume for the given job description.'),
  score: z.number().int().min(0).max(100).describe('A score from 0-100 representing how well the resume matches the job description.'),
});

export type ResumeReviewOutput = z.infer<typeof ResumeReviewOutputSchema>;


const prompt = ai.definePrompt({
    name: 'resumeReviewPrompt',
    input: { schema: ResumeReviewInputSchema },
    output: { schema: ResumeReviewOutputSchema },
    prompt: `You are an expert career coach and recruiter. Analyze the following resume against the provided job description. 
    
    1.  Provide a percentage score (0-100) for how well the resume matches the job description.
    2.  Provide clear, actionable feedback for improving the resume. Focus on keywords, skills, and experience alignment.

    Job Description:
    {{{jobDescription}}}

    Resume:
    {{{resume}}}
    `,
});

const generateResumeReviewFlow = ai.defineFlow(
  {
    name: 'generateResumeReviewFlow',
    inputSchema: ResumeReviewInputSchema,
    outputSchema: ResumeReviewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function generateResumeReview(input: ResumeReviewInput): Promise<ResumeReviewOutput> {
  return generateResumeReviewFlow(input);
}

    