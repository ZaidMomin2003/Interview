// src/app/(app)/pomodoro/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';

type PomodoroMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export default function PomodoroPage() {
  const [settings, setSettings] = useState<PomodoroSettings>({ pomodoro: 25, shortBreak: 5, longBreak: 15 });
  const [mode, setMode] = useState<PomodoroMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [isActive, setIsActive] = useState(false);

  // Effect for the countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer reached zero
      setIsActive(false);
      // Optional: Add a notification or sound here
      // You could automatically switch modes, e.g., to a break after a pomodoro session
      // For now, we'll just stop the timer.
    }
    
    // Cleanup function to clear the interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Effect to update the timer when the mode changes
  useEffect(() => {
    // Only reset the timer if it's not currently active
    if (!isActive) {
      setTimeLeft(settings[mode] * 60);
    }
  }, [mode, settings, isActive]);


  const switchMode = (newMode: PomodoroMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure value is not negative
    const newDuration = Math.max(1, Number(value));
    const newSettings = { ...settings, [name]: newDuration };
    setSettings(newSettings);
    
    // If the timer for the changed mode is not active, update its timeLeft
    if (!isActive && mode === name) {
        setTimeLeft(newDuration * 60);
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
