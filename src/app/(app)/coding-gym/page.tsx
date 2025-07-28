// src/app/(app)/coding-gym/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const codingSessionSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  numberOfQuestions: z.coerce.number().min(1, 'At least one question is required.').max(10, 'Maximum of 10 questions.'),
});

type CodingSessionFormValues = z.infer<typeof codingSessionSchema>;

export default function CodingGymPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CodingSessionFormValues>({
    resolver: zodResolver(codingSessionSchema),
    defaultValues: {
      topic: 'Arrays',
      difficulty: 'Easy',
      numberOfQuestions: 3,
    },
  });

  const handleStartSession = async (values: CodingSessionFormValues) => {
    setIsLoading(true);
    try {
      // In a real app, you would create a session and get an ID
      // For this demo, we'll just navigate to a hardcoded session ID
      toast({
        title: "Starting Coding Session...",
        description: `Generating ${values.numberOfQuestions} ${values.difficulty} ${values.topic} questions.`,
      });
      router.push('/coding-gym/demo-session');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Starting Session',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding Gym</h1>
        <p className="mt-2 text-muted-foreground">
          Create a personalized practice session to sharpen your coding skills.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configure Your Practice Session</CardTitle>
          <CardDescription>
            Select your desired topic, difficulty, and number of questions to begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStartSession)} className="space-y-6">
              <FormField control={form.control} name="topic" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <Select onValuechange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
              <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="difficulty" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValuechange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
                 <FormField control={form.control} name="numberOfQuestions" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" max="10" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? <Loader2 className="animate-spin" /> : <>Start Practice Session <ArrowRight className="ml-2"/></>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
