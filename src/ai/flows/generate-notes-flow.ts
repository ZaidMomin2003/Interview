'use server';
/**
 * @fileOverview A flow for generating structured notes from raw text.
 */

import { ai } from '@/ai/genkit';
import { 
    NotesInputSchema, 
    NotesOutputSchema,
    type NotesInput,
    type NotesOutput
} from '@/ai/schemas';


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
