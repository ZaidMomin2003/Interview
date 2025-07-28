// src/ai/flows/estimate-salary-flow.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const EstimateSalaryInputSchema = z.object({
  role: z.string().describe('The job title or role.'),
  experience: z.number().describe('Years of professional experience.'),
  skills: z.string().describe('A comma-separated list of key skills.'),
  location: z.string().describe('The city and state, or country.'),
});

export type EstimateSalaryInput = z.infer<typeof EstimateSalaryInputSchema>;

const EstimateSalaryOutputSchema = z.object({
  median: z.number().int().describe('The estimated median annual salary in USD.'),
  percentile25: z.number().int().describe('The estimated 25th percentile annual salary in USD.'),
  percentile75: z.number().int().describe('The estimated 75th percentile annual salary in USD.'),
  rationale: z.string().describe('A brief explanation of the factors that influenced the estimate.'),
});

export type EstimateSalaryOutput = z.infer<typeof EstimateSalaryOutputSchema>;


const prompt = ai.definePrompt({
    name: 'estimateSalaryPrompt',
    input: { schema: EstimateSalaryInputSchema },
    output: { schema: EstimateSalaryOutputSchema },
    prompt: `You are an expert salary and compensation analyst. Based on the following information, provide an estimated annual salary range in USD.

    Role: {{role}}
    Experience: {{experience}} years
    Skills: {{skills}}
    Location: {{location}}

    Consider all factors, including market rates, demand for skills, and cost of living in the location.
    `,
});


const estimateSalaryFlow = ai.defineFlow(
  {
    name: 'estimateSalaryFlow',
    inputSchema: EstimateSalaryInputSchema,
    outputSchema: EstimateSalaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);


export async function estimateSalary(input: EstimateSalaryInput): Promise<EstimateSalaryOutput> {
  return estimateSalaryFlow(input);
}

    