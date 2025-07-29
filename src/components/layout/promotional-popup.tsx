// src/components/layout/promotional-popup.tsx
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cpu, X, Bot, CodeXml, Notebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export default function PromotionalPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        { 
            icon: <Bot className="h-5 w-5" />, 
            title: "AI Interviews", 
            description: "Practice with a realistic AI that asks relevant technical & behavioral questions." 
        },
        { 
            icon: <CodeXml className="h-5 w-5" />, 
            title: "Coding Gym", 
            description: "Solve problems and get instant, side-by-side analysis of your code vs. optimal solutions." 
        },
        { 
            icon: <Notebook className="h-5 w-5" />, 
            title: "AI Notes", 
            description: "Instantly generate structured notes on any software development topic." 
        },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const featureInterval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(featureInterval);
    }, [isOpen, features.length]);


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="p-0 border-0 bg-transparent w-full max-w-sm shadow-2xl">
                <div className="relative w-full rounded-3xl bg-black overflow-hidden aspect-[9/14] border-2 border-primary">
                    <Image
                      src="/popup.png"
                      alt="Abstract background image of a futuristic landscape"
                      layout="fill"
                      objectFit="cover"
                      className="opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="relative p-6 flex flex-col h-full text-white">
                        
                        <div className="flex justify-between items-start">
                             <div className="w-14 h-14 rounded-lg bg-primary/20 backdrop-blur-sm flex flex-col items-center justify-center text-primary p-2 border border-primary/20">
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
                            
                            <div className="mt-4 space-y-3">
                                {features.map((feature, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setActiveFeature(index)}
                                        className={cn(
                                            "w-full text-left p-3 rounded-lg border transition-all duration-300",
                                            activeFeature === index 
                                                ? "bg-primary/20 border-accent" 
                                                : "bg-white/5 border-white/10 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("p-2 rounded-md", activeFeature === index ? "bg-primary/30 text-primary-foreground" : "bg-white/10")}>{feature.icon}</div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                                                <p className={cn(
                                                    "text-xs transition-all duration-300 ease-in-out overflow-hidden",
                                                    activeFeature === index ? "max-h-10 text-muted-foreground mt-1" : "max-h-0"
                                                )}>
                                                   {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
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
