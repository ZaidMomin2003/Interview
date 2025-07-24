// src/components/feature/onboarding-check.tsx
'use client';

import { useUserData } from "@/hooks/use-user-data";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from "../ui/skeleton";

export const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
    const { profile, loading: userDataLoading } = useUserData();
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        if (userDataLoading || pathname === '/onboarding') return;

        const hasOnboarded = !!profile?.displayName;

        if (profile && !hasOnboarded) {
            router.push('/onboarding');
        }
    }, [profile, userDataLoading, pathname, router]);

    if (userDataLoading) {
       return (
            <div className="flex-1 p-8">
                <Skeleton className="h-12 w-1/2 mb-4 bg-muted" />
                <Skeleton className="h-8 w-3/4 mb-8 bg-muted" />
                <Skeleton className="h-64 w-full bg-muted" />
            </div>
       )
    }

    if (profile && !profile.displayName && pathname !== '/onboarding') {
        return null;
    }

    return <>{children}</>;
}
