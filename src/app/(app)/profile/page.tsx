// src/app/(app)/profile/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building, Briefcase, Code, GraduationCap, Link as LinkIcon, Mail, Phone, Target, CalendarDays, CaseSensitive } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const InfoCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <Card className="bg-gray-900/50 border border-cyan-500/20">
        <CardHeader className="flex flex-row items-center gap-4 pb-4">
            {icon}
            <CardTitle className="text-xl text-cyan-400">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode, label: string }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-cyan-400 transition-colors">
        {icon}
        <span className="truncate">{label}</span>
    </Link>
);

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null; // Or a loading spinner
  }
  
  const socialLinks = [
    { href: user.linkedin, icon: <LinkIcon className="h-5 w-5" />, label: "LinkedIn" },
    { href: user.github, icon: <LinkIcon className="h-5 w-5" />, label: "GitHub" },
    { href: user.twitter, icon: <LinkIcon className="h-5 w-5" />, label: "Twitter/X" },
    { href: user.instagram, icon: <LinkIcon className="h-5 w-5" />, label: "Instagram" },
  ].filter(link => link.href);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Avatar className="h-24 w-24 border-4 border-cyan-400">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
            <AvatarFallback className="text-4xl font-bold bg-gray-800 text-cyan-300">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-4xl font-bold font-headline">{user.displayName}</h1>
            <p className="text-gray-400 flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {user.email}
            </p>
             {user.phone && (
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4" />
                    {user.phone}
                </p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <InfoCard icon={<Briefcase className="w-8 h-8 text-cyan-400/80" />} title="Professional Info">
                <div className="space-y-4">
                     {user.status && <p className="flex items-center gap-2"><strong className="font-semibold text-gray-300">Status:</strong> <Badge variant="secondary" className="capitalize">{user.status}</Badge></p>}
                     {user.status === 'student' && user.university && (
                        <p className="flex items-center gap-2">
                           <GraduationCap className="h-5 w-5 text-gray-400" />
                           <strong className="font-semibold text-gray-300">University:</strong> {user.university}
                        </p>
                     )}
                     {user.languages && user.languages.length > 0 && (
                        <div>
                            <strong className="font-semibold text-gray-300 flex items-center gap-2 mb-2"><Code className="h-5 w-5" /> Proficient Languages:</strong>
                            <div className="flex flex-wrap gap-2">
                                {user.languages.map((lang: string) => <Badge key={lang} className="capitalize bg-cyan-900/50 text-cyan-300 border-cyan-500/30">{lang}</Badge>)}
                            </div>
                        </div>
                     )}
                </div>
            </InfoCard>

            <InfoCard icon={<Target className="w-8 h-8 text-cyan-400/80" />} title="Career Goals">
                 <div className="space-y-4">
                     {user.targetRole && <p className="flex items-center gap-2"><CaseSensitive className="h-5 w-5 text-gray-400" /> <strong className="font-semibold text-gray-300">Target Role:</strong> {user.targetRole}</p>}
                     {user.targetCompanies && (
                        <div>
                            <strong className="font-semibold text-gray-300 flex items-center gap-2 mb-2"><Building className="h-5 w-5" /> Target Companies:</strong>
                            <p className="text-gray-400 whitespace-pre-wrap">{user.targetCompanies}</p>
                        </div>
                     )}
                     {user.interviewDate && <p className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-gray-400" /> <strong className="font-semibold text-gray-300">Target Interview Date:</strong> {format(new Date(user.interviewDate), 'PPP')}</p>}
                </div>
            </InfoCard>
        </div>

        <div className="space-y-6">
             <InfoCard icon={<LinkIcon className="w-8 h-8 text-cyan-400/80" />} title="Social Links">
                {socialLinks.length > 0 ? (
                    <div className="space-y-3">
                        {socialLinks.map(link => (
                            <SocialLink key={link.label} href={link.href!} icon={link.icon} label={link.label} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No social links provided.</p>
                )}
            </InfoCard>
        </div>

      </div>
    </div>
  );
}
