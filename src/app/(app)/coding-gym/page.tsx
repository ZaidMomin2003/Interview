// src/app/(app)/coding-gym/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { CodingQuestionInputSchema, type CodingQuestionOutput } from '@/ai/schemas';
import type { z } from 'zod';

type CodingQuestionFormValues = z.infer<typeof CodingQuestionInputSchema>;

export default function CodingGymPage() {
  const { generateCodingQuestion, addHistoryItem } = useUserData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<CodingQuestionOutput | null>(null);
  const [solution, setSolution] = useState('');
  
  const form = useForm<CodingQuestionFormValues>({
    resolver: zodResolver(CodingQuestionInputSchema),
    defaultValues: {
      difficulty: 'Easy',
      topic: 'Arrays',
    },
  });

  const handleGenerateQuestion = async (values: CodingQuestionFormValues) => {
    setIsLoading(true);
    setQuestion(null);
    try {
      const result = await generateCodingQuestion(values);
      setQuestion(result);
      setSolution(result.starter_code);
      await addHistoryItem({
          type: 'coding',
          title: `Coding: ${result.title}`,
          content: result
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Question',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSolutionSubmit = async () => {
    // In a real app, this would send the solution for evaluation
    toast({
        title: "Solution Submitted!",
        description: "In a real application, we would evaluate your code. For now, great job practicing!",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding Gym</h1>
        <p className="mt-2 text-muted-foreground">
          Generate custom coding problems to sharpen your skills.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side: Form and Question */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Generate a Challenge</CardTitle>
                    <CardDescription>Select your desired topic and difficulty.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleGenerateQuestion)} className="space-y-4">
                            <FormField control={form.control} name="topic" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Topic</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="e.g., Arrays, Linked Lists, Trees" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Arrays">Arrays</SelectItem>
                                            <SelectItem value="Strings">Strings</SelectItem>
                                            <SelectItem value="Linked Lists">Linked Lists</SelectItem>
                                            <SelectItem value="Trees">Trees</SelectItem>
                                            <SelectItem value="Graphs">Graphs</SelectItem>
                                            <SelectItem value="Dynamic Programming">Dynamic Programming</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="difficulty" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Generate Problem</>}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {isLoading && (
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            )}

            {question && !isLoading && (
                 <Card>
                    <CardHeader>
                        <CardTitle>{question.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{question.question}</p>
                    </CardContent>
                </Card>
            )}
        </div>

        {/* Right Side: Code Editor */}
        <div className="space-y-6">
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Your Solution</CardTitle>
                    <CardDescription>Write your code below.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <Textarea 
                        placeholder="// Your code here..."
                        className="h-full font-code text-sm resize-none"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        disabled={!question || isLoading}
                    />
                </CardContent>
                <div className="p-6 pt-0">
                    <Button onClick={handleSolutionSubmit} disabled={!question || isLoading} className="w-full">
                        Submit Solution
                    </Button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
