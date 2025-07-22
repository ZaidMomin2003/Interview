"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { handleGenerateResume, handleEnhanceResumeSection } from "@/lib/actions";
import { Loader2, Copy, Check, PlusCircle, Trash2, Sparkles } from "lucide-react";
import type { GenerateResumeOutput } from "@/ai/flows/generate-resume";
import { AnimatePresence, motion } from "framer-motion";

const experienceSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  startDate: z.string().min(4, "Start date is required"),
  endDate: z.string().min(4, "End date is required"),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

const projectSchema = z.object({
    name: z.string().min(2, "Project name is required"),
    description: z.string().min(10, "Description is required"),
    technologies: z.string().min(2, "Technologies are required"),
    link: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

const educationSchema = z.object({
    institution: z.string().min(3, "Institution name is required"),
    degree: z.string().min(3, "Degree is required"),
    graduationDate: z.string().min(4, "Graduation date is required"),
});

const resumeFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email(),
  phone: z.string().min(10, "Phone number is required."),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  summary: z.string().min(20, "Summary must be at least 20 characters."),
  experiences: z.array(experienceSchema).min(1, "At least one work experience is required."),
  projects: z.array(projectSchema).optional(),
  education: z.array(educationSchema).min(1, "At least one education entry is required."),
  skills: z.string().min(2, "Please list some skills."),
  desiredJob: z.string().min(3, "Desired job must be at least 3 characters."),
});

type ResumeFormData = z.infer<typeof resumeFormSchema>;

