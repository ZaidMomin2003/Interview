'use server';
/**
 * @fileOverview A flow for generating concise notes from a longer text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNotesInputSchema = z.object({
  text: z.string().describe('The text to be summarized into notes.'),
  format: z.string().describe('The desired format for the notes (e.g., bullet points, summary).')
});
type GenerateNotesInput = z.infer<typeof GenerateNotesInputSchema>;

const GenerateNotesOutputSchema = z.object({
  notes: z.string().describe('The generated notes.'),
});
type GenerateNotesOutput = z.infer<typeof GenerateNotesOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateNotesPrompt',
  input: {schema: GenerateNotesInputSchema},
  output: {schema: GenerateNotesOutputSchema},
  prompt: `
    You are an expert at distilling information.
    Your task is to generate clear and concise notes from the following text.
    The desired format is "{{format}}".

    Text to process:
    ---
    {{text}}
    ---
  `,
});

const generateNotesFlow = ai.defineFlow(
  {
    name: 'generateNotesFlow',
    inputSchema: GenerateNotesInputSchema,
    outputSchema: GenerateNotesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateNotes(
  input: GenerateNotesInput
): Promise<GenerateNotesOutput> {
  return generateNotesFlow(input);
}
