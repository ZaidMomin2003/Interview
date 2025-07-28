// src/app/(app)/history/page.tsx
"use client";

import { useUserData } from '@/hooks/use-user-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, BarChart3, FileText, StickyNote, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const typeMap = {
    interview: { icon: <Bot className="h-5 w-5" />, color: "bg-blue-500/20 text-blue-300", label: "AI Interview" },
    resume: { icon: <FileText className="h-5 w-5" />, color: "bg-green-500/20 text-green-300", label: "Resume Review" },
    coding: { icon: <BarChart3 className="h-5 w-5" />, color: "bg-purple-500/20 text-purple-300", label: "Coding Challenge" },
    notes: { icon: <StickyNote className="h-5 w-5" />, color: "bg-yellow-500/20 text-yellow-300", label: "Notes" },
    other: { icon: <HelpCircle className="h-5 w-5" />, color: "bg-gray-500/20 text-gray-300", label: "Other Activity" },
};

export default function HistoryPage() {
    const { profile, loading } = useUserData();
    const history = profile?.history || [];

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-grow space-y-2">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Session History</h1>
                <p className="mt-2 text-muted-foreground">
                    Review your past interactions and generated content.
                </p>
            </div>

            {history.length === 0 ? (
                <Card>
                    <CardContent className="p-10 text-center">
                        <p className="text-muted-foreground">You have no history yet. Start a session to see it here!</p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                           {history.map((item, index) => {
                                const details = typeMap[item.type as keyof typeof typeMap] || typeMap.other;
                                const date = item.timestamp ? new Date(item.timestamp) : null;
                                const isValidDate = date && !isNaN(date.getTime());
                                
                                return (
                                    <AccordionItem value={`item-${index}`} key={item.id}>
                                        <AccordionTrigger className="p-4 hover:no-underline hover:bg-secondary/50">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className={`p-2 rounded-full ${details.color}`}>{details.icon}</div>
                                                <div className="flex-grow text-left">
                                                    <p className="font-semibold text-foreground">{item.title}</p>
                                                    {isValidDate && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatDistanceToNow(date, { addSuffix: true })}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge variant="outline" className={details.color}>{details.label}</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="p-6 bg-black/30">
                                            <pre className="text-sm text-foreground whitespace-pre-wrap font-sans bg-secondary p-4 rounded-md">
                                                {JSON.stringify(item.content, null, 2)}
                                            </pre>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                           })}
                        </Accordion>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
