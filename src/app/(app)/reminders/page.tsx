// src/app/(app)/reminders/page.tsx
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const reminderFormSchema = z.object({
  title: z.string().min(1, 'Reminder title is required.'),
  date: z.date({
    required_error: 'An interview date is required.',
  }),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

export default function RemindersPage() {
  const { profile, loading, addReminder, removeReminder } = useUserData();
  const { toast } = useToast();

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
  });

  const onSubmit = async (data: ReminderFormValues) => {
    await addReminder({
        title: data.title,
        date: data.date.getTime(),
    });
    toast({
        title: "Reminder Set!",
        description: `We'll help you keep track of "${data.title}".`,
    });
    form.reset({title: '', date: undefined});
  };
  
  const reminders = profile?.reminders || [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Interview Reminders</h1>
        <p className="mt-2 text-muted-foreground">
          Set reminders for your upcoming interviews. A countdown will appear in the sidebar.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card>
            <CardHeader>
                <CardTitle>Add New Reminder</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Interview / Company Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Google SWE Interview" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="date" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Interview Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={form.formState.isSubmitting}>Set Reminder</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
                {reminders.length === 0 ? (
                    <p className="text-muted-foreground">You have no upcoming reminders.</p>
                ) : (
                    <ul className="space-y-4">
                        {reminders.map(reminder => (
                            <li key={reminder.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                               <div>
                                   <p className="font-semibold">{reminder.title}</p>
                                   <p className="text-sm text-muted-foreground">
                                       {formatDistanceToNow(new Date(reminder.date), { addSuffix: true })}
                                   </p>
                               </div>
                               <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeReminder(reminder.id)}>
                                   <Trash2 className="h-4 w-4"/>
                               </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}