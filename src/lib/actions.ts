"use server";

import { z } from "zod";
import { generateResume, GenerateResumeInput } from "@/ai/flows/generate-resume";
import { optimizeResume, OptimizeResumeInput } from "@/ai/flows/optimize-resume";
import { generateCodingQuestion, GenerateCodingQuestionInput } from "@/ai/flows/generate-coding-question";
import { getCodeFeedback, GetCodeFeedbackInput } from "@/ai/flows/get-code-feedback";
import { calculateSalary } from "@/ai/flows/calculate-salary";
import { CalculateSalaryInput, CalculateSalaryInputSchema } from "@/ai/types/salary-types";
import { enhanceResumeSection, EnhanceResumeSectionInput } from "@/ai/flows/enhance-resume-section";
import { generateNotes, GenerateNotesInput } from "@/ai/flows/generate-notes";

const experienceSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().min(4, "End date is required"),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

const projectSchema = z.object({
    name: z.string().min(2, "Project name is required"),
    description: z.string().min(10, "Description is required"),
    technologies: z.string().min(2, "Technologies are required"),
    link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const educationSchema = z.object({
    institution: z.string().min(3, "Institution name is required"),
    degree: z.string().min(3, "Degree is required"),
    graduationDate: z.string().min(4, "Graduation date is required"),
});

const resumeGeneratorSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email(),
  phone: z.string().min(10, "Phone number is required."),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  summary: z.string().min(20, "Summary must be at least 20 characters."),
  experiences: z.array(experienceSchema).min(1, "At least one work experience is required."),
  projects: z.array(projectSchema).optional(),
  education: z.array(educationSchema).min(1, "At least one education entry is required."),
  skills: z.string().min(2, "Please list some skills."),
  desiredJob: z.string().min(3, "Desired job must be at least 3 characters."),
});


export async function handleGenerateResume(data: GenerateResumeInput) {
  const validatedFields = resumeGeneratorSchema.safeParse(data);

  if (!validatedFields.success) {
    // Construct a more detailed error message
    const errorMessages = validatedFields.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join('; ');
    throw new Error(`Invalid input: ${errorMessages}`);
  }

  try {
    const result = await generateResume(validatedFields.data);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate resume. Please try again.");
  }
}

const enhanceResumeSectionSchema = z.object({
  sectionType: z.string(),
  text: z.string().min(20, "Text must be at least 20 characters to enhance."),
});

export async function handleEnhanceResumeSection(data: EnhanceResumeSectionInput) {
    const validatedFields = enhanceResumeSectionSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid input for enhancement.");
    }

    try {
        const result = await enhanceResumeSection(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to enhance section. Please try again.");
    }
}

const resumeOptimizerSchema = z.object({
    resumeText: z.string().min(100, "Resume text must be at least 100 characters."),
    jobDescription: z.string().min(50, "Job description must be at least 50 characters."),
});

export async function handleOptimizeResume(data: OptimizeResumeInput) {
    const validatedFields = resumeOptimizerSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid input.");
    }

    try {
        const result = await optimizeResume(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to optimize resume. Please try again.");
    }
}


const questionGeneratorSchema = z.object({
    skillLevel: z.string().min(1, "Please select a skill level."),
    preferredLanguages: z.string().min(2, "Please enter preferred languages."),
    desiredTopics: z.string().min(2, "Please enter desired topics."),
});

export async function handleGenerateCodingQuestion(data: GenerateCodingQuestionInput) {
    const validatedFields = questionGeneratorSchema.safeParse(data);
    
    if (!validatedFields.success) {
        throw new Error("Invalid input.");
    }

    try {
        const result = await generateCodingQuestion(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to generate coding question. Please try again.");
    }
}

const codeFeedbackSchema = z.object({
    code: z.string().min(10, "Please enter at least 10 characters of code."),
    language: z.string().min(1, "Please specify the coding language."),
    problemDescription: z.string().min(10, "Please provide a problem description."),
});

export async function handleGetCodeFeedback(data: GetCodeFeedbackInput) {
    const validatedFields = codeFeedbackSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid input.");
    }

    try {
        const result = await getCodeFeedback(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get code feedback. Please try again.");
    }
}

export async function handleCalculateSalary(data: CalculateSalaryInput) {
    const validatedFields = CalculateSalaryInputSchema.safeParse(data);
    
    if (!validatedFields.success) {
        throw new Error("Invalid input.");
    }

    try {
        const result = await calculateSalary(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to calculate salary. Please try again.");
    }
}

const generateNotesSchema = z.object({
    topic: z.string().min(2, "Topic must be at least 2 characters."),
    difficulty: z.string().min(1, "Difficulty is required."),
});

export async function handleGenerateNotes(data: GenerateNotesInput) {
    const validatedFields = generateNotesSchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid input for generating notes.");
    }

    try {
        const result = await generateNotes(validatedFields.data);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to generate notes. Please try again.");
    }
}
