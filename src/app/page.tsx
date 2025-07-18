import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeXml, FileText, Bot, Rocket, BrainCircuit, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-accent" />,
      title: 'AI Resume Builder',
      description: 'Craft the perfect, professional resume tailored to your dream job in minutes. Let our AI handle the formatting and keywords.',
      dataAiHint: 'resume professional',
    },
    {
      icon: <Rocket className="h-10 w-10 text-accent" />,
      title: 'Resume Optimization',
      description: 'Get actionable feedback on your existing resume. Our AI analyzes your resume against job descriptions to boost your chances.',
      dataAiHint: 'rocket launch',
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-accent" />,
      title: 'Dynamic Question Generator',
      description: 'Sharpen your coding skills with personalized questions. Tailored to your skill level, preferred languages, and topics.',
      dataAiHint: 'brain circuit',
    },
    {
      icon: <CodeXml className="h-10 w-10 text-accent" />,
      title: 'Integrated Code Editor',
      description: 'Solve problems directly in our sleek, integrated code editor with syntax highlighting and a clean interface.',
      dataAiHint: 'code editor',
    },
    {
      icon: <Sparkles className="h-10 w-10 text-accent" />,
      title: 'AI-Powered Code Feedback',
      description: 'Submit your solutions and receive instant, detailed feedback. Understand your mistakes and learn more efficient approaches.',
      dataAiHint: 'AI feedback',
    },
    {
      icon: <Bot className="h-10 w-10 text-accent" />,
      title: 'Your Career Copilot',
      description: 'DevPro Ascent is more than a set of tools; it\'s your partner in navigating the tech landscape and achieving your career goals.',
      dataAiHint: 'robot assistant',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Rocket className="h-6 w-6 text-accent" />
            <span className="font-bold font-headline text-lg">DevPro Ascent</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Sign In</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="container px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-headline">
              Ascend to Your <span className="text-accent">Dream Tech Career</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              AI-powered tools to build your resume, sharpen your coding skills, and land your next big role. Your ascent starts here.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard">Start Building For Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-32 bg-secondary">
          <div className="container px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">The Ultimate Developer Toolkit</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Everything you need to prepare for the competitive tech market, all in one place.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="bg-card hover:border-accent transition-colors duration-300">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 sm:py-32">
           <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">From Blank Page to Job Offer</h2>
                    <p className="mt-4 text-lg text-muted-foreground">DevPro Ascent streamlines your entire job application process. Generate a compelling resume with our AI, practice with tailored coding questions, and get instant feedback to improve. Stop juggling tools and start focusing on what matters: your career growth.</p>
                    <div className="mt-8 flex gap-4">
                        <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/dashboard">Start Your Ascent</Link>
                        </Button>
                    </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-2xl">
                     <Image src="https://placehold.co/600x400.png" alt="DevPro Ascent Application Screenshot" width={600} height={400} className="w-full h-auto" data-ai-hint="dashboard application" />
                </div>
           </div>
        </section>

      </main>

      <footer className="bg-secondary border-t">
        <div className="container py-8 flex items-center justify-between">
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
