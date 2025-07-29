// src/app/(app)/coding-gym/[sessionId]/results/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Repeat, Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/use-user-data';
import { getCodingSession, updateCodingSessionFeedback } from '@/services/firestore';
import type { CodingSession } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';


export default function CodingResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = use(params);
    const { toast } = useToast();
    const { addBookmark, generateCodingFeedback } = useUserData();
    const [session, setSession] = useState<CodingSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndAnalyze = async () => {
            setLoading(true);
            let fetchedSession = await getCodingSession(sessionId);

            if (!fetchedSession) {
                toast({ variant: 'destructive', title: "Error", description: "Session not found." });
                setLoading(false);
                return;
            }

            // Check if feedback is already generated
            const needsFeedback = fetchedSession.questions.some(q => q.userSolution && !q.feedback);

            if (needsFeedback) {
                toast({ title: "Analyzing Solutions...", description: "The AI is reviewing your code. This may take a moment." });
                try {
                    const feedbackPromises = fetchedSession.questions.map(async (q) => {
                        if (!q.userSolution || q.feedback) return q; // Skip if no solution or feedback exists
                        const feedback = await generateCodingFeedback({
                            questionTitle: q.title,
                            questionDescription: q.question,
                            userSolution: q.userSolution,
                        });
                        return { ...q, feedback };
                    });

                    const questionsWithFeedback = await Promise.all(feedbackPromises);
                    await updateCodingSessionFeedback(fetchedSession.id, questionsWithFeedback);
                    fetchedSession.questions = questionsWithFeedback; // Update local state
                    toast({ title: "Analysis Complete!", description: "AI feedback is now available." });

                } catch (error) {
                    toast({ variant: 'destructive', title: "Analysis Failed", description: "Could not generate AI feedback." });
                }
            }

            setSession(fetchedSession);
            setLoading(false);
        };

        fetchAndAnalyze();
    }, [sessionId, toast, generateCodingFeedback]);

    const handleBookmark = () => {
        addBookmark({
            type: 'coding-review',
            title: `Coding Review: Session #${sessionId.slice(0, 6)}...`,
            url: `/coding-gym/${sessionId}/results`
        });
        toast({
            title: "Review Bookmarked!",
            description: "You can find this session review in your bookmarks.",
        });
    };

    if (loading || !session) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-12 w-1/3" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" className="mb-2">
                        <Link href="/coding-gym"><ArrowLeft className="mr-2"/> Back to Gym</Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Coding Session Results</h1>
                    <p className="mt-2 text-muted-foreground">
                        Here's the breakdown of your performance for session #{sessionId.slice(0, 6)}...
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleBookmark}><Bookmark className="mr-2"/> Bookmark Review</Button>
                    <Button asChild>
                        <Link href="/coding-gym"><Repeat className="mr-2"/> Start New Session</Link>
                    </Button>
                </div>
            </div>

            {/* Detailed Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle>Question by Question Breakdown</CardTitle>
                    <CardDescription>Review the analysis for each problem you attempted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {session.questions.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <p className="font-semibold text-foreground text-lg">{item.title}</p>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                     {item.userSolution ? (
                                        <>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-foreground mb-2">Your Solution</h4>
                                                    <pre className="text-sm bg-secondary p-3 rounded-md font-code overflow-x-auto">
                                                        <code>{item.userSolution}</code>
                                                    </pre>
                                                </div>
                                                 <div>
                                                    <h4 className="font-semibold text-foreground mb-2">Suggested Solution</h4>
                                                    {item.feedback ? (
                                                        <pre className="text-sm bg-secondary p-3 rounded-md font-code overflow-x-auto">
                                                            <code>{item.feedback.suggestedSolution}</code>
                                                        </pre>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Generating...</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-2">AI Analysis</h4>
                                                 {item.feedback ? (
                                                    <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md whitespace-pre-wrap">{item.feedback.analysis}</p>
                                                 ) : (
                                                    <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" /> Generating...</div>
                                                 )}
                                            </div>
                                        </>
                                     ) : (
                                        <p className="text-muted-foreground text-center py-8">You did not provide a solution for this question.</p>
                                     )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
