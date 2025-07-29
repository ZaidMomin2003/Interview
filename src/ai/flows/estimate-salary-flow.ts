// src/ai/flows/estimate-salary-flow.ts
'use server';

import { ai } from '@/ai/genkit';
import { 
    EstimateSalaryInputSchema, 
    EstimateSalaryOutputSchema,
    type EstimateSalaryInput,
    type EstimateSalaryOutput 
} from '@/ai/schemas';

const prompt = ai.definePrompt({
    name: 'estimateSalaryPrompt',
    input: { schema: EstimateSalaryInputSchema },
    output: { schema: EstimateSalaryOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
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
