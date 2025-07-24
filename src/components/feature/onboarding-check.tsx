// src/components/feature/onboarding-check.tsx
'use client';

import { useUserData } from "@/hooks/use-user-data";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from "../ui/skeleton";

// This component now handles both loading the user profile and checking if onboarding is complete.
export const OnboardingCheck = ({ children }: { children: React.ReactNode }) => {
    const { profile, loading: userDataLoading } = useUserData();
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        // Don't run check if data is still loading or if we are already on the onboarding page
        if (userDataLoading || pathname === '/onboarding') return;

        // A simple check to see if onboarding has been completed.
        // We assume if displayName exists, they have onboarded.
        const hasOnboarded = !!profile?.displayName;

        if (profile && !hasOnboarded) {
            router.push('/onboarding');
        }
    }, [profile, userDataLoading, pathname, router]);

    // Show a loading skeleton while the user profile is being fetched.
    if (userDataLoading) {
       return (
            <div className="flex-1 p-8">
                <Skeleton className="h-12 w-1/2 mb-4 bg-muted" />
                <Skeleton className="h-8 w-3/4 mb-8 bg-muted" />
                <Skeleton className="h-64 w-full bg-muted" />
            </div>
       )
    }

    // Once loaded, render the children (the rest of the app)
    return <>{children}</>;
}
