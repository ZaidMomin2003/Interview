
// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight, Video, Target, CheckCircle, PercentCircle, BarChartHorizontalBig, Info } from "lucide-react";
import Link from "next/link";

// Placeholder data
const progressData = {
    interviewsCompleted: 3,
    codingQuestionsSolved: 42,
    mcqsAnswered: 128,
};

const recentTopics = [
    { name: "Atomic Structure", created: "6 days ago" },
    { name: "Quantum Mechanics", created: "10 days ago" },
    { name: "French Revolution", created: "12 days ago" },
]


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
                  <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                          <Video className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.interviewsCompleted}</div>
                          <p className="text-xs text-muted-foreground">+1 from last week</p>
                      </CardContent>
                  </Card>
                   <Card>
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <CardTitle className="text-sm font-medium">Coding Questions Solved</CardTitle>
                          <CodeXml className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">{progressData.codingQuestionsSolved}</div>
                          <p className="text-xs text-muted-foreground">+12 from last week</p>
                      </CardContent>
                  </Card>
                   <Card>
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
              
              <Card>
                  <CardHeader>
                      <CardTitle className="text-xl">Create a New Study Topic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* This would be a form in a real application */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium">Study Topic</p>
                        <div className="p-3 rounded-md bg-input text-muted-foreground">
                            e.g., The French Revolution, Quantum Physics
                        </div>
                         <Button>Generate Materials</Button>
                    </div>
                  </CardContent>
              </Card>

              <Card>
                  <CardHeader>
                      <CardTitle>Recent Topics</CardTitle>
                      <CardDescription>You have created {recentTopics.length} topics. Jump back into a recent one.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          {recentTopics.map(topic => (
                               <div key={topic.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary hover:bg-accent transition-colors">
                                  <div>
                                    <span className="font-medium">{topic.name}</span>
                                    <p className="text-xs text-muted-foreground">Created {topic.created}</p>
                                  </div>
                                  <Button variant="ghost" size="sm" asChild>
                                      <Link href="/coding-practice">Study <ArrowRight className="ml-1 h-3 w-3" /></Link>
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </CardContent>
              </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
              <Card className="text-center flex flex-col items-center justify-center p-6 h-full">
                   <CardHeader className="p-0">
                      <CardTitle className="text-xl">Today's Goal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-grow flex flex-col items-center justify-center">
                    <Info className="w-10 h-10 text-muted-foreground mb-4"/>
                    <p className="text-sm text-muted-foreground mb-2">No study plan set for today.</p>
                    <Button variant="link" asChild>
                        <Link href="/arena">Create a roadmap</Link>
                    </Button>
                  </CardContent>
              </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
