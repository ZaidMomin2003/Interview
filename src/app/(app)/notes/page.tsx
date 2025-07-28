// src/app/(app)/notes/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addHistoryItem } from '@/services/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { marked } from 'marked';

const notesFormSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  rawText: z.string().min(50, 'Please provide at least 50 characters of text to summarize.'),
});

type NotesFormValues = z.infer<typeof notesFormSchema>;

export default function NotesPage() {
  const { user } = useAuth();
  const { generateNotes } = useUserData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<string | null>(null);

  const form = useForm<NotesFormValues>({
    resolver: zodResolver(notesFormSchema),
    defaultValues: {
      topic: '',
      rawText: '',
    },
  });

  const handleGenerateNotes = async (values: NotesFormValues) => {
    setIsLoading(true);
    setGeneratedNotes(null);
    try {
      const result = await generateNotes(values);
      setGeneratedNotes(result.notes);
      if (user?.uid) {
        await addHistoryItem(user.uid, {
          type: 'notes',
          title: `Notes on: ${values.topic}`,
          content: result,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Notes',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Note Taker</h1>
        <p className="mt-2 text-muted-foreground">
          Paste in any text and get well-structured, summarized notes in Markdown.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Input Your Text</CardTitle>
            <CardDescription>Provide the raw text and a topic for your notes.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGenerateNotes)} className="space-y-4">
                <FormField control={form.control} name="topic" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <input {...field} className="w-full bg-secondary p-2 rounded-md" placeholder="e.g., React State Management" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="rawText" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raw Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your article, transcript, or any block of text here..."
                        className="h-64 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2"/> Generate Notes</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Notes</CardTitle>
            <CardDescription>Your summarized notes will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-6 w-1/3 mt-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
            {generatedNotes && !isLoading && (
              <div
                className="prose prose-invert prose-p:text-foreground prose-headings:text-primary prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground"
                dangerouslySetInnerHTML={{ __html: marked(generatedNotes) }}
              />
            )}
            {!generatedNotes && !isLoading && (
              <div className="text-center text-muted-foreground p-8">
                Your notes will be displayed here once generated.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    