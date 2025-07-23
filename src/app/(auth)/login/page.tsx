// src/app/(auth)/login/page.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cpu, FileText, CodeXml, Video, CheckCircle, Star, Github } from 'lucide-react';

const TrustFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string}) => (
    <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/20 rounded-full">{icon}</div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      await login();
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background via-transparent to-background"></div>

      <div className="container grid lg:grid-cols-2 flex-grow items-center">
        {/* Left Side: Trust elements */}
        <div className="hidden lg:flex flex-col justify-center items-start p-12 text-left">
           <Link href="/" className="flex items-center gap-2 justify-center mb-8">
              <Cpu className="h-10 w-10 text-primary" />
              <span className="font-headline text-4xl font-bold tracking-widest text-foreground uppercase">
                Talxify
              </span>
            </Link>
            <h1 className="text-4xl font-bold font-headline mb-4 text-foreground">Welcome Back to Your Ascent</h1>
            <p className="text-muted-foreground mb-8 max-w-lg">
                Continue shaping your career with powerful AI tools at your fingertips.
            </p>
            <div className="space-y-6 mb-12">
                <TrustFeature icon={<FileText className="h-6 w-6 text-primary"/>} title="Resume Studio" description="Optimize your resume against any job description." />
                <TrustFeature icon={<CodeXml className="h-6 w-6 text-primary"/>} title="Coding Gym" description="Generate personalized questions and get instant feedback." />
                <TrustFeature icon={<Video className="h-6 w-6 text-primary"/>} title="AI Mock Interviews" description="Sharpen your skills with a realistic AI interviewer." />
            </div>
            <Card className="bg-secondary/30 border-border backdrop-blur-sm max-w-md">
                <CardContent className="p-6">
                    <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="text-amber-400 fill-amber-400" />)}
                    </div>
                    <blockquote className="text-foreground">
                        "The AI feedback on my resume was a game-changer. I landed my dream job at a FAANG company within a month of using Talxify."
                    </blockquote>
                    <p className="text-right font-semibold text-primary mt-4">&mdash; Alex D., Senior Software Engineer</p>
                </CardContent>
            </Card>
        </div>
        
        {/* Right Side: Form */}
        <div className="flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-secondary/30 border border-border backdrop-blur-sm">
            <CardHeader className="text-center">
               <div className="lg:hidden mb-4">
                  <Link href="/" className="flex items-center gap-2 justify-center">
                    <Cpu className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold tracking-widest text-foreground uppercase">
                      Talxify
                    </span>
                  </Link>
               </div>
              <CardTitle className="text-foreground text-2xl">Sign In</CardTitle>
              <CardDescription className="text-muted-foreground">Sign in to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGoogleLogin} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Github className="mr-2 h-5 w-5" /> Sign In with Google</>}
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
