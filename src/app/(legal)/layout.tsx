// src/app/(legal)/layout.tsx
import { Button } from '@/components/ui/button';
import { Cpu, Github, Instagram, Linkedin } from 'lucide-react';
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
         <footer className="border-t border-border bg-secondary/30">
            <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">
                <div className="text-center md:text-left text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Talxify. All Rights Reserved.</p>
                <p>Made with 💓 by Zaid</p>
                </div>
                <div className="flex items-center gap-6">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
                </div>
                <div className="flex gap-4">
                <Link href="https://github.com/ZaidMomin2003" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-6 w-6" />
                </Link>
                <Link href="https://www.linkedin.com/in/arshad-momin-a3139b21b/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="https://www.instagram.com/zaidwontdo/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="h-6 w-6" />
                </Link>
                </div>
            </div>
            </div>
        </footer>
    </div>
  );
}
