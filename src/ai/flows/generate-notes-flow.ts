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
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are an expert educator and content creator specializing in software development. Your task is to generate a comprehensive, well-structured educational note on a given topic for a specific difficulty level.

Topic: {{topic}}
Difficulty: {{difficulty}}

Instructions:
1.  **Title**: Create a clear and descriptive title for the topic.
2.  **Description**: Write a concise, one-paragraph overview of the topic.
3.  **Key Takeaways**: Generate a list of 3-5 essential bullet points that a learner must remember.
4.  **Content Sections**: Break down the topic into several logical sections. For each section:
    a.  Provide a clear \`title\`.
    b.  Write a detailed \`explanation\` in Markdown format. Explain the concept thoroughly, assuming the target audience's difficulty level.
    c.  Provide a clear, relevant \`codeExample\` in a JavaScript Markdown block to illustrate the concept. The code should be practical and easy to understand.

Your final output must be a valid JSON object that strictly follows the provided output schema.
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
