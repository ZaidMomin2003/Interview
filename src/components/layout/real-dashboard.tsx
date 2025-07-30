// src/components/layout/real-dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, CodeXml, FileText, ArrowRight, BrainCircuit, History, HelpCircle } from 'lucide-react';
import { ActivityChart, ReadinessChart } from '@/app/p/[userId]/charts';
import { format, subDays, formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUserData } from '@/hooks/use-user-data';
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
        if (!item.timestamp) return;
        const itemDate = new Date(item.timestamp);
        // Ensure date is valid before proceeding
        if (isNaN(itemDate.getTime())) return;
        
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

const quickStartActions = [
    { title: "Start Mock Interview", href: "/interview-prep", icon: <Bot className="h-5 w-5"/> },
    { title: "Begin Coding Session", href: "/coding-gym", icon: <CodeXml className="h-5 w-5" /> },
    { title: "Generate New Notes", href: "/notes", icon: <BrainCircuit className="h-5 w-5" /> }
];

const typeMap: Record<string, { label: string, color: string, href: string }> = {
    interview: { label: "Interview", color: "bg-blue-500/20 text-blue-300", href: "/interview-prep" },
    coding: { label: "Coding", color: "bg-purple-500/20 text-purple-300", href: "/coding-gym" },
    notes: { label: "Notes", color: "bg-yellow-500/20 text-yellow-300", href: "/notes" },
    resume: { label: "Resume", color: "bg-green-500/20 text-green-300", href: "/resume-studio" },
    other: { label: "Other", color: "bg-gray-500/20 text-gray-300", href: "/history" },
};


export default function RealDashboard() {
  const { profile } = useUserData();

  if (!profile) {
    return null; // or a loading skeleton
  }

  const { displayName, history } = profile;

  const interviewCount = history.filter(item => item.type === 'interview').length;
  const codingCount = history.filter(item => item.type === 'coding').length;
  const notesCount = history.filter(item => item.type === 'notes').length;

  const usageData = [
    { title: "AI Interviews", icon: <Bot className="text-primary" />, current: interviewCount, total: 40, color: "hsl(var(--primary))" },
    { title: "Coding Problems", icon: <CodeXml className="text-primary" />, current: codingCount, total: 160, color: "hsl(var(--primary))" },
    { title: "Notes Generated", icon: <FileText className="text-primary" />, current: notesCount, total: 100, color: "hsl(var(--primary))" },
  ];

  const activityData = getWeeklyActivity(history);
  const readiness = Math.min(100, Math.floor((codingCount * 1.5) + (interviewCount * 2.5)));
  
  const recentHistory = history.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {displayName}</h1>
        <p className="mt-1 text-muted-foreground">
          Here's your progress overview. Keep up the great work!
        </p>
      </div>
      
      {/* Readiness Card (Mobile Only) */}
       <Card className="bg-secondary/50 lg:hidden">
            <CardHeader className="text-center">
                <CardTitle>Interview Readiness</CardTitle>
                <CardDescription>Based on your recent performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <ReadinessChart percentage={readiness} />
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
            {/* Usage Stats */}
            <div className="grid gap-6 md:grid-cols-3">
                {usageData.map(item => (
                    <Card key={item.title} className="bg-secondary/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                            {item.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold">{item.current}<span className="text-base text-muted-foreground">/{item.total}</span></div>
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
                    <ActivityChart data={activityData} />
                </CardContent>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
             <Card className="bg-secondary/50 hidden lg:block">
                <CardHeader className="text-center">
                    <CardTitle>Interview Readiness</CardTitle>
                    <CardDescription>Based on your recent performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ReadinessChart percentage={readiness} />
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
        </div>
      </div>

       {/* Full-width Recent Activity Table */}
      <Card className="bg-secondary/50">
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" /> Recent Activity</CardTitle>
              <CardDescription>A log of your most recent sessions and generated content.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Activity</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {recentHistory.map((item, index) => {
                          const details = typeMap[item.type as keyof typeof typeMap] || typeMap.other;
                          const date = typeof item.timestamp === 'number' && !isNaN(new Date(item.timestamp).getTime()) ? new Date(item.timestamp) : null;
                          return (
                            <TableRow key={item.id || index}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={details.color}>{details.label}</Badge>
                                </TableCell>
                                <TableCell>
                                    {date ? formatDistanceToNow(date, { addSuffix: true }) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={details.href}>View</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                          )
                      })}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
    </div>
  );
}
