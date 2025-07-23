"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateCodingQuestion } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { GenerateCodingQuestionOutput } from "@/ai/flows/generate-coding-question";
import { CodeEditorFeedback } from "./code-editor-feedback";
import { useUserData } from "@/hooks/use-user-data";

const formSchema = z.object({
  skillLevel: z.string().min(1, { message: "Please select a skill level." }),
  preferredLanguages: z.string().min(2, { message: "Please enter at least one language." }),
  desiredTopics: z.string().min(2, { message: "Please enter at least one topic." }),
  numberOfQuestions: z.coerce.number().int().min(1, "Must be at least 1.").max(5, "Cannot be more than 5."),
});

export function QuestionGenerator() {
  const [questions, setQuestions] = useState<GenerateCodingQuestionOutput['questions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillLevel: "intermediate",
      preferredLanguages: "TypeScript, Python",
      desiredTopics: "Data Structures",
      numberOfQuestions: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestions(null);
    try {
      const response = await handleGenerateCodingQuestion(values);
      if (response.questions && response.questions.length > 0) {
        setQuestions(response.questions);
        addHistoryItem({
            id: `cq-${Date.now()}`,
            type: 'Coding Challenge',
            description: `Generated ${response.questions.length} question(s) on "${response.questions[0].topic}".`,
            timestamp: new Date(),
        });
      } else {
        toast({
            variant: "destructive",
            title: "No questions generated",
            description: "The AI did not return any questions. Please try different topics.",
        });
      }
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
  
  const handleGenerateNew = () => {
    setQuestions(null);
    form.handleSubmit(onSubmit)();
  };
  
  const currentQuestion = questions ? questions[0] : null;

  return (
    <div className="space-y-8">
      {!currentQuestion && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generate a Coding Question</CardTitle>
              <CardDescription>
                Tell us your preferences, and our AI will generate a tailored coding challenge for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="skillLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your skill level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredLanguages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Languages</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., JavaScript, Python" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="desiredTopics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Topics</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Arrays, Hash Tables" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="numberOfQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Questions</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={5} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : "Generate Question"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
      )}
      
      {isLoading && !currentQuestion && (
         <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {currentQuestion && (
        <CodeEditorFeedback 
            question={currentQuestion} 
            language={form.getValues('preferredLanguages').split(',')[0]?.trim() || 'javascript'}
            onNewQuestion={handleGenerateNew}
        />
      )}
    </div>
  );
}
