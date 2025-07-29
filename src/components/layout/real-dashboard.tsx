// src/components/layout/real-dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, CodeXml, FileText, ArrowRight, User, BrainCircuit, Target, BookOpen } from 'lucide-react';
import { ActivityChart, ReadinessChart } from '@/app/p/[userId]/charts';
import { format, subDays } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

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

const demoTopics = [
    { title: 'Data Structures', level: 'Intermediate', href: '/coding-gym' },
    { title: 'System Design', level: 'Beginner', href: '/notes' },
    { title: 'Behavioral Questions', level: 'Advanced', href: '/interview-prep' },
]

export default function RealDashboard() {

  return (
    <div className="space-y-8 p-4 bg-transparent text-left">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {demoDisplayName}</h1>
        <p className="mt-1 text-muted-foreground">
          Here's your progress overview. Keep up the great work!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3 bg-secondary/50">
            <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Your activity over the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ActivityChart data={demoActivityData} />
            </CardContent>
        </Card>
        <div className="lg:col-span-2 space-y-6">
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
                    <CardTitle>Topics to Cover</CardTitle>
                    <CardDescription>Based on your bookmarked questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {demoTopics.map(topic => (
                        <div key={topic.title} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                            <div>
                                <h4 className="font-semibold text-foreground">{topic.title}</h4>
                                <Badge variant="outline" className="mt-1 text-xs">{topic.level}</Badge>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                                <Link href={topic.href}>Practice <ArrowRight className="ml-2 h-3 w-3"/></Link>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}