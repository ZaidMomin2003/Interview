// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from "@/hooks/use-auth";
import { useUserData } from "@/hooks/use-user-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight, Video, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartTooltip } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useMemo } from "react";
import { subDays, format, isAfter } from 'date-fns';

const chartConfig = {
  questions: { label: "Questions", color: "hsl(var(--primary))" },
  interviews: { label: "Interviews", color: "hsl(var(--accent))" },
  notes: { label: "Notes", color: "hsl(var(--foreground))" },
};

// Dummy data for plan limits
const planLimits = {
    interviews: 10,
    codingQuestions: 60,
    notes: 30,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { history, bookmarks } = useUserData();
  const displayName = user?.displayName?.split(' ')[0] || 'developer';

  const {
    interviewsUsed,
    questionsUsed,
    notesUsed,
    dailyActivity,
    readinessScore,
    topicsToImprove,
  } = useMemo(() => {
    // Calculate usage
    const interviewsUsed = history.filter(item => item.type === 'AI Interview').length;
    const questionsUsed = history.filter(item => item.type === 'Coding Challenge').length;
    const notesUsed = history.filter(item => item.type === 'Notes Generation').length;
    
    // Calculate daily activity for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    const dailyActivity = last7Days.map(day => {
        const dayStr = format(day, 'E'); // Mon, Tue, etc.
        const startOfDay = new Date(day.setHours(0,0,0,0));
        const endOfDay = new Date(day.setHours(23,59,59,999));
        
        const dayHistory = history.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate >= startOfDay && itemDate <= endOfDay;
        });
        
        return {
            day: dayStr,
            questions: dayHistory.filter(h => h.type === 'Coding Challenge').length,
            interviews: dayHistory.filter(h => h.type === 'AI Interview').length,
            notes: dayHistory.filter(h => h.type === 'Notes Generation').length,
        };
    });

    // Calculate readiness score (simple version)
    const recentHistory = history.filter(item => isAfter(item.timestamp, subDays(new Date(), 30)));
    const score = Math.min(
      Math.floor(
        (interviewsUsed * 10 + questionsUsed * 2 + recentHistory.length) / 
        (planLimits.interviews * 10 + planLimits.codingQuestions * 2) * 100
      ), 100
    );
    
    // Determine topics to improve from bookmarks
    const codingBookmarks = bookmarks.filter(b => b.type === 'coding-question');
    const topics = codingBookmarks.map(b => ({
      name: b.title,
      area: b.description?.split('|')[0]?.trim() || 'Practice Topic',
    })).slice(0, 3); // Get top 3

    return {
        interviewsUsed,
        questionsUsed,
        notesUsed,
        dailyActivity,
        readinessScore: [{ name: 'readiness', value: score, fill: 'hsl(var(--primary))' }],
        topicsToImprove: topics,
    };

  }, [history, bookmarks]);

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
                          <CardTitle className="text-base font-headline text-primary">Interviews Usage</CardTitle>
                          <Video className="h-5 w-5 text-primary" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{interviewsUsed} / {planLimits.interviews}</div>
                          <p className="text-xs text-muted-foreground">Credits remaining for this cycle</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base font-headline text-primary">Coding Questions</CardTitle>
                          <CodeXml className="h-5 w-5 text-primary" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{questionsUsed} / {planLimits.codingQuestions}</div>
                          <p className="text-xs text-muted-foreground">Credits remaining for this cycle</p>
                      </CardContent>
                  </Card>
                   <Card className="bg-secondary/30 backdrop-blur-sm">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-base font-headline text-primary">Notes Generations</CardTitle>
                          <BrainCircuit className="h-5 w-5 text-primary" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{notesUsed} / {planLimits.notes}</div>
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
                  <ChartContainer config={chartConfig} className="mx-auto aspect-square h-full w-full max-h-[250px]">
                    <RadialBarChart 
                        data={readinessScore} 
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
                            {readinessScore[0].value}%
                        </text>
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-secondary/30 backdrop-blur-sm">
                  <CardHeader>
                      <CardTitle>Topics to Improve</CardTitle>
                      <CardDescription>Based on your bookmarked questions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-3">
                          {topicsToImprove.length > 0 ? (
                            topicsToImprove.map(topic => (
                               <div key={topic.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-accent/50 transition-colors">
                                  <div>
                                    <span className="font-medium">{topic.name}</span>
                                    <p className="text-xs text-muted-foreground">{topic.area}</p>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                      <Link href="/coding-practice">Practice <ArrowRight className="ml-1 h-3 w-3" /></Link>
                                  </Button>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-sm text-muted-foreground py-4">Bookmark coding questions to see recommendations here.</p>
                          )}
                      </div>
                  </CardContent>
              </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
