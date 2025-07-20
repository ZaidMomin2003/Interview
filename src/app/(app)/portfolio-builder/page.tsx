// src/app/(app)/portfolio-builder/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { GalleryVertical, Link as LinkIcon, Eye, Copy, Check, PlusCircle, Trash2, Palette } from 'lucide-react';
import Link from 'next/link';

// Dummy data structure, in a real app this would come from state/DB
const initialPortfolioData = {
  slug: 'ada-lovelace',
  includeDashboardStats: true,
  projects: [
    { id: 1, title: 'Analytical Engine', description: 'A mechanical general-purpose computer.', tech: 'Brass, Iron, Steam', link: '#' },
  ],
  hackathons: [
    { id: 1, name: 'London Tech Fair 1843', role: 'Exhibitor', achievement: 'First Place' },
  ],
  certificates: [
    { id: 1, name: 'Babbage Fellowship', issuer: 'Royal Society', date: '1842' },
  ]
};

const themes = [
  { name: 'Default', class: 'theme-default' },
  { name: 'Forest', class: 'theme-forest' },
  { name: 'Ocean', class: 'theme-ocean' },
  { name: 'Sunset', class: 'theme-sunset' },
];

function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('app-theme') || 'theme-default';
    }
    return 'theme-default';
  });

  const setTheme = (themeClass: string) => {
    document.documentElement.classList.remove(...themes.map(t => t.class));
    document.documentElement.classList.add(themeClass);
    localStorage.setItem('app-theme', themeClass);
    setCurrentTheme(themeClass);
  };
  
  // Set initial theme on mount
  useState(() => {
     if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('app-theme') || 'theme-default';
        setTheme(savedTheme);
     }
  });


  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-cyan-400">
        <Palette className="w-5 h-5"/>
        <h3 className="text-lg font-headline">Color Palette</h3>
      </div>
       <div className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.name}
              variant={currentTheme === theme.class ? 'default' : 'outline'}
              onClick={() => setTheme(theme.class)}
            >
              {theme.name}
            </Button>
          ))}
        </div>
    </div>
  )
}


export default function PortfolioBuilderPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [portfolio, setPortfolio] = useState(initialPortfolioData);

  const portfolioUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/${portfolio.slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    toast({ title: 'Copied to clipboard!', description: 'Your portfolio URL is ready to be shared.' });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSave = () => {
     toast({ title: 'Portfolio Saved!', description: 'Your changes have been successfully saved.' });
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
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-800 border border-gray-700">
               <span className="text-muted-foreground hidden sm:block">talxify.com/portfolio/</span>
               <Input 
                className="bg-transparent border-none focus-visible:ring-0 p-0 h-auto" 
                value={portfolio.slug} 
                onChange={(e) => setPortfolio(p => ({ ...p, slug: e.target.value}))}
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
                {portfolio.projects.map((proj, index) => (
                    <Card key={proj.id} className="bg-gray-800/50 p-4">
                        <div className="flex justify-between items-start">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                                <Input defaultValue={proj.title} placeholder="Project Title" />
                                <Input defaultValue={proj.tech} placeholder="Tech Stack (comma-separated)" />
                                <Textarea className="md:col-span-2" defaultValue={proj.description} placeholder="Project Description" />
                                <Input defaultValue={proj.link} placeholder="Project Link" />
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 shrink-0"><Trash2 className="text-red-500"/></Button>
                        </div>
                    </Card>
                ))}
                 <Button variant="outline" className="border-dashed"><PlusCircle className="mr-2"/> Add Project</Button>
            </div>
            
            {/* Hackathons Section */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold font-headline">Hackathons</h3>
                 {portfolio.hackathons.map((hack, index) => (
                    <Card key={hack.id} className="bg-gray-800/50 p-4">
                       <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                                <Input defaultValue={hack.name} placeholder="Hackathon Name" />
                                <Input defaultValue={hack.role} placeholder="Your Role (e.g., Participant, Winner)" />
                                <Input defaultValue={hack.achievement} placeholder="Achievement/Award" />
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 shrink-0"><Trash2 className="text-red-500"/></Button>
                        </div>
                    </Card>
                 ))}
                 <Button variant="outline" className="border-dashed"><PlusCircle className="mr-2"/> Add Hackathon</Button>
            </div>
            
             {/* Certificates Section */}
            <div className="space-y-4">
                 <h3 className="text-xl font-bold font-headline">Certificates</h3>
                 {portfolio.certificates.map((cert, index) => (
                    <Card key={cert.id} className="bg-gray-800/50 p-4">
                       <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                                <Input defaultValue={cert.name} placeholder="Certificate Name" />
                                <Input defaultValue={cert.issuer} placeholder="Issuing Organization" />
                                <Input defaultValue={cert.date} placeholder="Date Issued" />
                            </div>
                            <Button variant="ghost" size="icon" className="ml-2 shrink-0"><Trash2 className="text-red-500"/></Button>
                        </div>
                    </Card>
                 ))}
                <Button variant="outline" className="border-dashed"><PlusCircle className="mr-2"/> Add Certificate</Button>
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
              <Switch id="include-stats" checked={portfolio.includeDashboardStats} onCheckedChange={(checked) => setPortfolio(p => ({ ...p, includeDashboardStats: checked}))}/>
           </div>
           <ThemeSwitcher />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
          <Button size="lg" onClick={handleSave}>Save Portfolio</Button>
      </div>

    </div>
  );
}

// Add a simple Textarea component if it doesn't exist.
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />
);
