
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Code, Cpu, Bot, Zap, ShieldCheck, User, Mail, Send, Video, FileText, Target, BrainCircuit, LayoutDashboard, CheckCircle, BarChartHorizontalBig, Mic, VideoOff as VideoOffIcon, BotIcon, CodeXml, Video as VideoIcon, History as HistoryIcon, Phone, Github, Linkedin, Instagram } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';


const weeklyProgressData = [
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


function AnimatedCounter({ to, label }: { to: number, label: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 2000;
      const end = to;
      if (start === end) return;

      const range = end - start;
      let current = start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / range));
      
      const timer = setInterval(() => {
        current += increment * Math.ceil(range/100);
        if((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
          current = end;
          clearInterval(timer);
        }
        setCount(current);
      }, stepTime > 0 ? stepTime : 1);

      return () => {
        clearInterval(timer);
      };
    }
  }, [inView, to]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-5xl font-bold font-headline text-cyan-400">{count.toLocaleString()}+</p>
      <p className="text-gray-400 mt-2">{label}</p>
    </div>
  );
}


function SpotlightCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative overflow-hidden rounded-lg border bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm transition-colors duration-300 group", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(56, 189, 248, 0.2), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};


export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const features = [
    {
      icon: <Video className="h-10 w-10 text-cyan-400" />,
      title: 'AI Mock Interviews',
      description: 'Face a realistic AI interviewer that asks relevant questions, tracks your speech, and provides instant feedback to sharpen your communication skills.',
      prototype: (
         <Card className="w-full max-w-lg mx-auto bg-black border-cyan-500/30 shadow-cyan-400/10 shadow-2xl">
              <CardContent className="p-4 space-y-3">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Main user view */}
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <User className="w-24 h-24 text-gray-600"/>
                      </div>
                      
                      {/* AI Interviewer inset view */}
                      <div className="absolute top-4 right-4 w-1/4 h-1/4 bg-gray-900 rounded-lg border-2 border-cyan-500/50 flex flex-col items-center justify-center p-2">
                         <BotIcon className="h-8 w-8 text-cyan-400/70" />
                         <p className="mt-1 text-xs text-gray-200 text-center">AI Interviewer</p>
                      </div>

                       {/* Controls */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/50 rounded-full border border-gray-700">
                          <Button variant="destructive" size="icon" className="w-10 h-10 rounded-full"><Mic className="w-5 h-5"/></Button>
                          <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full"><VideoOffIcon className="w-5 h-5"/></Button>
                          <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full"><Phone className="w-5 h-5"/></Button>
                      </div>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded-lg text-sm text-gray-300">
                      <p className="font-semibold text-cyan-400 mb-1">Transcript:</p>
                      <p>&gt; AI: "Can you tell me about a time you faced a difficult challenge?"</p>
                      <p className="text-white">&gt; You: "Certainly. In my previous role at TechCorp, we had a major project deadline..."</p>
                  </div>
              </CardContent>
          </Card>
      ),
    },
    {
      icon: <FileText className="h-10 w-10 text-cyan-400" />,
      title: 'Resume Studio',
      description: 'Generate a brand-new resume from scratch or optimize your existing one against a specific job description. Our AI helps you bypass ATS filters and catch recruiter attention.',
      prototype: (
         <Card className="w-full max-w-lg mx-auto bg-gray-900 border-cyan-500/30 shadow-cyan-400/10 shadow-2xl">
              <CardHeader>
                  <CardTitle>Resume Optimization</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg space-y-2">
                      <h4 className="font-semibold text-gray-200">Your Resume</h4>
                      <p className="text-sm text-gray-400">&bull; Experienced in React and Node.js...</p>
                      <p className="text-sm text-gray-400">&bull; Managed a team of 3 developers...</p>
                  </div>
                   <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg space-y-2">
                      <h4 className="font-semibold text-green-400">AI Suggestions</h4>
                      <p className="text-sm text-gray-300">&bull; Change "Managed" to "Led" for stronger impact...</p>
                      <p className="text-sm text-gray-300">&bull; Add quantifiable results like "increased efficiency by 15%".</p>
                  </div>
              </CardContent>
          </Card>
      ),
    },
     {
      icon: <Code className="h-10 w-10 text-cyan-400" />,
      title: 'Coding Gym',
      description: 'Generate personalized coding questions based on your skill level and desired topics. Submit your solution and receive instant, line-by-line feedback from our AI mentor.',
       prototype: (
         <Card className="w-full max-w-lg mx-auto bg-gray-900 border-cyan-500/30 shadow-cyan-400/10 shadow-2xl">
              <CardContent className="p-4 space-y-3">
                  <div className="p-3 bg-gray-800 rounded-lg">
                      <p className="text-sm text-cyan-400">Question: Two Sum</p>
                      <p className="text-sm text-gray-400 mt-1">Given an array of integers, return indices of the two numbers such that they add up to a specific target.</p>
                  </div>
                   <div className="p-3 font-code text-sm bg-black rounded-lg text-gray-300">
                      <span className="text-purple-400">function</span> <span className="text-yellow-300">twoSum</span>(<span className="text-orange-400">nums, target</span>) {'{'}<br/>
                      {'  '}<span className="text-gray-500">// Your code here...</span><br/>
                      {'}'}
                  </div>
                   <div className="p-3 bg-cyan-900/20 border border-cyan-500/30 rounded-lg">
                       <p className="text-sm font-semibold text-cyan-300">AI Feedback:</p>
                       <p className="text-sm text-gray-300 mt-1">"Consider using a hash map for O(n) time complexity."</p>
                   </div>
              </CardContent>
          </Card>
      ),
    },
     {
      icon: <Target className="h-10 w-10 text-cyan-400" />,
      title: 'Interview Arena',
      description: 'Set a target interview date and get a personalized, day-by-day training plan. The Arena unlocks new challenges daily, guiding you from preparation to peak performance.',
       prototype: (
         <Card className="w-full max-w-lg mx-auto bg-gray-900/50 border-cyan-500/30 shadow-cyan-400/10 shadow-2xl">
              <CardHeader>
                  <CardTitle>Your 14-Day Plan</CardTitle>
                  <CardDescription>Target: Senior Frontend Engineer</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 rounded-lg bg-green-900/50 border border-green-500/30">
                      <p className="font-bold">Day 1</p>
                      <CheckCircle className="mx-auto mt-1 h-5 w-5 text-green-400" />
                  </div>
                   <div className="text-center p-2 rounded-lg bg-green-900/50 border border-green-500/30">
                      <p className="font-bold">Day 2</p>
                      <CheckCircle className="mx-auto mt-1 h-5 w-5 text-green-400" />
                  </div>
                   <div className="text-center p-2 rounded-lg bg-cyan-900/80 border-2 border-cyan-400">
                      <p className="font-bold">Day 3</p>
                      <BarChartHorizontalBig className="mx-auto mt-1 h-5 w-5 text-cyan-300" />
                  </div>
                  <div className="text-center p-2 rounded-lg bg-gray-800 border border-gray-700 opacity-60">
                      <p className="font-bold">Day 4</p>
                       <BrainCircuit className="mx-auto mt-1 h-5 w-5" />
                  </div>
              </CardContent>
          </Card>
      ),
    },
  ];

  const pricingTiers = [
    {
      name: "Apprentice",
      price: "$0",
      period: "/ month",
      description: "Get a feel for the platform, on us.",
      features: ["Basic Resume Generation", "3 Coding Questions/day", "Limited Code Feedback"],
      cta: "Get Started Free",
      href: "/signup"
    },
    {
      name: "Developer",
      price: "$15",
      period: "/ month",
      description: "The essential toolkit for active job seekers.",
      features: ["Advanced Resume Generation", "Unlimited Coding Questions", "Full Code Analysis", "Resume Optimization"],
      cta: "Choose Developer",
      href: "/signup",
      popular: true
    },
    {
      name: "Ascendant",
      price: "$29",
      period: "/ month",
      description: "For those who want to master their craft.",
      features: ["All Developer Features", "Priority AI Agent Access", "Career Path Analysis", "Mock AI Interviews"],
      cta: "Become Ascendant",
      href: "/signup"
    }
  ];

  const faqs = [
    {
      question: "What is Talxify?",
      answer: "Talxify is an AI-powered platform designed to help developers accelerate their careers. We provide tools for resume building, coding practice, and interview preparation, all tailored to your specific needs and goals."
    },
    {
      question: "How does the AI resume builder work?",
      answer: "Our AI resume builder takes your work experience, skills, and the job description you're targeting, and generates a professional, optimized resume designed to get past applicant tracking systems and catch the eye of recruiters."
    },
    {
      question: "Can I use my own code for feedback?",
      answer: "Absolutely. The Coding Gym allows you to solve AI-generated problems or paste your own code solutions to get instant, comprehensive feedback on correctness, efficiency, and style."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, including Visa, Mastercard, and American Express, processed securely through our payment provider."
    }
  ];

  const renderAuthButtons = () => {
    if (loading) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      );
    }

    if (user) {
      return (
        <Button className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]" asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:scale-105 active:scale-95" asChild>
            <Link href="/login">Login</Link>
        </Button>
        <Button className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]" asChild>
            <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-200 font-body">
      {/* Background Grid & Interactive Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.2), transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-black via-transparent to-black"></div>

      {/* Header */}
      <header className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "border-b border-cyan-500/30 bg-black/50 backdrop-blur-lg" : "bg-transparent"
        )}>
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="h-8 w-8 text-cyan-400" />
            <span className="font-headline text-2xl font-bold tracking-widest text-gray-100 uppercase">
              Talxify
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#about" className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">About</Link>
            <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">Pricing</Link>
            <Link href="#faq" className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">FAQ</Link>
             <Link href="#contact" className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            {renderAuthButtons()}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="py-20 md:py-24">
          <div className="container mx-auto px-4 text-center">
             <h1 className="animate-text-gradient bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-7xl font-headline">
              Ascend Your Career
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-400">
              Your AI-powered career co-pilot. Generate resumes, practice for
              interviews, and accelerate your developer journey into the digital frontier.
            </p>
            <div className="mt-10 mb-16">
              <Button size="lg" className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]" asChild>
                <Link href={user ? "/dashboard" : "/signup"}>
                  {user ? "Go to Dashboard" : "Engage AI Co-Pilot"} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>

            {/* Dashboard Prototype */}
            <div className="max-w-6xl mx-auto">
                <Card className="w-full bg-black/50 border-2 border-cyan-500/30 shadow-cyan-400/20 shadow-2xl overflow-hidden">
                    <div className="p-1.5 bg-gray-900/80 border-b border-cyan-500/30 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="grid grid-cols-12 gap-6 p-6 bg-black/30 backdrop-blur-sm">
                        {/* Sidebar Mock */}
                        <div className="col-span-3 hidden md:flex flex-col gap-2">
                           {[
                                { icon: <LayoutDashboard />, label: "Dashboard" },
                                { icon: <Target />, label: "Arena" },
                                { icon: <VideoIcon />, label: "AI Interview" },
                                { icon: <FileText />, label: "Resume Studio" },
                                { icon: <CodeXml />, label: "Coding Gym" },
                                { icon: <HistoryIcon />, label: "History"},
                                { icon: <div className="h-5 w-5" />, label: "" }, // Placeholder for spacing
                            ].map((item, index) => (
                                <div key={index} className={cn("flex items-center gap-3 p-2 rounded-lg text-sm", index === 0 ? "bg-cyan-400/20 text-cyan-300 font-semibold" : "text-gray-400")}>
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        {/* Main Content Mock */}
                        <div className="col-span-12 md:col-span-9">
                            <h2 className="text-2xl font-bold font-headline text-left mb-1">Welcome back, Developer</h2>
                            <p className="text-left text-muted-foreground mb-4">Here's your progress overview.</p>
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
                              {/* Left Column */}
                              <div className="lg:col-span-2 space-y-6">
                                  {/* Stats Cards */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <Card className="bg-secondary/30 backdrop-blur-sm">
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                              <CardTitle className="text-sm font-medium">Interviews Completed</CardTitle>
                                              <VideoIcon className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold">3</div>
                                              <p className="text-xs text-muted-foreground">+1 since last week</p>
                                          </CardContent>
                                      </Card>
                                      <Card className="bg-secondary/30 backdrop-blur-sm">
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                              <CardTitle className="text-sm font-medium">Coding Questions Solved</CardTitle>
                                              <CodeXml className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold">42</div>
                                              <p className="text-xs text-muted-foreground">+12 since last week</p>
                                          </CardContent>
                                      </Card>
                                      <Card className="bg-secondary/30 backdrop-blur-sm">
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                              <CardTitle className="text-sm font-medium">MCQs Answered</CardTitle>
                                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold">128</div>
                                              <p className="text-xs text-muted-foreground">92% accuracy</p>
                                          </CardContent>
                                      </Card>
                                  </div>
                                  
                                  {/* Weekly Progress */}
                                  <Card className="bg-secondary/30 backdrop-blur-sm">
                                      <CardHeader>
                                          <CardTitle>Weekly Progress</CardTitle>
                                      </CardHeader>
                                      <CardContent className="pl-2">
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={weeklyProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                                <Bar dataKey="questions" fill="hsl(var(--primary))" name="Questions" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                      </CardContent>
                                  </Card>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-6">
                                  <Card className="bg-secondary/30 backdrop-blur-sm">
                                    <CardHeader>
                                      <CardTitle>Interview Readiness</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-center p-0">
                                      <ResponsiveContainer width="100%" height={160}>
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
                                      </CardHeader>
                                      <CardContent>
                                          <div className="space-y-3">
                                              {topicsToImprove.slice(0, 2).map(topic => (
                                                  <div key={topic.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                                                      <div>
                                                        <span className="font-medium">{topic.name}</span>
                                                        <p className="text-xs text-muted-foreground">{topic.area}</p>
                                                      </div>
                                                      <ArrowRight className="h-4 w-4" />
                                                  </div>
                                              ))}
                                          </div>
                                      </CardContent>
                                  </Card>
                              </div>

                            </div>
                        </div>
                    </div>
                </Card>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-6xl space-y-24">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">Core Matrix</h2>
              <p className="mt-4 text-lg text-gray-400">
                Harness cutting-edge tools forged for the modern software engineer.
              </p>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-12 items-center">
                <div className={cn("space-y-4", index % 2 === 1 && "md:order-2")}>
                  <div className="inline-flex items-center gap-4">
                    <div className="p-3 bg-gray-800 border border-cyan-500/30 rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold font-headline text-gray-100">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-gray-400">{feature.description}</p>
                   <Button variant="outline" asChild>
                    <Link href="/signup">Try it now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
                <div className={cn(index % 2 === 1 && "md:order-1")}>
                  {feature.prototype}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 sm:py-24 bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">About The Developer</h2>
                  <p className="mt-4 text-lg text-gray-400">
                    Meet Zaid, a passionate programmer from Bijapur, Karnataka. With a B.Tech in CSE specializing in Data Science, he is dedicated to building innovative tools that empower the developer community.
                  </p>
                  <div className="mt-6 flex gap-4">
                     <Button asChild variant="outline">
                        <Link href="https://github.com/ZaidMomin2003" target="_blank">
                            <Github className="mr-2 h-4 w-4" /> GitHub
                        </Link>
                     </Button>
                      <Button asChild variant="outline">
                        <Link href="https://www.linkedin.com/in/arshad-momin-a3139b21b/" target="_blank">
                            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        </Link>
                     </Button>
                      <Button asChild variant="outline">
                        <Link href="https://www.instagram.com/zaidwontdo/" target="_blank">
                            <Instagram className="mr-2 h-4 w-4" /> Instagram
                        </Link>
                     </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                   <Image 
                        src="/about.jpg"
                        alt="Developer Zaid"
                        width={400}
                        height={400}
                        className="rounded-full shadow-cyan-400/20 shadow-2xl"
                    />
                </div>
            </div>
             <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedCounter to={15000} label="Resumes Generated" />
              <AnimatedCounter to={25000} label="Coding Problems Solved" />
              <AnimatedCounter to={98} label="User Satisfaction (%)" />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">Access Protocols</h2>
              <p className="mt-4 text-lg text-gray-400">
                Choose your level of engagement. No hidden fees. Upgrade or cancel anytime.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={cn(
                  "bg-gray-900/50 border border-cyan-500/30 flex flex-col transition-all duration-300 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-2xl hover:-translate-y-2",
                  tier.popular ? 'border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.4)]' : ''
                )}>
                   {tier.popular && (
                    <div className="text-center py-1 bg-cyan-400 text-black font-bold text-sm">MOST POPULAR</div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-gray-100">{tier.name}</CardTitle>
                    <p className="text-gray-400">{tier.description}</p>
                    <div className="text-5xl font-bold text-cyan-400 pt-4">{tier.price} <span className="text-xl font-normal text-gray-400">{tier.period}</span></div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <ShieldCheck className="h-5 w-5 text-cyan-400" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                     <Button className={cn(
                       "w-full transition-all duration-300 hover:scale-105 active:scale-95",
                       tier.popular ? 'bg-cyan-400 text-black hover:bg-cyan-300 hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                     )} asChild>
                      <Link href={user ? '/dashboard' : tier.href}>{user ? "Go to Dashboard" : tier.cta}</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">System Knowledge Base</h2>
              <p className="mt-4 text-lg text-gray-400">
                Frequently accessed data nodes. If your query is not here, please connect to a support channel.
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full mt-12">
              {faqs.map((faq, i) => (
                 <AccordionItem key={i} value={`item-${i}`} className="border-cyan-500/30">
                  <AccordionTrigger className="text-lg text-left font-semibold text-gray-200 hover:text-cyan-400 transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">Establish Connection</h2>
              <p className="mt-4 text-lg text-gray-400">
                Have a question, feedback, or a partnership inquiry? We'd love to hear from you.
              </p>
            </div>
            <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="text-cyan-400 font-headline text-2xl">Get in Touch</CardTitle>
                  <CardDescription>
                    Our team is available to help with any questions you might have. We look forward to hearing from you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                   <a href="mailto:contact@talxify.com" className="flex items-center gap-3 hover:text-cyan-400 transition-colors">
                     <Mail className="h-5 w-5"/>
                     <span>contact@talxify.com</span>
                   </a>
                    <div className="flex items-center gap-3">
                     <Phone className="h-5 w-5"/>
                     <span>+1 (555) 123-4567</span>
                   </div>
                   <p className="text-sm text-gray-500 pt-4">
                     We typically respond to inquiries within 24-48 business hours.
                   </p>
                </CardContent>
              </SpotlightCard>
              <Card className="bg-gray-900/50 border border-cyan-500/30 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-cyan-400">Name</Label>
                        <Input id="name" type="text" placeholder="Your name" className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-cyan-400" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-cyan-400">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-cyan-400" />
                      </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message" className="text-cyan-400">Message</Label>
                        <Textarea id="message" placeholder="Your message" rows={5} className="bg-gray-800 border-gray-700 text-gray-200 focus:ring-cyan-400" />
                      </div>
                      <div className="text-right">
                        <Button type="submit" className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-105 active:scale-95">
                          Send Message <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                  </form>
                </CardContent>
              </Card>
            </div>
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-500/30">
        <div className="container mx-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <p className="text-sm text-gray-500">
            Made with 💓 By Zaid
          </p>
          <div className="flex gap-4">
            <Link href="https://github.com/ZaidMomin2003" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
              <Github className="h-6 w-6" />
            </Link>
             <Link href="https://www.linkedin.com/in/arshad-momin-a3139b21b/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
             <Link href="https://www.instagram.com/zaidwontdo/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
