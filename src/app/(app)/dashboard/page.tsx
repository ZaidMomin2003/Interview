// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight, Video, Target, CheckCircle, PercentCircle, BarChartHorizontalBig, Info } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar, LabelList, LineChart, Line, CartesianGrid } from "recharts";


// Placeholder data
const progressData = {
    interviewsCompleted: 3,
    codingQuestionsSolved: 42,
    mcqsAnswered: 128,
};

const weeklyProgress = [
  { name: "Week 1", questions: 10, interviews: 1 },
  { name: "Week 2", questions: 15, interviews: 1 },
  { name: "Week 3", questions: 12, interviews: 0 },
  { name: "Week 4", questions: 20, interviews: 1 },
];

const chartConfig = {
  questions: { label: "Questions Solved", color: "hsl(var(--primary))" },
  interviews: { label: "Interviews", color: "hsl(var(--accent))" },
};

const readinessData = [{ name: 'readiness', value: 78, fill: 'hsl(var(--primary))' }];

const topicsToImprove = [
    { name: "Dynamic Programming", area: "Algorithms" },
    { name: "System Design", area: "Concepts" },
    { name: "Concurrency", area: "Languages" },
];


export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName?.split(' ')[0] || 'developer';

  return (
    <div className="space-y-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            Welcome back, {displayName}
          </h1>
          <p className="text-muted-foreground mt-2">Here's your progress overview. Keep up the great work!</p>
        </div>

        {/* Main Grid Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                          <Video className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.interviewsCompleted}</div>
                          <p className="text-xs text-muted-foreground">+1 since last week</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Coding Questions Solved</CardTitle>
                          <CodeXml className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.codingQuestionsSolved}</div>
                          <p className="text-xs text-muted-foreground">+12 since last week</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">MCQs Answered</CardTitle>
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.mcqsAnswered}</div>
                           <p className="text-xs text-muted-foreground">92% accuracy</p>
                      </CardContent>
                  </Card>
              </div>
              
              {/* Weekly Progress */}
              <Card className="bg-secondary/30 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle>Weekly Progress</CardTitle>
                      <CardDescription>Your activity over the last 4 weeks.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart
                          accessibilityLayer
                          data={weeklyProgress}
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                           <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                          />
                          <Line
                            dataKey="questions"
                            type="natural"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{
                              fill: "hsl(var(--primary))",
                            }}
                            activeDot={{
                              r: 6,
                            }}
                          />
                           <Line
                            dataKey="interviews"
                            type="natural"
                            stroke="hsl(var(--accent))"
                            strokeWidth={2}
                            dot={{
                              fill: "hsl(var(--accent))",
                            }}
                            activeDot={{
                              r: 6,
                            }}
                          />
                        </LineChart>
                      </ChartContainer>
                  </CardContent>
              </Card>

              
          </div>

          {/* Right Column */}
          <div className="space-y-6">
               <Card className="bg-secondary/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Interview Readiness</CardTitle>
                  <CardDescription>Based on your recent performance.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-0">
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart 
                        data={readinessData} 
                        innerRadius="70%" 
                        outerRadius="100%" 
                        barSize={20}
                        startAngle={90}
                        endAngle={-270}
                    >
                        <RadialBar
                            minAngle={15}
                            background
                            dataKey='value'
                            cornerRadius={10}
                        />
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-4xl font-bold font-headline"
                        >
                            {readinessData[0].value}%
                        </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-secondary/30 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle>Topics to Improve</CardTitle>
                      <CardDescription>AI recommends focusing on these areas.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-3">
                          {topicsToImprove.map(topic => (
                               <div key={topic.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-accent/50 transition-colors">
                                  <div>
                                    <span className="font-medium">{topic.name}</span>
                                    <p className="text-xs text-muted-foreground">{topic.area}</p>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                      <Link href="/coding-practice">Practice <ArrowRight className="ml-1 h-3 w-3" /></Link>
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
