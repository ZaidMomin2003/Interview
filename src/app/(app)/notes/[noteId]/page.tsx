// src/app/(app)/notes/[noteId]/page.tsx
"use client";

import { useMemo } from 'react';
import { useUserData } from '@/hooks/use-user-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bookmark, ThumbsUp, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import { useToast } from '@/hooks/use-toast';

function CodeBlock({ code }: { code: string }) {
  const html = useMemo(() => {
    // Basic syntax highlighting for JS
    const highlightedCode = code
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return marked.parse(highlightedCode);
  }, [code]);
  
  return (
    <div 
      className="prose prose-sm md:prose-base prose-invert max-w-none bg-black/50 p-4 rounded-lg overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function NotePage({ params }: { params: { noteId: string } }) {
    const { profile, loading, addBookmark } = useUserData();
    const { toast } = useToast();

    const note = useMemo(() => {
        if (!profile?.notes) return null;
        return profile.notes.find(n => n.id === params.noteId) || null;
    }, [profile, params.noteId]);
    
    const handleBookmark = () => {
        if (!note) return;
        addBookmark({
            type: 'note',
            title: `Note: ${note.title}`,
            url: `/notes/${note.id}`
        });
        toast({
            title: "Note Bookmarked!",
            description: "You can find this note in your bookmarks.",
        });
    }

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-8 w-48" />
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                         {[...Array(2)].map((_, i) => (
                            <Card key={i}><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
                        ))}
                    </div>
                    <div className="space-y-6">
                        <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
                         <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!note) {
        return notFound();
    }
    
    const { title, description, keyTakeaways, contentSections } = note.content;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Button asChild variant="ghost" className="mb-2 self-start">
                    <Link href="/notes"><ArrowLeft className="mr-2"/> Back to Notes</Link>
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleBookmark}><Bookmark className="mr-2"/> Bookmark Note</Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <header>
                        <h1 className="text-4xl font-bold font-headline text-primary">{title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
                    </header>

                    {contentSections.map((section, index) => (
                        <Card key={index} className="bg-secondary/50">
                            <CardHeader>
                                <CardTitle>{section.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div 
                                    className="prose prose-invert prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-li:text-foreground"
                                    dangerouslySetInnerHTML={{ __html: marked(section.explanation) }}
                                />
                                <CodeBlock code={section.codeExample} />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                    <Card>
                        <CardHeader>
                            <CardTitle>Key Takeaways</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {keyTakeaways.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"/>
                                        <span className="text-muted-foreground">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Was this helpful?</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2">
                           <Button variant="outline" className="w-full"><ThumbsUp className="mr-2"/> Yes</Button>
                           <Button variant="outline" className="w-full"><ThumbsDown className="mr-2"/> No</Button>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}