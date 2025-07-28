// src/ai/schemas.ts
/**
 * @fileOverview Centralized Zod schemas and TypeScript types for AI flows.
 * This file does not use 'use server' and can safely export objects and types.
 */
import { z } from 'zod';

// Schemas for estimate-salary-flow
export const EstimateSalaryInputSchema = z.object({
  role: z.string().describe('The job title or role.'),
  experience: z.number().describe('Years of professional experience.'),
  skills: z.string().describe('A comma-separated list of key skills.'),
  location: z.string().describe('The city and state, or country.'),
});
export type EstimateSalaryInput = z.infer<typeof EstimateSalaryInputSchema>;

export const EstimateSalaryOutputSchema = z.object({
  median: z.number().int().describe('The estimated median annual salary in USD.'),
  percentile25: z.number().int().describe('The estimated 25th percentile annual salary in USD.'),
  percentile75: z.number().int().describe('The estimated 75th percentile annual salary in USD.'),
  rationale: z.string().describe('A brief explanation of the factors that influenced the estimate.'),
});
export type EstimateSalaryOutput = z.infer<typeof EstimateSalaryOutputSchema>;

// Schemas for generate-coding-question-flow
export const CodingQuestionInputSchema = z.object({
  topic: z.string().describe('The topic for the coding question (e.g., Arrays, Linked Lists).'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']).describe('The difficulty level of the question.'),
});
export type CodingQuestionInput = z.infer<typeof CodingQuestionInputSchema>;

export const CodingQuestionOutputSchema = z.object({
    title: z.string().describe('A short, descriptive title for the coding problem.'),
    question: z.string().describe('The full coding problem description, including examples.'),
    starter_code: z.string().describe('Boilerplate code for the user to start with, in JavaScript.'),
});
export type CodingQuestionOutput = z.infer<typeof CodingQuestionOutputSchema>;

// Schemas for generate-interview-question-flow
export const InterviewQuestionInputSchema = z.object({
  role: z.string().describe('The job role the user is interviewing for (e.g., Senior Frontend Engineer).'),
  level: z.enum(['Entry-Level', 'Mid-Level', 'Senior', 'Staff']).describe('The seniority level of the role.'),
  type: z.enum(['Technical', 'Behavioral']).describe('The type of interview question.'),
});
export type InterviewQuestionInput = z.infer<typeof InterviewQuestionInputSchema>;

export const InterviewQuestionOutputSchema = z.object({
  question: z.string().describe('The generated interview question.'),
});
export type InterviewQuestionOutput = z.infer<typeof InterviewQuestionOutputSchema>;

// Schemas for generate-notes-flow
export const NotesInputSchema = z.object({
    topic: z.string().describe('The main topic of the text.'),
    rawText: z.string().describe('The block of text to be summarized and structured.'),
});
export type NotesInput = z.infer<typeof NotesInputSchema>;

export const NotesOutputSchema = z.object({
    notes: z.string().describe('Well-structured, summarized notes in Markdown format.'),
});
export type NotesOutput = z.infer<typeof NotesOutputSchema>;


// Schemas for generate-resume-review-flow
export const ResumeReviewInputSchema = z.object({
  resume: z.string().describe('The full text of the user\'s resume.'),
  jobDescription: z.string().describe('The full text of the target job description.'),
});
export type ResumeReviewInput = z.infer<typeof ResumeReviewInputSchema>;

export const ResumeReviewOutputSchema = z.object({
  review: z.string().describe('Actionable feedback on how to improve the resume for the given job description.'),
  score: z.number().int().min(0).max(100).describe('A score from 0-100 representing how well the resume matches the job description.'),
});
export type ResumeReviewOutput = z.infer<typeof ResumeReviewOutputSchema>;
