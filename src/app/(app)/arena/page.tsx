// src/app/(app)/arena/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { differenceInDays, format, addDays, isFuture, isToday, isPast as isPastDate } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { BrainCircuit, Code, MessageSquare, ArrowRight, Target, CalendarOff, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DailyTask {
    id: string;
    type: 'MCQ' | 'Coding' | 'Mock Interview';
    title: string;
    description: string;
    icon: React.ReactNode;
    action: string;
    href: string;
}

const generateTasks = (day: number): DailyTask[] => [
    {
        id: `day${day}-interview`,
        type: 'Mock Interview',
        title: 'Daily Stand-up & Mock Interview',
        description: 'Practice your communication and problem-solving skills under pressure.',
        icon: <MessageSquare className="h-6 w-6 text-purple-400" />,
        action: 'Start Interview',
        href: '/ai-interview',
    },
    {
        id: `day${day}-coding`,
        type: 'Coding' as const,
        title: `Day ${day} Coding Challenges`,
        description: 'Tackle your daily set of data structure or algorithm problems.',
        icon: <Code className="h-6 w-6 text-cyan-400" />,
        action: 'Go to Gym',
        href: '/coding-practice',
    },
    {
        id: `day${day}-mcq`,
        type: 'MCQ' as const,
        title: `Day ${day} MCQs`,
        description: 'Test your knowledge on core computer science concepts.',
        icon: <BrainCircuit className="h-6 w-6 text-amber-400" />,
        action: 'Start Quiz',
        href: '#', // Placeholder for MCQ feature
    },
];


export default function ArenaPage() {
    const { user } = useAuth();
    const [selectedDay, setSelectedDay] = useState<{ day: number; date: Date; tasks: DailyTask[] } | null>(null);
    const [showFutureDayWarning, setShowFutureDayWarning] = useState(false);

    const interviewDate = user?.interviewDate ? new Date(user.interviewDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    let daysUntilInterview: number | null = null;
    let prepDays: Date[] = [];

    if (interviewDate && (isFuture(interviewDate) || isToday(interviewDate))) {
        daysUntilInterview = differenceInDays(interviewDate, today);
        prepDays = Array.from({ length: daysUntilInterview + 1 }, (_, i) => addDays(today, i));
    }

    if (!interviewDate || isPastDate(interviewDate)) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[70vh] text-center">
                 <div className="p-6 bg-gray-800/50 border border-cyan-500/30 rounded-full mb-6">
                    <CalendarOff className="h-16 w-16 text-cyan-400" />
                </div>
                <h1 className="text-4xl font-bold font-headline">Set Your Target</h1>
                <p className="text-muted-foreground mt-4 max-w-md">
                    To generate your personalized training plan, please set a target interview date in your profile.
                </p>
                <Button asChild className="mt-8 bg-cyan-400 text-black hover:bg-cyan-300">
                    <Link href="/profile">Go to Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
        );
    }

    const handleDayClick = (dayIndex: number, date: Date) => {
        const isFutureDay = date > today;
        if (isFutureDay) {
            setShowFutureDayWarning(true);
        } else {
            setSelectedDay({
                day: dayIndex + 1,
                date,
                tasks: generateTasks(dayIndex + 1),
            });
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Interview Arena</h1>
                <p className="text-muted-foreground mt-2">
                    Your personalized {daysUntilInterview! + 1}-day plan to ace your interview for the <span className="text-cyan-400">{user?.targetRole || 'target role'}</span>.
                </p>
            </div>

            <Dialog open={!!selectedDay} onOpenChange={(isOpen) => !isOpen && setSelectedDay(null)}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {prepDays.map((date, index) => {
                        const isPast = date < today;
                        const isCurrentDay = isToday(date);
                        const isFutureDay = date > today;
                        return (
                             <Card
                                key={index}
                                onClick={() => handleDayClick(index, date)}
                                className={cn(
                                    "bg-gray-900/50 border border-cyan-500/30 transition-all duration-300 backdrop-blur-sm group text-center cursor-pointer",
                                    isCurrentDay && "border-2 border-cyan-400 shadow-cyan-400/20 shadow-lg",
                                    !isFutureDay && "hover:border-cyan-400 hover:-translate-y-1",
                                    isFutureDay && "bg-gray-800/20 border-gray-700/50 text-muted-foreground opacity-70 hover:opacity-100"
                                )}
                            >
                                <DialogTrigger asChild disabled={isFutureDay}>
                                    <div>
                                        <CardHeader className="p-4">
                                            <CardTitle className="font-headline text-xl">Day {index + 1}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{format(date, 'MMM d')}</p>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            {isPast && <CheckCircle2 className="mx-auto h-8 w-8 text-green-500" />}
                                            {isCurrentDay && <Target className="mx-auto h-8 w-8 text-cyan-400/70 transition-transform group-hover:scale-110" />}
                                            {isFutureDay && <Lock className="mx-auto h-8 w-8 text-gray-500" />}
                                        </CardContent>
                                    </div>
                                </DialogTrigger>
                            </Card>
                        );
                    })}
                </div>
                {selectedDay && (
                    <DialogContent className="max-w-2xl bg-gray-900 border-cyan-500/30 text-gray-200">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-headline text-cyan-400">
                                Day {selectedDay.day}: {format(selectedDay.date, 'EEEE, MMMM d')}
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[70vh] pr-4 -mr-4">
                            <div className="space-y-4 py-4">
                                {selectedDay.tasks.map((task) => (
                                    <Card key={task.id} className="bg-gray-800/50 border-gray-700/50">
                                        <CardContent className="p-4 flex items-center justify-between gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gray-900/70 border border-gray-600 rounded-lg">{task.icon}</div>
                                                <div>
                                                    <h4 className="font-bold text-gray-100">{task.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" asChild className="shrink-0 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black">
                                                <Link href={task.href}>
                                                    {task.action}
                                                    <ArrowRight className="ml-2 h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                )}
            </Dialog>

            <AlertDialog open={showFutureDayWarning} onOpenChange={setShowFutureDayWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Day Locked</AlertDialogTitle>
                        <AlertDialogDescription>
                            You must complete the tasks for the current day before proceeding to future days. Keep up the great work!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogAction onClick={() => setShowFutureDayWarning(false)}>Got it</AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
