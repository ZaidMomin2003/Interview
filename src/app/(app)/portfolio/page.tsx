// src/app/(app)/portfolio/page.tsx
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, ExternalLink, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PortfolioSchema, type Portfolio } from '@/ai/schemas';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

type PortfolioFormValues = Portfolio;

export default function PortfolioPage() {
  const { profile, loading, updatePortfolio } = useUserData();
  const { toast } = useToast();

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(PortfolioSchema),
    values: profile?.portfolio, // Use `values` to keep form in sync with profile
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills",
  });
  
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });
  
  const { fields: certFields, append: appendCert, remove: removeCert } = useFieldArray({
    control: form.control,
    name: "certifications",
  });
  
  const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control: form.control,
    name: "achievements",
  });
  
  const { fields: testimonialFields, append: appendTestimonial, remove: removeTestimonial } = useFieldArray({
    control: form.control,
    name: "testimonials",
  });

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const onSubmit = async (data: PortfolioFormValues) => {
    try {
      await updatePortfolio(data);
      toast({
        title: 'Portfolio Updated',
        description: 'Your changes have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    }
  };
  
  const handleShare = () => {
    if(!profile?.uid) return;
    const url = `${window.location.origin}/p/${profile.uid}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Your portfolio URL is now on your clipboard.",
    });
  }

  if (loading || !profile) {
    return (
       <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio Studio</h1>
            <p className="mt-2 text-muted-foreground">
              Craft your public-facing developer portfolio.
            </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={handleShare} disabled={!profile.portfolio?.isPublic}><Share2 className="mr-2"/> Share</Button>
           <Button asChild disabled={!profile.portfolio?.isPublic}>
             <Link href={`/p/${profile.uid}`} target="_blank">
                <Eye className="mr-2"/> View Public Page
             </Link>
           </Button>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic information for your public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable Public Portfolio</FormLabel>
                      <p className="text-sm text-muted-foreground">
                       Make your portfolio visible to everyone.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="displayName" render={({ field }) => (
                <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem><FormLabel>Bio / Tagline</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Senior Software Engineer specializing in Next.js and AI."/></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="e.g., San Francisco, CA" /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Showcase your top technologies and skills.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {skillFields.map((field, index) => (
                   <Badge key={field.id} variant="outline" className="text-base py-1 pl-3 pr-1 group">
                      {form.watch(`skills.${index}.name`)}
                      <Button type="button" variant="ghost" size="icon" className="h-6 w-6 ml-1 group-hover:text-destructive" onClick={() => removeSkill(index)}><Trash2 className="h-3 w-3"/></Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a new skill (e.g., React)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        appendSkill({ name: value });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                 <Button type="button" onClick={() => {
                   const input = document.querySelector<HTMLInputElement>('input[placeholder="Add a new skill (e.g., React)"]');
                   if(input?.value.trim()) {
                      appendSkill({ name: input.value.trim() });
                      input.value = '';
                   }
                 }}>Add</Button>
              </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Highlight your most important work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {projectFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4"/></Button>
                    <FormField control={form.control} name={`projects.${index}.title`} render={({ field }) => (
                      <FormItem><FormLabel>Project Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => (
                      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name={`projects.${index}.url`} render={({ field }) => (
                      <FormItem><FormLabel>Project URL</FormLabel><FormControl><Input {...field} placeholder="https://github.com/..." /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              ))}
               <Button type="button" variant="outline" onClick={() => appendProject({ title: '', description: '', url: '' })}><PlusCircle className="mr-2"/> Add Project</Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>List any professional certifications you have earned.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {certFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeCert(index)}><Trash2 className="h-4 w-4"/></Button>
                    <FormField control={form.control} name={`certifications.${index}.name`} render={({ field }) => (
                      <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`certifications.${index}.issuer`} render={({ field }) => (
                      <FormItem><FormLabel>Issuing Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name={`certifications.${index}.url`} render={({ field }) => (
                      <FormItem><FormLabel>Credential URL</FormLabel><FormControl><Input {...field} placeholder="https://credential.net/..." /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              ))}
               <Button type="button" variant="outline" onClick={() => appendCert({ name: '', issuer: '', url: '' })}><PlusCircle className="mr-2"/> Add Certification</Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Highlight key accomplishments, awards, or recognitions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {achievementFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeAchievement(index)}><Trash2 className="h-4 w-4"/></Button>
                    <FormField control={form.control} name={`achievements.${index}.description`} render={({ field }) => (
                      <FormItem><FormLabel>Achievement</FormLabel><FormControl><Input {...field} placeholder="e.g., Won 1st place in the 2023 National Hackathon" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`achievements.${index}.date`} render={({ field }) => (
                      <FormItem><FormLabel>Date</FormLabel><FormControl><Input {...field} placeholder="e.g., May 2023" /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              ))}
               <Button type="button" variant="outline" onClick={() => appendAchievement({ description: '', date: '' })}><PlusCircle className="mr-2"/> Add Achievement</Button>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Add quotes from colleagues or clients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {testimonialFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeTestimonial(index)}><Trash2 className="h-4 w-4"/></Button>
                    <FormField control={form.control} name={`testimonials.${index}.quote`} render={({ field }) => (
                      <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} placeholder="The testimonial text..."/></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField control={form.control} name={`testimonials.${index}.authorName`} render={({ field }) => (
                        <FormItem><FormLabel>Author's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name={`testimonials.${index}.authorRole`} render={({ field }) => (
                        <FormItem><FormLabel>Author's Role / Title</FormLabel><FormControl><Input {...field} placeholder="e.g., Senior Engineer at Acme" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </div>
                </div>
              ))}
               <Button type="button" variant="outline" onClick={() => appendTestimonial({ quote: '', authorName: '', authorRole: '' })}><PlusCircle className="mr-2"/> Add Testimonial</Button>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Add a personal FAQ section to your profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {faqFields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => removeFaq(index)}><Trash2 className="h-4 w-4"/></Button>
                    <FormField control={form.control} name={`faqs.${index}.question`} render={({ field }) => (
                      <FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`faqs.${index}.answer`} render={({ field }) => (
                      <FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              ))}
               <Button type="button" variant="outline" onClick={() => appendFaq({ question: '', answer: '' })}><PlusCircle className="mr-2"/> Add FAQ</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Links to your professional profiles.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
               <FormField control={form.control} name="socials.github" render={({ field }) => (
                <FormItem><FormLabel>GitHub</FormLabel><FormControl><Input {...field} placeholder="https://github.com/..." /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="socials.twitter" render={({ field }) => (
                <FormItem><FormLabel>Twitter / X</FormLabel><FormControl><Input {...field} placeholder="https://x.com/..." /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="socials.website" render={({ field }) => (
                <FormItem><FormLabel>Personal Website</FormLabel><FormControl><Input {...field} placeholder="https://..." /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
          
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
