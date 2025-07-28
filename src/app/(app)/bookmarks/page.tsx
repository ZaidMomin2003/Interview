// src/app/(app)/bookmarks/page.tsx
"use client";

import { useUserData } from '@/hooks/use-user-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, BarChart3, StickyNote, Bookmark as BookmarkIcon, Trash2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const typeMap = {
    interview: { icon: <Bot className="h-5 w-5" />, color: "text-blue-300", label: "AI Interview" },
    coding: { icon: <BarChart3 className="h-5 w-5" />, color: "text-purple-300", label: "Coding Challenge" },
    note: { icon: <StickyNote className="h-5 w-5" />, color: "text-yellow-300", label: "Note" },
    other: { icon: <BookmarkIcon className="h-5 w-5" />, color: "text-gray-300", label: "Other" },
};

export default function BookmarksPage() {
    const { profile, loading, removeBookmark } = useUserData();
    const bookmarks = profile?.bookmarks || [];

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                           <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                           <CardContent className="space-y-4">
                               <Skeleton className="h-4 w-full" />
                               <Skeleton className="h-4 w-1/2" />
                           </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
                <p className="mt-2 text-muted-foreground">
                    Your saved items for quick access.
                </p>
            </div>

            {bookmarks.length === 0 ? (
                <Card className="text-center py-20">
                    <CardContent className="space-y-4">
                        <BookmarkIcon className="h-16 w-16 mx-auto text-muted-foreground/50" />
                        <h3 className="text-xl font-semibold">No Bookmarks Yet</h3>
                        <p className="text-muted-foreground">You haven't saved any items. Start exploring and bookmark your favorites!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => {
                        const details = typeMap[bookmark.type];
                        return (
                            <Card key={bookmark.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className={`p-2 rounded-full bg-secondary ${details.color}`}>{details.icon}</div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeBookmark(bookmark.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="pt-2 text-base">{bookmark.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col justify-end">
                                    <div className="text-xs text-muted-foreground">
                                        Saved {formatDistanceToNow(new Date(bookmark.timestamp), { addSuffix: true })}
                                    </div>
                                    <Button asChild variant="link" className="p-0 h-auto justify-start mt-2">
                                        <Link href={bookmark.url}>
                                            View Item <ExternalLink className="ml-2 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}