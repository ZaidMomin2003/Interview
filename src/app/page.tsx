import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Check, Code, Cpu, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const faqs = [
    {
      question: 'What is DevPro Ascent?',
      answer: 'DevPro Ascent is an AI-powered career copilot for developers. It helps you generate and optimize resumes, practice for coding interviews, and get AI-driven feedback on your code to accelerate your career growth.',
    },
    {
      question: 'Who is this platform for?',
      answer: 'Our platform is designed for developers of all levels, from beginners preparing for their first job to senior engineers looking to hone their skills and land their next big role. If you write code, DevPro Ascent is for you.',
    },
    {
      question: 'How does the AI work?',
      answer: 'We leverage state-of-the-art generative AI models to provide our services. For resumes, the AI analyzes your experience and tailors it to job descriptions. For coding, it generates relevant questions and provides expert-level feedback on your solutions.',
    },
  ];

  const features = [
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: 'AI Resume Studio',
      description: 'Generate tailored resumes from scratch or optimize your existing one to match any job description perfectly.',
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: 'Coding Gym',
      description: 'Practice with AI-generated coding questions and get instant, in-depth feedback on your solutions.',
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: 'Skill Analytics',
      description: 'Track your progress, identify areas for improvement, and see your skills grow over time with our analytics.',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background grid-bg"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-transparent via-transparent to-background"></div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
              <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 7L12 12L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold font-headline text-lg">DevPro Ascent</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 sm:py-32 md:py-40">
          <div className="container px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Interface with Tomorrow
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Your AI-powered career co-pilot. Generate resumes, practice for interviews, and accelerate your developer journey.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Access The Grid <ArrowRight className="ml-2" /></Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 sm:py-24">
          <div className="container px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">System Capabilities</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Harness cutting-edge tools designed for the modern software engineer.
                </p>
            </div>
             <div className="mt-16 grid gap-4 md:grid-cols-3">
              {features.map((feature, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors duration-300">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="text-2xl pt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 sm:py-24">
           <div className="container px-4 max-w-3xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Incoming Transmissions</h2>
                 <p className="mt-4 text-lg text-muted-foreground">
                  Frequently Asked Queries.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full mt-12">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i + 1}`} className="border-primary/20 bg-card/50 backdrop-blur-sm rounded-lg px-4 mb-2">
                    <AccordionTrigger className="text-lg text-left hover:text-primary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
           </div>
        </section>
      </main>

      <footer className="bg-transparent border-t border-border/40">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DevPro Ascent // All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
