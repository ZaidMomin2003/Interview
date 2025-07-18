import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Check, Rocket } from 'lucide-react';
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
  
  const pricingTiers = [
    {
      name: 'Hobbyist',
      price: '$0',
      description: 'Perfect for getting started and exploring the platform.',
      features: ['Basic Resume Generation', '5 Coding Questions/month', 'Limited AI Feedback'],
      cta: 'Start for Free',
      href: '/dashboard',
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For the serious developer ready to accelerate their career.',
      features: ['Advanced Resume Generation', 'Resume Optimization', 'Unlimited Coding Questions', 'Priority AI Feedback', 'Performance Analytics'],
      cta: 'Get Started with Pro',
      href: '/dashboard',
      popular: true,
    },
    {
      name: 'Team',
      price: '$39',
      description: 'Equip your entire team with the best career development tools.',
      features: ['Everything in Pro', 'Team Management', 'Shared Question Banks', 'Centralized Billing'],
      cta: 'Contact Sales',
      href: '#',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background grid-bg"></div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
             <Rocket className="h-6 w-6 text-foreground" />
            <span className="font-bold font-headline text-lg">DevPro Ascent</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-1">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Start a Free Trial</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 sm:py-32 md:py-40">
          <div className="container px-4 text-center">
            <p className="text-sm font-medium text-muted-foreground mb-3">Latest AI Integration Just Arrived</p>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl font-headline">
              Boost Your Developer Career
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Best analytics & prep app for developers, consultants, and engineering students. Get AI-powered feedback, generate resumes, and practice for interviews.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Start a Free Trial <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>
        
        <section id="features" className="py-20 sm:py-24">
          <div className="container px-4">
            <div className="text-left max-w-3xl mx-auto">
                <p className="text-sm font-medium text-muted-foreground mb-2">Features</p>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">The Tools That Deliver Real Results</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Our proven methods help you climb the career ladder faster than ever, with no technical skill gaps required.
                </p>
            </div>
             <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle>Resume Studio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Generate tailored resumes from scratch or optimize your existing one to match any job description perfectly.</p>
                </CardContent>
              </Card>
               <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle>Coding Gym</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Practice with AI-generated coding questions and get instant, in-depth feedback on your solutions.</p>
                </CardContent>
              </Card>
               <Card className="bg-secondary/30 border-white/10">
                <CardHeader>
                  <CardTitle>AI-Powered Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Track your progress, identify areas for improvement, and see your skills grow over time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        <section id="pricing" className="py-20 sm:py-24">
          <div className="container px-4">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">Pricing</p>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Flexible Pricing for Every Ambition</h2>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={`flex flex-col border-white/10 ${tier.popular ? 'bg-secondary' : 'bg-secondary/30'}`}>
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription className="pt-2">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col">
                    <div className="text-4xl font-bold font-headline mb-4">{tier.price}<span className="text-sm font-normal text-muted-foreground">/ month</span></div>
                    <ul className="space-y-2 text-muted-foreground">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-foreground" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                     <Button asChild className={`w-full ${tier.popular ? '' : 'bg-secondary'}`}>
                      <Link href={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 sm:py-24">
           <div className="container px-4 max-w-3xl mx-auto">
              <div className="text-left">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Your Questions Answered</h2>
                 <p className="mt-4 text-lg text-muted-foreground">
                  Find answers to common questions about DevPro Ascent.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full mt-12">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i + 1}`} className="border-white/10">
                    <AccordionTrigger className="text-lg text-left hover:text-foreground/80 hover:no-underline">
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

      <footer className="bg-background border-t border-white/10">
        <div className="container py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} DevPro Ascent. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
