// src/app/p/[userId]/page.tsx
import { getPublicPortfolio } from '@/services/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PublicPortfolioPage({ params }: { params: { userId: string } }) {
  const portfolioData = await getPublicPortfolio(params.userId);

  if (!portfolioData) {
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

  const { displayName, bio, location, skills, projects, socials, photoURL } = portfolioData;

  return (
    <div className="min-h-screen bg-background text-foreground">
       <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
       <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background via-transparent to-background"></div>

      <div className="container mx-auto max-w-4xl p-4 sm:p-8 md:p-12">
        <header className="flex flex-col md:flex-row items-center gap-8">
          <Avatar className="h-32 w-32 border-4 border-primary">
            <AvatarImage src={photoURL || undefined} alt={displayName || 'User'} />
            <AvatarFallback className="text-4xl">{displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">{displayName}</h1>
            <p className="mt-2 text-xl text-muted-foreground">{bio}</p>
            {location && (
                <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{location}</span>
                </div>
            )}
          </div>
        </header>

         <div className="my-10 flex items-center justify-center gap-4">
            {socials?.github && <Button asChild variant="outline" size="icon"><Link href={socials.github} target="_blank"><Github/></Link></Button>}
            {socials?.linkedin && <Button asChild variant="outline" size="icon"><Link href={socials.linkedin} target="_blank"><Linkedin/></Link></Button>}
            {socials?.twitter && <Button asChild variant="outline" size="icon"><Link href={socials.twitter} target="_blank"><Twitter/></Link></Button>}
            {socials?.website && <Button asChild variant="outline" size="icon"><Link href={socials.website} target="_blank"><Globe/></Link></Button>}
        </div>

        {skills && skills.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold font-headline text-primary mb-6">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <Badge key={skill.name} className="text-lg py-2 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  {skill.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {projects && projects.length > 0 && (
          <section className="mt-12">
            <h2 className="text-3xl font-bold font-headline text-primary mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="bg-secondary/50 border-border hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      {project.url ? (
                        <Link href={project.url} target="_blank" className="hover:text-primary transition-colors flex items-center">
                          {project.title} <Globe className="h-4 w-4 ml-2"/>
                        </Link>
                      ) : project.title}
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
      </div>
    </div>
  );
}
