// src/app/(app)/salary-calculator/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateSalary } from '@/ai/flows/calculate-salary';
import { CalculateSalaryInputSchema, CalculateSalaryOutput, CalculateSalaryInput } from '@/ai/types/salary-types';
import { marked } from 'marked';

export default function SalaryCalculatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CalculateSalaryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof CalculateSalaryInputSchema>>({
    resolver: zodResolver(CalculateSalaryInputSchema),
    defaultValues: {
      jobTitle: 'Software Engineer',
      experienceLevel: 'Mid-level',
      location: 'San Francisco, CA',
      skills: 'React, Node.js, TypeScript, AWS',
      companySize: 'Mid-size',
    },
  });

  async function onSubmit(values: CalculateSalaryInput) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await calculateSalary(values);
      setResult(response);
    } catch (error) {
      console.error('Error calculating salary:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem calculating the salary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Salary Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Estimate your market value with our AI-powered salary calculator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Details</CardTitle>
            <CardDescription>
              Provide your information to get a personalized salary estimate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Frontend Developer" {...field} />
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Entry-level">Entry-level</SelectItem>
                          <SelectItem value="Mid-level">Mid-level</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Staff/Principal">Staff/Principal</SelectItem>
                        </SelectContent>
                      </Select>
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
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Python, Django, PostgreSQL" {...field} />
                      </FormControl>
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
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Startup (1-50 employees)">Startup (1-50)</SelectItem>
                          <SelectItem value="Mid-size (51-500 employees)">Mid-size (51-500)</SelectItem>
                          <SelectItem value="Large (501+ employees)">Large (501+)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Calculate Salary
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp/> Salary Estimate</CardTitle>
            <CardDescription>
              Your estimated salary range will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4 text-center">
                 <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary"/>
                 <p className="text-muted-foreground">Calculating...</p>
              </div>
            )}
            {result ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm font-semibold text-primary">Estimated Annual Salary</p>
                    <p className="text-4xl font-bold text-foreground mt-2">{result.estimatedSalaryRange}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground mb-2">Reasoning:</h4>
                    <div className="prose prose-sm dark:prose-invert max-w-none"
                         dangerouslySetInnerHTML={{ __html: marked(result.reasoning) }}
                    />
                 </div>
              </div>
            ) : (
                !isLoading && <p className="text-center text-muted-foreground py-12">Results will be shown here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
