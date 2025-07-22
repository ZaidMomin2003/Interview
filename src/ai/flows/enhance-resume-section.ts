// src/ai/flows/enhance-resume-section.ts
'use server';

/**
 * @fileOverview An AI agent that enhances a specific section of a resume.
 *
 * - enhanceResumeSection - A function that takes a piece of text for a resume section and rewrites it.
 * - EnhanceResumeSectionInput - The input type for the enhanceResumeSection function.
 * - EnhanceResumeSectionOutput - The return type for the enhanceResumeSection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceResumeSectionInputSchema = z.object({
  sectionType: z
    .string()
    .describe(
      'The type of resume section (e.g., "Professional Summary", "Work Experience Description").'
    ),
  text: z.string().describe('The text content of the resume section to be enhanced.'),
});
export type EnhanceResumeSectionInput = z.infer<typeof EnhanceResumeSectionInputSchema>;

const EnhanceResumeSectionOutputSchema = z.object({
  enhancedText: z.string().describe('The AI-enhanced resume section content.'),
});
export type EnhanceResumeSectionOutput = z.infer<typeof EnhanceResumeSectionOutputSchema>;

export async function enhanceResumeSection(
  input: EnhanceResumeSectionInput
): Promise<EnhanceResumeSectionOutput> {
  return enhanceResumeSectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceResumeSectionPrompt',
  input: {schema: EnhanceResumeSectionInputSchema},
  output: {schema: EnhanceResumeSectionOutputSchema},
  prompt: `You are an expert resume writer. You will be given a piece of text from a specific section of a user's resume.
Your task is to rewrite it to be more professional, impactful, and concise. Use strong action verbs and quantify achievements where possible.

The section is: {{{sectionType}}}

The user's text is:
"{{{text}}}"

Rewrite the text. Return ONLY the rewritten text in the enhancedText field.
`,
});

const enhanceResumeSectionFlow = ai.defineFlow(
  {
    name: 'enhanceResumeSectionFlow',
    inputSchema: EnhanceResumeSectionInputSchema,
    outputSchema: EnhanceResumeSectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
