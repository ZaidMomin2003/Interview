"use server";

import { z } from "zod";
import { generateResume, GenerateResumeInput } from "@/ai/flows/generate-resume";
import { optimizeResume, OptimizeResumeInput } from "@/ai/flows/optimize-resume";
import { generateCodingQuestion, GenerateCodingQuestionInput } from "@/ai/flows/generate-coding-question";
import { getCodeFeedback, GetCodeFeedbackInput } from "@/ai/flows/get-code-feedback";

const resumeGeneratorSchema = z.object({
  workExperience: z.string().min(50, "Please provide more details about your work experience."),
  desiredJob: z.string().min(3, "Please specify a desired job."),
});

export async function handleGenerateResume(data: GenerateResumeInput) {
  const validatedFields = resumeGeneratorSchema.safeParse(data);

  if (!validatedFields.success) {
    throw new Error("Invalid input.");
  }

  try {
    const result = await generateResume(validatedFields.data);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate resume. Please try again.");
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
