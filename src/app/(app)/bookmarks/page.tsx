// src/app/(app)/bookmarks/page.tsx
'use client';

import { useUserData } from '@/hooks/use-user-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark, Code, FileText, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BookmarkCard = ({ title, description, href }: { title: string, description: string, href: string }) => (
    <Card className="bg-secondary/30 border-border hover:border-primary transition-colors">
        <CardHeader>
            <CardTitle className="text-lg font-headline">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="outline" size="sm" asChild>
                <Link href={href}>View <ArrowRight className="ml-2 h-4 w-4"/></Link>
            </Button>
        </CardContent>
    </Card>
);

export default function BookmarksPage() {
  const { profile } = useUserData();
  const bookmarks = profile?.bookmarks || [];

  const notes = bookmarks.filter(b => b.type === 'note');
  const codingQuestions = bookmarks.filter(b => b.type === 'coding-question');
  const interviews = bookmarks.filter(b => b.type === 'interview');
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-2">
            <Bookmark className="w-8 h-8"/>
            Bookmarks
        </h1>
        <p className="text-muted-foreground mt-2">Your saved notes, coding questions, and interview summaries.</p>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px]">
          <TabsTrigger value="notes"><FileText className="mr-2 h-4 w-4" /> Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="coding"><Code className="mr-2 h-4 w-4" /> Coding Questions ({codingQuestions.length})</TabsTrigger>
          <TabsTrigger value="interviews"><MessageSquare className="mr-2 h-4 w-4" /> Interview Summaries ({interviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map(note => <BookmarkCard key={note.id} title={note.title} description={note.description || ''} href={note.href} />)}
            </div>
            {notes.length === 0 && <p className="text-center text-muted-foreground py-12">You haven't bookmarked any notes yet.</p>}
        </TabsContent>

        <TabsContent value="coding" className="mt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {codingQuestions.map(q => (
                     <Card key={q.id} className="bg-secondary/30 border-border hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">{q.title}</CardTitle>
                            <CardDescription>{q.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={q.href}>Practice <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
             {codingQuestions.length === 0 && <p className="text-center text-muted-foreground py-12">You haven't bookmarked any coding questions yet.</p>}
        </TabsContent>

        <TabsContent value="interviews" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map(interview => <BookmarkCard key={interview.id} title={interview.title} description={interview.description || ''} href={interview.href}/>)}
            </div>
            {interviews.length === 0 && <p className="text-center text-muted-foreground py-12">You haven't bookmarked any interview summaries yet.</p>}
        </TabsContent>

      </Tabs>
    </div>
  );
}
