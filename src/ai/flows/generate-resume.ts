'use server';

/**
 * @fileOverview AI-powered resume generation flow.
 *
 * - generateResume - A function that generates a resume based on user-provided information.
 * - GenerateResumeInput - The input type for the generateResume function.
 * - GenerateResumeOutput - The return type for the generateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

const ProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.string(),
  link: z.string().optional(),
});

const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  graduationDate: z.string(),
});

const GenerateResumeInputSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  portfolio: z.string().optional(),
  summary: z.string(),
  experiences: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  skills: z.string(),
  desiredJob: z.string().describe('The desired job role for the resume.'),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

const GenerateResumeOutputSchema = z.object({
  resume: z.string().describe('The generated resume content in plain text or markdown format.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are an expert resume writer. Generate a professional, well-formatted, plain-text resume tailored for the desired job role.
Use the following detailed information. Ensure the output is clean, professional, and follows standard resume structure.

Desired Job: {{{desiredJob}}}

--- PERSONAL DETAILS ---
Full Name: {{{fullName}}}
Email: {{{email}}}
Phone: {{{phone}}}
LinkedIn: {{#if linkedin}} {{{linkedin}}} {{else}}N/A{{/if}}
GitHub: {{#if github}} {{{github}}} {{else}}N/A{{/if}}
Portfolio: {{#if portfolio}} {{{portfolio}}} {{else}}N/A{{/if}}

--- PROFESSIONAL SUMMARY ---
{{{summary}}}

--- WORK EXPERIENCE ---
{{#each experiences}}
- Job Title: {{{this.jobTitle}}}
  Company: {{{this.company}}}
  Location: {{{this.location}}}
  Dates: {{{this.startDate}}} - {{{this.endDate}}}
  Description: {{{this.description}}}
{{/each}}

--- PROJECTS ---
{{#each projects}}
- Project Name: {{{this.name}}}
  Technologies: {{{this.technologies}}}
  Description: {{{this.description}}}
  Link: {{#if this.link}} {{{this.link}}} {{else}}N/A{{/if}}
{{/each}}

--- EDUCATION ---
{{#each education}}
- Institution: {{{this.institution}}}
  Degree: {{{this.degree}}}
  Graduation Date: {{{this.graduationDate}}}
{{/each}}

--- SKILLS ---
{{{skills}}}

---

Based on all this information, generate the complete resume text.
`,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
