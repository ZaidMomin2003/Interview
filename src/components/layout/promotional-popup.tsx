// src/components/layout/promotional-popup.tsx
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
    "Ace interviews with an AI that asks real questions.",
    "Optimize your resume against any job description.",
    "Sharpen your skills in a personalized coding gym.",
    "Build a public portfolio to showcase your talent."
];

const POPUP_SEEN_KEY = 'talxify_popup_seen';

export default function PromotionalPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem(POPUP_SEEN_KEY);
        if (!hasSeenPopup) {
            // Add a small delay to let the user see the page first
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md bg-secondary/50 border-primary/20 backdrop-blur-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-primary text-center">
                        Stay on Top of the Competition
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground pt-2">
                        Unlock your full potential with Talxify's AI-powered toolkit, designed to help you land your dream job in tech.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                    <ul className="space-y-3">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                <span className="text-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <Button asChild size="lg" className="w-full">
                    <Link href="/signup">
                        Get Started for Free <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </DialogContent>
        </Dialog>
    );
}