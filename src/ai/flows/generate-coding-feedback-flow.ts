'use server';
/**
 * @fileOverview A flow for generating feedback on a coding solution.
 */

import { ai } from '@/ai/genkit';
import {
    CodingFeedbackInputSchema,
    CodingFeedbackOutputSchema,
    type CodingFeedbackInput,
    type CodingFeedbackOutput
} from '@/ai/schemas';

const prompt = ai.definePrompt({
    name: 'codingFeedbackPrompt',
    input: { schema: CodingFeedbackInputSchema },
    output: { schema: CodingFeedbackOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an expert software engineer conducting a code review.
    
    The user was given the following coding problem:
    Title: {{questionTitle}}
    Description:
    {{{questionDescription}}}

    The user submitted the following solution:
    \`\`\`javascript
    {{{userSolution}}}
    \`\`\`

    Please perform the following tasks:
    1.  **Analyze the User's Solution**: Evaluate the code for correctness, efficiency (time and space complexity), readability, and adherence to JavaScript best practices. Explain any issues clearly and concisely.
    2.  **Provide a Suggested Solution**: Write an optimal or more idiomatic solution in JavaScript. The solution should be clean, well-commented, and efficient.
    
    Structure your response strictly according to the output schema.`,
});

const generateCodingFeedbackFlow = ai.defineFlow(
  {
    name: 'generateCodingFeedbackFlow',
    inputSchema: CodingFeedbackInputSchema,
    outputSchema: CodingFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateCodingFeedback(input: CodingFeedbackInput): Promise<CodingFeedbackOutput> {
  return generateCodingFeedbackFlow(input);
}
