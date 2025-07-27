
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Video, CodeXml, CheckCircle } from "lucide-react";

const chartConfig = {
    questions: { label: "Questions Solved", color: "hsl(var(--primary))" },
    interviews: { label: "Interviews", color: "hsl(var(--accent))" },
};

export function PortfolioCharts({ dashboard }: { dashboard: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3 bg-secondary/50 border-border">
                <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={dashboard.weeklyProgress}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="fillPortfolioQuestions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <Area 
                                dataKey="questions" 
                                type="natural" 
                                fill="url(#fillPortfolioQuestions)"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                name="Questions"
                                dot={false}
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="bg-secondary/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboard.interviewsCompleted}</div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coding Questions Solved</CardTitle>
                    <CodeXml className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboard.codingQuestionsSolved}</div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MCQs Answered</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{dashboard.mcqsAnswered}</div>
                </CardContent>
            </Card>
        </div>
    );
}
