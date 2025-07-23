// src/app/(app)/ai-interview/start/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Video, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const interviewSetupSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.string().min(1, "Please select a difficulty level."),
});

export default function AiInterviewStartPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof interviewSetupSchema>>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: {
      topic: "",
      difficulty: "",
    },
  });

  function onSubmit(values: z.infer<typeof interviewSetupSchema>) {
    setIsSubmitting(true);
    const url = `/ai-interview?topic=${encodeURIComponent(values.topic || 'General')}&difficulty=${encodeURIComponent(values.difficulty)}`;
    router.push(url);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
          <Video className="w-8 h-8"/>
          AI Mock Interview
        </h1>
        <p className="text-muted-foreground mt-2">Configure your practice session. The AI will tailor the questions to your choices.</p>
      </div>

      <Card className="max-w-2xl mx-auto bg-secondary/30">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Interview Setup</CardTitle>
          <CardDescription>
            Choose a topic and difficulty to begin your practice session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Topic (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., System Design, Behavioral, React Hooks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a difficulty..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entry-level">Entry-level / Intern</SelectItem>
                        <SelectItem value="mid-level">Mid-level</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="staff-principal">Staff / Principal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting...
                  </>
                 ) : (
                  <>
                    Start Interview <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                 )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
