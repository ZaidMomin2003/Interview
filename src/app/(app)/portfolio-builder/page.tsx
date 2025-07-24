// src/app/(app)/portfolio-builder/page.tsx
'use client';

import { useState } from 'react';
import { useUserData, type PortfolioData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { GalleryVertical, Link as LinkIcon, Eye, Copy, Check, PlusCircle, Trash2, Palette, Moon, Sun, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />
);

export default function PortfolioBuilderPage() {
  const { profile, loading, updatePortfolio } = useUserData();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [portfolioState, setPortfolioState] = useState<PortfolioData | null>(null);

  // Sync state with profile data
  useState(() => {
    if (profile?.portfolio) {
      setPortfolioState(profile.portfolio);
    }
  });

  if (loading || !profile || !portfolioState) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
        </div>
    );
  }

  const portfolioUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/${portfolioState.slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast({ title: 'Copied to clipboard!', description: 'Your portfolio URL is ready to be shared.' });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSave = async () => {
     setIsSaving(true);
     try {
       await updatePortfolio(portfolioState);
       toast({ title: 'Portfolio Saved!', description: 'Your changes have been successfully saved.' });
     } catch (error) {
       console.error("Failed to save portfolio:", error);
       toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your portfolio. Please try again.' });
     } finally {
       setIsSaving(false);
     }
  }

  const handlePortfolioChange = (field: keyof PortfolioData, value: any) => {
    setPortfolioState(p => p ? { ...p, [field]: value } : null);
  }
  
  const handleItemChange = (itemType: 'projects' | 'hackathons' | 'certificates', index: number, field: string, value: string) => {
      setPortfolioState(p => {
          if (!p) return null;
          const items = [...p[itemType]];
          items[index] = { ...items[index], [field]: value };
          return { ...p, [itemType]: items };
      });
  }

  const addItem = (itemType: 'projects' | 'hackathons' | 'certificates') => {
      setPortfolioState(p => {
          if (!p) return null;
          const newItem = itemType === 'projects'
              ? { id: Date.now().toString(), title: '', description: '', tech: '', link: '' }
              : itemType === 'hackathons'
              ? { id: Date.now().toString(), name: '', role: '', achievement: '' }
              : { id: Date.now().toString(), name: '', issuer: '', date: '' };
          return { ...p, [itemType]: [...p[itemType], newItem as any] };
      });
  }

  const removeItem = (itemType: 'projects' | 'hackathons' | 'certificates', index: number) => {
      setPortfolioState(p => {
          if (!p) return null;
          const items = [...p[itemType]];
          items.splice(index, 1);
          return { ...p, [itemType]: items };
      });
  }


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-2">
            <GalleryVertical className="w-8 h-8"/>
            Portfolio Builder
        </h1>
        <p className="text-muted-foreground mt-2">Create and customize your public developer portfolio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio URL</CardTitle>
          <CardDescription>This is the public link to your portfolio. Make it unique!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-secondary/50 border border-border">
               <span className="text-muted-foreground hidden sm:block">talxify.com/portfolio/</span>
               <Input 
                className="bg-transparent border-none focus-visible:ring-0 p-0 h-auto" 
                value={portfolioState.slug} 
                onChange={(e) => handlePortfolioChange('slug', e.target.value)}
               />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCopyUrl} variant="outline">
                {copied ? <Check className="text-green-500" /> : <Copy />}
                <span className="ml-2">Copy Link</span>
              </Button>
               <Button asChild>
                <Link href={portfolioUrl} target="_blank">
                  <Eye />
                  <span className="ml-2">Preview</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Portfolio Content</CardTitle>
            <CardDescription>Add projects, hackathons, and certificates to showcase your skills.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Projects Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold font-headline">Projects</h3>
                {portfolioState.projects.map((proj, index) => (
                    <Card key={proj.id} className="bg-secondary/30 p-4">
                        <div className="flex justify-between items-start">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                <Input value={proj.title} onChange={e => handleItemChange('projects', index, 'title', e.target.value)} placeholder="Project Title" />
                                <Input value={proj.tech} onChange={e => handleItemChange('projects', index, 'tech', e.target.value)} placeholder="Tech Stack (comma-separated)" />
                                <Textarea className="md:col-span-2" value={proj.description} onChange={e => handleItemChange('projects', index, 'description', e.target.value)} placeholder="Project Description" />
                                <Input value={proj.link} onChange={e => handleItemChange('projects', index, 'link', e.target.value)} placeholder="Project Link" />
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 shrink-0" onClick={() => removeItem('projects', index)}><Trash2 className="text-red-500"/></Button>
                        </div>
                    </Card>
                ))}
                 <Button variant="outline" className="border-dashed" onClick={() => addItem('projects')}><PlusCircle className="mr-2"/> Add Project</Button>
            </div>
            
            {/* Hackathons Section */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold font-headline">Hackathons</h3>
                 {portfolioState.hackathons.map((hack, index) => (
                    <Card key={hack.id} className="bg-secondary/30 p-4">
                       <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                                <Input value={hack.name} onChange={e => handleItemChange('hackathons', index, 'name', e.target.value)} placeholder="Hackathon Name" />
                                <Input value={hack.role} onChange={e => handleItemChange('hackathons', index, 'role', e.target.value)} placeholder="Your Role (e.g., Participant, Winner)" />
                                <Input value={hack.achievement} onChange={e => handleItemChange('hackathons', index, 'achievement', e.target.value)} placeholder="Achievement/Award" />
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 shrink-0" onClick={() => removeItem('hackathons', index)}><Trash2 className="text-red-500"/></Button>
                        </div>
                    </Card>
                 ))}
                 <Button variant="outline" className="border-dashed" onClick={() => addItem('hackathons')}><PlusCircle className="mr-2"/> Add Hackathon</Button>
            </div>
            
             {/* Certificates Section */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold font-headline">Certificates</h3>
                 {portfolioState.certificates.map((cert, index) => (
                    <Card key={cert.id} className="bg-secondary/30 p-4">
                       <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                                <Input value={cert.name} onChange={e => handleItemChange('certificates', index, 'name', e.target.value)} placeholder="Certificate Name" />
                                <Input value={cert.issuer} onChange={e => handleItemChange('certificates', index, 'issuer', e.target.value)} placeholder="Issuing Organization" />
                                <Input value={cert.date} onChange={e => handleItemChange('certificates', index, 'date', e.target.value)} placeholder="Date Issued" />
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 shrink-0" onClick={() => removeItem('certificates', index)}><Trash2 className="text-red-500"/></Button>
                        </div>
                    </Card>
                 ))}
                <Button variant="outline" className="border-dashed" onClick={() => addItem('certificates')}><PlusCircle className="mr-2"/> Add Certificate</Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center justify-between">
              <Label htmlFor="include-stats" className="flex flex-col">
                <span className="font-semibold">Include Dashboard Stats</span>
                <span className="text-sm text-muted-foreground">Showcase your coding activity and readiness score on your portfolio.</span>
              </Label>
              <Switch id="include-stats" checked={portfolioState.includeDashboardStats} onCheckedChange={(checked) => handlePortfolioChange('includeDashboardStats', checked)}/>
           </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-mode" className="flex flex-col">
                <span className="font-semibold">Appearance</span>
                <span className="text-sm text-muted-foreground">Choose between a light or dark theme for your public portfolio.</span>
              </Label>
               <div className="flex items-center gap-2">
                 <Sun className="h-5 w-5" />
                 <Switch 
                    id="theme-mode" 
                    checked={portfolioState.theme === 'dark'} 
                    onCheckedChange={(checked) => handlePortfolioChange('theme', checked ? 'dark' : 'light')}
                 />
                 <Moon className="h-5 w-5" />
              </div>
           </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" /> : "Save Portfolio"}
          </Button>
      </div>

    </div>
  );
}
