// src/app/(app)/pomodoro/page.tsx
"use client";

import { useMemo } from 'react';
import { useUserData } from '@/hooks/use-user-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PomodoroPage() {
  const { 
    profile, 
    loading, 
    updatePomodoroSettings,
    pomodoroState,
    setPomodoroState,
    switchPomodoroMode,
    resetPomodoroTimer,
    togglePomodoroActive,
  } = useUserData();

  const settings = useMemo(() => ({
    pomodoro: profile?.pomodoroSettings?.pomodoro ?? 25,
    shortBreak: profile?.pomodoroSettings?.shortBreak ?? 5,
    longBreak: profile?.pomodoroSettings?.longBreak ?? 15,
  }), [profile]);

  const timeLeft = pomodoroState.timeLeft;
  const isActive = pomodoroState.isActive;
  const mode = pomodoroState.mode;
  
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newDuration = Math.max(1, Number(value));
    const newSettings = { ...settings, [name]: newDuration };
    
    // This now calls the central update function
    updatePomodoroSettings({
        pomodoro: newSettings.pomodoro,
        shortBreak: newSettings.shortBreak,
        longBreak: newSettings.longBreak
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !profile) {
    return (
       <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
        <Card className="max-w-md mx-auto">
          <CardHeader>
             <Skeleton className="h-10 w-full" />
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-8 pt-6">
            <Skeleton className="w-64 h-64 rounded-full" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-10 w-10" />
            </div>
          </CardContent>
        </Card>
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 w-full" /></div>
              <div className="space-y-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-10 w-full" /></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progressPercentage = (timeLeft / (settings[mode] * 60)) * 100;
  
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
            <Tabs value={mode} onValueChange={(value) => switchPomodoroMode(value as any)} className="w-full">
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
                <Button onClick={togglePomodoroActive} size="lg" className="w-32">
                    {isActive ? <><Pause className="mr-2"/> Pause</> : <><Play className="mr-2"/> Start</>}
                </Button>
                <Button onClick={resetPomodoroTimer} variant="outline" size="icon">
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
                    <Input id="pomodoro" name="pomodoro" type="number" value={settings.pomodoro} onChange={handleSettingsChange} min="1" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="shortBreak">Short Break</Label>
                    <Input id="shortBreak" name="shortBreak" type="number" value={settings.shortBreak} onChange={handleSettingsChange} min="1"/>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="longBreak">Long Break</Label>
                    <Input id="longBreak" name="longBreak" type="number" value={settings.longBreak} onChange={handleSettingsChange} min="1"/>
                </div>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
