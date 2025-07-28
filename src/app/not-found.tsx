// src/app/not-found.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, Home, Rocket } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center p-4">
      <div className="max-w-2xl w-full">
         <Image
            src="https://placehold.co/600x400.png"
            alt="An astronaut floating in space, looking confused."
            width={600}
            height={400}
            data-ai-hint="astronaut space"
            className="mx-auto rounded-lg mb-8"
        />

        <h1 className="text-6xl font-bold font-headline text-primary animate-pulse">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          Houston, we have a broken link.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          The page you're looking for seems to have drifted off into the cosmos. Let's get you back on course.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
                <Link href="/">
                    <Home className="mr-2" /> Go to Homepage
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
                 <Link href="/dashboard">
                    <Rocket className="mr-2" /> Go to Dashboard
                </Link>
            </Button>
        </div>

        <Card className="mt-16 w-full bg-secondary/30 text-left">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                    <Bot className="h-8 w-8 text-primary"/>
                </div>
                <div>
                    <CardTitle>Don't leave empty-handed!</CardTitle>
                    <p className="text-muted-foreground text-sm">Why not try one of our most popular features?</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                    <div>
                        <h3 className="font-semibold text-foreground">AI Interview Prep</h3>
                        <p className="text-sm text-muted-foreground">Practice with an AI that asks real questions.</p>
                    </div>
                    <Button variant="ghost" asChild>
                        <Link href="/interview-prep">
                            Start Session <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
