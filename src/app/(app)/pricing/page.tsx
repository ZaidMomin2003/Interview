// src/app/(app)/pricing/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserData } from '@/hooks/use-user-data';

const pricingTiers = [
    {
      name: 'Cadet',
      monthlyPrice: 9,
      yearlyPrice: 7,
      description: 'Perfect for getting started and sharpening core skills.',
      features: [
        '10 AI Mock Interviews',
        '60 Coding Questions',
        '30 Notes Generations',
        'Community Support',
      ],
      cta: 'Choose Cadet',
      href: '/signup',
    },
    {
      name: 'Gladiator',
      monthlyPrice: 29,
      yearlyPrice: 23,
      description: 'For those serious about landing their next big role.',
      features: [
        '40 AI Mock Interviews',
        '160 Coding Questions',
        '100 Notes Generations',
        'Priority Email Support',
      ],
      cta: 'Choose Gladiator',
      href: '/signup',
      popular: true,
    },
    {
      name: 'Champion',
      monthlyPrice: 49,
      yearlyPrice: 39,
      description: 'For dedicated developers aiming for the top.',
      features: [
        '60 AI Mock Interviews',
        '200 Coding Questions',
        '180 Notes Generations',
        'Dedicated Support Channel',
      ],
      cta: 'Choose Champion',
      href: '/signup',
    },
    {
        name: 'Legend',
        monthlyPrice: 99,
        yearlyPrice: 79,
        description: 'The ultimate toolkit for elite performers.',
        features: [
          '120 AI Mock Interviews',
          '400 Coding Questions',
          '400 Notes Generations',
          '24/7 Premium Support',
        ],
        cta: 'Choose Legend',
        href: '/signup',
    },
  ];


export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);
    const { profile } = useUserData();

    // This would be replaced with actual subscription data from the profile
    const currentPlan = "Gladiator";

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
                <p className="mt-2 text-muted-foreground">
                    Choose the plan that best fits your career goals.
                </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <Label htmlFor="billing-cycle" className="font-medium">Monthly</Label>
              <Switch
                id="billing-cycle"
                checked={isYearly}
                onCheckedChange={setIsYearly}
                aria-label="Switch between monthly and yearly billing"
              />
              <Label htmlFor="billing-cycle" className="font-medium flex items-center">
                Yearly
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-900 text-green-300">
                  Save 20%
                </span>
              </Label>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-start max-w-7xl mx-auto">
                {pricingTiers.map((tier) => (
                    <Card key={tier.name} className={cn(
                        "bg-card border flex flex-col transition-all duration-300 h-full",
                        tier.name === currentPlan ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border-border'
                    )}>
                        {tier.popular && (
                        <div className="text-center py-1 bg-primary text-primary-foreground font-bold text-sm rounded-t-lg">MOST POPULAR</div>
                        )}
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-headline text-foreground">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                            <div className="text-5xl font-bold text-primary pt-4">
                                ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                                <span className="text-xl font-normal text-muted-foreground">/ month</span>
                            </div>
                            {isYearly && tier.monthlyPrice > 0 && (
                                <p className="text-sm text-muted-foreground">Billed as ${tier.yearlyPrice * 12} per year</p>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-4">
                                {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-foreground">{feature}</span>
                                li>
                                ))}
                            </ul>
                        </CardContent>
                        <div className="p-6 pt-0">
                            <Button disabled={tier.name === currentPlan} className="w-full">
                                {tier.name === currentPlan ? 'Current Plan' : `Switch to ${tier.name}`}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
