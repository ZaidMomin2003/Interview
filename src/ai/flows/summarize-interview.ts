'use server';
/**
 * @fileOverview A flow for summarizing a completed mock interview.
 */
import {ai} from '@/ai/genkit';
import {
  SummarizeInterviewInput,
  SummarizeInterviewInputSchema,
  SummarizeInterviewOutput,
  SummarizeInterviewOutputSchema,
} from '@/ai/types/interview-types';

const prompt = ai.definePrompt({
  name: 'summarizeInterviewPrompt',
  input: {schema: SummarizeInterviewInputSchema},
  output: {schema: SummarizeInterviewOutputSchema},
  prompt: `
    You are an expert hiring manager reviewing an interview transcript.
    Analyze the following conversation between an AI interviewer ("model") and a candidate ("user").
    Provide a concise summary of the candidate's performance.
    Highlight their strengths and identify areas for improvement.
    The feedback should be constructive and actionable.
    Format the output as a single string.

    Transcript:
    ---
    {{#each messages}}
    {{#if (eq role "user")}}
    Candidate: {{content}}
    {{else}}
    Interviewer: {{content}}
    {{/if}}
    {{/each}}
    ---
  `,
});


const summarizeInterviewFlow = ai.defineFlow(
  {
    name: 'summarizeInterviewFlow',
    inputSchema: SummarizeInterviewInputSchema,
    outputSchema: SummarizeInterviewOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function summarizeInterview(
  input: SummarizeInterviewInput
): Promise<SummarizeInterviewOutput> {
  return summarizeInterviewFlow(input);
}
