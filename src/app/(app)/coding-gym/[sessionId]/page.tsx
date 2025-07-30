// src/app/(app)/coding-gym/[sessionId]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, ChevronLeft, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import type { CodingSession } from '@/ai/schemas';
import { getCodingSession, updateCodingSessionSolutions } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function CodingSessionPage({ params }: { params: { sessionId: string } }) {
    const { sessionId } = params;
    const router = useRouter();
    const { toast } = useToast();
    
    // `use` hook resolves the promise from the server action during render.
    const initialSession = use(getCodingSession(sessionId));

    const [session, setSession] = useState<CodingSession | null>(null);
    const [loading, setLoading] = useState(true); // Start with loading true until state is synced
    const [solutions, setSolutions] = useState<Record<string, string>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        // This effect runs after initial render to handle the session data or redirect.
        if (initialSession) {
            setSession(initialSession);
            const initialSolutions: Record<string, string> = {};
            initialSession.questions.forEach(q => {
                initialSolutions[q.id] = q.userSolution || '';
            });
            setSolutions(initialSolutions);
            setLoading(false);
        } else {
            // The session was not found. Redirect after render is complete.
            toast({ variant: 'destructive', title: 'Error', description: 'Coding session not found.' });
            router.push('/coding-gym');
        }
    }, [initialSession, router, toast]);

    const handleNextQuestion = () => {
        if (!session || currentQuestionIndex >= session.questions.length - 1) return;
        setCurrentQuestionIndex(prev => prev + 1);
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex <= 0) return;
        setCurrentQuestionIndex(prev => prev - 1);
    };

    const handleSolutionChange = (questionId: string, value: string) => {
        setSolutions(prev => ({ ...prev, [questionId]: value }));
    };

    const handleFinishSession = async () => {
        if (!session) return;
        setIsFinishing(true);
        try {
            await updateCodingSessionSolutions(session.id, solutions);
            toast({
                title: "Finishing Session...",
                description: "Saving your solutions. You will be redirected shortly."
            });
            router.push(`/coding-gym/${sessionId}/results`);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save your solutions.' });
            setIsFinishing(false);
        }
    };

    if (loading || !session) {
        return (
             <div className="space-y-6">
                <Card><CardHeader><Skeleton className="h-10 w-3/4" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader><CardContent><Skeleton className="h-96 w-full" /></CardContent></Card>
            </div>
        )
    }

    const currentQuestion = session.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">{currentQuestion.title}</CardTitle>
                            <CardDescription className="mt-1">
                                Question {currentQuestionIndex + 1} of {session.questions.length} | Difficulty: {session.difficulty}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" onClick={() => router.push('/coding-gym')}>End Session</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Progress value={progress} className="mb-6 h-2" />
                    <pre className="text-muted-foreground whitespace-pre-wrap font-sans">{currentQuestion.question}</pre>
                </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Your Solution</CardTitle>
                    <CardDescription>Write your code below. You can move between questions before finishing.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <Textarea
                        placeholder={currentQuestion.starter_code || "// Your JavaScript code here..."}
                        className="h-96 font-code text-sm resize-none bg-black/50"
                        value={solutions[currentQuestion.id] || ''}
                        onChange={(e) => handleSolutionChange(currentQuestion.id, e.target.value)}
                        disabled={isFinishing}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0 || isFinishing}>
                    <ChevronLeft className="mr-2" /> Previous Question
                </Button>

                {currentQuestionIndex < session.questions.length - 1 ? (
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
