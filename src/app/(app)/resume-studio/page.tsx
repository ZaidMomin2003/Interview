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
import { addHistoryItem } from '@/services/firestore';
import { useAuth } from '@/hooks/use-auth';
import { ResumeReviewInputSchema, type ResumeReviewOutput } from '@/ai/schemas';
import type { z } from 'zod';

type ResumeReviewFormValues = z.infer<typeof ResumeReviewInputSchema>;

export default function ResumeStudioPage() {
  const { user } = useAuth();
  const { generateResumeReview } = useUserData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [review, setReview] = useState<ResumeReviewOutput | null>(null);

  const form = useForm<ResumeReviewFormValues>({
    resolver: zodResolver(ResumeReviewInputSchema),
  });

  const handleGenerateReview = async (values: ResumeReviewFormValues) => {
    setIsLoading(true);
    setReview(null);
    try {
      const result = await generateResumeReview(values);
      setReview(result);
       if (user?.uid) {
         await addHistoryItem(user.uid, {
            type: 'resume',
            title: `Resume Review (Score: ${result.score}%)`,
            content: result
        });
       }
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
          Optimize your resume against a job description with AI-powered feedback.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Paste your resume and the target job description to get instant feedback and a match score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateReview)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="resume" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste your full resume text here..." {...field} className="h-72 resize-none" disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="jobDescription" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the full job description here..." {...field} className="h-72 resize-none" disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Generate Feedback</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || review) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Feedback</CardTitle>
            <CardDescription>Here's how your resume stacks up.</CardDescription>
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
              review && <>
                <div>
                  <h3 className="text-lg font-semibold">Match Score: {review.score}%</h3>
                  <Progress value={review.score} className="mt-2" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Suggestions for Improvement</h3>
                  <div className="mt-2 p-4 bg-secondary rounded-md text-sm text-foreground whitespace-pre-wrap">{review.review}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
