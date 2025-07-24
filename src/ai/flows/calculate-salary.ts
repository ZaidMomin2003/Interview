'use server';
/**
 * @fileOverview A flow for calculating an estimated salary range.
 */
import {ai} from '@/ai/genkit';
import {
  CalculateSalaryInput,
  CalculateSalaryInputSchema,
  CalculateSalaryOutput,
  CalculateSalaryOutputSchema,
} from '@/ai/types/salary-types';

const prompt = ai.definePrompt({
  name: 'calculateSalaryPrompt',
  input: {schema: CalculateSalaryInputSchema},
  output: {schema: CalculateSalaryOutputSchema},
  prompt: `
    You are an expert salary negotiation coach for the tech industry.
    Your task is to provide an estimated salary range and reasoning based on the provided user data.
    Analyze the user's job title, experience level, location, skills, and company size.
    Provide a realistic salary range in USD.
    Provide a brief, bulleted list of reasons for your estimation.

    User Data:
    - Job Title: {{jobTitle}}
    - Experience Level: {{experienceLevel}}
    - Location: {{location}}
    - Skills: {{skills}}
    - Company Size: {{companySize}}
  `,
});

const calculateSalaryFlow = ai.defineFlow(
  {
    name: 'calculateSalaryFlow',
    inputSchema: CalculateSalaryInputSchema,
    outputSchema: CalculateSalaryOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function calculateSalary(
  input: CalculateSalaryInput
): Promise<CalculateSalaryOutput> {
  return calculateSalaryFlow(input);
}
