// src/app/portfolio/[slug]/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth'; // We can use this to get user data
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, GitBranch, Github, Linkedin, Globe, Trophy, Award, BarChartHorizontalBig, Cpu, Video, CodeXml, CheckCircle, Target } from 'lucide-react';
import Link from 'next/link';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import { useParams } from 'next/navigation';

// Dummy data mirroring the builder and dashboard
const portfolioData = {
  user: {
    displayName: 'Ada Lovelace',
    email: 'ada@devproascent.com',
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

const chartConfig = {
  questions: {
    label: "Questions Solved",
    color: "hsl(var(--primary))",
  },
  interviews: {
    label: "Interviews",
    color: "hsl(var(--accent))",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <section className="space-y-6">
        <h2 className="text-2xl font-bold font-headline flex items-center gap-3 text-cyan-300">
            {icon}
            {title}
        </h2>
        {children}
    </section>
);


export default function PortfolioPage() {
  const params = useParams();
  const slug = params?.slug;
  // In a real app, you would fetch portfolio data based on the slug
  // For now, we'll use the dummy data.
  const { user, projects, hackathons, certificates, dashboard } = portfolioData;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-body">
       <div className="absolute inset-0 -z-10 h-full w-full bg-gray-900 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
       <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-gray-900 via-transparent to-gray-900"></div>

       <div className="container mx-auto max-w-5xl p-4 sm:p-8 space-y-12">
            {/* Header */}
            <header className="flex flex-col sm:flex-row items-center gap-6">
                 <Avatar className="h-32 w-32 border-4 border-cyan-400">
                    {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} data-ai-hint="professional portrait" />}
                    <AvatarFallback className="text-5xl font-bold bg-gray-800 text-cyan-300">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold font-headline">{user.displayName}</h1>
                    <p className="text-gray-400 mt-2 max-w-2xl">{user.bio}</p>
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
                      <div className="space-y-6">
                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <Card className="bg-gray-800/50 border-cyan-500/20">
                                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                                      <CardTitle className="text-sm font-medium text-cyan-400">Interviews Completed</CardTitle>
                                      <Video className="h-4 w-4 text-muted-foreground" />
                                  </CardHeader>
                                  <CardContent>
                                      <div className="text-2xl font-bold">{dashboard.interviewsCompleted}</div>
                                  </CardContent>
                              </Card>
                              <Card className="bg-gray-800/50 border-cyan-500/20">
                                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                                      <CardTitle className="text-sm font-medium text-cyan-400">Coding Questions Solved</CardTitle>
                                      <CodeXml className="h-4 w-4 text-muted-foreground" />
                                  </CardHeader>
                                  <CardContent>
                                      <div className="text-2xl font-bold">{dashboard.codingQuestionsSolved}</div>
                                  </CardContent>
                              </Card>
                              <Card className="bg-gray-800/50 border-cyan-500/20">
                                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                                      <CardTitle className="text-sm font-medium text-cyan-400">MCQs Answered</CardTitle>
                                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                  </CardHeader>
                                  <CardContent>
                                      <div className="text-2xl font-bold">{dashboard.mcqsAnswered}</div>
                                  </CardContent>
                              </Card>
                          </div>
                          
                          {/* Progress Chart */}
                          <Card className="bg-gray-800/50 border-cyan-500/20">
                              <CardHeader>
                                  <CardTitle className="text-cyan-400">Weekly Activity</CardTitle>
                              </CardHeader>
                              <CardContent className="pl-2">
                                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                                      <BarChart accessibilityLayer data={dashboard.weeklyProgress} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 6)} />
                                          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                                          <Tooltip content={<ChartTooltipContent />} />
                                          <Bar dataKey="questions" fill="var(--color-questions)" radius={4} />
                                          <Bar dataKey="interviews" fill="var(--color-interviews)" radius={4} />
                                      </BarChart>
                                  </ChartContainer>
                              </CardContent>
                          </Card>
                      </div>
                    </Section>

                    <Section icon={<GitBranch/>} title="Projects">
                        <div className="space-y-6">
                            {projects.map(proj => (
                                <Card key={proj.id} className="bg-gray-800/50 border-cyan-500/20">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl text-cyan-400">{proj.title}</CardTitle>
                                            {proj.link && proj.link !== '#' && <Button variant="outline" size="sm" asChild><Link href={proj.link} target="_blank"><Globe className="mr-2 h-4 w-4" /> View Project</Link></Button>}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-400 mb-4">{proj.description}</p>
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
                                <Card key={hack.id} className="bg-gray-800/50 border-cyan-500/20">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-cyan-400">{hack.name}</CardTitle>
                                        <p className="text-gray-400">{hack.role}</p>
                                    </CardHeader>
                                    <CardContent>
                                       <p className="font-semibold text-gray-300">{hack.achievement}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </Section>
                    
                     <Section icon={<Award/>} title="Certificates">
                         <div className="space-y-6">
                            {certificates.map(cert => (
                                <Card key={cert.id} className="bg-gray-800/50 border-cyan-500/20 p-6">
                                    <div className="flex justify-between items-center">
                                         <div>
                                            <h4 className="font-bold text-gray-200">{cert.name}</h4>
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
                     <Card className="bg-gradient-to-br from-cyan-900/50 to-gray-900/50 border-cyan-400/50 text-center flex flex-col items-center justify-center p-6">
                         <CardHeader className="p-0">
                            <CardDescription className="text-cyan-300">Interview Readiness</CardDescription>
                            <CardTitle className="text-5xl font-bold text-white my-2">{dashboard.interviewReadiness}%</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-sm text-cyan-200/80">Based on recent activity and performance.</p>
                        </CardContent>
                    </Card>

                     <Card className="bg-gray-800/50 border-cyan-500/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Code/> Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex flex-wrap gap-2">
                                {user.languages.map(lang => <Badge key={lang} variant="outline" className="text-lg py-1 px-3 bg-cyan-900/50 text-cyan-300 border-cyan-700">{lang}</Badge>)}
                            </div>
                        </CardContent>
                     </Card>
                </aside>
            </main>
             <footer className="text-center text-sm text-gray-500 pt-8">
                <p>Powered by <Link href="/" className="font-bold text-cyan-400 hover:underline">DevPro Ascent</Link></p>
            </footer>
       </div>
    </div>
  );
}
