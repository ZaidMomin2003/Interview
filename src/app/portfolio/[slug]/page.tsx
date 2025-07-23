// src/app/portfolio/[slug]/page.tsx
// Convert to a Server Component to correctly handle params and data fetching.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, GitBranch, Github, Linkedin, Globe, Trophy, Award, BarChartHorizontalBig, Cpu, Video, CodeXml, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { PortfolioCharts } from '@/components/feature/portfolio-charts';


// Dummy data mirroring the builder and dashboard
// In a real app, this would be fetched from a database based on the slug
const getPortfolioData = async (slug: string) => {
    console.log(`Fetching data for slug: ${slug}`);
    // Simulating an async fetch
    await new Promise(res => setTimeout(res, 100));

    return {
      theme: 'dark', 
      user: {
        displayName: 'Ada Lovelace',
        email: 'ada@talxify.com',
        photoURL: 'https://placehold.co/128x128.png',
        bio: 'Pioneering computer programmer and mathematician, known for my work on Charles Babbage\'s proposed mechanical general-purpose computer, the Analytical Engine.',
        languages: ['Assembly', 'Calculus', 'Logic'],
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
      },
      dashboard: {
        interviewsCompleted: 3,
        codingQuestionsSolved: 42,
        mcqsAnswered: 128,
        interviewReadiness: 78,
        weeklyProgress: [
            { name: "Week 1", questions: 10, interviews: 1 },
            { name: "Week 2", questions: 15, interviews: 1 },
            { name: "Week 3", questions: 12, interviews: 0 },
            { name: "Week 4", questions: 20, interviews: 1 },
        ],
      },
      projects: [
        { id: 1, title: 'Analytical Engine Notes', description: 'Published a series of comprehensive notes on the Analytical Engine, including what is considered to be the first algorithm intended to be processed by a machine.', tech: 'Paper, Ink, Logic', link: '#' },
        { id: 2, title: 'Flyology Speculation', description: 'A personal project exploring the mechanics of flight, combining mathematical models with observational data.', tech: 'Mathematical Modelling, Observation', link: '#' },
      ],
      hackathons: [
        { id: 1, name: 'London Tech Fair 1843', role: 'Exhibitor & Speaker', achievement: 'Presented the potential of the Analytical Engine, far beyond mere calculation.' },
      ],
      certificates: [
        { id: 1, name: 'Fellowship of the Royal Society', issuer: 'The Royal Society', date: '1842' },
      ]
    };
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
  const { theme, user, projects, hackathons, certificates, dashboard } = portfolioData;

  return (
    <div className={cn("min-h-screen bg-background text-foreground font-body", theme)}>
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
       <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background via-transparent to-background"></div>

       <div className="container mx-auto max-w-5xl p-4 sm:p-8 space-y-12">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center gap-6">
                 <Avatar className="h-32 w-32 border-4 border-primary">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} data-ai-hint="professional portrait" />}
                    <AvatarFallback className="text-5xl font-bold bg-secondary text-primary">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground">{user.displayName}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">{user.bio}</p>
                    <div className="flex flex-wrap gap-4 mt-4">
                        {user.github && <Button variant="ghost" asChild><Link href={user.github} target="_blank"><Github/> <span className="ml-2">GitHub</span></Link></Button>}
                        {user.linkedin && <Button variant="ghost" asChild><Link href={user.linkedin} target="_blank"><Linkedin/> <span className="ml-2">LinkedIn</span></Link></Button>}
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-12">
                    <Section icon={<BarChartHorizontalBig/>} title="Activity & Progress">
                      <PortfolioCharts dashboard={dashboard} />
                    </Section>

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
                </div>

                {/* Right Column / Sidebar */}
                <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
                     <Card className="bg-gradient-to-br from-primary/20 to-secondary/50 border-primary/50 text-center flex flex-col items-center justify-center p-6">
                         <CardHeader className="p-0">
                            <CardDescription className="text-primary">Interview Readiness</CardDescription>
                            <CardTitle className="text-5xl font-bold text-foreground my-2">{dashboard.interviewReadiness}%</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-sm text-muted-foreground">Based on recent activity and performance.</p>
                        </CardContent>
                    </Card>

                     <Card className="bg-secondary/50 border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary"><Code/> Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-wrap gap-2">
                                {user.languages.map(lang => <Badge key={lang} variant="outline" className="text-lg py-1 px-3 bg-primary/10 text-primary border-primary/20">{lang}</Badge>)}
                            </div>
                        </CardContent>
                     </Card>
                </aside>
            </main>
             <footer className="text-center text-sm text-muted-foreground pt-8">
                <p>Powered by <Link href="/" className="font-bold text-primary hover:underline">Talxify</Link></p>
            </footer>
       </div>
    </div>
  );
}
