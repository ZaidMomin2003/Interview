// src/app/(app)/bookmarks/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark, Code, FileText, MessageSquare, ArrowRight, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Placeholder data for bookmarks
const bookmarks = {
  notes: [
    {
      id: 'note-1',
      title: 'Data Structures: Linked Lists',
      description: 'An in-depth look at singly and doubly linked lists...',
      href: '/notes/data-structures',
    },
    {
      id: 'note-2',
      title: 'Big O Notation Explained',
      description: 'Understanding time and space complexity is crucial for...',
      href: '/notes/big-o-notation',
    },
  ],
  codingQuestions: [
    {
      id: 'q-1',
      title: 'Two Sum',
      topic: 'Arrays',
      difficulty: 'Easy',
      href: '/coding-practice',
    },
     {
      id: 'q-2',
      title: 'Longest Substring Without Repeating Characters',
      topic: 'Strings, Sliding Window',
      difficulty: 'Medium',
      href: '/coding-practice',
    },
  ],
  interviews: [
    {
      id: 'interview-1',
      title: 'Behavioral Interview Practice',
      date: '2024-07-20',
      summary: 'Focused on STAR method for answering questions. AI feedback suggested more quantifiable results...',
      href: '/ai-interview',
    },
  ],
};

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
  const [favorite, setFavorite] = useState<string | null>(null);
  
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
          <TabsTrigger value="notes"><FileText className="mr-2 h-4 w-4" /> Notes ({bookmarks.notes.length})</TabsTrigger>
          <TabsTrigger value="coding"><Code className="mr-2 h-4 w-4" /> Coding Questions ({bookmarks.codingQuestions.length})</TabsTrigger>
          <TabsTrigger value="interviews"><MessageSquare className="mr-2 h-4 w-4" /> Interview Summaries ({bookmarks.interviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.notes.map(note => <BookmarkCard key={note.id} {...note} />)}
            </div>
            {bookmarks.notes.length === 0 && <p className="text-center text-muted-foreground py-12">You haven't bookmarked any notes yet.</p>}
        </TabsContent>

        <TabsContent value="coding" className="mt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.codingQuestions.map(q => (
                     <Card key={q.id} className="bg-secondary/30 border-border hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">{q.title}</CardTitle>
                            <CardDescription>{q.topic} &bull; <span className="capitalize">{q.difficulty}</span></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={q.href}>Practice <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
             {bookmarks.codingQuestions.length === 0 && <p className="text-center text-muted-foreground py-12">You haven't bookmarked any coding questions yet.</p>}
        </TabsContent>

        <TabsContent value="interviews" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.interviews.map(interview => <BookmarkCard key={interview.id} title={interview.title} description={interview.summary} href={interview.href}/>)}
            </div>
            {bookmarks.interviews.length === 0 && <p className="text-center text-muted-foreground py-12">You haven't bookmarked any interview summaries yet.</p>}
        </TabsContent>

      </Tabs>
    </div>
  );
}