export function ResumeGenerator() {
  const [result, setResult] = useState<GenerateResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResumeFormData>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
      experiences: [{ jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" }],
      projects: [],
      education: [{ institution: "", degree: "", graduationDate: "" }],
      skills: "",
      desiredJob: "",
    },
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "experiences",
  });
  
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const enhanceSection = async (sectionType: string, fieldName: any, text: string) => {
    const uniqueId = `${fieldName}-${sectionType}`;
    setIsEnhancing(prev => ({ ...prev, [uniqueId]: true }));
    try {
        const result = await handleEnhanceResumeSection({ sectionType, text });
        form.setValue(fieldName, result.enhancedText, { shouldValidate: true });
        toast({ title: "Section Enhanced!", description: "The AI has improved this section." });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Enhancement Failed",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    } finally {
        setIsEnhancing(prev => ({ ...prev, [uniqueId]: false }));
    }
  };

  async function onSubmit(values: ResumeFormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleGenerateResume(values);
      setResult(response);
      toast({ title: "Resume Generated!", description: "Your new resume is ready." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = () => {
    if (result?.resume) {
      navigator.clipboard.writeText(result.resume);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Resume Details</CardTitle>
          <CardDescription>
            Fill in the sections below. Use the ✨ button to get AI writing assistance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Details */}
              <Section title="Personal Details">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Ada Lovelace" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="email" render={({ field }) => <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="ada.lovelace@example.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="phone" render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="linkedin" render={({ field }) => <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input placeholder="https://linkedin.com/in/..." {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="github" render={({ field }) => <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>} />
                  <FormField control={form.control} name="portfolio" render={({ field }) => <FormItem><FormLabel>Portfolio/Website URL</FormLabel><FormControl><Input placeholder="https://your-site.com" {...field} /></FormControl><FormMessage /></FormItem>} />
                </div>
              </Section>
              
              {/* Professional Summary */}
              <Section title="Professional Summary">
                <EnhancedTextArea control={form.control} name="summary" placeholder="A brief, powerful summary of your career..." onEnhance={enhanceSection} isEnhancing={isEnhancing['summary-Professional Summary']} />
              </Section>
              
              {/* Work Experience */}
              <Section title="Work Experience">
                <AnimatePresence>
                  {experienceFields.map((field, index) => (
                    <motion.div key={field.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 border rounded-lg bg-secondary/30 space-y-4 relative">
                        <FormField control={form.control} name={`experiences.${index}.jobTitle`} render={({ field }) => <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input placeholder="Software Engineer" {...field} /></FormControl><FormMessage /></FormItem>} />
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`experiences.${index}.company`} render={({ field }) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Tech Solutions Inc." {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name={`experiences.${index}.location`} render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="San Francisco, CA" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name={`experiences.${index}.startDate`} render={({ field }) => <FormItem><FormLabel>Start Date</FormLabel><FormControl><Input placeholder="Jan 2022" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name={`experiences.${index}.endDate`} render={({ field }) => <FormItem><FormLabel>End Date</FormLabel><FormControl><Input placeholder="Present" {...field} /></FormControl><FormMessage /></FormItem>} />
                        </div>
                        <EnhancedTextArea control={form.control} name={`experiences.${index}.description`} placeholder="Describe your responsibilities and achievements..." sectionType="Work Experience Description" onEnhance={enhanceSection} isEnhancing={isEnhancing[`experiences.${index}.description-Work Experience Description`]} />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button type="button" variant="outline" className="border-dashed" onClick={() => appendExperience({ jobTitle: "", company: "", location: "", startDate: "", endDate: "", description: "" })}><PlusCircle className="mr-2" /> Add Experience</Button>
              </Section>
              
              {/* Projects */}
              <Section title="Projects">
                <AnimatePresence>
                    {projectFields.map((field, index) => (
                         <motion.div key={field.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 border rounded-lg bg-secondary/30 space-y-4 relative">
                            <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input placeholder="My Awesome Project" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <FormField control={form.control} name={`projects.${index}.technologies`} render={({ field }) => <FormItem><FormLabel>Technologies Used</FormLabel><FormControl><Input placeholder="React, Next.js, TypeScript" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <EnhancedTextArea control={form.control} name={`projects.${index}.description`} placeholder="Describe the project, its purpose, and your role..." sectionType="Project Description" onEnhance={enhanceSection} isEnhancing={isEnhancing[`projects.${index}.description-Project Description`]} />
                             <FormField control={form.control} name={`projects.${index}.link`} render={({ field }) => <FormItem><FormLabel>Project Link</FormLabel><FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl><FormMessage /></FormItem>} />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                         </motion.div>
                    ))}
                </AnimatePresence>
                <Button type="button" variant="outline" className="border-dashed" onClick={() => appendProject({ name: "", description: "", technologies: "" })}><PlusCircle className="mr-2" /> Add Project</Button>
              </Section>

              {/* Education */}
              <Section title="Education">
                 <AnimatePresence>
                    {educationFields.map((field, index) => (
                         <motion.div key={field.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 border rounded-lg bg-secondary/30 space-y-4 relative">
                            <FormField control={form.control} name={`education.${index}.institution`} render={({ field }) => <FormItem><FormLabel>Institution</FormLabel><FormControl><Input placeholder="University of Technology" {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => <FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="B.S. in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField control={form.control} name={`education.${index}.graduationDate`} render={({ field }) => <FormItem><FormLabel>Graduation Date</FormLabel><FormControl><Input placeholder="May 2021" {...field} /></FormControl><FormMessage /></FormItem>} />
                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                         </motion.div>
                    ))}
                </AnimatePresence>
                <Button type="button" variant="outline" className="border-dashed" onClick={() => appendEducation({ institution: "", degree: "", graduationDate: "" })}><PlusCircle className="mr-2" /> Add Education</Button>
              </Section>

              {/* Skills */}
              <Section title="Skills">
                <FormField control={form.control} name="skills" render={({ field }) => <FormItem><FormLabel>Skills</FormLabel><FormControl><Textarea placeholder="List your technical skills, comma-separated... e.g., JavaScript, React, Node.js, AWS, Docker" {...field} /></FormControl><FormMessage /></FormItem>} />
              </Section>

              {/* Desired Job */}
              <Section title="Target Role">
                  <FormField control={form.control} name="desiredJob" render={({ field }) => <FormItem><FormLabel>Desired Job Title</FormLabel><FormControl><Input placeholder="e.g., Senior Frontend Developer" {...field} /></FormControl><FormMessage /><CardDescription className="pt-2">The AI will tailor the resume for this specific role.</CardDescription></FormItem>} />
              </Section>

              <Button type="submit" disabled={isLoading} className="w-full text-lg" size="lg">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</> : "Generate Full Resume"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Result Card */}
      <Card className="flex flex-col lg:sticky lg:top-8 h-fit max-h-[90vh]">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Generated Resume</CardTitle>
          <CardDescription>
            Your AI-crafted resume will appear here. Review and copy it.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow relative min-h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 rounded-md">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result?.resume && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <pre className="w-full h-full bg-secondary p-4 rounded-md overflow-auto text-sm font-code whitespace-pre-wrap">
                {result.resume}
              </pre>
            </>
          )}
          {!isLoading && !result && (
             <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
                Fill out the form and click "Generate" to create your new resume.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-2xl font-headline text-primary border-b pb-2">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const EnhancedTextArea = ({ control, name, placeholder, sectionType = "text", onEnhance, isEnhancing }: any) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Textarea
                                placeholder={placeholder}
                                className="min-h-[120px]"
                                {...field}
                            />
                             <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="absolute bottom-2 right-2"
                                onClick={() => onEnhance(sectionType, name, field.value)}
                                disabled={isEnhancing || field.value.length < 20}
                            >
                                {isEnhancing ? 
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                                }
                                Enhance with AI
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
};
