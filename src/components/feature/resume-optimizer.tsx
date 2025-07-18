"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleOptimizeResume } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { OptimizeResumeOutput } from "@/ai/flows/optimize-resume";

const formSchema = z.object({
  resumeText: z.string().min(100, { message: "Resume text must be at least 100 characters." }),
  jobDescription: z.string().min(50, { message: "Job description must be at least 50 characters." }),
});

export function ResumeOptimizer() {
  const [result, setResult] = useState<OptimizeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
      jobDescription: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleOptimizeResume(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Submit for Optimization</CardTitle>
          <CardDescription>
            Paste your current resume and the job description for the role you're targeting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="resumeText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Resume</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste your full resume text here..."
                          className="min-h-[300px] font-code"
                          {...field}
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
                      <FormLabel>Target Job Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the target job description here..."
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Optimizing...
                  </>
                ) : "Optimize My Resume"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )}

      {result && (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Optimized Resume</CardTitle>
                    <CardDescription>Here is the AI--tuned version of your resume.</CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="w-full bg-secondary p-4 rounded-md overflow-auto text-sm font-code whitespace-pre-wrap">
                        {result.optimizedResume}
                    </pre>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Suggestions for Improvement</CardTitle>
                    <CardDescription>Actionable advice to make your resume even better.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="prose prose-invert prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                        {result.suggestions}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
