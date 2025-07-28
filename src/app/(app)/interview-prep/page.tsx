// src/app/(app)/interview-prep/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InterviewQuestionInputSchema } from '@/ai/schemas';
import type { z } from 'zod';

type InterviewPrepFormValues = z.infer<typeof InterviewQuestionInputSchema>;

export default function InterviewPrepPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InterviewPrepFormValues>({
    resolver: zodResolver(InterviewQuestionInputSchema),
    defaultValues: {
      role: 'Senior Frontend Engineer',
      level: 'Senior',
      type: 'Technical',
    },
  });

  const handleStartInterview = async (values: InterviewPrepFormValues) => {
    setIsLoading(true);
    try {
      // In a real app, you would create a session and get an ID
      // For this demo, we'll just navigate to a hardcoded session ID
      toast({
        title: "Starting Interview...",
        description: "Good luck! You will be redirected shortly.",
      });
      router.push('/interview-prep/demo-session');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Starting Interview',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Interview Prep</h1>
        <p className="mt-2 text-muted-foreground">
          Configure your mock interview session to get started.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configure Your Mock Interview</CardTitle>
          <CardDescription>
            Tell the AI what kind of interview to conduct. This will start a new session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStartInterview)} className="space-y-6">
               <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Senior Frontend Engineer" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid md:grid-cols-2 gap-6">
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
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? <Loader2 className="animate-spin" /> : <>Start Mock Interview <ArrowRight className="ml-2"/></>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}
