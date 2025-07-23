// src/components/feature/code-editor-feedback.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleGetCodeFeedback } from "@/lib/actions";
import { Loader2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GenerateCodingQuestionOutput } from "@/ai/flows/generate-coding-question";
import type { GetCodeFeedbackOutput } from "@/ai/flows/get-code-feedback";
import { useUserData } from "@/hooks/use-user-data";

const formSchema = z.object({
  code: z.string().min(10, { message: "Code must be at least 10 characters." }),
});

interface SingleQuestion {
    question: string;
    topic: string;
    difficulty: string;
}

interface CodeEditorFeedbackProps {
  question: SingleQuestion;
  language: string;
  onNewQuestion: () => void;
}

export function CodeEditorFeedback({ question, language, onNewQuestion }: CodeEditorFeedbackProps) {
  const [feedback, setFeedback] = useState<GetCodeFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addBookmark } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await handleGetCodeFeedback({
        ...values,
        language,
        problemDescription: question.question,
      });
      setFeedback(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleBookmark = () => {
    addBookmark({
      id: `cq-${question.topic}-${question.difficulty}`,
      type: 'coding-question',
      title: question.topic,
      description: `${question.difficulty} | ${question.question.substring(0, 100)}...`,
      href: '/coding-practice',
    });
    toast({
      title: "Question Bookmarked!",
      description: "You can find it in your bookmarks section."
    });
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <CardTitle className="font-headline text-2xl">{question.topic}</CardTitle>
              <CardDescription>
                {question.question}
              </CardDescription>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{question.difficulty}</Badge>
                <Button variant="ghost" size="icon" onClick={handleBookmark}>
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Bookmark Question</span>
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Solution</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`// Write your ${language} solution here...`}
                        className="min-h-[300px] font-code text-sm bg-secondary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Get Feedback"}
                </Button>
                 <Button type="button" variant="outline" onClick={onNewQuestion}>
                    Generate New Question
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}
      
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Feedback</CardTitle>
            <CardDescription>Here's an analysis of your code solution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg font-headline mb-2">Feedback</h3>
                <div className="prose prose-invert prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                    {feedback.feedback}
                </div>
            </div>
             <div>
                <h3 className="font-semibold text-lg font-headline mb-2">Suggested Improvements</h3>
                <pre className="w-full bg-secondary p-4 rounded-md overflow-auto text-sm font-code whitespace-pre-wrap">
                    {feedback.improvements}
                </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
