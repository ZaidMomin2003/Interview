// src/app/p/[userId]/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Portfolio } from '@/ai/schemas';

// As we can't use server-side services anymore, we'll make this page fully client-side.
// This is a placeholder component. A real implementation would fetch from a public endpoint
// or have data passed to it. For now, it shows a message.
export default function PublicPortfolioPage({ params }: { params: { userId: string } }) {
  
  return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold font-headline text-primary">Portfolio Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This portfolio is either private or does not exist.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
            (Public portfolio fetching from database is disabled in this version.)
        </p>
         <Button asChild className="mt-8">
            <Link href="/">Back to Home</Link>
         </Button>
      </div>
  );
}
