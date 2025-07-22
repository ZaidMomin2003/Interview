

"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Code, Cpu, Bot, Zap, ShieldCheck, User, Mail, Send, Video, FileText, Target, BrainCircuit, LayoutDashboard, CheckCircle, BarChartHorizontalBig, Mic, VideoOff as VideoOffIcon, BotIcon, CodeXml, Video as VideoIcon, History as HistoryIcon, Phone, Github, Linkedin, Instagram, TrendingUp, GalleryVertical, Plus, GraduationCap, Briefcase, Rocket, Star, Quote, Tags, Check } from 'lucide-react';
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
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Switch } from '@/components/ui/switch';


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
      <p className="text-5xl font-bold font-headline text-primary">{count.toLocaleString()}+</p>
      <p className="text-muted-foreground mt-2">{label}</p>
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
      className={cn("relative overflow-hidden rounded-lg border bg-secondary/30 border-border backdrop-blur-sm transition-colors duration-300 group", className)}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, hsl(var(--primary) / 0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}


export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { user, loading } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.href.replace(/.*#/, '');
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const features = [
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: 'AI Mock Interviews',
      description: 'Face a realistic AI interviewer that asks relevant questions, tracks your speech, and provides instant feedback to sharpen your communication skills.',
      prototype: (
         <Card className="w-full max-w-lg mx-auto bg-background border-border shadow-primary/10 shadow-2xl">
              <CardContent className="p-4 space-y-3">
                  <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Main user view */}
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                          <User className="w-24 h-24 text-muted-foreground"/>
                      </div>
                      
                      {/* AI Interviewer inset view */}
                      <div className="absolute top-4 right-4 w-1/4 h-1/4 bg-secondary rounded-lg border-2 border-primary/50 flex flex-col items-center justify-center p-2">
                         <BotIcon className="h-8 w-8 text-primary/70" />
                         <p className="mt-1 text-xs text-foreground text-center">AI Interviewer</p>
                      </div>

                       {/* Controls */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/50 rounded-full border border-gray-700">
                          <Button variant="destructive" size="icon" className="w-10 h-10 rounded-full"><Mic className="w-5 h-5"/></Button>
                          <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full"><VideoOffIcon className="w-5 h-5"/></Button>
                          <Button variant="secondary" size="icon" className="w-10 h-10 rounded-full"><Phone className="w-5 h-5"/></Button>
                      </div>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
                      <p className="font-semibold text-primary mb-1">Transcript:</p>
                      <p>&gt; AI: "Can you tell me about a time you faced a difficult challenge?"</p>
                      <p className="text-foreground">&gt; You: "Certainly. In my previous role at TechCorp, we had a major project deadline..."</p>
                  </div>
              </CardContent>
          </Card>
      ),
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: 'Resume Studio',
      description: 'Generate a brand-new resume from scratch or optimize your existing one against a specific job description. Our AI helps you bypass ATS filters and catch recruiter attention.',
      prototype: (
         <Card className="w-full max-w-lg mx-auto bg-background border-border shadow-primary/10 shadow-2xl">
              <CardHeader>
                  <CardTitle>Resume Optimization</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-secondary rounded-lg space-y-2">
                      <h4 className="font-semibold text-foreground">Your Resume</h4>
                      <p className="text-sm text-muted-foreground">&bull; Experienced in React and Node.js...</p>
                      <p className="text-sm text-muted-foreground">&bull; Managed a team of 3 developers...</p>
                  </div>
                   <div className="p-3 bg-primary/10 border border-primary/30 rounded-lg space-y-2">
                      <h4 className="font-semibold text-primary">AI Suggestions</h4>
                      <p className="text-sm text-foreground">&bull; Change "Managed" to "Led" for stronger impact...</p>
                      <p className="text-sm text-foreground">&bull; Add quantifiable results like "increased efficiency by 15%".</p>
                  </div>
              </CardContent>
          </Card>
      ),
    },
     {
      icon: <Code className="h-10 w-10 text-primary" />,
      title: 'Coding Gym',
      description: 'Generate personalized coding questions based on your skill level and desired topics. Submit your solution and receive instant, line-by-line feedback from our AI mentor.',
       prototype: (
         <Card className="w-full max-w-lg mx-auto bg-background border-border shadow-primary/10 shadow-2xl">
              <CardContent className="p-4 space-y-3">
                  <div className="p-3 bg-secondary rounded-lg">
                      <p className="text-sm text-primary">Question: Two Sum</p>
                      <p className="text-sm text-muted-foreground mt-1">Given an array of integers, return indices of the two numbers such that they add up to a specific target.</p>
                  </div>
                   <div className="p-3 font-code text-sm bg-black rounded-lg text-gray-300">
                      <span className="text-purple-400">function</span> <span className="text-yellow-300">twoSum</span>(<span className="text-orange-400">nums, target</span>) {'{'}<br/>
                      {'  '}<span className="text-gray-500">// Your code here...</span><br/>
                      {'}'}
                  </div>
                   <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                       <p className="text-sm font-semibold text-primary">AI Feedback:</p>
                       <p className="text-sm text-foreground mt-1">"Consider using a hash map for O(n) time complexity."</p>
                   </div>
              </CardContent>
          </Card>
      ),
    },
     {
      icon: <Target className="h-10 w-10 text-primary" />,
      title: 'Interview Arena',
      description: 'Set a target interview date and get a personalized, day-by-day training plan. The Arena unlocks new challenges daily, guiding you from preparation to peak performance.',
       prototype: (
         <Card className="w-full max-w-lg mx-auto bg-background/50 border-border shadow-primary/10 shadow-2xl">
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
                   <div className="text-center p-2 rounded-lg bg-primary/20 border-2 border-primary">
                      <p className="font-bold">Day 3</p>
                      <BarChartHorizontalBig className="mx-auto mt-1 h-5 w-5 text-primary/80" />
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary border border-border opacity-60">
                      <p className="font-bold">Day 4</p>
                       <BrainCircuit className="mx-auto mt-1 h-5 w-5" />
                  </div>
              </CardContent>
          </Card>
      ),
    },
    {
      icon: <GalleryVertical className="h-10 w-10 text-primary" />,
      title: 'Public Portfolio',
      description: 'Showcase your skills and projects with a personalized, public-facing portfolio. Automatically syncs with your dashboard stats and projects.',
       prototype: (
         <Card className="w-full max-w-lg mx-auto bg-background border-border shadow-primary/10 shadow-2xl">
              <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 border-2 border-primary">
                          <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                          <h3 className="text-xl font-bold text-foreground">Jane Doe</h3>
                          <p className="text-sm text-muted-foreground">Software Engineer</p>
                      </div>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                       <h4 className="font-semibold text-primary mb-2">Top Project</h4>
                       <p className="font-bold text-foreground">AI-Powered Code Analyzer</p>
                       <p className="text-xs text-muted-foreground">Next.js, Tailwind CSS, Genkit AI</p>
                  </div>
              </CardContent>
          </Card>
      ),
    },
  ];

  const personas = [
    {
        icon: <GraduationCap className="h-12 w-12 text-primary"/>,
        title: "The Aspiring Student",
        description: "Launching your career? Talxify helps you build a solid foundation, from crafting the perfect entry-level resume to mastering fundamental coding concepts for your first technical interview.",
        benefits: ["Build a portfolio from scratch", "Master data structures", "Nail your first interview"],
    },
    {
        icon: <Rocket className="h-12 w-12 text-primary"/>,
        title: "The Career Accelerator",
        description: "Ready for the next step? Optimize your resume for senior roles, tackle advanced coding challenges, and practice behavioral questions to land a promotion or a job at a top-tier company.",
        benefits: ["Optimize resume for senior roles", "Target specific companies", "Sharpen communication skills"],
    },
    {
        icon: <Briefcase className="h-12 w-12 text-primary"/>,
        title: "The Senior Strategist",
        description: "Aimed at Staff+ roles? Dive deep into system design, practice high-level architectural discussions in mock interviews, and refine your leadership narrative to stand out to hiring managers.",
        benefits: ["Practice system design interviews", "Refine leadership narrative", "Prepare for architectural discussions"],
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Senior Software Engineer @ Google",
      avatar: "/avatars/01.png",
      testimonial: "The AI feedback on my resume was a game-changer. It helped me highlight my impact in a way I hadn't thought of, and I started getting way more callbacks. Talxify was instrumental in landing my current role.",
    },
    {
      name: "Samantha Chen",
      role: "Frontend Developer @ Vercel",
      avatar: "/avatars/02.png",
      testimonial: "As a visual learner, the interactive coding gym and mock interviews were perfect for me. The AI interviewer is surprisingly realistic and helped me build confidence for the real thing. Highly recommend!",
    },
    {
      name: "David Kim",
      role: "Full-Stack Developer @ Startup",
      avatar: "/avatars/03.png",
      testimonial: "I used the Arena feature for a 2-week crunch before a series of interviews. The daily, structured plan kept me focused and covered all my bases. I felt more prepared than ever before.",
    },
     {
      name: "Maria Garcia",
      role: "Backend Developer @ Amazon",
      avatar: "/avatars/04.png",
      testimonial: "The portfolio builder is slick. I had a professional-looking site up in minutes that automatically showcased my stats from the platform. It's a great way to show, not just tell, what you can do.",
    },
  ];


  const pricingTiers = [
    {
      name: 'Apprentice',
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: 'Get a feel for the platform, on us.',
      features: [
        'Basic Resume Generation',
        '3 Coding Questions/day',
        'Limited Code Feedback',
        'Community Support',
      ],
      cta: 'Get Started Free',
      href: '/signup',
    },
    {
      name: 'Developer',
      monthlyPrice: 15,
      yearlyPrice: 12,
      description: 'The essential toolkit for active job seekers.',
      features: [
        'Advanced Resume Generation & Optimization',
        'Unlimited Coding Questions',
        'Full Code Analysis & Feedback',
        'AI Resume Tailoring',
        'Priority Email Support',
      ],
      cta: 'Choose Developer',
      href: '/signup',
      popular: true,
    },
    {
      name: 'Ascendant',
      monthlyPrice: 29,
      yearlyPrice: 24,
      description: 'For those who want to master their craft.',
      features: [
        'All Developer Features',
        'Unlimited AI Mock Interviews',
        'Career Path Analysis',
        'Interview Arena Access',
        'Dedicated Support Channel',
      ],
      cta: 'Become Ascendant',
      href: '/signup',
    },
  ];

  const faqs = [
    {
        question: 'What happens if I cancel my subscription?',
        answer: 'You can cancel your subscription at any time. You will retain access to all your plan\'s features until the end of your current billing period. We do not offer refunds for partial periods.'
    },
    {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan at any time from your account settings. When you upgrade, you will be charged a prorated amount for the remainder of the billing cycle. Downgrades will take effect at the start of your next billing cycle.'
    },
    {
        question: 'What AI models do you use?',
        answer: 'Talxify is powered by Google\'s state-of-the-art Gemini family of models. This allows us to provide advanced capabilities in text generation, code analysis, and conversational AI for a top-tier user experience.'
    },
    {
        question: 'How does the AI Resume Optimization work?',
        answer: 'You provide your resume and a target job description. Our AI analyzes both, identifies key skills and keywords from the job description, and suggests improvements to your resume to align it better with the role. It helps you get past automated screening systems (ATS) and catch a recruiter\'s eye.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. We prioritize your privacy and data security. All personal information and user-generated content are encrypted and handled with the strictest confidentiality. We do not share your data with third parties.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, including Visa, Mastercard, and American Express. All payments are processed securely through our payment provider, Stripe.'
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
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
            <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      {/* Background Grid & Interactive Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.1), transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background via-transparent to-background"></div>


      {/* Header */}
      <header className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled ? "bg-background/80 backdrop-blur-sm border-b border-border/50" : "bg-transparent"
        )}>
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold tracking-widest text-foreground uppercase">
              Talxify
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#who-is-this-for" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Who It's For</Link>
            <Link href="#testimonials" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Testimonials</Link>
            <Link href="#about" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link href="#pricing" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Link href="#faq" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
            <Link href="#contact" onClick={handleSmoothScroll} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-2">
            {renderAuthButtons()}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="py-20 md:py-24">
          <div className="container mx-auto px-4 text-center">
             <div className="mb-6">
                <Badge variant="outline" className="cursor-pointer text-sm font-semibold py-1 px-3 rounded-full border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                    <span className="font-bold mr-2">v0.3</span>
                    <span className="text-primary/90">Now with Light Mode and new features!</span>
                    <ArrowRight className="ml-2 h-4 w-4 text-primary/90"/>
                </Badge>
            </div>
             <h1 className="animate-text-gradient bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-7xl font-headline">
              Ascend Your Career
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
              Your AI-powered career co-pilot. Generate resumes, practice for
              interviews, and accelerate your developer journey into the digital frontier.
            </p>
            <div className="mt-10 mb-16">
              <Button size="lg" asChild>
                <Link href={user ? "/dashboard" : "/signup"}>
                  {user ? "Go to Dashboard" : "Engage AI Co-Pilot"} <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>

            {/* Dashboard Prototype */}
            <div className="max-w-6xl mx-auto">
                <Card className="w-full bg-background/50 border-2 border-border shadow-primary/20 shadow-2xl overflow-hidden">
                    <div className="p-1.5 bg-secondary/80 border-b border-border flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="grid grid-cols-12 gap-6 p-6 bg-background/30 backdrop-blur-sm">
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
                                <div key={index} className={cn("flex items-center gap-3 p-2 rounded-lg text-sm", index === 0 ? "bg-primary/20 text-primary font-semibold" : "text-muted-foreground")}>
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        {/* Main Content Mock */}
                        <div className="col-span-12 md:col-span-9">
                            <h2 className="text-2xl font-bold font-headline text-left mb-1 text-foreground">Welcome back, Developer</h2>
                            <p className="text-left text-muted-foreground mb-4">Here's your progress overview.</p>
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
                              {/* Left Column */}
                              <div className="lg:col-span-2 space-y-6">
                                  {/* Stats Cards */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                      <Card className="bg-secondary/30 backdrop-blur-sm">
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                              <CardTitle className="text-sm font-medium text-foreground">Interviews Completed</CardTitle>
                                              <VideoIcon className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold text-foreground">3</div>
                                              <p className="text-xs text-muted-foreground">+1 since last week</p>
                                          </CardContent>
                                      </Card>
                                      <Card className="bg-secondary/30 backdrop-blur-sm">
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                              <CardTitle className="text-sm font-medium text-foreground">Coding Questions Solved</CardTitle>
                                              <CodeXml className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold text-foreground">42</div>
                                              <p className="text-xs text-muted-foreground">+12 since last week</p>
                                          </CardContent>
                                      </Card>
                                      <Card className="bg-secondary/30 backdrop-blur-sm">
                                          <CardHeader className="flex flex-row items-center justify-between pb-2">
                                              <CardTitle className="text-sm font-medium text-foreground">MCQs Answered</CardTitle>
                                              <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                          </CardHeader>
                                          <CardContent>
                                              <div className="text-2xl font-bold text-foreground">128</div>
                                              <p className="text-xs text-muted-foreground">92% accuracy</p>
                                          </CardContent>
                                      </Card>
                                  </div>
                                  
                                  {/* Weekly Progress */}
                                  <Card className="bg-secondary/30 backdrop-blur-sm">
                                      <CardHeader>
                                          <CardTitle className="text-foreground">Weekly Progress</CardTitle>
                                      </CardHeader>
                                      <CardContent className="pl-2">
                                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                            <AreaChart
                                                accessibilityLayer
                                                data={weeklyProgressData}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                  <linearGradient id="fillQuestionsLanding" x1="0" y1="0" x2="0" y2="1">
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
                                                    fill="url(#fillQuestionsLanding)"
                                                    stroke="hsl(var(--primary))"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </AreaChart>
                                        </ChartContainer>
                                      </CardContent>
                                  </Card>
                              </div>

                              {/* Right Column */}
                              <div className="space-y-6">
                                  <Card className="bg-secondary/30 backdrop-blur-sm">
                                    <CardHeader>
                                      <CardTitle className="text-foreground">Interview Readiness</CardTitle>
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
                                          <CardTitle className="text-foreground">Topics to Improve</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                          <div className="space-y-3">
                                              {topicsToImprove.slice(0, 2).map(topic => (
                                                  <div key={topic.name} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                                                      <div>
                                                        <span className="font-medium text-foreground">{topic.name}</span>
                                                        <p className="text-xs text-muted-foreground">{topic.area}</p>
                                                      </div>
                                                      <ArrowRight className="h-4 w-4 text-foreground" />
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
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Core Matrix</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Harness cutting-edge tools forged for the modern software engineer.
              </p>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-12 items-center">
                <div className={cn("space-y-4", index % 2 === 1 && "md:order-2")}>
                  <div className="inline-flex items-center gap-4">
                    <div className="p-3 bg-secondary border border-border rounded-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold font-headline text-foreground">{feature.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground">{feature.description}</p>
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

        {/* Who is this for Section */}
        <section id="who-is-this-for" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Engineered For Every Ascent</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Whether you're writing your first line of code or designing distributed systems, Talxify is your dedicated co-pilot.
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                {personas.map((persona) => (
                  <SpotlightCard key={persona.title} className="p-8 text-center flex flex-col">
                    <div className="flex-grow">
                      <div className="inline-block p-4 bg-secondary border border-border rounded-full mb-4">
                        {persona.icon}
                      </div>
                      <h3 className="text-2xl font-bold font-headline text-foreground">{persona.title}</h3>
                      <p className="mt-2 text-muted-foreground">{persona.description}</p>
                    </div>
                    <div className="mt-6 text-left">
                       <ul className="space-y-2 text-sm">
                          {persona.benefits.map(benefit => (
                            <li key={benefit} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-primary shrink-0"/>
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Stories of Success</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                See how developers like you have accelerated their careers with Talxify.
              </p>
            </div>
            <div className="mt-16 w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                    {[...testimonials, ...testimonials].map((item, index) => (
                        <div key={index} className="w-[450px] flex-shrink-0 p-4">
                            <Card className="bg-secondary/30 border-border h-full flex flex-col justify-between">
                                <CardContent className="p-6 flex-grow">
                                    <Quote className="w-12 h-12 text-primary/20 mb-4" />
                                    <blockquote className="text-foreground text-lg leading-relaxed">
                                    {item.testimonial}
                                    </blockquote>
                                </CardContent>
                                <CardHeader className="p-6 pt-0 flex-row items-center gap-4">
                                    <Avatar className="w-12 h-12 border-2 border-primary/50">
                                        <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint="person portrait" alt={item.name} />
                                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-foreground">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground">{item.role}</p>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </section>


        {/* Lead Magnet Section */}
        <section id="salary-calculator" className="py-20 sm:py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <SpotlightCard className="p-8 md:p-12">
                    <div className="text-center">
                         <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
                            <TrendingUp className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Know Your Worth</h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Use our AI-powered salary estimator to understand your market value. Get a personalized salary range based on your skills, experience, and location.
                        </p>
                        <div className="mt-8">
                            <Button size="lg" asChild>
                                <Link href="/calculate-salary">
                                    Calculate Your Salary <ArrowRight className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </SpotlightCard>
            </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 sm:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">About The Developer</h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Meet Zaid, a passionate programmer from Bijapur, Karnataka. With a B.Tech in CSE specializing in Data Science, he is dedicated to building innovative tools that empower the developer community.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
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
                <div className="flex items-center justify-center order-first md:order-last">
                   <Image 
                        src="/about.jpg"
                        alt="Developer Zaid"
                        width={400}
                        height={400}
                        className="rounded-full shadow-primary/20 shadow-2xl w-64 h-64 md:w-96 md:h-96 object-cover"
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
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold font-headline text-primary">Find the Plan That's Right for You</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose your level of engagement. No hidden fees. Upgrade, downgrade, or cancel anytime.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <Label htmlFor="billing-cycle-landing" className="font-medium">Monthly</Label>
              <Switch
                id="billing-cycle-landing"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                aria-label="Switch between monthly and yearly billing"
              />
              <Label htmlFor="billing-cycle-landing" className="font-medium flex items-center">
                Yearly
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-900 text-green-300">
                  Save 20%
                </span>
              </Label>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={cn(
                "bg-secondary/30 border-border flex flex-col transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 h-full",
                tier.popular ? 'border-2 border-primary shadow-[0_0_25px_hsl(var(--primary)_/_0.4)]' : ''
              )}>
                {tier.popular && (
                  <div className="text-center py-1 bg-primary text-primary-foreground font-bold text-sm rounded-t-lg">MOST POPULAR</div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-headline text-foreground">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="text-5xl font-bold text-primary pt-4">
                    ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                    <span className="text-xl font-normal text-muted-foreground">/ month</span>
                  </div>
                  {isYearly && tier.monthlyPrice > 0 && (
                    <p className="text-sm text-muted-foreground">Billed as ${tier.yearlyPrice * 12} per year</p>
                  )}
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-4">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button className="w-full transition-all duration-300" asChild>
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 sm:py-24">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">System Knowledge Base</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Frequently accessed data nodes. If your query is not here, please connect to a support channel.
                    </p>
                </div>
                <div className="mt-12">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="bg-secondary/30 border-border/50 rounded-lg mb-4 p-2 transition-all hover:bg-secondary/50">
                                <AccordionTrigger className="text-lg text-left font-semibold text-foreground hover:text-primary transition-colors duration-300 p-4">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base p-4 pt-0">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>


        {/* Contact Us Section */}
        <section id="contact" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Establish Connection</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Have a question, feedback, or a partnership inquiry? We'd love to hear from you.
              </p>
            </div>
            <div className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="text-primary font-headline text-2xl">Get in Touch</CardTitle>
                  <CardDescription>
                    Our team is available to help with any questions you might have. We look forward to hearing from you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                   <a href="mailto:contact@talxify.com" className="flex items-center gap-3 hover:text-primary transition-colors">
                     <Mail className="h-5 w-5"/>
                     <span>contact@talxify.com</span>
                   </a>
                    <div className="flex items-center gap-3">
                     <Phone className="h-5 w-5"/>
                     <span>+1 (555) 123-4567</span>
                   </div>
                   <p className="text-sm text-muted-foreground/50 pt-4">
                     We typically respond to inquiries within 24-48 business hours.
                   </p>
                </CardContent>
              </SpotlightCard>
              <Card className="bg-secondary/30 border-border backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-primary">Name</Label>
                        <Input id="name" type="text" placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-primary">Email</Label>
                        <Input id="email" type="email" placeholder="Your email" />
                      </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message" className="text-primary">Message</Label>
                        <Textarea id="message" placeholder="Your message" rows={5} />
                      </div>
                      <div className="text-right">
                        <Button type="submit">
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
      <footer className="border-t border-border">
        <div className="container mx-auto py-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <p className="text-sm text-muted-foreground">
            Made with 💓 By Zaid
          </p>
          <div className="flex gap-4">
            <Link href="https://github.com/ZaidMomin2003" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
            </Link>
             <Link href="https://www.linkedin.com/in/arshad-momin-a3139b21b/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
            </Link>
             <Link href="https://www.instagram.com/zaidwontdo/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

    
