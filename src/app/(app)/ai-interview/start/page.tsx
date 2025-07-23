// src/app/(app)/ai-interview/start/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Video, ArrowRight, PlusCircle, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

const interviewSetupSchema = z.object({
  topics: z.array(
    z.object({
      value: z.string().min(2, "Topic must be at least 2 characters long."),
    })
  ).optional(),
  difficulty: z.string().min(1, "Please select a difficulty level."),
});

export default function AiInterviewStartPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof interviewSetupSchema>>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: {
      topics: [{ value: "" }],
      difficulty: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "topics",
  });

  function onSubmit(values: z.infer<typeof interviewSetupSchema>) {
    setIsSubmitting(true);
    const topicParam = values.topics
      ?.map(t => t.value)
      .filter(Boolean) // Filter out empty strings
      .join(',') || 'General';

    const url = `/ai-interview?topic=${encodeURIComponent(topicParam)}&difficulty=${encodeURIComponent(values.difficulty)}`;
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
            Choose topics and difficulty to begin your practice session.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <FormLabel>Interview Topics</FormLabel>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                         <div key={field.id} className="flex items-center gap-2">
                           <FormField
                                control={form.control}
                                name={`topics.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormControl>
                                        <Input placeholder="e.g., System Design" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 1}
                                className={fields.length <= 1 ? "opacity-50 cursor-not-allowed" : "text-red-500"}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ value: "" })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Topic
                </Button>
              </FormItem>
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
