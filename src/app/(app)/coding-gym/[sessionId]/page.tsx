// src/app/(app)/coding-gym/[sessionId]/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const demoQuestions = [
    {
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.'
    },
    {
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.'
    },
    {
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        description: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.'
    },
];

export default function CodingSessionPage({ params }: { params: { sessionId: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [solution, setSolution] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < demoQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSolution(''); // Clear solution for next question
        }
    }
    
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            setSolution('');
        }
    }

    const handleFinishSession = () => {
        setIsFinishing(true);
        toast({
            title: "Finishing Session...",
            description: "Calculating your results. You will be redirected shortly."
        });
        // Simulate analysis delay
        setTimeout(() => {
            router.push(`/coding-gym/${params.sessionId}/results`);
        }, 2000);
    }
    
    const currentQuestion = demoQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / demoQuestions.length) * 100;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
                            <CardDescription className="mt-1">
                                Question {currentQuestionIndex + 1} of {demoQuestions.length} | Difficulty: {currentQuestion.difficulty}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" onClick={() => router.push('/coding-gym')}>End Session</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="mb-6 h-2" />
                    <p className="text-muted-foreground whitespace-pre-wrap">{currentQuestion.description}</p>
                </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Your Solution</CardTitle>
                    <CardDescription>Write your code below. You can move between questions before finishing.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <Textarea 
                        placeholder="// Your JavaScript code here..."
                        className="h-96 font-code text-sm resize-none bg-black/50"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        disabled={isFinishing}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0 || isFinishing}>
                    <ChevronLeft className="mr-2" /> Previous Question
                </Button>

                {currentQuestionIndex < demoQuestions.length - 1 ? (
                    <Button onClick={handleNextQuestion} disabled={isFinishing}>
                        Next Question <ChevronRight className="ml-2" />
                    </Button>
                ) : (
                    <Button onClick={handleFinishSession} disabled={isFinishing} className="bg-green-600 hover:bg-green-700">
                        {isFinishing ? (
                            <Loader2 className="mr-2 animate-spin" />
                        ) : (
                            <CheckCircle className="mr-2" />
                        )}
                        Finish & View Results
                    </Button>
                )}
            </div>
        </div>
    );
}
