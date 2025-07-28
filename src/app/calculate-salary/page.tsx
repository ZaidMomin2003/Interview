// src/app/calculate-salary/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { estimateSalary } from '@/ai/flows/estimate-salary-flow';
import { type EstimateSalaryOutput, EstimateSalaryInputSchema } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ChartContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const salaryFormSchema = EstimateSalaryInputSchema;

type SalaryFormValues = z.infer<typeof salaryFormSchema>;

export default function CalculateSalaryPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateSalaryOutput | null>(null);

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
  });

  const handleEstimateSalary = async (values: SalaryFormValues) => {
    setIsLoading(true);
    setResult(null);
    try {
      const estimation = await estimateSalary(values);
      setResult(estimation);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Estimating Salary',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = result ? [
    { name: '25th Percentile', salary: result.percentile25 },
    { name: 'Median (50th)', salary: result.median },
    { name: '75th Percentile', salary: result.percentile75 },
  ] : [];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
         <Button asChild variant="ghost">
            <Link href="/"><ArrowLeft className="mr-2"/> Back to Home</Link>
         </Button>
       </div>

      <div className="w-full max-w-4xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-center text-primary">Salary Estimator</h1>
          <p className="mt-2 text-muted-foreground text-center">
            Enter your details to get an AI-powered salary estimation.
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleEstimateSalary)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="experience" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="skills" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., React, Node.js, Python" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Estimate Salary</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {(isLoading || result) && (
          <Card>
            <CardHeader>
              <CardTitle>Salary Estimation Result</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                result && (
                  <div className="space-y-6">
                     <p className="text-lg text-muted-foreground">
                        Based on your inputs, the estimated salary range is between 
                        <strong className="text-primary"> ${result.percentile25.toLocaleString()} </strong> 
                        and 
                        <strong className="text-primary"> ${result.percentile75.toLocaleString()}</strong>,
                        with a median of 
                        <strong className="text-primary"> ${result.median.toLocaleString()}</strong>.
                    </p>
                    <div className="h-[300px] w-full">
                      <ChartContainer config={{}} className="w-full h-full">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                          <YAxis 
                            stroke="hsl(var(--muted-foreground))"
                            tickFormatter={(value) => `$${Number(value) / 1000}k`}
                          />
                          <Tooltip
                            cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="p-2 rounded-lg bg-secondary border border-border">
                                    <p className="font-semibold">{`${payload[0].payload.name}`}</p>
                                    <p className="text-primary">{`Salary: $${payload[0].value.toLocaleString()}`}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="salary" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ChartContainer>
                    </div>
                     <div>
                      <h3 className="font-semibold text-foreground mb-2">Rationale</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.rationale}</p>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
