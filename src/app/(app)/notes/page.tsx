// src/app/(app)/notes/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotesInputSchema } from '@/ai/schemas';
import type { z } from 'zod';
import { useRouter } from 'next/navigation';

type NotesFormValues = z.infer<typeof NotesInputSchema>;

export default function NotesPage() {
  const { addNote } = useUserData();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NotesFormValues>({
    resolver: zodResolver(NotesInputSchema),
    defaultValues: {
      topic: 'React Hooks',
      difficulty: 'Intermediate',
    },
  });

  const handleGenerateNotes = async (values: NotesFormValues) => {
    setIsLoading(true);
    try {
      const noteId = await addNote(values);
      if (noteId) {
        toast({
          title: "Notes Generated!",
          description: "You are being redirected to your new note.",
        });
        router.push(`/notes/${noteId}`);
      } else {
        throw new Error("Failed to create and save the note.");
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error Generating Notes',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Note Generator</h1>
        <p className="mt-2 text-muted-foreground">
          Generate comprehensive, structured notes on any software development topic.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Note</CardTitle>
          <CardDescription>
            Enter a topic and select a difficulty to generate your study guide.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateNotes)} className="space-y-6">
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React State Management, CSS Grid" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="difficulty" render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? <Loader2 className="animate-spin" /> : <>Generate Notes <Wand2 className="ml-2"/></>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
