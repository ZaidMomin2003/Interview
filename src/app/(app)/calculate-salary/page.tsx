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
import { Loader2, DollarSign, BrainCircuit, ArrowRight, TrendingUp, Cpu, User, Mail } from 'lucide-react';
import { CalculateSalaryInput, CalculateSalaryOutput } from '@/ai/types/salary-types';
import Link from 'next/link';

const salaryFormSchema = z.object({
  jobTitle: z.string().min(2, { message: 'Please enter a job title.' }),
  experienceLevel: z.string().min(1, { message: 'Please select an experience level.' }),
  location: z.string().min(2, { message: 'Please enter a location.' }),
  skills: z.string().min(2, { message: 'Please list some key skills.' }),
  companySize: z.string().min(1, { message: 'Please select a company size.' }),
});

const leadFormSchema = z.object({
    name: z.string().min(2, { message: 'Please enter your name.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
});

type PageState = 'FORM' | 'LEAD_CAPTURE' | 'RESULT';

export default function CalculateSalaryPage() {
  const [result, setResult] = useState<CalculateSalaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState<PageState>('FORM');
  const { toast } = useToast();

  const salaryForm = useForm<z.infer<typeof salaryFormSchema>>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      jobTitle: '',
      experienceLevel: '',
      location: '',
      skills: '',
      companySize: '',
    },
  });
  
  const leadForm = useForm<z.infer<typeof leadFormSchema>>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: '', email: '' },
  });


  async function onSalarySubmit(values: CalculateSalaryInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleCalculateSalary(values);
      setResult(response);
      setPageState('LEAD_CAPTURE');
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

  function onLeadSubmit(values: z.infer<typeof leadFormSchema>) {
    console.log('Lead captured:', values); // In a real app, you'd send this to your CRM/backend
    toast({
        title: 'Thank you!',
        description: 'Here is your personalized salary estimation.'
    });
    setPageState('RESULT');
  }
  
  const renderContent = () => {
    switch (pageState) {
        case 'FORM':
            return <SalaryForm form={salaryForm} onSubmit={onSalarySubmit} isLoading={isLoading} />;
        case 'LEAD_CAPTURE':
            return <LeadCaptureForm form={leadForm} onSubmit={onLeadSubmit} result={result} />;
        case 'RESULT':
            return <ResultDisplay result={result!} />;
        default:
            return <SalaryForm form={salaryForm} onSubmit={onSalarySubmit} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
            <Cpu className="h-10 w-10 text-cyan-400" />
            <span className="font-headline text-4xl font-bold tracking-widest text-gray-100 uppercase">
              Talxify
            </span>
        </Link>
        <div className="w-full max-w-2xl">
            {renderContent()}
        </div>
    </div>
  );
}


function SalaryForm({ form, onSubmit, isLoading }: { form: any, onSubmit: (values: any) => void, isLoading: boolean }) {
    return (
        <Card className="w-full max-w-2xl mx-auto bg-gray-900/50 border border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline text-3xl flex items-center gap-2 text-cyan-400">
                    <TrendingUp /> AI Salary Estimator
                </CardTitle>
                <CardDescription>
                    Provide your details, and our AI will estimate your potential salary based on market data.
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
}

function LeadCaptureForm({ form, onSubmit, result }: { form: any, onSubmit: (values: any) => void, result: CalculateSalaryOutput | null }) {
    return (
        <Card className="w-full max-w-lg mx-auto text-center animate-in fade-in-50 duration-500 bg-gray-900/50 border border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="items-center">
                 <div className="p-4 bg-primary/20 rounded-full w-fit">
                    <Cpu className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Your Result is Ready!</CardTitle>
                <CardDescription>
                   {result ? `We've estimated a salary of ${result.estimatedSalaryRange}. ` : ''}
                   Enter your name and email to view the detailed breakdown.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center gap-2"><User className="h-4 w-4"/> Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ada Lovelace" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4"/> Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="ada@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" size="lg" className="w-full">
                            See My Salary <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}


function ResultDisplay({ result }: { result: CalculateSalaryOutput }) {
    return (
        <Card className="w-full max-w-2xl mx-auto animate-in fade-in-50 duration-500 bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm">
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
