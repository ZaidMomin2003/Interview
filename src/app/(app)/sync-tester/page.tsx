// src/app/(app)/sync-tester/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/use-user-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Play, Square, Hash, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

export default function SyncTesterPage() {
    const { user } = useAuth();
    const { profile, loading } = useUserData();
    const [duration, setDuration] = useState(60); // Default 60 seconds
    const [remainingTime, setRemainingTime] = useState(0);
    const [newNumber, setNewNumber] = useState(0);

    const isTimerRunning = profile?.sync?.isTimerRunning ?? false;
    const endTime = profile?.sync?.endTime ?? null;
    const syncedNumber = profile?.sync?.syncedNumber ?? 0;

    useEffect(() => {
        if (!isTimerRunning || !endTime) {
            setRemainingTime(0);
            return;
        }

        const calculateRemaining = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.round((endTime - now) / 1000));
            setRemainingTime(remaining);

            if (remaining === 0 && user) {
                 const userDocRef = doc(db, 'users', user.uid);
                 updateDoc(userDocRef, { 'sync.isTimerRunning': false, 'sync.endTime': null });
            }
        };

        calculateRemaining();
        const interval = setInterval(calculateRemaining, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, endTime, user]);

    useEffect(() => {
      setNewNumber(syncedNumber);
    }, [syncedNumber])

    const handleStart = async () => {
        if (!user) return;
        const newEndTime = Date.now() + duration * 1000;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            'sync.isTimerRunning': true,
            'sync.endTime': newEndTime,
        });
    };

    const handleStop = async () => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            'sync.isTimerRunning': false,
            'sync.endTime': null,
        });
    };
    
    const handleSyncNumber = async () => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            'sync.syncedNumber': newNumber,
        });
    };
    
    if (loading) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-8 w-2/3" />
                <Card><CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
        )
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-2">
                    <RefreshCw className="w-8 h-8"/>
                    Sync Tester
                </h1>
                <p className="text-muted-foreground mt-2">Use these tools to test real-time data synchronization across your devices.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <Card className="bg-secondary/30">
                  <CardHeader className="text-center">
                      <CardTitle className="font-headline text-primary text-3xl flex items-center justify-center gap-2"><Timer /> Real-Time Timer</CardTitle>
                      <CardDescription>Start the timer on one device and watch it count down on another.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="text-center">
                          <p className="text-7xl font-bold font-mono text-foreground tracking-tighter">
                              {formatTime(remainingTime)}
                          </p>
                      </div>

                      {!isTimerRunning ? (
                           <div className="flex flex-col sm:flex-row items-center gap-4">
                              <Input
                                  type="number"
                                  value={duration}
                                  onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value, 10) || 0))}
                                  className="text-center text-lg"
                                  min="1"
                              />
                              <Button onClick={handleStart} className="w-full sm:w-auto" size="lg">
                                  <Play className="mr-2 h-5 w-5"/> Start
                              </Button>
                          </div>
                      ) : (
                          <Button onClick={handleStop} variant="destructive" className="w-full" size="lg">
                              <Square className="mr-2 h-5 w-5" /> Stop
                          </Button>
                      )}
                  </CardContent>
              </Card>

              <Card className="bg-secondary/30">
                  <CardHeader className="text-center">
                      <CardTitle className="font-headline text-primary text-3xl flex items-center justify-center gap-2"><Hash /> Real-Time Number</CardTitle>
                      <CardDescription>Set a number on one device and watch it update on another.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                      <div className="text-center">
                          <p className="text-7xl font-bold font-mono text-foreground tracking-tighter">
                              {syncedNumber}
                          </p>
                      </div>

                       <div className="flex flex-col sm:flex-row items-center gap-4">
                          <Input
                              type="number"
                              value={newNumber}
                              onChange={(e) => setNewNumber(parseInt(e.target.value, 10) || 0)}
                              className="text-center text-lg"
                          />
                          <Button onClick={handleSyncNumber} className="w-full sm:w-auto" size="lg">
                              <RefreshCw className="mr-2 h-5 w-5"/> Sync Number
                          </Button>
                      </div>
                  </CardContent>
              </Card>
            </div>
        </div>
    );
}
