/**
 * @fileOverview Defines the data structures (schemas and types) for the salary calculator feature.
 */

import {z} from 'genkit';

export const CalculateSalaryInputSchema = z.object({
  jobTitle: z.string().describe("The user's job title (e.g., Software Engineer)."),
  experienceLevel: z
    .string()
    .describe("The user's experience level (e.g., Entry-level, Mid-level, Senior)."),
  location: z
    .string()
    .describe('The location of the job (e.g., San Francisco, CA, Remote).'),
  skills: z.string().describe('Key skills possessed by the user (e.g., React, Node.js, AWS).'),
  companySize: z.string().describe('The size of the company (e.g., Startup, Mid-size, Large Enterprise).'),
});
export type CalculateSalaryInput = z.infer<typeof CalculateSalaryInputSchema>;

export const CalculateSalaryOutputSchema = z.object({
  estimatedSalaryRange: z
    .string()
    .describe('The estimated salary range, formatted as a string (e.g., "$120,000 - $150,000 USD").'),
  reasoning: z
    .string()
    .describe('A brief explanation of the factors that influenced the salary estimate.'),
});
export type CalculateSalaryOutput = z.infer<typeof CalculateSalaryOutputSchema>;
