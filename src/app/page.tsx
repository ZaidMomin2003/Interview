
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Code, Cpu, Bot, Zap, ShieldCheck, User, Mail, Send } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

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
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(56, 189, 248, 0.1), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};


export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      icon: <Bot className="h-8 w-8 text-cyan-400" />,
      title: 'AI Resume Builder',
      description: 'Generate optimized resumes tailored to specific job roles using our advanced AI.',
    },
    {
      icon: <Code className="h-8 w-8 text-cyan-400" />,
      title: 'Coding Challenges',
      description: 'Practice with AI-generated questions and get instant, detailed feedback on your solutions.',
    },
    {
      icon: <Zap className="h-8 w-8 text-cyan-400" />,
      title: 'Code Analysis',
      description: 'Receive deep feedback and optimization suggestions for your code to improve your skills.',
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
      href: "/dashboard"
    },
    {
      name: "Developer",
      price: "$15",
      period: "/ month",
      description: "The essential toolkit for active job seekers.",
      features: ["Advanced Resume Generation", "Unlimited Coding Questions", "Full Code Analysis", "Resume Optimization"],
      cta: "Choose Developer",
      href: "/dashboard",
      popular: true
    },
    {
      name: "Ascendant",
      price: "$29",
      period: "/ month",
      description: "For those who want to master their craft.",
      features: ["All Developer Features", "Priority AI Agent Access", "Career Path Analysis", "Mock AI Interviews"],
      cta: "Become Ascendant",
      href: "/dashboard"
    }
  ];

  const faqs = [
    {
      question: "What is DevPro Ascent?",
      answer: "DevPro Ascent is an AI-powered platform designed to help developers accelerate their careers. We provide tools for resume building, coding practice, and interview preparation, all tailored to your specific needs and goals."
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

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-200 font-body">
      {/* Background Grid & Interactive Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56, 189, 248, 0.25), transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
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
              DevPro Ascent
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
            <Button className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(56,189,248,0.7)]" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="py-32 sm:py-40 md:py-48">
          <div className="container mx-auto px-4 text-center">
             <h1 className="animate-text-gradient bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-7xl lg:text-8xl font-headline">
              Ascend Your Career
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-400">
              Your AI-powered career co-pilot. Generate resumes, practice for
              interviews, and accelerate your developer journey into the digital frontier.
            </p>
            <div className="mt-10">
              <Button size="lg" className="bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(56,189,248,0.8)]" asChild>
                <Link href="/dashboard">
                  Engage AI Co-Pilot <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">About DevPro Ascent</h2>
              <p className="mt-4 text-lg text-gray-400">
                We are a collective of engineers and AI researchers dedicated to building the future of career development. We believe in empowering developers with the tools they need to navigate the complexities of the tech industry and achieve their highest potential.
              </p>
            </div>
             <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedCounter to={15000} label="Resumes Generated" />
              <AnimatedCounter to={25000} label="Coding Problems Solved" />
              <AnimatedCounter to={98} label="User Satisfaction (%)" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">Core Matrix</h2>
              <p className="mt-4 text-lg text-gray-400">
                Harness cutting-edge tools forged for the modern software engineer.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <SpotlightCard key={i}>
                  <CardHeader className="items-center text-center">
                    <div className="p-4 bg-gray-800 border border-cyan-500/30 rounded-lg group-hover:scale-110 transition-transform">
                       {feature.icon}
                    </div>
                    <CardTitle className="text-2xl pt-4 font-headline tracking-wider text-gray-100">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </SpotlightCard>
              ))}
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
           <div className="container mx-auto px-4 max-w-3xl">
             <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-cyan-400">Establish Connection</h2>
              <p className="mt-4 text-lg text-gray-400">
                Have a question or want to work together? Drop us a line.
              </p>
            </div>
            <div className="mt-16 max-w-2xl mx-auto">
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
            &copy; {new Date().getFullYear()} DevPro Ascent // All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
