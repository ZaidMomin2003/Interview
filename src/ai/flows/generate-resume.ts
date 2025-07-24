'use server';
/**
 * @fileOverview A flow for generating a resume from user-provided information.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeInfoSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  summary: z.string(),
  technologies: z.string(),
  experience: z.array(z.object({
    jobTitle: z.string(),
    company: z.string(),
    duration: z.string(),
    responsibilities: z.string(),
  })),
  education: z.array(z.object({
    degree: z.string(),
    university: z.string(),
    duration: z.string(),
  })),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.string(),
  })),
});
export type ResumeInfo = z.infer<typeof ResumeInfoSchema>;

const GenerateResumeOutputSchema = z.object({
  resumeMarkdown: z.string().describe("The generated resume in Markdown format."),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;


const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: ResumeInfoSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `
    You are an expert resume writer for software developers.
    Your task is to generate a professional, ATS-friendly resume in Markdown format based on the following information.
    The resume should be well-structured, clear, and concise. Use strong action verbs and quantify achievements where possible, even if you have to invent plausible numbers.

    ---
    Full Name: {{fullName}}
    Email: {{email}}
    Phone Number: {{phoneNumber}}
    LinkedIn: {{linkedin}}
    GitHub: {{github}}

    ## Summary
    {{summary}}

    ## Skills
    {{technologies}}

    ## Experience
    {{#each experience}}
    - **{{jobTitle}}** at {{company}} ({{duration}})
      {{responsibilities}}
    {{/each}}

    ## Education
    {{#each education}}
    - **{{degree}}**, {{university}} ({{duration}})
    {{/each}}

    ## Projects
    {{#each projects}}
    - **{{name}}**: {{description}} (Technologies: {{technologies}})
    {{/each}}
    ---
  `,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: ResumeInfoSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

export async function generateResume(input: ResumeInfo): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}
