// src/ai/schemas.ts
/**
 * @fileOverview Centralized Zod schemas and TypeScript types for AI flows.
 * This file does not use 'use server' and can safely export objects and types.
 */
import { z } from 'zod';

// Schemas for estimate-salary-flow
export const EstimateSalaryInputSchema = z.object({
  role: z.string().describe('The job title or role.'),
  experience: z.coerce.number().describe('Years of professional experience.'),
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

// Zod Schemas for Portfolio
const SocialsSchema = z.object({
  github: z.string().url().optional().or(z.literal('')).default(''),
  linkedin: z.string().url().optional().or(z.literal('')).default(''),
  twitter: z.string().url().optional().or(z.literal('')).default(''),
  website: z.string().url().optional().or(z.literal('')).default(''),
}).default({});

const SkillSchema = z.object({
  name: z.string().min(1),
});

const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().url().optional().or(z.literal('')),
});

const CertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().min(1),
  url: z.string().url().optional().or(z.literal('')),
});

const AchievementSchema = z.object({
  description: z.string().min(1),
  date: z.string().optional().default(''),
});


export const PortfolioSchema = z.object({
  isPublic: z.boolean().default(false),
  displayName: z.string().min(1, 'Display name is required.'),
  bio: z.string().optional().default(''),
  location: z.string().optional().default(''),
  socials: SocialsSchema.optional(),
  skills: z.array(SkillSchema).optional().default([]),
  projects: z.array(ProjectSchema).optional().default([]),
  certifications: z.array(CertificationSchema).optional().default([]),
  achievements: z.array(AchievementSchema).optional().default([]),
});
export type Portfolio = z.infer<typeof PortfolioSchema>;

// Schema for Bookmarks
export const BookmarkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  type: z.enum(['interview', 'coding', 'note', 'other']),
  timestamp: z.number(),
});
export type Bookmark = z.infer<typeof BookmarkSchema>;

// Schema for History
export const HistoryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['resume', 'coding', 'interview', 'notes']),
  title: z.string(),
  timestamp: z.number(),
  content: z.any(),
});
export type HistoryItem = z.infer<typeof HistoryItemSchema>;

// Schema for Notes
export const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    timestamp: z.number(),
});
export type Note = z.infer<typeof NoteSchema>;

// Schema for the entire AppUser profile
export const AppUserSchema = z.object({
  uid: z.string(),
  email: z.string().email().nullable(),
  displayName: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  pomodoroSettings: z.object({
    pomodoro: z.number(),
    shortBreak: z.number(),
    longBreak: z.number(),
  }),
  portfolio: PortfolioSchema,
  history: z.array(HistoryItemSchema),
  notes: z.array(NoteSchema),
  bookmarks: z.array(BookmarkSchema),
});
export type AppUser = z.infer<typeof AppUserSchema>;
