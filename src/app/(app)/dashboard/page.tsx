
// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight, Video, Target, CheckCircle, PercentCircle, BarChartHorizontalBig } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

// Placeholder data
const progressData = {
    interviewsCompleted: 3,
    codingQuestionsSolved: 42,
    mcqsAnswered: 128,
    interviewReadiness: 78,
    topicsToImprove: ["Dynamic Programming", "System Design (Advanced)", "Concurrency"],
    weeklyProgress: [
        { name: "Week 1", questions: 10, interviews: 1 },
        { name: "Week 2", questions: 15, interviews: 1 },
        { name: "Week 3", questions: 12, interviews: 0 },
        { name: "Week 4", questions: 20, interviews: 1 },
    ],
};

const chartConfig = {
  questions: {
    label: "Questions Solved",
    color: "hsl(var(--primary))",
  },
  interviews: {
    label: "Interviews",
    color: "hsl(var(--primary) / 0.5)",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName?.split(' ')[0] || 'developer';

  return (
    <div className="space-y-8 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-gray-100 to-primary">
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
                          <CardTitle className="text-sm font-medium text-primary">Interviews Completed</CardTitle>
                          <Video className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.interviewsCompleted}</div>
                          <p className="text-xs text-muted-foreground">+1 from last week</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-primary">Coding Questions Solved</CardTitle>
                          <CodeXml className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.codingQuestionsSolved}</div>
                          <p className="text-xs text-muted-foreground">+12 from last week</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium text-primary">MCQs Answered</CardTitle>
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.mcqsAnswered}</div>
                           <p className="text-xs text-muted-foreground">92% accuracy</p>
                      </CardContent>
                  </Card>
              </div>
              
              {/* Progress Chart */}
              <Card className="bg-secondary/30 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle className="text-primary">Activity Overview</CardTitle>
                      <CardDescription>Your performance over the last 4 weeks.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ChartContainer config={chartConfig} className="h-[250px] w-full">
                          <BarChart accessibilityLayer data={progressData.weeklyProgress} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                               <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 6)} />
                               <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                              <Tooltip content={<ChartTooltipContent />} />
                              <Bar dataKey="questions" fill="var(--color-questions)" radius={4} />
                              <Bar dataKey="interviews" fill="var(--color-interviews)" radius={4} />
                          </BarChart>
                      </ChartContainer>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
              <Card className="bg-gradient-to-br from-primary/20 to-secondary/30 border-primary/50 text-center flex flex-col items-center justify-center p-6 backdrop-blur-sm">
                   <CardHeader className="p-0">
                      <CardDescription className="text-primary/80">Interview Readiness</CardDescription>
                      <CardTitle className="text-5xl font-bold text-foreground my-2">{progressData.interviewReadiness}%</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                      <p className="text-sm text-primary/70 mb-4">Based on your recent activity and performance.</p>
                       <Button className="bg-primary/90 text-primary-foreground hover:bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.5)]" asChild>
                          <Link href="/arena">Go to Arena <Target className="ml-2 h-4 w-4" /></Link>
                      </Button>
                  </CardContent>
              </Card>

              <Card className="bg-secondary/30 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle className="text-primary">Topics to Improve</CardTitle>
                      <CardDescription>Focus on these areas to boost your readiness score.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex flex-col gap-3">
                          {progressData.topicsToImprove.map(topic => (
                               <div key={topic} className="flex items-center justify-between p-3 rounded-lg bg-black/30">
                                  <span className="font-medium">{topic}</span>
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
