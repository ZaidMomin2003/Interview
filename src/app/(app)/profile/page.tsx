// src/app/(app)/profile/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, Briefcase, Code, GraduationCap, Link as LinkIcon, Mail, Phone, Target, CalendarDays, CaseSensitive, Pencil } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="bg-secondary/30 border-border">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
            {icon}
            <CardTitle className="text-xl text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode, label: string }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
        {icon}
        <span className="truncate">{label}</span>
    </Link>
);

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!user) {
    return null; // Or a loading spinner
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please select an image smaller than 2MB.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        updateUser({ photoURL: result });
        toast({
          title: 'Avatar updated!',
          description: 'Your new profile picture has been saved.',
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const socialLinks = [
    { href: user.linkedin, icon: <LinkIcon className="h-5 w-5" />, label: "LinkedIn" },
    { href: user.github, icon: <LinkIcon className="h-5 w-5" />, label: "GitHub" },
    { href: user.twitter, icon: <LinkIcon className="h-5 w-5" />, label: "Twitter/X" },
    { href: user.instagram, icon: <LinkIcon className="h-5 w-5" />, label: "Instagram" },
  ].filter(link => link.href);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
           <Avatar className="h-24 w-24 border-4 border-primary">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
              <AvatarFallback className="text-4xl font-bold bg-secondary text-primary">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
          </Avatar>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/png, image/jpeg, image/gif"
          />
          <Button 
            onClick={handleAvatarClick}
            variant="outline"
            size="icon"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background/70 backdrop-blur-sm border-primary text-primary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit avatar</span>
          </Button>
        </div>
        <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-4 mb-2">
                <h1 className="text-4xl font-bold font-headline">{user.displayName}</h1>
                <Button variant="outline" asChild>
                    <Link href="/onboarding">
                        <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                    </Link>
                </Button>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
            </p>
             {user.phone && (
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                </p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <InfoCard icon={<Briefcase className="w-8 h-8 text-primary/80" />} title="Professional Info">
                <div className="space-y-4">
                     {user.status && <div className="flex items-center gap-2"><strong className="font-semibold text-foreground">Status:</strong> <Badge variant="secondary" className="capitalize">{user.status}</Badge></div>}
                     {user.status === 'student' && user.university && (
                        <p className="flex items-center gap-2">
                           <GraduationCap className="h-5 w-5 text-muted-foreground" />
                           <strong className="font-semibold text-foreground">University:</strong> {user.university}
                        </p>
                     )}
                     {user.languages && user.languages.length > 0 && (
                        <div>
                            <strong className="font-semibold text-foreground flex items-center gap-2 mb-2"><Code className="h-5 w-5" /> Proficient Languages:</strong>
                            <div className="flex flex-wrap gap-2">
                                {user.languages.map((lang: string) => <Badge key={lang} className="capitalize bg-primary/20 text-primary border-primary/30">{lang}</Badge>)}
                            </div>
                        </div>
                     )}
                </div>
            </InfoCard>

            <InfoCard icon={<Target className="w-8 h-8 text-primary/80" />} title="Career Goals">
                 <div className="space-y-4">
                     {user.targetRole && <p className="flex items-center gap-2"><CaseSensitive className="h-5 w-5 text-muted-foreground" /> <strong className="font-semibold text-foreground">Target Role:</strong> {user.targetRole}</p>}
                     {user.targetCompanies && (
                        <div>
                            <strong className="font-semibold text-foreground flex items-center gap-2 mb-2"><Building className="h-5 w-5" /> Target Companies:</strong>
                            <p className="text-muted-foreground whitespace-pre-wrap">{user.targetCompanies}</p>
                        </div>
                     )}
                     {user.interviewDate && <p className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-muted-foreground" /> <strong className="font-semibold text-foreground">Target Interview Date:</strong> {format(new Date(user.interviewDate), 'PPP')}</p>}
                </div>
            </InfoCard>
        </div>

        <div className="space-y-6">
             <InfoCard icon={<LinkIcon className="w-8 h-8 text-primary/80" />} title="Social Links">
                {socialLinks.length > 0 ? (
                    <div className="space-y-3">
                        {socialLinks.map(link => (
                           link.href && <SocialLink key={link.label} href={link.href} icon={link.icon} label={link.label} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">No social links provided.</p>
                )}
            </InfoCard>
        </div>

      </div>
    </div>
  );
}
