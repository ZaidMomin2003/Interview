// src/app/(app)/dashboard/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AreaChart, BarChart3, Bot, FileText, History, Target } from 'lucide-react';
import Link from 'next/link';

const kpiData = [
    { title: "Total Sessions", value: "128", change: "+15.2%", icon: <AreaChart /> },
    { title: "Avg. Score", value: "88%", change: "+5.1%", icon: <Target /> },
    { title: "Questions Answered", value: "450", change: "+20.5%", icon: <BarChart3 /> },
    { title: "Resumes Optimized", value: "32", change: "+10.0%", icon: <FileText /> },
];

const quickLinks = [
    { href: "/interview-prep", title: "Start AI Interview", description: "Practice with our AI interviewer.", icon: <Bot /> },
    { href: "/resume-studio", title: "Optimize a Resume", description: "Analyze your resume against a job.", icon: <FileText /> },
    { href: "/coding-gym", title: "Go to Coding Gym", description: "Sharpen your coding skills.", icon: <BarChart3 /> },
    { href: "/history", title: "View History", description: "Review your past sessions.", icon: <History /> },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's an overview of your progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map(item => (
            <Card key={item.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <div className="text-muted-foreground">{item.icon}</div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-xs text-muted-foreground">{item.change} from last month</p>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Jump right back into your career prep.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {quickLinks.map(link => (
                    <Link key={link.href} href={link.href} className="block group">
                        <div className="flex items-center gap-4 p-4 rounded-lg border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                           <div className="p-3 bg-primary/20 text-primary rounded-full">
                                {link.icon}
                           </div>
                           <div>
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
                                <p className="text-sm text-muted-foreground">{link.description}</p>
                           </div>
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>A log of your most recent sessions.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* This can be populated with real data later */}
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">No recent activity yet.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    