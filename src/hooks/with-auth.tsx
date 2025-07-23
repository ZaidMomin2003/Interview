// src/hooks/with-auth.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
             <div className="flex min-h-screen w-full bg-background">
                <div className="hidden md:flex flex-col gap-4 p-2 border-r border-border bg-secondary/30 w-64">
                <Skeleton className="h-10 w-full bg-muted" />
                <div className="p-2 space-y-2">
                    <Skeleton className="h-8 w-full bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                    <Skeleton className="h-8 w-full bg-muted" />
                </div>
                </div>
                <div className="flex-1 p-8">
                    <Skeleton className="h-12 w-1/2 mb-4 bg-muted" />
                    <Skeleton className="h-8 w-3/4 mb-8 bg-muted" />
                    <Skeleton className="h-64 w-full bg-muted" />
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
}
