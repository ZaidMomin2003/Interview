// src/app/(app)/resume-studio/page.tsx
"use client";

import { useState } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Bot, CodeXml, DollarSign, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { 
    ResumeReviewInputSchema, 
    InterviewQuestionInputSchema,
    CodingQuestionInputSchema,
    EstimateSalaryInputSchema,
    type ResumeReviewOutput,
    type InterviewQuestionOutput,
    type CodingQuestionOutput,
    type EstimateSalaryOutput
} from '@/ai/schemas';
import type { z } from 'zod';

type ResumeFormValues = z.infer<typeof ResumeReviewInputSchema>;
type InterviewFormValues = z.infer<typeof InterviewQuestionInputSchema>;
type CodingFormValues = z.infer<typeof CodingQuestionInputSchema>;
type SalaryFormValues = z.infer<typeof EstimateSalaryInputSchema>;

type ResultState = ResumeReviewOutput | InterviewQuestionOutput | CodingQuestionOutput | EstimateSalaryOutput | null;

// --- Forms ---
const ResumeForm = ({ form, isLoading }: { form: UseFormReturn<ResumeFormValues>, isLoading: boolean }) => (
    <div className="grid md:grid-cols-2 gap-6">
        <FormField control={form.control} name="resume" render={({ field }) => (
            <FormItem>
                <FormLabel>Your Resume</FormLabel>
                <FormControl><Textarea placeholder="Paste your full resume text here..." {...field} className="h-72 resize-none" disabled={isLoading}/></FormControl>
                <FormMessage />
            </FormItem>
        )} />
        <FormField control={form.control} name="jobDescription" render={({ field }) => (
            <FormItem>
                <FormLabel>Job Description</FormLabel>
                <FormControl><Textarea placeholder="Paste the full job description here..." {...field} className="h-72 resize-none" disabled={isLoading}/></FormControl>
                <FormMessage />
            </FormItem>
        )} />
    </div>
);

const InterviewForm = ({ form, isLoading }: { form: UseFormReturn<InterviewFormValues>, isLoading: boolean }) => (
    <div className="space-y-6 max-w-lg mx-auto">
        <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem><FormLabel>Target Role</FormLabel><FormControl><Input placeholder="e.g., Senior Frontend Engineer" {...field} disabled={isLoading} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-6">
             <FormField control={form.control} name="level" render={({ field }) => (
                <FormItem><FormLabel>Seniority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Entry-Level">Entry-Level</SelectItem><SelectItem value="Mid-Level">Mid-Level</SelectItem><SelectItem value="Senior">Senior</SelectItem><SelectItem value="Staff">Staff</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Technical">Technical</SelectItem><SelectItem value="Behavioral">Behavioral</SelectItem></SelectContent></Select><FormMessage /></FormItem>
            )} />
        </div>
    </div>
);

const CodingForm = ({ form, isLoading }: { form: UseFormReturn<CodingFormValues>, isLoading: boolean }) => (
     <div className="space-y-6 max-w-lg mx-auto">
        <FormField control={form.control} name="topic" render={({ field }) => (
            <FormItem><FormLabel>Topic</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}><FormControl><SelectTrigger><SelectValue placeholder="e.g., Arrays, Linked Lists" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Arrays">Arrays</SelectItem><SelectItem value="Strings">Strings</SelectItem><SelectItem value="Linked Lists">Linked Lists</SelectItem><SelectItem value="Trees">Trees</SelectItem><SelectItem value="Graphs">Graphs</SelectItem></SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="difficulty" render={({ field }) => (
            <FormItem><FormLabel>Difficulty</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select><FormMessage /></FormItem>
        )} />
    </div>
);

