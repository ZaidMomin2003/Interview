'use server';

/**
 * @fileOverview An AI agent for generating detailed study notes on technical topics.
 *
 * - generateNotes - A function that generates notes for a given topic.
 * - GenerateNotesInput - The input type for the generateNotes function.
 * - GenerateNotesOutput - The return type for the generateNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeExampleSchema = z.object({
  language: z.string().describe('The programming language of the code example (e.g., Python, JavaScript).'),
  code: z.string().describe('The code snippet demonstrating the concept.'),
});

const SectionSchema = z.object({
  title: z.string().describe('The title of this section.'),
  content: z.string().describe('The detailed explanation for this section, formatted in Markdown.'),
  example: CodeExampleSchema.optional().describe('An optional code example for this section.'),
});

const GenerateNotesInputSchema = z.object({
  topic: z.string().describe("The technical topic for which to generate notes (e.g., 'Data Structures', 'Big O Notation')."),
});
export type GenerateNotesInput = z.infer<typeof GenerateNotesInputSchema>;

const GenerateNotesOutputSchema = z.object({
  title: z.string().describe('The main title of the notes.'),
  introduction: z.string().describe('A brief introduction to the topic.'),
  sections: z.array(SectionSchema).describe('An array of detailed sections that make up the notes.'),
  summary: z.string().describe('A concluding summary of the key points.'),
});
export type GenerateNotesOutput = z.infer<typeof GenerateNotesOutputSchema>;


export async function generateNotes(input: GenerateNotesInput): Promise<GenerateNotesOutput> {
  return generateNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNotesPrompt',
  input: {schema: GenerateNotesInputSchema},
  output: {schema: GenerateNotesOutputSchema},
  prompt: `You are an expert computer science educator. Your task is to generate comprehensive, clear, and well-structured study notes on a given technical topic.

The notes should be broken down into logical sections, each with a title and detailed content. Where appropriate, include a code example to illustrate the concept.

Topic: {{{topic}}}

Structure the output with a main title, an introduction, multiple sections, and a final summary. The content should be written in Markdown for easy formatting.
`,
});

const generateNotesFlow = ai.defineFlow(
  {
    name: 'generateNotesFlow',
    inputSchema: GenerateNotesInputSchema,
    outputSchema: GenerateNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
