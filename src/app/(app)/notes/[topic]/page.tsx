// src/app/(app)/notes/[topic]/page.tsx
import { handleGenerateNotes } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, BookOpen, Check, Circle, ThumbsDown, ThumbsUp } from 'lucide-react';
import { NoteCodeBlock } from '@/components/feature/note-code-block';
import { marked } from 'marked';

// This is a server component that fetches data on the server.
export default async function NotesPage({ params }: { params: { topic: string } }) {
  const topic = decodeURIComponent(params.topic);

  if (!topic) {
    notFound();
  }

  let notes;
  try {
    notes = await handleGenerateNotes({ topic });
  } catch (error) {
    console.error('Failed to generate notes:', error);
    // Render an error state, or you could redirect
    return (
      <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-destructive">Error</h1>
        <p className="text-muted-foreground">
          Could not generate notes for the topic: "{topic}". Please try another topic or check back later.
        </p>
      </div>
    );
  }

  if (!notes) {
    return (
       <div className="space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">No Notes Found</h1>
        <p className="text-muted-foreground">
          We could not find or generate notes for the topic: "{topic}".
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">{notes.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{notes.introduction}</p>
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
