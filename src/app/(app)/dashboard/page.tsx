// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight, Video, Target, CheckCircle, PercentCircle, BarChartHorizontalBig, Info, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar, LabelList, LineChart, Line, CartesianGrid } from "recharts";


// Placeholder data
const progressData = {
    interviews: { used: 3, total: 10 },
    codingQuestions: { used: 42, total: 60 },
    notes: { used: 12, total: 30 },
};

const dailyActivity = [
  { day: "Mon", questions: 4, interviews: 1, notes: 2 },
  { day: "Tue", questions: 3, interviews: 0, notes: 3 },
  { day: "Wed", questions: 6, interviews: 0, notes: 1 },
  { day: "Thu", questions: 5, interviews: 1, notes: 4 },
  { day: "Fri", questions: 8, interviews: 0, notes: 2 },
  { day: "Sat", questions: 2, interviews: 0, notes: 1 },
  { day: "Sun", questions: 10, interviews: 1, notes: 5 },
];

const chartConfig = {
  questions: { label: "Questions", color: "hsl(var(--primary))" },
  interviews: { label: "Interviews", color: "hsl(var(--accent))" },
  notes: { label: "Notes", color: "hsl(var(--foreground))" },
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
                          <CardTitle className="text-sm font-medium">Interviews Usage</CardTitle>
                          <Video className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.interviews.used} / {progressData.interviews.total}</div>
                          <p className="text-xs text-muted-foreground">Credits remaining for this cycle</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Coding Questions Usage</CardTitle>
                          <CodeXml className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.codingQuestions.used} / {progressData.codingQuestions.total}</div>
                          <p className="text-xs text-muted-foreground">Credits remaining for this cycle</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Notes Generations</CardTitle>
                          <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.notes.used} / {progressData.notes.total}</div>
                           <p className="text-xs text-muted-foreground">Credits remaining for this cycle</p>
                      </CardContent>
                  </Card>
              </div>
              
              {/* Daily Activity */}
              <Card className="bg-secondary/30 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle>Daily Activity</CardTitle>
                      <CardDescription>Your activity over the last 7 days.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                     <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart
                          accessibilityLayer
                          data={dailyActivity}
                           margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                           <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                          />
                           <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={6}
                          />
                          <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent indicator="line" />}
                          />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line 
                            dataKey="questions" 
                            type="monotone" 
                            stroke="var(--color-questions)"
                            strokeWidth={2}
                            dot={{r: 4, fill: "var(--color-questions)"}}
                            activeDot={{
                                r: 6,
                                stroke: "var(--color-questions)",
                                strokeWidth: 1,
                                fill: "hsl(var(--background))"
                            }}
                            />
                           <Line 
                            dataKey="interviews" 
                            type="monotone" 
                            stroke="var(--color-interviews)"
                            strokeWidth={2}
                            dot={{r: 4, fill: "var(--color-interviews)"}}
                             activeDot={{
                                r: 6,
                                stroke: "var(--color-interviews)",
                                strokeWidth: 1,
                                fill: "hsl(var(--background))"
                            }}
                            />
                             <Line 
                            dataKey="notes" 
                            type="monotone" 
                            stroke="var(--color-notes)"
                            strokeWidth={2}
                             dot={{r: 4, fill: "var(--color-notes)"}}
                             activeDot={{
                                r: 6,
                                stroke: "var(--color-notes)",
                                strokeWidth: 1,
                                fill: "hsl(var(--background))"
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
