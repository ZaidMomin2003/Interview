// src/components/layout/promotional-popup.tsx
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cpu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const POPUP_SEEN_KEY = 'talxify_popup_seen_v2';

export default function PromotionalPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem(POPUP_SEEN_KEY);
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 border-0 bg-transparent w-full max-w-sm shadow-2xl">
                <div className="relative w-full rounded-3xl bg-black overflow-hidden aspect-[9/14]">
                    <Image
                      src="https://placehold.co/400x600.png"
                      alt="Abstract background image of a futuristic landscape"
                      data-ai-hint="futuristic abstract"
                      layout="fill"
                      objectFit="cover"
                      className="opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="relative p-6 flex flex-col h-full text-white">
                        
                        <div className="flex justify-between items-start">
                             <div className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-white p-2 border border-white/20">
                                <Cpu className="w-8 h-8" />
                            </div>
                            <DialogClose asChild>
                                <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/20">
                                    <X className="h-5 w-5" />
                                </Button>
                            </DialogClose>
                        </div>

                        <div className="mt-auto">
                            <h1 className="text-4xl font-bold leading-tight font-headline">Welcome to Talxify</h1>
                            <p className="mt-2 text-white/80">
                              Your AI-powered co-pilot for acing interviews and accelerating your career.
                            </p>
                        </div>

                        <Button asChild size="lg" className="w-full mt-6 bg-white text-black hover:bg-gray-200 rounded-full text-base font-bold py-6">
                            <Link href="/signup">Join the Ascent</Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
