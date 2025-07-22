'use server';

/**
 * @fileOverview An AI agent for estimating job salaries.
 *
 * - calculateSalary - A function that estimates salary based on various factors.
 * - CalculateSalaryInput - The input type for the calculateSalary function.
 * - CalculateSalaryOutput - The return type for the calculateSalary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CalculateSalaryInputSchema = z.object({
  jobTitle: z.string().describe("The user's job title (e.g., Software Engineer)."),
  experienceLevel: z
    .string()
    .describe("The user's experience level (e.g., Entry-level, Mid-level, Senior)."),
  location: z
    .string()
    .describe('The location of the job (e.g., San Francisco, CA, Remote).'),
  skills: z.string().describe('Key skills possessed by the user (e.g., React, Node.js, AWS).'),
  companySize: z.string().describe('The size of the company (e.g., Startup, Mid-size, Large Enterprise).'),
});
export type CalculateSalaryInput = z.infer<typeof CalculateSalaryInputSchema>;

export const CalculateSalaryOutputSchema = z.object({
  estimatedSalaryRange: z
    .string()
    .describe('The estimated salary range, formatted as a string (e.g., "$120,000 - $150,000 USD").'),
  reasoning: z
    .string()
    .describe('A brief explanation of the factors that influenced the salary estimate.'),
});
export type CalculateSalaryOutput = z.infer<typeof CalculateSalaryOutputSchema>;

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
