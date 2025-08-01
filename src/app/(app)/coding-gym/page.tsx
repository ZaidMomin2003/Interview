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
import { Loader2, ArrowRight, BrainCircuit, CodeXml, GitCompareArrows } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/use-user-data';
import { CreateCodingSessionInputSchema } from '@/ai/schemas';
import { createCodingSession } from '@/ai/flows/create-coding-session-flow';

const codingSessionSchema = CreateCodingSessionInputSchema.omit({ userId: true });

type CodingSessionFormValues = z.infer<typeof codingSessionSchema>;


const FeatureListItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/20 text-primary rounded-lg mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);


export default function CodingGymPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useUserData();

  const form = useForm<CodingSessionFormValues>({
    resolver: zodResolver(codingSessionSchema),
    defaultValues: {
      topic: '',
      difficulty: 'Easy',
      numberOfQuestions: 3,
    },
  });

  const handleStartSession = async (values: CodingSessionFormValues) => {
    if (!profile) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to start a session.',
      });
      return;
    }
    setIsLoading(true);
    try {
      toast({
        title: "Building Your Session...",
        description: `Generating ${values.numberOfQuestions} ${values.difficulty} "${values.topic}" questions. This may take a moment.`,
      });
      const result = await createCodingSession({ ...values, userId: profile.uid });
      if (result.sessionId) {
        router.push(`/coding-gym/${result.sessionId}`);
      } else {
        throw new Error('Failed to create a session ID.');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded')) {
           toast({
            variant: 'destructive',
            title: 'AI Service Unavailable',
            description: 'The AI model is currently overloaded. Please wait a moment and try again.',
          });
      } else {
         toast({
          variant: 'destructive',
          title: 'Error Starting Session',
          description: errorMessage,
        });
      }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-12rem)]">
        {/* Left Side: Description */}
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">Coding Gym</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Flex your problem-solving muscles. Create a personalized practice session, solve real-world coding challenges, and get instant, AI-powered feedback.
                </p>
            </div>
            <div className="space-y-6">
                <FeatureListItem 
                    icon={<BrainCircuit className="h-6 w-6"/>} 
                    title="Personalized Challenges" 
                    description="Select your desired topic, difficulty, and number of questions to build a session that targets your weak spots."
                />
                <FeatureListItem 
                    icon={<CodeXml className="h-6 w-6"/>} 
                    title="AI Code Analysis" 
                    description="Our AI doesn't just check for correctness; it analyzes your code for efficiency, readability, and best practices."
                />
                <FeatureListItem 
                    icon={<GitCompareArrows className="h-6 w-6"/>} 
                    title="Optimal Solutions" 
                    description="Compare your solution side-by-side with an optimal one to understand different approaches and learn faster."
                />
            </div>
        </div>

      {/* Right Side: Form */}
      <Card className="max-w-2xl mx-auto w-full bg-secondary/30">
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
                      <FormLabel>Topic(s)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Arrays, Strings, Dynamic Programming" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <div className="grid md:grid-cols-2 gap-6">
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
