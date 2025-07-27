// src/components/feature/pomodoro-timer.tsx
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
import { Timer, Settings, Play, Pause, RotateCcw } from 'lucide-react';

const settingsSchema = z.object({
  workMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(120),
  shortBreakMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(30),
  longBreakMinutes: z.coerce.number().min(1, 'Must be at least 1 minute').max(60),
});

export function PomodoroTimer() {
  const { profile, updatePomodoro } = useUserData();
  const [timeLeft, setTimeLeft] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    if (!pomodoroState?.isRunning || !pomodoroState.endTime) {
      setTimeLeft('');
      return;
    }

    const intervalId = setInterval(() => {
      const now = Date.now();
      const remaining = pomodoroState.endTime! - now;

      if (remaining <= 0) {
        clearInterval(intervalId);
        // Handle session end automatically
        handleTimerEnd();
        return;
      }

      const minutes = Math.floor((remaining / 1000 / 60) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 500);

    return () => clearInterval(intervalId);
  }, [pomodoroState]);

  const handleTimerEnd = async () => {
    if (!pomodoroState) return;

    let newMode = pomodoroState.mode;
    let newSessionCount = pomodoroState.sessionCount;

    if (pomodoroState.mode === 'work') {
        newSessionCount++;
        if (newSessionCount % pomodoroState.settings.sessionsUntilLongBreak === 0) {
            newMode = 'longBreak';
        } else {
            newMode = 'shortBreak';
        }
    } else {
        newMode = 'work';
    }

    await updatePomodoro({ 
        isRunning: false,
        mode: newMode,
        sessionCount: newSessionCount,
        endTime: null 
    });

    // Optional: play a sound or show a notification
  };


  const startTimer = (mode = pomodoroState?.mode || 'work') => {
    if (!pomodoroState) return;
    
    let durationMinutes = 0;
    switch (mode) {
        case 'work': durationMinutes = pomodoroState.settings.workMinutes; break;
        case 'shortBreak': durationMinutes = pomodoroState.settings.shortBreakMinutes; break;
        case 'longBreak': durationMinutes = pomodoroState.settings.longBreakMinutes; break;
    }
    
    const endTime = Date.now() + durationMinutes * 60 * 1000;
    updatePomodoro({ isRunning: true, endTime, mode });
  };

  const togglePause = () => {
    if (!pomodoroState) return;

    if (pomodoroState.isRunning) {
      updatePomodoro({ isRunning: false, endTime: null }); // In a real app, you might want to save remaining time
    } else {
      startTimer();
    }
  };
  
  const resetTimer = () => {
    if (!pomodoroState) return;
    updatePomodoro({ isRunning: false, endTime: null, mode: 'work', sessionCount: 0 });
  };

  const handleSettingsSave = (values: z.infer<typeof settingsSchema>) => {
    updatePomodoro({ settings: { ...pomodoroState!.settings, ...values }});
    setIsDialogOpen(false);
  };
  
  if (!pomodoroState) return null;

  return (
    <>
      {pomodoroState.isRunning && timeLeft ? (
         <div className="w-full text-center p-2 bg-secondary rounded-lg group-data-[collapsible=icon]:hidden">
            <div className="text-xs font-semibold text-muted-foreground">{pomodoroState.mode === 'work' ? 'Focus Session' : 'Break Time'}</div>
            <div className="font-mono text-3xl font-bold text-primary">{timeLeft}</div>
            <div className="flex justify-center gap-2 mt-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={togglePause}>
                    {pomodoroState.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetTimer}>
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </div>
         </div>
      ) : (
        <div className="p-2 group-data-[collapsible=icon]:hidden">
            <Button variant="outline" className="w-full" onClick={() => startTimer()}>
                <Timer className="mr-2 h-4 w-4"/>
                Start Focus Session
            </Button>
        </div>
      )}
      
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 group-data-[collapsible=icon]:hidden">
                    <Settings className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pomodoro Settings</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(handleSettingsSave)} className="space-y-4">
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
    </>
  );
}
