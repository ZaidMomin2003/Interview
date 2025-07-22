// src/app/(app)/calculate-salary/page.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { handleCalculateSalary } from '@/lib/actions';
import { Loader2, DollarSign, BrainCircuit, ArrowRight, TrendingUp, Cpu } from 'lucide-react';
import { CalculateSalaryInput, CalculateSalaryOutput } from '@/ai/types/salary-types';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const formSchema = z.object({
  jobTitle: z.string().min(2, { message: 'Please enter a job title.' }),
  experienceLevel: z.string().min(1, { message: 'Please select an experience level.' }),
  location: z.string().min(2, { message: 'Please enter a location.' }),
  skills: z.string().min(2, { message: 'Please list some key skills.' }),
  companySize: z.string().min(1, { message: 'Please select a company size.' }),
});

export default function CalculateSalaryPage() {
  const [result, setResult] = useState<CalculateSalaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      experienceLevel: '',
      location: '',
      skills: '',
      companySize: '',
    },
  });

  async function onSubmit(values: CalculateSalaryInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleCalculateSalary(values);
      setResult(response);
      setFormSubmitted(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const renderContent = () => {
    if (formSubmitted && !user && !loading) {
      return <SignUpPrompt result={result} />;
    }
    
    if (result) {
      return <ResultDisplay result={result} />;
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <TrendingUp /> AI Salary Estimator
          </CardTitle>
          <CardDescription>
            Provide your details below, and our AI will estimate your potential salary based on market data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New York, NY or Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entry-level">Entry-level (0-2 years)</SelectItem>
                          <SelectItem value="mid-level">Mid-level (3-5 years)</SelectItem>
                          <SelectItem value="senior">Senior (6-9 years)</SelectItem>
                          <SelectItem value="staff-principal">Staff/Principal (10+ years)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                          <SelectItem value="mid-size">Mid-size (51-1000 employees)</SelectItem>
                          <SelectItem value="large-enterprise">Large Enterprise (1000+ employees)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Key Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., TypeScript, Go, Kubernetes, System Design" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate Salary <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
        {renderContent()}
    </div>
  )
}


function ResultDisplay({ result }: { result: CalculateSalaryOutput }) {
    return (
        <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50 duration-500">
             <CardHeader className="text-center items-center">
                <div className="p-4 bg-green-500/20 rounded-full w-fit">
                    <DollarSign className="h-12 w-12 text-green-400" />
                </div>
                <CardTitle className="font-headline text-5xl text-green-400 mt-4">{result.estimatedSalaryRange}</CardTitle>
                <CardDescription className="text-lg">
                    This is our AI's estimated salary range based on the information you provided.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Card className="bg-secondary/50">
                    <CardHeader>
                         <CardTitle className="font-headline text-xl flex items-center gap-2">
                            <BrainCircuit /> AI Reasoning
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{result.reasoning}</p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

function SignUpPrompt({ result }: { result: CalculateSalaryOutput | null }) {
    return (
        <Card className="w-full max-w-lg mx-auto text-center animate-in fade-in-50 duration-500">
            <CardHeader className="items-center">
                 <div className="p-4 bg-primary/20 rounded-full w-fit">
                    <Cpu className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Your Result is Ready!</CardTitle>
                <CardDescription>
                   {result ? `We've estimated a salary of ${result.estimatedSalaryRange}. ` : ''}
                   Create a free account to view the detailed breakdown and unlock all of our career tools.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button asChild size="lg" className="w-full">
                    <Link href="/signup">Sign Up to View <ArrowRight className="ml-2 h-4 w-4"/></Link>
                </Button>
                 <Button asChild variant="outline" className="w-full">
                    <Link href="/login">I already have an account</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
