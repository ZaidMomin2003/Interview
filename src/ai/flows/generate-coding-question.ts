'use server';
/**
 * @fileOverview A flow for generating Multiple Choice Questions.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateMCQInputSchema,
  GenerateMCQOutput,
  GenerateMCQOutputSchema,
  GenerateMCQInput,
} from '@/ai/types/coding-question-types';

const prompt = ai.definePrompt({
  name: 'generateMCQPrompt',
  input: {schema: GenerateMCQInputSchema},
  output: {schema: GenerateMCQOutputSchema},
  prompt: `
    You are an expert interviewer at a top tech company.
    Your task is to generate a JSON object containing a 'questions' array with {{count}} Multiple Choice Question(s) on the topic of "{{topic}}" and a difficulty level of "{{difficulty}}".

    For each question in the array, you must provide:
    1. A 'question' field with clear and concise question text.
    2. An 'options' array with exactly 4 string values representing the potential answers.
    3. An 'answer' field with the string of the correct option.
    4. An 'explanation' field with a detailed explanation of why the correct answer is right and the other options are wrong.

    Example for one question:
    {
      "questions": [
        {
          "question": "What is the time complexity of a binary search algorithm?",
          "options": ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
          "answer": "O(log n)",
          "explanation": "Binary search works on sorted arrays and halves the search space in each iteration, resulting in a logarithmic time complexity."
        }
      ]
    }
  `,
});

const generateMCQFlow = ai.defineFlow(
  {
    name: 'generateMCQFlow',
    inputSchema: GenerateMCQInputSchema,
    outputSchema: GenerateMCQOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateMCQ(
  input: GenerateMCQInput
): Promise<GenerateMCQOutput> {
  return generateMCQFlow(input);
}
