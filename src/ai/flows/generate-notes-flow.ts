'use server';
/**
 * @fileOverview A flow for generating structured notes from raw text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NotesInputSchema = z.object({
    topic: z.string().describe('The main topic of the text.'),
    rawText: z.string().describe('The block of text to be summarized and structured.'),
});

export type NotesInput = z.infer<typeof NotesInputSchema>;

const NotesOutputSchema = z.object({
    notes: z.string().describe('Well-structured, summarized notes in Markdown format.'),
});

export type NotesOutput = z.infer<typeof NotesOutputSchema>;

const prompt = ai.definePrompt({
    name: 'notesPrompt',
    input: { schema: NotesInputSchema },
    output: { schema: NotesOutputSchema },
    prompt: `You are an expert note-taker. Read the following text about "{{topic}}" and create a set of clear, concise, and well-structured notes in Markdown format. Use headings, bullet points, and bold text to organize the information effectively.

Raw Text:
{{{rawText}}}
`,
});

const generateNotesFlow = ai.defineFlow(
  {
    name: 'generateNotesFlow',
    inputSchema: NotesInputSchema,
    outputSchema: NotesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateNotes(input: NotesInput): Promise<NotesOutput> {
  return generateNotesFlow(input);
}

    