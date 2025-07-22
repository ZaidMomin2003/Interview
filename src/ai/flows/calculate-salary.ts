'use server';

/**
 * @fileOverview An AI agent for estimating job salaries.
 *
 * - calculateSalary - A function that estimates salary based on various factors.
 */

import {ai} from '@/ai/genkit';
import {
  CalculateSalaryInput,
  CalculateSalaryInputSchema,
  CalculateSalaryOutput,
  CalculateSalaryOutputSchema
} from '@/ai/types/salary-types';


export async function calculateSalary(input: CalculateSalaryInput): Promise<CalculateSalaryOutput> {
  return calculateSalaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateSalaryPrompt',
  input: {schema: CalculateSalaryInputSchema},
  output: {schema: CalculateSalaryOutputSchema},
  prompt: `You are an expert salary analyst for the tech industry. Based on the following user-provided information, estimate a realistic salary range and provide a brief justification for your estimate.

Consider all factors, especially how location and specific high-value skills impact compensation.

Job Title: {{{jobTitle}}}
Experience Level: {{{experienceLevel}}}
Location: {{{location}}}
Skills: {{{skills}}}
Company Size: {{{companySize}}}

Provide the output as a salary range string and a brief reasoning.
`,
});

const calculateSalaryFlow = ai.defineFlow(
  {
    name: 'calculateSalaryFlow',
    inputSchema: CalculateSalaryInputSchema,
    outputSchema: CalculateSalaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
