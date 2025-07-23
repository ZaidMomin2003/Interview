// src/app/(app)/pricing/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, ShieldCheck, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

const faqs = [
    {
        question: 'What happens if I cancel my subscription?',
        answer: 'You can cancel your subscription at any time. You will retain access to all your plan\'s features until the end of your current billing period. We do not offer refunds for partial periods.'
    },
    {
        question: 'Can I upgrade or downgrade my plan?',
        answer: 'Yes, you can change your plan at any time from your account settings. When you upgrade, you will be charged a prorated amount for the remainder of the billing cycle. Downgrades will take effect at the start of your next billing cycle.'
    },
    {
        question: 'What AI models do you use?',
        answer: 'Talxify is powered by Google\'s state-of-the-art Gemini family of models. This allows us to provide advanced capabilities in text generation, code analysis, and conversational AI for a top-tier user experience.'
    },
    {
        question: 'How does the AI Resume Optimization work?',
        answer: 'You provide your resume and a target job description. Our AI analyzes both, identifies key skills and keywords from the job description, and suggests improvements to your resume to align it better with the role. It helps you get past automated screening systems (ATS) and catch a recruiter\'s eye.'
    },
    {
        question: 'Is my data secure?',
        answer: 'Absolutely. We prioritize your privacy and data security. All personal information and user-generated content are encrypted and handled with the strictest confidentiality. We do not share your data with third parties.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, including Visa, Mastercard, and American Express. All payments are processed securely through our payment provider, Stripe.'
    }
];


export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Find the Plan That's Right for You</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose your level of engagement. No hidden fees. Upgrade, downgrade, or cancel anytime.
        </p>
        <div className="mt-8 flex items-center justify-center space-x-4">
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
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 items-start">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className={cn(
            "bg-secondary/30 border-border flex flex-col transition-all duration-300 hover:border-primary hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-2 h-full",
            tier.popular ? 'border-2 border-primary shadow-[0_0_25px_hsl(var(--primary)_/_0.4)]' : ''
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
                  </li>
                ))}
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
               <Button className="w-full transition-all duration-300" asChild>
                <a href={tier.href}>{tier.cta}</a>
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      {/* FAQ Section */}
        <section id="faq" className="py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Frequently Asked Questions</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Your questions, answered.
                    </p>
                </div>
                <div className="mt-12">
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="bg-secondary/30 border-border/50 rounded-lg mb-4 p-2 transition-all hover:bg-secondary/50">
                                <AccordionTrigger className="text-lg text-left font-semibold text-foreground hover:text-primary transition-colors duration-300 p-4">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base p-4 pt-0">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    </div>
  );
}
