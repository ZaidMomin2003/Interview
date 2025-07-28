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
import { Loader2, ArrowRight, BrainCircuit, BarChart, MessageSquareQuote, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InterviewQuestionInputSchema } from '@/ai/schemas';
import type { z } from 'zod';

type InterviewPrepFormValues = z.infer<typeof InterviewQuestionInputSchema>;

const FeatureListItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/20 text-primary rounded-lg mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


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
    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-12rem)]">
      {/* Left Side: Description */}
      <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">AI Interview Prep</h1>
            <p className="mt-4 text-lg text-muted-foreground">
             Step into a realistic mock interview simulation. Our AI will challenge you with relevant questions and provide instant, actionable feedback to help you land your dream job.
            </p>
        </div>
        <div className="space-y-6">
            <FeatureListItem 
                icon={<BrainCircuit className="h-6 w-6"/>} 
                title="Realistic Questions" 
                description="Face a mix of technical and behavioral questions tailored to your target role and seniority."
            />
             <FeatureListItem 
                icon={<MessageSquareQuote className="h-6 w-6"/>} 
                title="Instant Feedback" 
                description="Receive a detailed analysis of your answers, including clarity, pacing, and use of filler words."
            />
             <FeatureListItem 
                icon={<BarChart className="h-6 w-6"/>} 
                title="Performance Analytics" 
                description="Track your progress over time with a comprehensive performance dashboard."
            />
        </div>
      </div>
      
      {/* Right Side: Form */}
      <Card className="max-w-xl mx-auto w-full bg-secondary/30">
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
