
// src/app/(app)/coding-gym/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateMCQ,
} from '@/ai/flows/generate-coding-question';
import type { MCQ, GenerateMCQInput } from '@/ai/types/coding-question-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  count: z.coerce.number().int().min(1).max(5),
});

function MCQCard({ mcq, index }: { mcq: MCQ, index: number }) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const isCorrect = selectedOption === mcq.answer;

    const getOptionClass = (option: string) => {
        if (!showAnswer) return '';
        if (option === mcq.answer) return 'bg-green-500/20 border-green-500';
        if (option === selectedOption && option !== mcq.answer) return 'bg-red-500/20 border-red-500';
        return '';
    };

    return (
         <Card>
            <CardHeader>
                <CardTitle>Question {index + 1}</CardTitle>
                <CardDescription className="text-lg text-foreground pt-2">{mcq.question}</CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    value={selectedOption || undefined}
                    onValueChange={(val) => {
                        setSelectedOption(val);
                        setShowAnswer(false);
                    }}
                    disabled={showAnswer}
                >
                    {mcq.options.map((option, i) => (
                        <FormItem
                            key={i}
                            className={cn("flex items-center space-x-3 space-y-0 p-4 rounded-lg border transition-all", getOptionClass(option))}
                        >
                            <FormControl>
                                <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal text-base w-full cursor-pointer">{option}</FormLabel>
                        </FormItem>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 <Button onClick={() => setShowAnswer(true)} disabled={!selectedOption || showAnswer}>
                    Check Answer
                </Button>
                {showAnswer && (
                    <div className="w-full p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-2 mb-2">
                             {isCorrect ? <CheckCircle className="text-green-500"/> : <XCircle className="text-red-500"/>}
                            <h4 className="font-semibold text-lg">{isCorrect ? "Correct!" : "Incorrect"}</h4>
                        </div>
                        <p className="text-muted-foreground"><span className="font-bold text-foreground">Correct Answer: </span>{mcq.answer}</p>
                        <Separator className="my-4"/>
                        <p className="text-muted-foreground"><span className="font-bold text-foreground">Explanation: </span>{mcq.explanation}</p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}


export default function CodingGymPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const { addHistoryItem } = useUserData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      difficulty: 'Medium',
      count: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestions([]);
    try {
      const result = await generateMCQ(values as GenerateMCQInput);
      setQuestions(result.questions);
      // Correctly add the count to the history item
      await addHistoryItem({
        type: 'MCQ Challenge',
        description: `Generated ${values.count} ${values.difficulty} MCQ(s) on ${values.topic}.`,
        count: values.count,
      });
      toast({
        title: "Success!",
        description: `Generated ${result.questions.length} questions.`,
      })
    } catch (error) {
      console.error('Error generating questions:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your questions. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Coding Gym</h1>
        <p className="text-muted-foreground mt-2">
          Sharpen your skills with AI-generated multiple choice questions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate MCQs</CardTitle>
          <CardDescription>
            Select a topic, difficulty, and number of questions to generate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., JavaScript, Data Structures, Networking" {...field} />
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
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number</FormLabel>
                     <Select onValueChange={(v) => field.onChange(parseInt(v, 10))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="md:col-start-4">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="bg-muted h-6 w-3/4 rounded-md animate-pulse"></CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="bg-muted h-10 w-full rounded-md animate-pulse"></div>
                    <div className="bg-muted h-10 w-full rounded-md animate-pulse"></div>
                    <div className="bg-muted h-10 w-full rounded-md animate-pulse"></div>
                    <div className="bg-muted h-10 w-full rounded-md animate-pulse"></div>
                 </CardContent>
            </Card>
        </div>
      )}


      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-headline">Generated Questions</h2>
            {questions.map((q, index) => (
                <MCQCard mcq={q} index={index} key={index} />
            ))}
        </div>
      )}
    </div>
  );
}
