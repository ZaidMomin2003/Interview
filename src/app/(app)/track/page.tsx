// src/app/(app)/track/page.tsx
"use client";

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUserData } from '@/hooks/use-user-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Plus, ArrowLeft, ArrowRight, Trash2, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import type { Task, TaskStatus } from '@/ai/schemas';

const taskFormSchema = z.object({
  title: z.string().min(2, 'Task title must be at least 2 characters.'),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const statusConfig: Record<TaskStatus, { title: string; color: string; }> = {
    'todo': { title: 'To Do', color: 'bg-gray-500/20 text-gray-300' },
    'in-progress': { title: 'In Progress', color: 'bg-blue-500/20 text-blue-300' },
    'done': { title: 'Done', color: 'bg-green-500/20 text-green-300' },
};

function TaskCard({ task }: { task: Task }) {
    const { updateTaskStatus, removeTask } = useUserData();

    const handleMove = (direction: 'next' | 'prev') => {
        const statuses: TaskStatus[] = ['todo', 'in-progress', 'done'];
        const currentIndex = statuses.indexOf(task.status);
        const nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= 0 && nextIndex < statuses.length) {
            updateTaskStatus(task.id, statuses[nextIndex]);
        }
    };
    
    return (
        <Card className="bg-secondary group">
            <CardContent className="p-3 flex items-center justify-between">
                <p className="font-medium text-foreground">{task.title}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove('prev')} disabled={task.status === 'todo'}><ArrowLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMove('next')} disabled={task.status === 'done'}><ArrowRight className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/80 hover:text-destructive" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function TrackPage() {
  const { profile, loading, addTask } = useUserData();
  const { toast } = useToast();
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = async (data: TaskFormValues) => {
    try {
        await addTask(data.title);
        toast({ title: 'Task Added!' });
        form.reset();
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const tasksByStatus = useMemo(() => {
    const columns: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': [],
    };
    (profile?.tasks || []).forEach(task => {
        columns[task.status].push(task);
    });
    return columns;
  }, [profile?.tasks]);

  if (loading) {
     return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <Skeleton className="h-12 w-full max-w-lg" />
            <div className="grid md:grid-cols-3 gap-6">
                 {[...Array(3)].map((_, i) => (
                    <Card key={i}><CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardContent></Card>
                ))}
            </div>
        </div>
     );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Task Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Organize your job hunt with a simple Kanban board.
        </p>
      </div>
      
      <Card className="max-w-lg">
        <CardContent className="p-4">
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                   <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormControl>
                                <Input placeholder="e.g., Follow up with recruiter from Acme Corp" {...field} />
                            </FormControl>
                        </FormItem>
                   )} />
                   <Button type="submit" disabled={form.formState.isSubmitting}>
                       {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Add Task</>}
                   </Button>
                </form>
                 <FormMessage className="pt-2">{form.formState.errors.title?.message}</FormMessage>
            </Form>
        </CardContent>
      </Card>


      <div className="grid md:grid-cols-3 gap-6 items-start">
        {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
            <Card key={status} className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                       <span className={`w-3 h-3 rounded-full ${statusConfig[status].color}`} />
                       {statusConfig[status].title}
                       <span className="text-sm font-normal text-muted-foreground">({tasksByStatus[status].length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 min-h-[100px]">
                    {tasksByStatus[status].length > 0 ? (
                        tasksByStatus[status].map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            No tasks here.
                        </div>
                    )}
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
