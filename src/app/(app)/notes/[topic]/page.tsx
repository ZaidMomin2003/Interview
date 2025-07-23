// src/app/(app)/notes/[topic]/page.tsx
'use client'

import { handleGenerateNotes } from '@/lib/actions';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, BookOpen, ThumbsDown, ThumbsUp, Bookmark } from 'lucide-react';
import { NoteCodeBlock } from '@/components/feature/note-code-block';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { GenerateNotesOutput } from '@/ai/flows/generate-notes';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';

// This is a server component that fetches data on the server.
export default function NotesPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const topic = typeof params.topic === 'string' ? decodeURIComponent(params.topic) : '';
  const difficulty = searchParams.get('difficulty') || 'intermediate';

  if (!topic) {
    notFound();
  }
  
  return (
      <Suspense fallback={<NotesSkeleton topic={topic} />}>
        <NotesContent topic={topic} difficulty={difficulty} />
      </Suspense>
  )
}

function NotesContent({ topic, difficulty }: { topic: string, difficulty: string }) {
  const [notes, setNotes] = useState<GenerateNotesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addBookmark, addHistoryItem } = useUserData();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchNotes() {
      try {
        const result = await handleGenerateNotes({ topic, difficulty });
        setNotes(result);
        addHistoryItem({
          id: `note-${Date.now()}`,
          type: 'Notes Generation',
          description: `Generated notes on "${result.title}".`,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error('Failed to generate notes:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      }
    }
    fetchNotes();
  }, [topic, difficulty, addHistoryItem]);


  const handleBookmark = () => {
    if (!notes) return;
    addBookmark({
      id: `note-${topic}-${difficulty}`,
      type: 'note',
      title: notes.title,
      description: `Difficulty: ${difficulty}. ${notes.introduction.substring(0, 100)}...`,
      href: `/notes/${encodeURIComponent(topic)}?difficulty=${difficulty}`,
    });
    toast({
      title: 'Note Bookmarked!',
      description: 'You can find this note in your bookmarks.',
    });
  };

  if (error) {
     return (
      <div className="space-y-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-destructive">Unable to Generate Notes</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          The AI service is currently experiencing high demand and could not generate notes for the topic: "{topic}". Please try again in a few moments.
        </p>
         <pre className="text-xs text-left bg-secondary p-4 rounded-md">{error}</pre>
      </div>
    );
  }

  if (!notes) {
    return <NotesSkeleton topic={topic} />
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{notes.title}</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{notes.introduction}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className="mr-2 h-4 w-4"/>
                Bookmark Note
            </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {notes.sections.map((section, index) => (
            <Card key={index} className="bg-secondary/30">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="prose prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: marked(section.content) as string }}
                />

                {section.example && (
                  <NoteCodeBlock 
                    code={section.example.code} 
                    language={section.example.language} 
                    problemDescription={`Example for ${section.title}`}
                    result={section.example.result}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-8 space-y-8">
           <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <ClipboardList/>
                        Key Takeaways
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                    <div className="prose prose-invert prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: marked(notes.summary) as string }} />
                </CardContent>
            </Card>
            <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="text-lg font-headline">Was this helpful?</CardTitle>
                    <CardDescription>Your feedback improves our AI.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-around">
                    <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
                        <ThumbsUp className="w-8 h-8"/>
                        <span>Yes</span>
                    </button>
                     <button className="flex flex-col items-center gap-2 text-muted-foreground hover:text-red-500 transition-colors">
                        <ThumbsDown className="w-8 h-8"/>
                        <span>No</span>
                    </button>
                </CardContent>
            </Card>
        </aside>
      </div>
    </div>
  );
}


function NotesSkeleton({ topic }: { topic: string }) {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="border-b border-border pb-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2 mt-4" />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    {[...Array(3)].map((_, index) => (
                        <Card key={index} className="bg-secondary/30">
                            <CardHeader>
                                <Skeleton className="h-8 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-5/6" />
                               <Skeleton className="h-32 w-full mt-4" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sidebar */}
                <aside className="lg:sticky lg:top-8 space-y-8">
                    <Card className="bg-secondary/30">
                        <CardHeader>
                           <Skeleton className="h-6 w-3/4"/>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}
