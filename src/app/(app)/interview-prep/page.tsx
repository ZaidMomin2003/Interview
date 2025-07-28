// src/app/(app)/interview-prep/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Mic } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { addHistoryItem } from '@/services/firestore';
import { useAuth } from '@/hooks/use-auth';

const interviewPrepFormSchema = z.object({
  role: z.string().min(1, 'Please enter a role.'),
  level: z.enum(['Entry-Level', 'Mid-Level', 'Senior', 'Staff']),
  type: z.enum(['Technical', 'Behavioral']),
});

type InterviewPrepFormValues = z.infer<typeof interviewPrepFormSchema>;

export default function InterviewPrepPage() {
  const { user } = useAuth();
  const { generateInterviewQuestion } = useUserData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);

  const form = useForm<InterviewPrepFormValues>({
    resolver: zodResolver(interviewPrepFormSchema),
    defaultValues: {
      role: '',
      level: 'Mid-Level',
      type: 'Technical',
    },
  });

  const handleGenerateQuestion = async (values: InterviewPrepFormValues) => {
    setIsLoading(true);
    setQuestion(null);
    try {
      const result = await generateInterviewQuestion(values);
      setQuestion(result.question);
       if (user?.uid) {
         await addHistoryItem(user.uid, {
            type: 'interview',
            title: `Interview Question for ${values.role}`,
            content: result
        });
       }
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Prep</h1>
        <p className="mt-2 text-muted-foreground">
          Generate realistic interview questions and practice your responses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Your Mock Interview</CardTitle>
          <CardDescription>
            Tell the AI what kind of interview to conduct.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateQuestion)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Frontend Engineer" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="level" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seniority Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Entry-Level">Entry-Level</SelectItem>
                            <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                            <SelectItem value="Senior">Senior</SelectItem>
                             <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Technical">Technical</SelectItem>
                            <SelectItem value="Behavioral">Behavioral</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Generate Question</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || question) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Generated Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-lg font-semibold leading-relaxed text-foreground">{question}</p>
            )}

            <div className="text-center">
                <Button size="lg" className="rounded-full h-20 w-20">
                    <Mic className="h-8 w-8" />
                    <span className="sr-only">Start Recording</span>
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">Click to start recording your answer</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    