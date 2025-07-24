// All server actions are temporarily disabled to focus on core sync functionality.
"use server";

export async function handleGenerateResume(data: any) {
  console.warn("Resume generation is temporarily disabled.");
  return { resume: "Resume generation is temporarily disabled." };
}

export async function handleEnhanceResumeSection(data: any) {
    console.warn("Resume enhancement is temporarily disabled.");
    return { enhancedText: "Resume enhancement is temporarily disabled." };
}

export async function handleOptimizeResume(data: any) {
    console.warn("Resume optimization is temporarily disabled.");
    return { optimizedResume: "Resume optimization is temporarily disabled.", suggestions: "Suggestions are disabled." };
}

export async function handleGenerateCodingQuestion(data: any) {
    console.warn("Coding question generation is temporarily disabled.");
    return { questions: [] };
}

export async function handleGetCodeFeedback(data: any) {
    console.warn("Code feedback is temporarily disabled.");
    return { feedback: "Feedback is disabled.", improvements: "Improvements are disabled." };
}

export async function handleCalculateSalary(data: any) {
    console.warn("Salary calculation is temporarily disabled.");
    return { estimatedSalaryRange: "$0", reasoning: "Salary calculation is disabled." };
}

export async function handleGenerateNotes(data: any) {
    console.warn("Notes generation is temporarily disabled.");
    throw new Error("Notes generation is temporarily disabled.");
}

export async function conductInterview(data: any) {
    console.warn("Interview feature is temporarily disabled.");
    throw new Error("Interview feature is temporarily disabled.");
}

export async function summarizeInterview(data: any) {
    console.warn("Interview summary is temporarily disabled.");
    throw new Error("Interview summary is temporarily disabled.");
}
