'use server';
/**
 * @fileOverview A flow for reviewing a resume against a job description.
 */

import { ai } from '@/ai/genkit';
import { 
    ResumeReviewInputSchema, 
    ResumeReviewOutputSchema,
    type ResumeReviewInput,
    type ResumeReviewOutput
} from '@/ai/schemas';

const prompt = ai.definePrompt({
    name: 'resumeReviewPrompt',
    input: { schema: ResumeReviewInputSchema },
    output: { schema: ResumeReviewOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
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