const SalaryForm = ({ form, isLoading }: { form: UseFormReturn<SalaryFormValues>, isLoading: boolean }) => (
     <div className="space-y-6 max-w-lg mx-auto">
        <FormField control={form.control} name="role" render={({ field }) => (
          <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="experience" render={({ field }) => (
          <FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="skills" render={({ field }) => (
          <FormItem><FormLabel>Top Skills</FormLabel><FormControl><Input placeholder="e.g., React, Node.js, Python" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
         <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., San Francisco, CA" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
    </div>
);


// --- Result Displays ---
const ResumeResult = ({ result }: { result: ResumeReviewOutput }) => (
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
);

const InterviewResult = ({ result }: { result: InterviewQuestionOutput }) => (
    <div className="p-4 bg-secondary rounded-md text-foreground whitespace-pre-wrap">{result.question}</div>
);

const CodingResult = ({ result }: { result: CodingQuestionOutput }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold">{result.title}</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{result.question}</p>
        <div>
            <h4 className="font-semibold mb-2">Starter Code (JavaScript)</h4>
            <pre className="p-4 bg-black/50 rounded-md font-code text-sm overflow-x-auto"><code>{result.starter_code}</code></pre>
        </div>
    </div>
);

const SalaryResult = ({ result }: { result: EstimateSalaryOutput }) => {
    const chartData = [
        { name: '25th Percentile', salary: result.percentile25 },
        { name: 'Median (50th)', salary: result.median },
        { name: '75th Percentile', salary: result.percentile75 },
    ];
    return (
        <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
                Estimated salary range is between <strong className="text-primary">${result.percentile25.toLocaleString()}</strong> and <strong className="text-primary">${result.percentile75.toLocaleString()}</strong>, with a median of <strong className="text-primary">${result.median.toLocaleString()}</strong>.
            </p>
            <div className="h-[300px] w-full">
                <ChartContainer config={{}} className="w-full h-full">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <Tooltip cursor={{ fill: 'hsl(var(--primary) / 0.1)' }} content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        return (
                            <div className="p-2 rounded-lg bg-secondary border border-border"><p className="font-semibold">{`${payload[0].payload.name}`}</p><p className="text-primary">{`Salary: $${payload[0].value.toLocaleString()}`}</p></div>
                        );
                        }
                        return null;
                    }} />
                    <Bar dataKey="salary" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ChartContainer>
            </div>
            <div>
                <h3 className="font-semibold text-foreground mb-2">Rationale</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.rationale}</p>
            </div>
        </div>
    );
};


export default function ResumeStudioPage() {
  const { addHistoryItem, generateResumeReview, generateCodingQuestion, generateInterviewQuestion, estimateSalary } = useUserData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultState>(null);
  const [currentTab, setCurrentTab] = useState("resume");

  const formResume = useForm<ResumeFormValues>({ resolver: zodResolver(ResumeReviewInputSchema) });
  const formInterview = useForm<InterviewFormValues>({ resolver: zodResolver(InterviewQuestionInputSchema), defaultValues: { level: 'Mid-Level', type: 'Technical' } });
  const formCoding = useForm<CodingFormValues>({ resolver: zodResolver(CodingQuestionInputSchema), defaultValues: { topic: 'Arrays', difficulty: 'Medium' }});
  const formSalary = useForm<SalaryFormValues>({ resolver: zodResolver(EstimateSalaryInputSchema) });

  const handleGenerate = async (values: any) => {
    setIsLoading(true);
    setResult(null);
    try {
      let generationResult;
      let historyItem;
      switch(currentTab) {
        case 'resume':
          generationResult = await generateResumeReview(values);
          historyItem = { type: 'resume', title: `Resume Review (Score: ${generationResult.score}%)`, content: generationResult };
          break;
        case 'interview':
          generationResult = await generateInterviewQuestion(values);
          historyItem = { type: 'interview', title: `Generated ${values.type} question`, content: generationResult };
          break;
        case 'coding':
          generationResult = await generateCodingQuestion(values);
          historyItem = { type: 'coding', title: `Generated ${values.difficulty} ${values.topic} question`, content: generationResult };
          break;
        case 'salary':
          generationResult = await estimateSalary(values);
          historyItem = { type: 'other', title: `Salary estimate for ${values.role}`, content: generationResult };
          break;
      }
      setResult(generationResult);
      if(historyItem) {
          await addHistoryItem(historyItem as any);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Result',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const forms: { [key: string]: UseFormReturn<any> } = {
    resume: formResume,
    interview: formInterview,
    coding: formCoding,
    salary: formSalary,
  };

  const currentForm = forms[currentTab];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Career Studio</h1>
        <p className="mt-2 text-muted-foreground">
          Your all-in-one hub for career preparation. Generate feedback, questions, and insights.
        </p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="resume"><FileText className="mr-2"/>Resume Review</TabsTrigger>
          <TabsTrigger value="interview"><Bot className="mr-2"/>Interview Q's</TabsTrigger>
          <TabsTrigger value="coding"><CodeXml className="mr-2"/>Coding Challenge</TabsTrigger>
          <TabsTrigger value="salary"><DollarSign className="mr-2"/>Salary Estimate</TabsTrigger>
        </TabsList>
        
        <Card className="mt-4">
            <CardContent className="p-6">
                <Form {...currentForm}>
                    <form onSubmit={currentForm.handleSubmit(handleGenerate)} className="space-y-6">
                        {currentTab === 'resume' && <ResumeForm form={formResume} isLoading={isLoading} />}
                        {currentTab === 'interview' && <InterviewForm form={formInterview} isLoading={isLoading} />}
                        {currentTab === 'coding' && <CodingForm form={formCoding} isLoading={isLoading} />}
                        {currentTab === 'salary' && <SalaryForm form={formSalary} isLoading={isLoading} />}
                        
                        <Button type="submit" disabled={isLoading} className="w-full max-w-md mx-auto flex">
                            {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Generate</>}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

      </Tabs>


      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Output</CardTitle>
            <CardDescription>Here's what the AI generated for you.</CardDescription>
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
              result && <>
                {currentTab === 'resume' && <ResumeResult result={result as ResumeReviewOutput}/>}
                {currentTab === 'interview' && <InterviewResult result={result as InterviewQuestionOutput}/>}
                {currentTab === 'coding' && <CodingResult result={result as CodingQuestionOutput}/>}
                {currentTab === 'salary' && <SalaryResult result={result as EstimateSalaryOutput}/>}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
