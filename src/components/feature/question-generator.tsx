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
});

export function QuestionGenerator() {
  const [question, setQuestion] = useState<GenerateCodingQuestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addHistoryItem } = useUserData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillLevel: "",
      preferredLanguages: "",
      desiredTopics: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestion(null);
    try {
      const response = await handleGenerateCodingQuestion(values);
      setQuestion(response);
      addHistoryItem({
          id: `cq-${Date.now()}`,
          type: 'Coding Challenge',
          description: `Generated a question on "${response.topic}" (${response.difficulty}).`,
          timestamp: new Date(),
      });
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
    setQuestion(null);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="space-y-8">
      {!question && (
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
                  <div className="grid md:grid-cols-3 gap-4">
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
      
      {isLoading && !question && (
         <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {question && (
        <CodeEditorFeedback 
            question={question} 
            language={form.getValues('preferredLanguages').split(',')[0]?.trim() || 'javascript'}
            onNewQuestion={handleGenerateNew}
        />
      )}
    </div>
  );
}
