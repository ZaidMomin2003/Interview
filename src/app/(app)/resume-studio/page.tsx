// src/app/(app)/resume-studio/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ResumeReviewInputSchema, type ResumeReviewOutput } from '@/ai/schemas';
import type { z } from 'zod';

type ResumeFormValues = z.infer<typeof ResumeReviewInputSchema>;

export default function ResumeStudioPage() {
  const { addHistoryItem, generateResumeReview } = useUserData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeReviewOutput | null>(null);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(ResumeReviewInputSchema),
  });

  const handleGenerateReview = async (values: ResumeFormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const reviewResult = await generateResumeReview(values);
      setResult(reviewResult);
      await addHistoryItem({
        type: 'resume',
        title: `Resume Review (Score: ${reviewResult.score}%)`,
        content: reviewResult,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Review',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Studio</h1>
        <p className="mt-2 text-muted-foreground">
          Paste your resume and a job description to get AI-powered feedback.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resume Analyzer</CardTitle>
          <CardDescription>
            Our AI will analyze your resume against the job description to give you a match score and suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateReview)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Resume</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your full resume text here..."
                          className="h-72 resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the full job description here..."
                          className="h-72 resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Analyze Resume</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
            <CardDescription>Here's what the AI found.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              result && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold">Match Score: {result.score}%</h3>
                    <Progress value={result.score} className="mt-2" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Suggestions for Improvement</h3>
                    <div className="mt-2 p-4 bg-secondary rounded-md text-sm text-foreground whitespace-pre-wrap">{result.review}</div>
                  </div>
                </>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
