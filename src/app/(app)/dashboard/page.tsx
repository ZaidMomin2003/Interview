// src/app/(app)/dashboard/page.tsx
'use client';
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight, Video } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.displayName?.split(' ')[0] || 'developer';

  return (
    <div className="space-y-8 text-gray-200">
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-black via-transparent to-black"></div>

      <div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-b from-gray-100 to-cyan-400">
          Welcome back, {displayName}
        </h1>
        <p className="text-gray-400 mt-2">Your AI-powered career co-pilot is ready. Let's get to work.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col bg-gray-900/50 border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-300 backdrop-blur-sm group">
          <CardHeader>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-gray-800 border border-cyan-500/30 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="font-headline text-2xl text-gray-100">Resume Studio</CardTitle>
            </div>
            <CardDescription className="pt-2 text-gray-400">
              Generate a brand-new resume or optimize your existing one. Our AI will help you stand out.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Craft professional resumes from scratch.</li>
              <li>Tailor your resume for specific job descriptions.</li>
              <li>Get suggestions for improvement.</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]" asChild>
              <Link href="/resume-builder">Go to Resume Studio <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col bg-gray-900/50 border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-300 backdrop-blur-sm group">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-800 border border-cyan-500/30 rounded-lg group-hover:scale-110 transition-transform">
                <CodeXml className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="font-headline text-2xl text-gray-100">Coding Gym</CardTitle>
            </div>
            <CardDescription className="pt-2 text-gray-400">
              Practice with AI-generated questions and get instant feedback on your code solutions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Personalized questions for your skill level.</li>
              <li>Write code in our integrated editor.</li>
              <li>Receive AI feedback to improve your solutions.</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]" asChild>
              <Link href="/coding-practice">Enter Coding Gym <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col bg-gray-900/50 border border-cyan-500/30 hover:border-cyan-400 transition-colors duration-300 backdrop-blur-sm group md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-800 border border-cyan-500/30 rounded-lg group-hover:scale-110 transition-transform">
                <Video className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="font-headline text-2xl text-gray-100">AI Interview</CardTitle>
            </div>
            <CardDescription className="pt-2 text-gray-400">
              Hone your interview skills with a mock AI interviewer that gives you real-time feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc list-inside text-gray-400 space-y-1">
              <li>Realistic, Zoom-like interview experience.</li>
              <li>Live speech-to-text transcription.</li>
              <li>(Coming soon) AI-powered feedback on your answers.</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)]" asChild>
              <Link href="/ai-interview">Start an Interview <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
