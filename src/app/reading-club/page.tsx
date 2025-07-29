// src/app/reading-club/page.tsx
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ReadingClubPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-body">
      <div className="relative w-full max-w-sm rounded-3xl bg-black shadow-2xl overflow-hidden">
        <Image
          src="https://placehold.co/400x600.png"
          alt="Abstract background image of a temple"
          data-ai-hint="temple abstract"
          layout="fill"
          objectFit="cover"
          className="opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative p-6 flex flex-col h-[550px]">
          <div className="flex justify-between items-start">
            <div className="flex gap-1.5">
                <div className="w-12 h-12 rounded-lg bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <span className="text-xs font-bold opacity-70">NOV</span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-black">
                    <span className="text-xl font-bold">12</span>
                    <span className="text-xs font-bold opacity-70">Wed</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-sm">
              <Upload className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-auto text-white">
            <h1 className="text-4xl font-bold leading-tight font-headline">The Lotus Reading Club</h1>
            <p className="mt-2 text-white/80">
              This month's pick: Klara and the Sun by Kazuo Ishiguro
            </p>
          </div>

          <Button asChild size="lg" className="w-full mt-6 bg-white text-black hover:bg-gray-200 rounded-full text-base font-bold py-6">
            <Link href="#">Join the club</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
