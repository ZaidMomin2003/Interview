// src/app/(app)/pomodoro/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserData } from '@/hooks/use-user-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, Settings, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const settingsSchema = z.object({
  workMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(120),
  shortBreakMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(30),
  longBreakMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(60),
});

export default function PomodoroPage() {
    const { profile, loading, updatePomodoro } = useUserData();
    const [timeLeft, setTimeLeft] = useState('00:00');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { toast } = useToast();

    const pomodoroState = profile?.pomodoro;

    const form = useForm<z.infer<typeof settingsSchema>>({
        resolver: zodResolver(settingsSchema),
        values: {
            workMinutes: pomodoroState?.settings.workMinutes || 25,
            shortBreakMinutes: pomodoroState?.settings.shortBreakMinutes || 5,
            longBreakMinutes: pomodoroState?.settings.longBreakMinutes || 15,
        },
    });
    
    useEffect(() => {
        if (pomodoroState) {
            form.reset({
                workMinutes: pomodoroState.settings.workMinutes,
                shortBreakMinutes: pomodoroState.settings.shortBreakMinutes,
                longBreakMinutes: pomodoroState.settings.longBreakMinutes,
            });
        }
    }, [pomodoroState, form]);
    
    const getDuration = (mode: 'work' | 'shortBreak' | 'longBreak' | undefined) => {
        if (!pomodoroState) return 25;
        switch(mode) {
            case 'work': return pomodoroState.settings.workMinutes;
            case 'shortBreak': return pomodoroState.settings.shortBreakMinutes;
            case 'longBreak': return pomodoroState.settings.longBreakMinutes;
            default: return 25;
        }
    }

    useEffect(() => {
        if (!pomodoroState) return;

        let intervalId: NodeJS.Timeout;

        if (pomodoroState.isRunning && pomodoroState.endTime) {
            intervalId = setInterval(() => {
                const now = Date.now();
                const remaining = pomodoroState.endTime! - now;

                if (remaining <= 0) {
                    clearInterval(intervalId);
                    setTimeLeft('00:00');
                    // Ensure handleTimerEnd is only called once
                    if (pomodoroState.isRunning) {
                        handleTimerEnd();
                    }
                    return;
                }

                const minutes = Math.floor((remaining / 1000 / 60) % 60);
                const seconds = Math.floor((remaining / 1000) % 60);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }, 500);
        } else {
             const duration = getDuration(pomodoroState.mode);
             setTimeLeft(`${String(duration).padStart(2, '0')}:00`);
        }

        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pomodoroState]);


    const handleTimerEnd = async () => {
        if (!pomodoroState) return;
        
        let newMode: 'work' | 'shortBreak' | 'longBreak' = 'work';
        let newSessionCount = pomodoroState.sessionCount;
        let notificationTitle = '';

        if (pomodoroState.mode === 'work') {
            newSessionCount++;
            if (newSessionCount > 0 && newSessionCount % 4 === 0) { // Using a fixed value of 4 for long break interval
                newMode = 'longBreak';
                notificationTitle = "Time for a long break!";
            } else {
                newMode = 'shortBreak';
                notificationTitle = "Time for a short break!";
            }
        } else {
            newMode = 'work';
            notificationTitle = "Time to get back to work!";
        }

        toast({ title: notificationTitle });
        // In a real app with notification permissions, you could use new Notification(notificationTitle);

        await updatePomodoro({ 
            isRunning: false,
            mode: newMode,
            sessionCount: newSessionCount,
            endTime: null 
        });
    };

    const toggleTimer = () => {
        if (!pomodoroState) return;
        
        const now = Date.now();
        if (pomodoroState.isRunning) {
            updatePomodoro({ isRunning: false, endTime: null }); 
        } else {
            const durationMinutes = getDuration(pomodoroState.mode);
            const endTime = now + durationMinutes * 60 * 1000;
            updatePomodoro({ isRunning: true, endTime });
        }
    };
    
    const resetTimer = () => {
        if (!pomodoroState) return;
        updatePomodoro({ isRunning: false, endTime: null, mode: 'work', sessionCount: 0 });
    };

    const skipToNext = () => {
        if (!pomodoroState || !pomodoroState.isRunning) return;
        handleTimerEnd();
    };

    const handleSettingsSave = (values: z.infer<typeof settingsSchema>) => {
        if (!pomodoroState) return;
        updatePomodoro({ settings: { ...pomodoroState.settings, ...values }, isRunning: false, endTime: null });
        setIsSettingsOpen(false);
        toast({ title: "Settings saved!" });
    };
  
    if (loading || !pomodoroState) {
        return (
            <div className="space-y-8">
                <div>
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </div>
                 <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center"><Skeleton className="h-6 w-24 mx-auto" /></CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-6">
                        <Skeleton className="w-64 h-64 rounded-full" />
                        <div className="flex items-center gap-4">
                             <Skeleton className="h-12 w-32 rounded-md" />
                             <Skeleton className="h-10 w-10 rounded-md" />
                             <Skeleton className="h-10 w-10 rounded-md" />
                        </div>
                        <Skeleton className="h-4 w-32" />
                    </CardContent>
                </Card>
                 <Skeleton className="h-10 w-40 mx-auto" />
            </div>
        );
    }

    const modeText = {
        work: "Focus",
        shortBreak: "Short Break",
        longBreak: "Long Break"
    };

    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">Pomodoro Timer</h1>
                <p className="text-muted-foreground mt-2">
                Stay focused and manage your work sessions effectively.
                </p>
            </div>
            
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-center text-xl text-primary">{modeText[pomodoroState.mode]}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-6">
                    <div className={cn(
                        "w-64 h-64 rounded-full flex items-center justify-center border-8 transition-colors",
                         pomodoroState.isRunning ? "border-primary" : "border-border"
                    )}>
                        <p className="font-mono text-7xl font-bold text-foreground">{timeLeft}</p>
                    </div>

                    <div className="flex items-center gap-4">
                         <Button onClick={toggleTimer} size="lg" className="w-32">
                            {pomodoroState.isRunning ? <Pause className="mr-2"/> : <Play className="mr-2" />}
                            {pomodoroState.isRunning ? 'Pause' : 'Start'}
                        </Button>
                         <Button onClick={resetTimer} variant="outline" size="icon"><RotateCcw/></Button>
                         <Button onClick={skipToNext} variant="outline" size="icon" disabled={!pomodoroState.isRunning}><SkipForward/></Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Sessions completed: <span className="font-bold text-primary">{pomodoroState.sessionCount}</span>
                    </p>
                     
                </CardContent>
            </Card>

             <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="mx-auto flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Timer Settings
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pomodoro Settings</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleSettingsSave)} className="space-y-4 pt-4">
                        <div>
                            <Label htmlFor="workMinutes">Work (minutes)</Label>
                            <Input id="workMinutes" type="number" {...form.register('workMinutes')} />
                            {form.formState.errors.workMinutes && <p className="text-destructive text-sm mt-1">{form.formState.errors.workMinutes.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="shortBreakMinutes">Short Break (minutes)</Label>
                            <Input id="shortBreakMinutes" type="number" {...form.register('shortBreakMinutes')} />
                            {form.formState.errors.shortBreakMinutes && <p className="text-destructive text-sm mt-1">{form.formState.errors.shortBreakMinutes.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="longBreakMinutes">Long Break (minutes)</Label>
                            <Input id="longBreakMinutes" type="number" {...form.register('longBreakMinutes')} />
                            {form.formState.errors.longBreakMinutes && <p className="text-destructive text-sm mt-1">{form.formState.errors.longBreakMinutes.message}</p>}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
