// src/app/(app)/resume-studio/page.tsx
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Trash2, Plus, Download } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';
import { generateResume, type ResumeInfo } from '@/ai/flows/generate-resume';
import { marked } from 'marked';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  duration: z.string().min(1, 'Duration is required'),
  responsibilities: z.string().min(1, 'Responsibilities are required'),
});

const educationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  university: z.string().min(1, 'University is required'),
  duration: z.string().min(1, 'Duration is required'),
});

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.string().min(1, 'Technologies are required'),
});

const resumeFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().url('Invalid URL').optional().or(z.literal('')),
  summary: z.string().min(10, 'Summary is too short.'),
  technologies: z.string().min(1, 'Please list some technologies.'),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
});


export default function ResumeStudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const { addHistoryItem } = useUserData();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      linkedin: '',
      github: '',
      summary: '',
      technologies: '',
      experience: [{ jobTitle: '', company: '', duration: '', responsibilities: '' }],
      education: [{ degree: '', university: '', duration: '' }],
      projects: [{ name: '', description: '', technologies: '' }],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control: form.control, name: "projects" });

  async function onSubmit(values: z.infer<typeof resumeFormSchema>) {
    setIsLoading(true);
    setGeneratedResume(null);
    try {
      const result = await generateResume(values as ResumeInfo);
      setGeneratedResume(result.resumeMarkdown);
      await addHistoryItem({
        type: 'Resume Generation',
        description: `Generated a new resume for ${values.fullName}.`,
      });
      toast({
        title: "Resume Generated!",
        description: "Your new resume is ready to be reviewed and downloaded.",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your resume. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const downloadAsPDF = async () => {
    const resumeContentElement = document.getElementById('resume-content');
    if (!resumeContentElement) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find resume content to download.' });
        return;
    }
    
    // Temporarily widen the element for better PDF capture
    resumeContentElement.style.width = '1024px';

    const canvas = await html2canvas(resumeContentElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
    });
    
    // Revert style
    resumeContentElement.style.width = '';

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('resume.pdf');
};


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Resume Studio</h1>
        <p className="text-muted-foreground mt-2">
          Craft a professional, ATS-friendly resume with the power of AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Resume Information</CardTitle>
            <CardDescription>Fill out your details below to generate your resume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="phoneNumber" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="linkedin" render={({ field }) => ( <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="github" render={({ field }) => ( <FormItem className="md:col-span-2"><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </div>
                </div>

                <FormField control={form.control} name="summary" render={({ field }) => ( <FormItem><FormLabel>Professional Summary</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="technologies" render={({ field }) => ( <FormItem><FormLabel>Skills & Technologies</FormLabel><FormControl><Textarea {...field} placeholder="e.g., JavaScript, React, Node.js, AWS..." /></FormControl><FormMessage /></FormItem> )} />

                {/* Experience */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    {expFields.map((field, index) => (
                        <Card key={field.id} className="p-4 space-y-2 relative">
                            <FormField control={form.control} name={`experience.${index}.jobTitle`} render={({ field }) => ( <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => ( <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`experience.${index}.duration`} render={({ field }) => ( <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} placeholder="e.g., Jan 2022 - Present" /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`experience.${index}.responsibilities`} render={({ field }) => ( <FormItem><FormLabel>Responsibilities</FormLabel><FormControl><Textarea {...field} placeholder="Describe your role and achievements..."/></FormControl><FormMessage /></FormItem> )} />
                             <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4" /></Button>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendExp({ jobTitle: '', company: '', duration: '', responsibilities: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
                </div>

                {/* Education */}
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Education</h3>
                    {eduFields.map((field, index) => (
                        <Card key={field.id} className="p-4 space-y-2 relative">
                            <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem><FormLabel>Degree/Certificate</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`education.${index}.university`} render={({ field }) => ( <FormItem><FormLabel>School/University</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`education.${index}.duration`} render={({ field }) => ( <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} placeholder="e.g., Aug 2018 - May 2022" /></FormControl><FormMessage /></FormItem> )} />
                             <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendEdu({ degree: '', university: '', duration: '' })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
                </div>
                
                {/* Projects */}
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Projects</h3>
                    {projFields.map((field, index) => (
                        <Card key={field.id} className="p-4 space-y-2 relative">
                            <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => ( <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name={`projects.${index}.technologies`} render={({ field }) => ( <FormItem><FormLabel>Technologies Used</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                             <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeProj(index)}><Trash2 className="h-4 w-4" /></Button>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendProj({ name: '', description: '', technologies: '' })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                </div>


                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Generate Resume
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 h-fit sticky top-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Generated Resume</CardTitle>
                <CardDescription>Review your AI-generated resume below.</CardDescription>
            </div>
            {generatedResume && (
                <Button onClick={downloadAsPDF}><Download className="mr-2 h-4 w-4" /> PDF</Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <div className="bg-muted h-8 w-3/4 rounded-md animate-pulse"></div>
                <div className="bg-muted h-6 w-full rounded-md animate-pulse"></div>
                <div className="bg-muted h-6 w-5/6 rounded-md animate-pulse"></div>
                <div className="bg-muted h-24 w-full rounded-md animate-pulse"></div>
                <div className="bg-muted h-16 w-full rounded-md animate-pulse"></div>
              </div>
            )}
            {generatedResume && (
               <div id="resume-content" className="prose prose-sm dark:prose-invert max-w-none prose-h1:text-2xl prose-h2:text-lg prose-h2:mt-2 prose-h2:mb-1 prose-ul:pl-4 prose-p:my-0 prose-strong:font-semibold bg-white text-black p-8 rounded-lg">
                <div
                    dangerouslySetInnerHTML={{
                      __html: marked(generatedResume),
                    }}
                  />
               </div>
            )}
            {!isLoading && !generatedResume && (
                <div className="text-center text-muted-foreground py-12">
                    <p>Your generated resume will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
