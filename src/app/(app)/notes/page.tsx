// src/app/(app)/notes/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, BookOpen, Wand2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  topic: z.string().min(2, { message: 'Please enter a topic to get notes on.' }),
  difficulty: z.string().min(1, { message: 'Please select a difficulty level.' }),
});

export default function NotesLandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: '', difficulty: 'intermediate' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    router.push(`/notes/${encodeURIComponent(values.topic)}?difficulty=${encodeURIComponent(values.difficulty)}`);
  }

  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
          <BookOpen className="w-8 h-8"/>
          AI-Generated Notes
        </h1>
        <p className="text-muted-foreground mt-2">Enter any technical topic, and our AI will generate comprehensive, easy-to-understand study notes for you.</p>
      </div>
      <Card className="max-w-2xl mx-auto bg-secondary/30">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2 text-primary">
            <Wand2 />
            Generate New Notes
          </CardTitle>
          <CardDescription>
            What do you want to learn about today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Big O Notation', 'React Hooks', 'System Design Basics'" {...field} />
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
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                    <>
                    Generate Notes <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
       <div className="text-center">
            <h3 className="text-xl font-headline mb-4">Or, browse some popular topics:</h3>
            <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" asChild><Link href="/notes/Data%20Structures">Data Structures</Link></Button>
                <Button variant="outline" asChild><Link href="/notes/Algorithms">Algorithms</Link></Button>
                <Button variant="outline" asChild><Link href="/notes/RESTful%20APIs">RESTful APIs</Link></Button>
                <Button variant="outline" asChild><Link href="/notes/Docker%20and%20Kubernetes">Docker & Kubernetes</Link></Button>
            </div>
        </div>
    </div>
  );
}
