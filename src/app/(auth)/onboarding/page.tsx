// src/app/(auth)/onboarding/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Cpu } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { AuthGuard } from '@/hooks/use-auth';

const onboardingSchema = z.object({
  displayName: z.string().min(2, { message: "Please enter your name." }),
});

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updatePortfolio } = useUserData();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      displayName: "",
    },
  });

  useEffect(() => {
    if (!profileLoading && profile?.portfolio?.displayName) {
        // User already onboarded, redirect to dashboard
        router.replace('/dashboard');
    }
  }, [profile, profileLoading, router]);

  const onSubmit = async (values: z.infer<typeof onboardingSchema>) => {
    if (!user) return;
    try {
      await updatePortfolio({
        ...profile?.portfolio,
        displayName: values.displayName,
        isPublic: false, // Default to private
      });
      toast({
        title: "Welcome to Talxify!",
        description: "Your profile has been created.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Onboarding Failed',
        description: error.message || "Could not save your information.",
      });
    }
  };
  
  const isLoading = authLoading || profileLoading || form.formState.isSubmitting;

  if (authLoading || profileLoading) {
     return (
        <div className="flex min-h-screen w-full bg-background items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Cpu className="h-12 w-12 text-primary animate-pulse" />
              <p className="text-muted-foreground">Loading Profile...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md bg-secondary/30 border border-border">
          <CardHeader className="text-center">
            <div className="flex items-center gap-2 justify-center mb-4">
                <Cpu className="h-8 w-8 text-primary" />
                <span className="font-headline text-2xl font-bold tracking-widest text-foreground uppercase">
                    Talxify
                </span>
            </div>
            <CardTitle>Welcome Aboard!</CardTitle>
            <CardDescription>Let's get your profile set up.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What should we call you?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ada Lovelace" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Continue to Dashboard'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
