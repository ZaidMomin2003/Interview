// src/app/(app)/pomodoro/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserData } from '@/hooks/use-user-data';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Play, Pause, RotateCcw } from 'lucide-react';

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export default function PomodoroPage() {
  const { profile, loading: userLoading } = useUserData();
  const [settings, setSettings] = useState<PomodoroSettings>({ pomodoro: 25, shortBreak: 5, longBreak: 15 });
  const [mode, setMode] = useState<PomodoroMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!profile) {
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      setLoading(true);
      const userDocRef = doc(db, 'users', profile.uid);
      const docSnap = await getDoc(userDocRef);

      let userSettings = settings;
      let userMode = mode;
      let userTimeLeft;
      let userIsActive = false;

      if (docSnap.exists() && docSnap.data().pomodoro) {
        const pomodoroData = docSnap.data().pomodoro;
        userSettings = pomodoroData.settings || settings;
        userMode = pomodoroData.mode || 'pomodoro';
        userTimeLeft = pomodoroData.timeLeft;
        userIsActive = pomodoroData.isActive || false;
      } else {
         await setDoc(userDocRef, {
          pomodoro: {
            settings,
            mode: 'pomodoro',
            timeLeft: settings.pomodoro * 60,
            isActive: false
          }
        }, { merge: true });
      }

      setSettings(userSettings);
      setMode(userMode);
      setTimeLeft(userTimeLeft !== undefined ? userTimeLeft : userSettings[userMode] * 60);
      setIsActive(userIsActive);
      setLoading(false);
    };

    loadSettings();
  }, [profile, userLoading]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      // Here you could add logic to auto-switch to the next mode and play a sound
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (!profile || loading) return;
    const userDocRef = doc(db, 'users', profile.uid);
    updateDoc(userDocRef, {
      "pomodoro.timeLeft": timeLeft,
      "pomodoro.isActive": isActive,
      "pomodoro.mode": mode,
      "pomodoro.settings": settings,
    }).catch(err => console.error("Failed to update pomodoro state", err));
  }, [timeLeft, isActive, mode, settings, profile, loading]);

  const switchMode = (newMode: PomodoroMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = { ...settings, [name]: Number(value) };
    setSettings(newSettings);
    // Auto-update timer if not active and on the changed mode
    if (!isActive && mode === name) {
        setTimeLeft(Number(value) * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || userLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-1/3" />
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader>
             <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-8 pt-6">
            <Skeleton className="h-64 w-64 rounded-full" />
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-12" />
            </div>
          </CardContent>
        </Card>
         <Card className="max-w-md mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-1/4"/>
                <Skeleton className="h-4 w-1/2"/>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-16 w-full"/>
                    <Skeleton className="h-16 w-full"/>
                    <Skeleton className="h-16 w-full"/>
               </div>
            </CardContent>
         </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
        <p className="mt-2 text-muted-foreground">
          Focus, break, and repeat. Your journey to productivity starts here.
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
            <Tabs value={mode} onValueChange={(value) => switchMode(value as PomodoroMode)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                    <TabsTrigger value="shortBreak">Short Break</TabsTrigger>
                    <TabsTrigger value="longBreak">Long Break</TabsTrigger>
                </TabsList>
            </Tabs>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-8 pt-6">
            <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-secondary" strokeWidth="7" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle
                        className="text-primary transition-all duration-1000 ease-linear"
                        strokeWidth="7"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - timeLeft / (settings[mode] * 60))}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold font-mono">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Button onClick={toggleTimer} size="lg" className="w-32">
                    {isActive ? <><Pause className="mr-2"/> Pause</> : <><Play className="mr-2"/> Start</>}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="icon">
                    <RotateCcw/>
                    <span className="sr-only">Reset</span>
                </Button>
            </div>
        </CardContent>
      </Card>

       <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Adjust your session durations (in minutes).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="pomodoro">Pomodoro</Label>
                    <Input id="pomodoro" name="pomodoro" type="number" value={settings.pomodoro} onChange={handleSettingsChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="shortBreak">Short Break</Label>
                    <Input id="shortBreak" name="shortBreak" type="number" value={settings.shortBreak} onChange={handleSettingsChange} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="longBreak">Long Break</Label>
                    <Input id="longBreak" name="longBreak" type="number" value={settings.longBreak} onChange={handleSettingsChange} />
                </div>
            </div>
        </CardContent>
       </Card>

    </div>
  );
}
