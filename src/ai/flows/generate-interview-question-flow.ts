'use server';
/**
 * @fileOverview A flow for generating interview questions.
 */

import { ai } from '@/ai/genkit';
import { 
    InterviewQuestionInputSchema, 
    InterviewQuestionOutputSchema,
    type InterviewQuestionInput,
    type InterviewQuestionOutput
} from '@/ai/schemas';


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
