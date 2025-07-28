// src/app/(app)/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, CodeXml, FileText, ArrowRight } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';
import { ActivityChart, ReadinessChart } from '../p/[userId]/charts';
import { format, subDays } from 'date-fns';
import type { HistoryItem } from '@/ai/schemas';

const getWeeklyActivity = (history: HistoryItem[]) => {
    const activityMap = new Map<string, { Questions: number, Interviews: number, Notes: number }>();
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const day = format(date, 'E');
        activityMap.set(day, { Questions: 0, Interviews: 0, Notes: 0 });
    }

    history.forEach(item => {
        const itemDate = new Date(item.timestamp);
        const dayDiff = (today.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (dayDiff < 7 && dayDiff >= 0) {
            const day = format(itemDate, 'E');
            const dayActivity = activityMap.get(day);
            if (dayActivity) {
                if (item.type === 'coding') dayActivity.Questions++;
                if (item.type === 'interview') dayActivity.Interviews++;
                if (item.type === 'notes') dayActivity.Notes++;
            }
        }
    });
    
    return Array.from(activityMap.entries()).map(([day, counts]) => ({ day, ...counts }));
};

const topicsToImprove = [
    { name: "Data Structures", level: "Intermediate" },
    { name: "System Design", level: "Beginner" },
];

export default function DashboardPage() {
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
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <Card className="lg:col-span-3"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
                <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent className="flex justify-center"><Skeleton className="h-48 w-48 rounded-full" /></CardContent></Card>
            </div>
             <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent></Card>
        </div>
    );
  }
  
  const { history, displayName } = profile;
  
  const interviewCount = history.filter(item => item.type === 'interview').length;
  const codingCount = history.filter(item => item.type === 'coding').length;
  const notesCount = history.filter(item => item.type === 'notes').length;

  const usageData = [
    { title: "Interviews Usage", icon: <Bot className="text-primary" />, current: interviewCount, total: 10, color: "hsl(var(--primary))" },
    { title: "Coding Questions", icon: <CodeXml className="text-primary" />, current: codingCount, total: 60, color: "hsl(var(--primary))" },
    { title: "Notes Generations", icon: <FileText className="text-primary" />, current: notesCount, total: 30, color: "hsl(var(--primary))" },
  ];
  
  const activityData = getWeeklyActivity(history);
  const readiness = Math.min(100, Math.floor((codingCount * 1.5) + (interviewCount * 2.5)));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {displayName}</h1>
        <p className="mt-1 text-muted-foreground">
          Here's your progress overview. Keep up the great work!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {usageData.map(item => (
            <Card key={item.title}>
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Your activity over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ActivityChart data={activityData} />
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader className="text-center">
                <CardTitle>Interview Readiness</CardTitle>
                <CardDescription>Based on your recent performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <ReadinessChart percentage={readiness} />
            </CardContent>
        </Card>
      </div>

       <Card>
            <CardHeader>
                <CardTitle>Topics to Improve</CardTitle>
                <CardDescription>Based on your bookmarked questions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {topicsToImprove.map(topic => (
                    <div key={topic.name} className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                       <div>
                           <h3 className="font-semibold text-foreground">{topic.name}</h3>
                           <p className="text-sm text-muted-foreground">{topic.level}</p>
                       </div>
                       <Button variant="ghost" asChild>
                           <a href="#">Practice <ArrowRight className="ml-2 h-4 w-4" /></a>
                       </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
  );
}
