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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-accent"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.59L7.41 13 9 11.41l2 2 4.59-4.59L17 10.41 11 16.59z" />
            </svg>
            <span className="font-bold font-headline text-lg">Dataly</span>
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
              Empowering your business with <span className="text-accent">data driven insights</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
             Founded by a team of data enthusiasts and industry experts, we specialize in developing cutting-edge fixed analytics platforms designed to meet the needs of businesses of all sizes.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-32 bg-secondary">
          <div className="container px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Our Values</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Empower your product team to make smarter decisions and drive innovation with our advanced analytics platform.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
               <Card className="bg-card hover:border-accent transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Innovation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">We continuously push the boundaries of technology to deliver the latest in analytics solutions.</p>
                    <Image src="https://placehold.co/400x200.png" alt="Innovation chart" width={400} height={200} className="w-full h-auto rounded-md" data-ai-hint="chart graph" />
                  </CardContent>
                </Card>
                <Card className="bg-card hover:border-accent transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Customer Centricity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Your success is our priority. We strive to provide exceptional support and tailor our solutions to meet your unique needs.</p>
                     <Image src="https://placehold.co/400x200.png" alt="Customer Centricity chart" width={400} height={200} className="w-full h-auto rounded-md" data-ai-hint="data table" />
                  </CardContent>
                </Card>
                <Card className="bg-card hover:border-accent transition-colors duration-300 md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">Integrity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">We are committed to transparency and honesty in all our interactions, ensuring you receive reliable and accurate insights.</p>
                     <Image src="https://placehold.co/400x200.png" alt="Integrity chart" width={400} height={200} className="w-full h-auto rounded-md" data-ai-hint="dashboard metrics" />
                  </CardContent>
                </Card>
            </div>
          </div>
        </section>
        
        <section className="py-20 sm:py-32">
           <div className="container px-4 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">Our Team</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Our team is our greatest asset. We bring together a diverse group of talented professionals with a shared passion for data and innovation.
              </p>
              <div className="mt-16 grid gap-8 sm:grid-cols-2 md:grid-cols-4 justify-center">
                {[
                  {name: 'Jane Smith', role: 'CEO & Co-Founder', hint: 'woman portrait'},
                  {name: 'John Doe', role: 'CTO & Co-Founder', hint: 'man portrait'},
                  {name: 'Emily White', role: 'Head of Data Science', hint: 'woman smiling'},
                  {name: 'Michael Brown', role: 'Lead Engineer', hint: 'man glasses'},
                ].map((member) => (
                  <div key={member.name}>
                    <Image src="https://placehold.co/200x200.png" alt={member.name} width={200} height={200} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" data-ai-hint={member.hint} />
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
           </div>
        </section>

      </main>

      <footer className="bg-secondary border-t">
        <div className="container py-8 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Dataly. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
