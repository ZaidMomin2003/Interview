// src/app/p/[userId]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { AppUser } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';

function PortfolioSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-3 text-center sm:text-left">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-32" />
            </div>
        </div>
        <Card><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
    </div>
  );
}

export default function PublicPortfolioPage({ params }: { params: { userId: string } }) {
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.userId) {
      try {
        const userProfileKey = `talxify_profile_${params.userId}`;
        const item = window.localStorage.getItem(userProfileKey);
        if (item) {
          const parsedProfile = JSON.parse(item) as AppUser;
          if(parsedProfile.portfolio?.isPublic) {
            setProfile(parsedProfile);
          } else {
            setError("This portfolio is private.");
          }
        } else {
          setError("Portfolio not found.");
        }
      } catch (e) {
        console.error("Failed to load portfolio", e);
        setError("Could not load portfolio.");
      } finally {
        setLoading(false);
      }
    }
  }, [params.userId]);
  
  if (loading) {
     return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <PortfolioSkeleton />
        </div>
    );
  }

  if (error || !profile) {
     return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold font-headline text-primary">Portfolio Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {error || "This portfolio is either private or does not exist."}
        </p>
         <Button asChild className="mt-8">
            <Link href="/">Back to Home</Link>
         </Button>
      </div>
    );
  }

  const { portfolio, photoURL, email } = profile;
  const { displayName, bio, location, socials, skills, projects } = portfolio;
  
  const socialLinks = [
      { href: socials?.github, icon: <Github className="h-5 w-5" />, label: 'GitHub' },
      { href: socials?.linkedin, icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn' },
      { href: socials?.twitter, icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
      { href: socials?.website, icon: <Globe className="h-5 w-5" />, label: 'Website' },
  ].filter(link => link.href);

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
        <div className="container mx-auto max-w-4xl p-4 md:p-8">
            <main className="space-y-10">
                {/* Header Section */}
                <section className="flex flex-col sm:flex-row items-center gap-8">
                    <Avatar className="h-32 w-32 border-4 border-primary">
                        <AvatarImage src={photoURL || undefined} alt={displayName} />
                        <AvatarFallback>{displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 text-center sm:text-left">
                        <h1 className="text-4xl font-bold font-headline text-foreground">{displayName}</h1>
                        <p className="text-lg text-primary">{bio}</p>
                        {location && (
                           <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{location}</span>
                           </div>
                        )}
                        <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                          {socialLinks.map(link => (
                             <Button asChild key={link.label} variant="ghost" size="icon">
                                 <Link href={link.href!} target="_blank" rel="noopener noreferrer">
                                     {link.icon}
                                     <span className="sr-only">{link.label}</span>
                                 </Link>
                             </Button>
                          ))}
                        </div>
                    </div>
                </section>

                {/* Skills Section */}
                {skills && skills.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill.name} variant="outline" className="text-base py-1 px-3">{skill.name}</Badge>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects Section */}
                {projects && projects.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Projects</h2>
                        <div className="space-y-6">
                            {projects.map((project) => (
                                <Card key={project.title} className="bg-secondary/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{project.title}</span>
                                            {project.url && (
                                                <Button asChild variant="link">
                                                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                                                        View Project <Globe className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            )}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground">{project.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </main>
             <footer className="text-center mt-20 text-sm text-muted-foreground">
                <p>Powered by Talxify</p>
                 <Button asChild variant="link">
                    <Link href="/">Create your own portfolio</Link>
                 </Button>
            </footer>
        </div>
    </div>
  );
}
