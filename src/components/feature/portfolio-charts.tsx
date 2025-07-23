// src/components/feature/portfolio-charts.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Video, CodeXml, CheckCircle } from 'lucide-react';

const chartConfig = {
  questions: {
    label: "Questions Solved",
    color: "hsl(var(--primary))",
  },
  interviews: {
    label: "Interviews",
    color: "hsl(var(--accent))",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];


interface DashboardData {
    interviewsCompleted: number;
    codingQuestionsSolved: number;
    mcqsAnswered: number;
    interviewReadiness: number;
    weeklyProgress: {
        name: string;
        questions: number;
        interviews: number;
    }[];
}

interface PortfolioChartsProps {
  dashboard: DashboardData;
}

export function PortfolioCharts({ dashboard }: PortfolioChartsProps) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-secondary/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Interviews Completed</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard.interviewsCompleted}</div>
                    </CardContent>
                </Card>
                <Card className="bg-secondary/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary">Coding Questions Solved</CardTitle>
                        <CodeXml className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard.codingQuestionsSolved}</div>
                    </CardContent>
                </Card>
                <Card className="bg-secondary/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-primary">MCQs Answered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{dashboard.mcqsAnswered}</div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Progress Chart */}
            <Card className="bg-secondary/50 border-border">
                <CardHeader>
                    <CardTitle className="text-primary">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <BarChart accessibilityLayer data={dashboard.weeklyProgress} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 6)} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="questions" fill="var(--color-questions)" radius={4} />
                            <Bar dataKey="interviews" fill="var(--color-interviews)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
