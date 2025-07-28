// src/app/p/[userId]/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Globe, MapPin, Bot, CodeXml, FileText, Award, Trophy, ExternalLink, Brush } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReadinessChart, ActivityChart } from './charts';
import { format, subDays } from 'date-fns';
import { getUserPortfolio } from '@/lib/session';
import type { HistoryItem } from '@/ai/schemas';

function PlaceholderCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="bg-secondary/30 border-dashed">
            <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center">
                {icon}
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm">{description}</p>
            </CardContent>
        </Card>
    )
}

const getWeeklyActivity = (history: HistoryItem[]) => {
    const activityMap = new Map<string, { Questions: number, Interviews: number, Notes: number }>();
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = subDays(today, i);
        const day = format(date, 'E');
        activityMap.set(day, { Questions: 0, Interviews: 0, Notes: 0 });
    }

    history.forEach(item => {
        const itemDate = new Date(item.timestamp);
        const dayDiff = (today.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);
        if (dayDiff < 7 && dayDiff >= 0) {
            const day = format(itemDate, 'E');
            const dayActivity = activityMap.get(day);
            if (dayActivity) {
                if (item.type === 'coding') dayActivity.Questions++;
                if (item.type === 'interview') dayActivity.Interviews++;
                if (item.type === 'notes') dayActivity.Notes++;
            }
        }
    });
    
    return Array.from(activityMap.entries()).map(([day, counts]) => ({ day, ...counts }));
};

export default async function PublicPortfolioPage({ params }: { params: { userId: string } }) {
  const profile = await getUserPortfolio(params.userId);

  if (!profile) {
     return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-4xl font-bold font-headline text-primary">Portfolio Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This portfolio is either private or does not exist.
        </p>
         <Button asChild className="mt-8">
            <Link href="/">Back to Home</Link>
         </Button>
      </div>
    );
  }

  const { portfolio, photoURL, history } = profile;
  const { displayName, bio, location, socials, skills, projects, certifications, achievements } = portfolio;
  
  const socialLinks = [
      { href: socials?.github, icon: <Github className="h-5 w-5" />, label: 'GitHub' },
      { href: socials?.linkedin, icon: <Linkedin className="h-5 w-5" />, label: 'LinkedIn' },
      { href: socials?.twitter, icon: <Twitter className="h-5 w-5" />, label: 'Twitter' },
      { href: socials?.website, icon: <Globe className="h-5 w-5" />, label: 'Website' },
  ].filter(link => link.href);

  const interviewCount = history.filter(item => item.type === 'interview').length;
  const codingCount = history.filter(item => item.type === 'coding').length;
  const notesCount = history.filter(item => item.type === 'notes').length;

  const usageData = [
    { title: "AI Interviews", icon: <Bot className="text-primary" />, current: interviewCount },
    { title: "Coding Problems", icon: <CodeXml className="text-primary" />, current: codingCount },
    { title: "Notes Generated", icon: <FileText className="text-primary" />, current: notesCount },
  ];

  const activityData = getWeeklyActivity(history);
  const readiness = Math.min(100, Math.floor((codingCount * 1.5) + (interviewCount * 2.5)));
  
  return (
    <div className="min-h-screen bg-background text-foreground py-12">
        <div className="container mx-auto max-w-4xl p-4 md:p-8">
            <main className="space-y-10">
                {/* Header Section */}
                <section className="flex flex-col sm:flex-row items-center gap-8">
                    <Avatar className="h-32 w-32 border-4 border-primary">
                        <AvatarImage src={photoURL || undefined} alt={displayName || ''} />
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
                
                 {/* Dashboard Stats Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold font-headline text-primary">Activity Overview</h2>
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {usageData.map(item => (
                            <Card key={item.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                                    {item.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold">{item.current}</div>
                                    <p className="text-xs text-muted-foreground">Total items completed</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                        <Card className="lg:col-span-3">
                            <CardHeader>
                                <CardTitle>Weekly Activity</CardTitle>
                                <CardDescription>Activity over the last 7 days.</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <ActivityChart data={activityData} />
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2">
                            <CardHeader className="text-center">
                                <CardTitle>Interview Readiness</CardTitle>
                                <CardDescription>Based on recent activity.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ReadinessChart percentage={readiness} />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Skills Section */}
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Skills</h2>
                    {skills && skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <Badge key={skill.name} variant="outline" className="text-base py-1 px-3">{skill.name}</Badge>
                            ))}
                        </div>
                    ) : (
                         <PlaceholderCard 
                            icon={<Brush className="h-10 w-10 text-muted-foreground/50"/>}
                            title="No Skills Added"
                            description="Add skills from the portfolio editor to showcase your expertise."
                        />
                    )}
                </section>
                

                {/* Projects Section */}
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Projects</h2>
                    {projects && projects.length > 0 ? (
                        <div className="space-y-6">
                            {projects.map((project) => (
                                <Card key={project.title} className="bg-secondary/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{project.title}</span>
                                            {project.url && (
                                                <Button asChild variant="link">
                                                    <Link href={project.url} target="_blank" rel="noopener noreferrer">
                                                        View Project <ExternalLink className="ml-2 h-4 w-4" />
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
                    ) : (
                         <PlaceholderCard 
                            icon={<CodeXml className="h-10 w-10 text-muted-foreground/50"/>}
                            title="No Projects Added"
                            description="Showcase your best work by adding projects in the portfolio editor."
                        />
                    )}
                </section>
                
                {/* Certifications Section */}
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Certifications</h2>
                    {certifications && certifications.length > 0 ? (
                        <div className="space-y-6">
                            {certifications.map((cert) => (
                                <Card key={cert.name} className="bg-secondary/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <Award className="h-6 w-6 text-primary/80" />
                                            <div>
                                                <span>{cert.name}</span>
                                                <p className="text-sm font-normal text-muted-foreground">Issued by {cert.issuer}</p>
                                            </div>
                                          </div>
                                          {cert.url && (
                                              <Button asChild variant="link">
                                                  <Link href={cert.url} target="_blank" rel="noopener noreferrer">
                                                      View Credential <ExternalLink className="ml-2 h-4 w-4" />
                                                  </Link>
                                              </Button>
                                          )}
                                        </CardTitle>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <PlaceholderCard 
                            icon={<Award className="h-10 w-10 text-muted-foreground/50"/>}
                            title="No Certifications Added"
                            description="List your professional certifications to build credibility."
                        />
                    )}
                </section>
                
                {/* Achievements Section */}
                <section>
                    <h2 className="text-2xl font-bold font-headline mb-4 text-primary">Achievements</h2>
                    {achievements && achievements.length > 0 ? (
                         <div className="space-y-4">
                            {achievements.map((ach) => (
                                <div key={ach.description} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                                    <Trophy className="h-6 w-6 text-amber-400 mt-1" />
                                    <div>
                                        <p className="font-semibold text-foreground">{ach.description}</p>
                                        {ach.date && <p className="text-sm text-muted-foreground">{ach.date}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <PlaceholderCard 
                            icon={<Trophy className="h-10 w-10 text-muted-foreground/50"/>}
                            title="No Achievements Added"
                            description="Highlight your awards and key accomplishments."
                        />
                    )}
                </section>

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
