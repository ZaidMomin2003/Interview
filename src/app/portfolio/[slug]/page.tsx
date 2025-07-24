// src/app/portfolio/[slug]/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, GitBranch, Github, Linkedin, Globe, Trophy, Award, BarChartHorizontalBig, Cpu, Video, CodeXml, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PortfolioCharts } from '@/components/feature/portfolio-charts';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { AppUser } from '@/hooks/use-user-data';
import { notFound } from 'next/navigation';

const getPortfolioData = async (slug: string): Promise<AppUser | null> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("portfolio.slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    const data = userDoc.data() as AppUser;

    // Firestore timestamps need to be converted to JS Dates if they exist
    if (data.history) {
        data.history = data.history.map(item => ({
            ...item,
            timestamp: (item.timestamp as any).toDate()
        }));
    }

    return data;
};


const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-3 text-primary">
            {icon}
            {title}
        </h2>
        {children}
    </section>
);


export default async function PortfolioPage({ params }: { params: { slug: string }}) {
  const portfolioData = await getPortfolioData(params.slug);
  
  if (!portfolioData) {
      notFound();
  }

  const { displayName, photoURL, email, portfolio, languages, linkedin, github } = portfolioData;
  const { theme, projects, hackathons, certificates, includeDashboardStats } = portfolio.
  
  // Create some dummy dashboard data from profile for now
   const dashboard = {
    interviewsCompleted: portfolioData.history?.filter(h => h.type === 'AI Interview').length || 0,
    codingQuestionsSolved: portfolioData.history?.filter(h => h.type === 'Coding Challenge').length || 0,
    mcqsAnswered: Math.floor(Math.random() * 200), // dummy
    interviewReadiness: Math.floor(Math.random() * 40) + 60, // dummy
    weeklyProgress: [
        { name: "Week 1", questions: 10, interviews: 1 },
        { name: "Week 2", questions: 15, interviews: 1 },
        { name: "Week 3", questions: 12, interviews: 0 },
        { name: "Week 4", questions: 20, interviews: 1 },
    ],
  };


  return (
    <div className={cn("min-h-screen bg-background text-foreground font-body", theme)}>
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
       <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background via-transparent to-background"></div>

       <div className="container mx-auto max-w-5xl p-4 sm:p-8 space-y-12">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center gap-6">
                 <Avatar className="h-32 w-32 border-4 border-primary">
                    {photoURL && <AvatarImage src={photoURL} alt={displayName || 'User'} data-ai-hint="professional portrait" />}
                    <AvatarFallback className="text-5xl font-bold bg-secondary text-primary">
                        {displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground">{displayName}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">{portfolioData.summary}</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {github && <Button variant="ghost" asChild><Link href={github} target="_blank"><Github/> <span className="ml-2">GitHub</span></Link></Button>}
                        {linkedin && <Button variant="ghost" asChild><Link href={linkedin} target="_blank"><Linkedin/> <span className="ml-2">LinkedIn</span></Link></Button>}
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-12">
                    {includeDashboardStats && (
                        <Section icon={<BarChartHorizontalBig/>} title="Activity & Progress">
                            <PortfolioCharts dashboard={dashboard} />
                        </Section>
                    )}

                    {projects && projects.length > 0 && (
                        <Section icon={<GitBranch/>} title="Projects">
                            <div className="space-y-6">
                                {projects.map(proj => (
                                    <Card key={proj.id} className="bg-secondary/50 border-border">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-xl text-primary">{proj.title}</CardTitle>
                                                {proj.link && proj.link !== '#' && <Button variant="outline" size="sm" asChild><Link href={proj.link} target="_blank"><Globe className="mr-2 h-4 w-4" /> View Project</Link></Button>}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-4">{proj.description}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {proj.tech.split(',').map(t => <Badge key={t} variant="secondary">{t.trim()}</Badge>)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </Section>
                    )}

                    {hackathons && hackathons.length > 0 && (
                         <Section icon={<Trophy/>} title="Hackathons">
                             <div className="space-y-6">
                                {hackathons.map(hack => (
                                    <Card key={hack.id} className="bg-secondary/50 border-border">
                                        <CardHeader>
                                            <CardTitle className="text-xl text-primary">{hack.name}</CardTitle>
                                            <p className="text-muted-foreground">{hack.role}</p>
                                        </CardHeader>
                                        <CardContent>
                                           <p className="font-semibold text-foreground">{hack.achievement}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </Section>
                    )}
                    
                     {certificates && certificates.length > 0 && (
                         <Section icon={<Award/>} title="Certificates">
                             <div className="space-y-6">
                                {certificates.map(cert => (
                                    <Card key={cert.id} className="bg-secondary/50 border-border p-6">
                                        <div className="flex justify-between items-center">
                                             <div>
                                                <h4 className="font-bold text-foreground">{cert.name}</h4>
                                                <p className="text-sm text-muted-foreground">Issued by {cert.issuer} &bull; {cert.date}</p>
                                            </div>
                                             <Award className="w-8 h-8 text-amber-400"/>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Section>
                     )}
                </div>

                {/* Right Column / Sidebar */}
                <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
                     {includeDashboardStats && (
                        <Card className="bg-gradient-to-br from-primary/20 to-secondary/50 border-primary/50 text-center flex flex-col items-center justify-center p-6">
                             <CardHeader className="p-0">
                                <CardDescription className="text-primary">Interview Readiness</CardDescription>
                                <CardTitle className="text-5xl font-bold text-foreground my-2">{dashboard.interviewReadiness}%</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <p className="text-sm text-muted-foreground">Based on recent activity and performance.</p>
                            </CardContent>
                        </Card>
                     )}

                     {languages && languages.length > 0 && (
                        <Card className="bg-secondary/50 border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary"><Code/> Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                 <div className="flex flex-wrap gap-2">
                                    {languages.map(lang => <Badge key={lang} variant="outline" className="text-lg py-1 px-3 bg-primary/10 text-primary border-primary/20">{lang}</Badge>)}
                                </div>
                            </CardContent>
                         </Card>
                     )}
                </aside>
            </main>
             <footer className="text-center text-sm text-muted-foreground pt-8">
                <p>Powered by <Link href="/" className="font-bold text-primary hover:underline">Talxify</Link></p>
            </footer>
       </div>
    </div>
  );
}
