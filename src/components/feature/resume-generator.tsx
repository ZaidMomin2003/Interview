"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateResume } from "@/lib/actions";
import { Loader2, Copy, Check } from "lucide-react";
import { GenerateResumeOutput } from "@/ai/flows/generate-resume";

const formSchema = z.object({
  workExperience: z.string().min(50, {
    message: "Work experience must be at least 50 characters.",
  }),
  desiredJob: z.string().min(3, {
    message: "Desired job must be at least 3 characters.",
  }),
});

export function ResumeGenerator() {
  const [result, setResult] = useState<GenerateResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workExperience: "",
      desiredJob: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleGenerateResume(values);
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

  const handleCopy = () => {
    if (result?.resume) {
      navigator.clipboard.writeText(result.resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Provide Your Details</CardTitle>
          <CardDescription>
            Fill in the form below with your professional background and career goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="workExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your past roles, responsibilities, and achievements..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredJob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Resume"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Generated Resume</CardTitle>
          <CardDescription>
            Your AI-crafted resume will appear here. Review and copy it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
            </div>
          )}
          {result?.resume && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <pre className="w-full h-full bg-secondary p-4 rounded-md overflow-auto text-sm font-code whitespace-pre-wrap">
                {result.resume}
              </pre>
            </>
          )}
          {!isLoading && !result && (
             <div className="flex items-center justify-center h-full text-muted-foreground">
                Your resume will be displayed here.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
