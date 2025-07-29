// src/app/(app)/dashboard/page.tsx
"use client";

import { useUserData } from '@/hooks/use-user-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RealDashboard from '@/components/layout/real-dashboard';

export default function DashboardPage() {
  const { loading } = useUserData();

  if (loading) {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/3" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/3" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-10 w-1/3" /></CardContent></Card>
            </div>
             <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2"><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
                <div className="lg:col-span-1 space-y-6">
                    <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent className="flex justify-center"><Skeleton className="h-48 w-48 rounded-full" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader><CardContent className="space-y-4"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent></Card>
                </div>
            </div>
        </div>
    );
  }
  
  return <RealDashboard />;
}

    