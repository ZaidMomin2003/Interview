// src/app/(app)/dashboard/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Bot, CodeXml, FileText, ArrowRight } from 'lucide-react';

const usageData = [
  { title: "Interviews Usage", icon: <Bot className="text-primary" />, current: 0, total: 10, color: "hsl(var(--primary))" },
  { title: "Coding Questions", icon: <CodeXml className="text-primary" />, current: 1, total: 60, color: "hsl(var(--primary))" },
  { title: "Notes Generations", icon: <FileText className="text-primary" />, current: 0, total: 30, color: "hsl(var(--primary))" },
];

const activityData = [
  { day: 'Tue', Questions: 0, Interviews: 0, Notes: 0 },
  { day: 'Wed', Questions: 0, Interviews: 0, Notes: 0 },
  { day: 'Thu', Questions: 0, Interviews: 0, Notes: 0 },
  { day: 'Fri', Questions: 0, Interviews: 0, Notes: 0 },
  { day: 'Sat', Questions: 0, Interviews: 0, Notes: 0 },
  { day: 'Sun', Questions: 0, Interviews: 0, Notes: 0 },
  { day: 'Mon', Questions: 1, Interviews: 0, Notes: 0 },
];

const topicsToImprove = [
    { name: "Data Structures", level: "Intermediate" },
    { name: "System Design", level: "Beginner" },
];

function InterviewReadinessChart() {
    const percentage = 1;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-card-foreground/10"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
                <circle
                    className="text-primary"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{percentage}%</span>
            </div>
        </div>
    );
}


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Zaid</h1>
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
            <CardContent className="h-[300px] w-full p-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                borderColor: 'hsl(var(--border))',
                                color: 'hsl(var(--foreground))'
                            }}
                        />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Line type="monotone" dataKey="Questions" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Interviews" stroke="hsl(var(--foreground) / 0.5)" strokeWidth={2} />
                        <Line type="monotone" dataKey="Notes" stroke="hsl(var(--muted-foreground))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader className="text-center">
                <CardTitle>Interview Readiness</CardTitle>
                <CardDescription>Based on your recent performance.</CardDescription>
            </CardHeader>
            <CardContent>
                <InterviewReadinessChart />
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
