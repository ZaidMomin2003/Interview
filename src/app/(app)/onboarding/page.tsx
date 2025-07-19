// src/app/(app)/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase, GraduationCap, Building, Code, Smartphone, Link as LinkIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const onboardingSchema = z.object({
  status: z.enum(['student', 'employee']),
  languages: z.array(z.string()).min(1, 'Please select at least one language.'),
  university: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: 'status', title: 'What is your current status?', fields: ['status'] },
  { id: 'languages', title: 'Which languages are you proficient in?', fields: ['languages'] },
  { id: 'university', title: 'What university are you attending?', fields: ['university'], dependsOn: 'status', expectedValue: 'student' },
  { id: 'socials', title: 'Connect your social accounts (optional)', fields: ['linkedin', 'github', 'instagram', 'twitter'] },
  { id: 'phone', title: 'What is your phone number? (optional)', fields: ['phone'] },
];

const languageOptions = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'csharp', label: 'C#' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'cpp', label: 'C++' },
    { id: 'ruby', label: 'Ruby' },
    { id: 'go', label: 'Go' },
    { id: 'swift', label: 'Swift' },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const methods = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      languages: [],
    },
  });
  const { handleSubmit, trigger, getValues, watch } = methods;

  const watchedStatus = watch('status');

  const processForm = (data: OnboardingData) => {
    setIsLoading(true);
    console.log('Onboarding data:', data);
    // Here you would typically save the data to your backend/Firestore
    toast({
      title: 'Onboarding Complete!',
      description: "Welcome! We're redirecting you to your dashboard.",
    });
    setTimeout(() => router.push('/dashboard'), 1000);
  };

  const nextStep = async () => {
    const activeStep = steps[currentStep];
    const fields = activeStep.fields as (keyof OnboardingData)[];
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return;

    let nextStepIndex = currentStep + 1;
    // Skip university step if user is an employee
    if (activeStep.id === 'languages' && getValues('status') === 'employee') {
      nextStepIndex++;
    }

    if (nextStepIndex < steps.length) {
      setCurrentStep(nextStepIndex);
    } else {
      handleSubmit(processForm)();
    }
  };

  const prevStep = () => {
    let prevStepIndex = currentStep - 1;
    if (steps[prevStepIndex].id === 'university' && getValues('status') === 'employee') {
        prevStepIndex--;
    }
    if (prevStepIndex >= 0) {
      setCurrentStep(prevStepIndex);
    }
  };
  
  const totalSteps = steps.filter(step => {
    if (step.dependsOn) {
      return getValues(step.dependsOn as keyof OnboardingData) === step.expectedValue;
    }
    return true;
  }).length;

  const currentProgress = (currentStep + 1) / totalSteps * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-gray-200">
      <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-black via-transparent to-black"></div>

      <div className="w-full max-w-xl p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(processForm)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-8">
                  <div className="space-y-2 text-center">
                    <p className="text-cyan-400 font-semibold">Step {currentStep + 1} of {totalSteps}</p>
                    <h1 className="text-3xl font-bold font-headline">{steps[currentStep].title}</h1>
                  </div>

                  <div className="min-h-[250px] flex items-center justify-center">
                    {currentStep === 0 && <StatusStep />}
                    {currentStep === 1 && <LanguagesStep />}
                    {currentStep === 2 && watchedStatus === 'student' && <UniversityStep />}
                    {currentStep === 3 && <SocialsStep />}
                    {currentStep === 4 && <PhoneStep />}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <Progress value={currentProgress} className="mb-4 h-2 bg-gray-800" />
              <div className="flex justify-between items-center">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={currentStep === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="button" onClick={nextStep} className="bg-cyan-400 text-black hover:bg-cyan-300" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

const SelectionBox = ({ icon, label, isSelected, onSelect }: { icon: ReactNode, label: string, isSelected: boolean, onSelect: () => void }) => (
  <div
    onClick={onSelect}
    className={cn(
      "flex flex-col items-center justify-center p-8 rounded-lg border-2 cursor-pointer transition-all duration-200 w-48 h-48",
      isSelected ? "bg-cyan-400/20 border-cyan-400 scale-105" : "bg-gray-800/50 border-gray-700 hover:border-cyan-500"
    )}
  >
    {icon}
    <p className="mt-4 font-semibold text-lg">{label}</p>
  </div>
);

const StatusStep = () => {
  const { setValue, watch } = useFormContext<OnboardingData>();
  const status = watch('status');
  return (
    <div className="flex gap-8">
      <SelectionBox icon={<GraduationCap className="h-16 w-16 text-cyan-400" />} label="Student" isSelected={status === 'student'} onSelect={() => setValue('status', 'student', { shouldValidate: true })} />
      <SelectionBox icon={<Briefcase className="h-16 w-16 text-cyan-400" />} label="Employee" isSelected={status === 'employee'} onSelect={() => setValue('status', 'employee', { shouldValidate: true })} />
    </div>
  );
};

const LanguagesStep = () => {
  const { setValue, watch } = useFormContext<OnboardingData>();
  const selectedLanguages = watch('languages') || [];

  const handleLanguageToggle = (langId: string) => {
    const newLangs = selectedLanguages.includes(langId)
      ? selectedLanguages.filter(l => l !== langId)
      : [...selectedLanguages, langId];
    setValue('languages', newLangs, { shouldValidate: true });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {languageOptions.map(lang => (
        <Label
          key={lang.id}
          htmlFor={`lang-${lang.id}`}
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
            selectedLanguages.includes(lang.id) ? "bg-cyan-400/20 border-cyan-400" : "bg-gray-800/50 border-gray-700 hover:border-cyan-500"
          )}
        >
          <Code className="h-6 w-6 text-cyan-400" />
          <p className="font-semibold">{lang.label}</p>
          <Checkbox 
            id={`lang-${lang.id}`}
            checked={selectedLanguages.includes(lang.id)} 
            onCheckedChange={() => handleLanguageToggle(lang.id)}
            className="ml-auto h-5 w-5" 
          />
        </Label>
      ))}
    </div>
  );
};

const UniversityStep = () => {
  const { register } = useFormContext<OnboardingData>();
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="university" className="flex items-center gap-2 text-cyan-400"><Building className="h-5 w-5"/> University Name</Label>
      <Input id="university" {...register('university')} placeholder="e.g., University of Technology" className="bg-gray-800 border-gray-700 text-gray-200" />
    </div>
  );
};

const SocialsStep = () => {
    const { register } = useFormContext<OnboardingData>();
    const socialFields: { name: keyof OnboardingData, placeholder: string }[] = [
        { name: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
        { name: 'github', placeholder: 'https://github.com/...' },
        { name: 'twitter', placeholder: 'https://x.com/...' },
        { name: 'instagram', placeholder: 'https://instagram.com/...' },
    ];

    return (
        <div className="w-full max-w-sm space-y-4">
            {socialFields.map(field => (
                <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name} className="capitalize flex items-center gap-2 text-cyan-400">
                        <LinkIcon className="h-5 w-5" /> {field.name}
                    </Label>
                    <Input id={field.name} {...register(field.name as any)} placeholder={field.placeholder} className="bg-gray-800 border-gray-700 text-gray-200" />
                </div>
            ))}
        </div>
    );
};

const PhoneStep = () => {
  const { register } = useFormContext<OnboardingData>();
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="phone" className="flex items-center gap-2 text-cyan-400"><Smartphone className="h-5 w-5"/> Phone Number</Label>
      <Input id="phone" type="tel" {...register('phone')} placeholder="+1 (555) 123-4567" className="bg-gray-800 border-gray-700 text-gray-200"/>
    </div>
  );
};
