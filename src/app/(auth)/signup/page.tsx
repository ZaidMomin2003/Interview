// src/app/(auth)/signup/page.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cpu, FileText, CodeXml, Video, Star, Eye, EyeOff, Github, Linkedin } from 'lucide-react';


const signupFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});


const TrustFeature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string}) => (
    <div className="flex items-start gap-4">
        <div className="p-2 bg-primary/20 rounded-full">{icon}</div>
        <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.88-6.88C35.84 2.61 30.34 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.42-4.55H24v8.51h12.8c-.57 3.01-2.2 5.56-4.81 7.32l7.6 5.89C44.43 38.13 47.16 31.95 46.98 24.55z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.6-5.89c-2.16 1.45-4.92 2.3-8.29 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);


export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { loginWithGoogle, signupWithEmail, loginWithGithub, loginWithLinkedin } = useAuth();
  
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { email: "", password: "" },
  });


  async function handleGoogleSignUp() {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push('/onboarding');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
       setIsLoading(false);
    }
  }

  async function handleGithubSignUp() {
    setIsLoading(true);
    try {
      await loginWithGithub();
      router.push('/onboarding');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
       setIsLoading(false);
    }
  }
  
  async function handleLinkedinSignUp() {
    setIsLoading(true);
    try {
      await loginWithLinkedin();
      router.push('/onboarding');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
       setIsLoading(false);
    }
  }
  
  async function handleEmailSignUp(values: z.infer<typeof signupFormSchema>) {
    setIsLoading(true);
    try {
      await signupWithEmail(values.email, values.password);
      router.push('/onboarding');
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Sign Up Failed',
            description: error.message || 'Could not create account. The email may already be in use.',
        });
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
            <h1 className="text-4xl font-bold font-headline mb-4 text-foreground">Join Thousands of Developers Ascending Their Careers</h1>
            <p className="text-muted-foreground mb-8 max-w-lg">
                Unlock your potential with a suite of AI-powered tools designed to get you hired and promoted.
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
           <Card className="w-full max-w-md bg-secondary/30 border-border backdrop-blur-sm">
              <CardHeader className="text-center">
                  <div className="lg:hidden mb-4">
                      <Link href="/" className="flex items-center gap-2 justify-center">
                        <Cpu className="h-8 w-8 text-primary" />
                        <span className="font-headline text-2xl font-bold tracking-widest text-foreground uppercase">
                          Talxify
                        </span>
                      </Link>
                  </div>
                <CardTitle className="text-foreground text-2xl">Create Your Account</CardTitle>
                <CardDescription className="text-muted-foreground">Join the ascent. It's free to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleEmailSignUp)} className="space-y-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" placeholder="ada@example.com" {...field} disabled={isLoading} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input 
                                            type={showPassword ? "text" : "password"} 
                                            placeholder="••••••••" 
                                            {...field} 
                                            disabled={isLoading} 
                                            className="pr-10"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            <span className="sr-only">Toggle password visibility</span>
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </Button>
                    </form>
                </Form>
                 <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border"></span>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-secondary px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    <Button onClick={handleGoogleSignUp} disabled={isLoading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="outline">
                        {isLoading ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
                    </Button>
                     <Button onClick={handleGithubSignUp} disabled={isLoading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="outline">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Github />}
                    </Button>
                     <Button onClick={handleLinkedinSignUp} disabled={isLoading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80" variant="outline">
                        {isLoading ? <Loader2 className="animate-spin" /> : <Linkedin />}
                    </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link href="/login" className="font-medium text-primary hover:underline">
                          Sign in
                      </Link>
                  </p>
              </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
