// src/components/layout/real-dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, CodeXml, FileText, ArrowRight, BrainCircuit, History } from 'lucide-react';
import { ActivityChart, ReadinessChart } from '@/app/p/[userId]/charts';
import { format, subDays, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '../ui/skeleton';

// Static prototype data
const demoDisplayName = "Zaid";
const demoInterviewCount = 8;
const demoCodingCount = 27;
const demoNotesCount = 12;

const demoUsageData = [
  { title: "Interviews Usage", icon: <Bot className="text-primary" />, current: demoInterviewCount, total: 40, color: "hsl(var(--primary))" },
  { title: "Coding Questions", icon: <CodeXml className="text-primary" />, current: demoCodingCount, total: 160, color: "hsl(var(--primary))" },
  { title: "Notes Generations", icon: <FileText className="text-primary" />, current: demoNotesCount, total: 100, color: "hsl(var(--primary))" },
];

const getDemoWeeklyActivity = () => {
    const data: {day: string, Questions: number, Interviews: number, Notes: number}[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        data.push({
            day: format(date, 'E'),
            Questions: Math.floor(Math.random() * 5),
            Interviews: Math.floor(Math.random() * 2),
            Notes: Math.floor(Math.random() * 3),
        });
    }
    return data;
}

const demoActivityData = getDemoWeeklyActivity();
const demoReadiness = Math.min(100, Math.floor((demoCodingCount * 1.5) + (demoInterviewCount * 2.5)));

const quickStartActions = [
    { title: "Start Mock Interview", href: "/interview-prep", icon: <Bot className="h-5 w-5"/> },
    { title: "Begin Coding Session", href: "/coding-gym", icon: <CodeXml className="h-5 w-5" /> },
    { title: "Generate New Notes", href: "/notes", icon: <BrainCircuit className="h-5 w-5" /> }
];

const demoHistory = [
    { type: 'coding', title: 'Completed review for "Two Sum"', time: subDays(new Date(), 1) },
    { type: 'interview', title: 'Finished mock interview for "Frontend Role"', time: subDays(new Date(), 2) },
    { type: 'notes', title: 'Generated notes on "React Hooks"', time: subDays(new Date(), 3) },
];


export default function RealDashboard() {
  const { profile, loading } = useUserData();

  if (loading || !profile) {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/3" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/3" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/3" /></CardContent></Card>
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
                <Card className="lg:col-span-1"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent className="flex flex-col gap-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent></Card>
            </div>
        </div>
    );
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {profile.displayName}</h1>
        <p className="mt-1 text-muted-foreground">
          Here's your progress overview. Keep up the great work!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Usage Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                {demoUsageData.map(item => (
                    <Card key={item.title} className="bg-secondary/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{item.current}/{item.total}</div>
                            <p className="text-xs text-muted-foreground">Credits remaining for this cycle</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Activity Chart */}
            <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Daily Activity</CardTitle>
                    <CardDescription>Your activity over the last 7 days.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ActivityChart data={demoActivityData} />
                </CardContent>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
             <Card className="bg-secondary/50">
                <CardHeader className="text-center">
                    <CardTitle>Interview Readiness</CardTitle>
                    <CardDescription>Based on your recent performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReadinessChart percentage={demoReadiness} />
                </CardContent>
            </Card>
             <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle>Quick Start</CardTitle>
                    <CardDescription>Jump right back into action.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {quickStartActions.map(action => (
                        <Button asChild key={action.title} variant="outline" className="w-full justify-start">
                            <Link href={action.href}>
                                {action.icon}
                                <span>{action.title}</span>
                                <ArrowRight className="ml-auto h-4 w-4" />
                            </Link>
                        </Button>
                    ))}
                </CardContent>
            </Card>
             <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {demoHistory.map((item, index) => (
                           <li key={index} className="flex items-start gap-3">
                              <div className="mt-1 p-1.5 bg-primary/20 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{formatDistanceToNow(item.time, { addSuffix: true })}</p>
                              </div>
                           </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
