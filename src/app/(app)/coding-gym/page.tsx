
// src/app/(app)/coding-gym/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateCodingQuestion,
} from '@/ai/flows/generate-coding-question';
import type { CodingQuestion, GenerateCodingQuestionInput } from '@/ai/types/coding-question-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';
import { marked } from 'marked';

const formSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  count: z.coerce.number().int().min(1).max(5),
});

export default function CodingGymPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const { addHistoryItem } = useUserData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      difficulty: 'Medium',
      count: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestions([]);
    try {
      const result = await generateCodingQuestion(values as GenerateCodingQuestionInput);
      setQuestions(result.questions);
      // Correctly add the count to the history item
      await addHistoryItem({
        type: 'Coding Challenge',
        description: `Generated ${values.count} ${values.difficulty} question(s) on ${values.topic}.`,
        count: values.count,
      });
      toast({
        title: "Success!",
        description: `Generated ${result.questions.length} questions.`,
      })
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your questions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Coding Gym</h1>
        <p className="text-muted-foreground mt-2">
          Sharpen your skills with AI-generated coding challenges tailored to your needs.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Questions</CardTitle>
          <CardDescription>
            Select a topic, difficulty, and number of questions to generate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Arrays, Recursion, System Design" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number</FormLabel>
                     <Select onValueChange={(v) => field.onChange(parseInt(v, 10))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="md:col-start-4">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="bg-muted h-6 w-3/4 rounded-md animate-pulse"></CardTitle>
                </CardHeader>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="bg-muted h-6 w-1/2 rounded-md animate-pulse"></CardTitle>
                </CardHeader>
            </Card>
        </div>
      )}


      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline">Generated Questions</h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {questions.map((q, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="bg-card border rounded-lg">
                <AccordionTrigger className="p-4 text-left text-lg hover:no-underline">
                  {`Question ${index + 1}: ${q.question.substring(0, 80)}...`}
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                  <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked(q.solution) }}></div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
