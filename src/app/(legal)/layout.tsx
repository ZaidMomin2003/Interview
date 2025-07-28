// src/app/(legal)/layout.tsx
import { Button } from '@/components/ui/button';
import { Cpu } from 'lucide-react';
import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Cpu className="h-8 w-8 text-primary" />
                    <span className="font-headline text-2xl font-bold tracking-widest text-foreground uppercase">
                    Talxify
                    </span>
                </Link>
                <Button asChild variant="outline">
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </header>
        <main className="flex-1">
            <div className="container mx-auto max-w-4xl py-12 px-4">
                <div className="prose prose-invert max-w-none prose-h1:text-primary prose-h1:font-headline prose-h2:font-headline prose-a:text-primary hover:prose-a:text-primary/80">
                    {children}
                </div>
            </div>
        </main>
         <footer className="border-t border-border">
            <div className="container mx-auto py-8 text-center text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Talxify. All rights reserved.</p>
                <p>Made with 💓 By Zaid</p>
            </div>
        </footer>
    </div>
  );
}
