import { QuestionGenerator } from "@/components/feature/question-generator";

export default function CodingPracticePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Code & AI Feedback</h1>
        <p className="text-muted-foreground mt-2">Generate personalized coding questions and get AI feedback on your solutions.</p>
      </div>
      <QuestionGenerator />
    </div>
  );
}
