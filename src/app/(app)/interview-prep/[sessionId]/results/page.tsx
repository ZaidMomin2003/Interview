// src/app/(app)/interview-prep/[sessionId]/results/page.tsx
"use client";

import { use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Repeat, Share2, MessageSquareQuote, Bot, BarChart, Smile, Frown } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const demoResults = {
    overallScore: 82,
    analytics: [
        { title: 'Clarity Score', value: '91%', description: 'You spoke clearly and concisely.' },
        { title: 'Filler Words', value: '4', description: 'Low use of "um", "ah", etc.' },
        { title: 'Pacing', value: 'Good', description: 'Your speech rate was optimal.' },
    ],
    feedback: [
        {
            question: 'Can you explain the difference between `let`, `const`, and `var` in JavaScript?',
            answer: "You correctly defined all three, but could have provided a stronger example for block-scoping with `let`.",
            suggestion: "When discussing `let`, show a code snippet with an `if` block or `for` loop to visually demonstrate how it differs from `var`'s function scope.",
            score: 85,
        },
        {
            question: 'Tell me about a time you had a conflict with a coworker.',
            answer: "You described the situation well using the STAR method. Your explanation of the resolution was clear and positive.",
            suggestion: "Great answer! To make it even better, you could briefly mention what you learned from the experience to prevent future conflicts.",
            score: 95,
        },
        {
            question: 'Walk me through your process for designing a scalable REST API endpoint.',
            answer: "Your answer covered the basics like choosing the right HTTP verb and status codes, but missed key aspects of scalability like rate limiting and caching.",
            suggestion: "Expand your answer to include considerations for performance and security. Mentioning database indexing, caching strategies (like Redis), and API security (authentication/authorization) would make this a senior-level answer.",
            score: 65,
        },
    ]
};

export default function InterviewResultsPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = use(params);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" className="mb-2">
                        <Link href="/interview-prep"><ArrowLeft className="mr-2"/> Back to Prep</Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Interview Results</h1>
                    <p className="mt-2 text-muted-foreground">
                        Here's the breakdown of your performance for session #{sessionId}.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Share2 className="mr-2"/> Share Results</Button>
                    <Button asChild>
                        <Link href="/interview-prep"><Repeat className="mr-2"/> Start New Interview</Link>
                    </Button>
                </div>
            </div>

            {/* Overall Score */}
            <Card>
                <CardHeader>
                    <CardTitle>Overall Performance Score</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="text-7xl font-bold text-primary">{demoResults.overallScore}%</div>
                    <Progress value={demoResults.overallScore} className="h-4" />
                    <p className="text-muted-foreground">This score is based on the clarity of your answers, technical accuracy, and communication skills.</p>
                </CardContent>
            </Card>

             {/* Analytics */}
             <div className="grid md:grid-cols-3 gap-6">
                {demoResults.analytics.map(item => (
                    <Card key={item.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                            <BarChart className="text-primary"/>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detailed Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle>Question by Question Breakdown</CardTitle>
                    <CardDescription>Review the AI's feedback on each of your answers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {demoResults.feedback.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-foreground">{item.question}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-primary">{item.score}%</span>
                                            {item.score >= 80 ? <Smile className="text-green-500"/> : <Frown className="text-yellow-500" />}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2 text-foreground mb-2"><MessageSquareQuote className="text-primary/80"/> Your Answer</h4>
                                        <p className="text-muted-foreground bg-secondary p-3 rounded-md">{item.answer}</p>
                                    </div>
                                     <div>
                                        <h4 className="font-semibold flex items-center gap-2 text-foreground mb-2"><Bot className="text-primary/80"/> AI Suggestion</h4>
                                        <p className="text-muted-foreground bg-secondary p-3 rounded-md">{item.suggestion}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
