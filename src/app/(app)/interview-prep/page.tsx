// src/app/(app)/interview-prep/page.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Mic, Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { useUserData } from '@/hooks/use-user-data';
import { useToast } from '@/hooks/use-toast';
import { conductInterview } from '@/ai/flows/conduct-interview';
import { summarizeInterview } from '@/ai/flows/summarize-interview';
import type { InterviewMessage } from '@/ai/types/interview-types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const interviewSetupSchema = z.object({
  topic: z.string().min(1, 'Topic is required.'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
});

const userResponseSchema = z.object({
  text: z.string().min(1, "Please provide a response."),
});

export default function InterviewPrepPage() {
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [interviewSettings, setInterviewSettings] = useState<z.infer<typeof interviewSetupSchema> | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  
  const { addHistoryItem } = useUserData();
  const { toast } = useToast();
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const setupForm = useForm<z.infer<typeof interviewSetupSchema>>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: { topic: 'React Hooks', difficulty: 'Medium' },
  });

  const responseForm = useForm<z.infer<typeof userResponseSchema>>({
    resolver: zodResolver(userResponseSchema),
    defaultValues: { text: '' },
  });

  useEffect(() => {
    // Scroll to bottom of messages when new message is added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);


  async function handleStartInterview(values: z.infer<typeof interviewSetupSchema>) {
    setIsLoading(true);
    setMessages([]);
    setSummary(null);
    setInterviewSettings(values);
    
    try {
      const initialMessage: InterviewMessage = { role: 'user', content: `Let's start the interview.` };
      const response = await conductInterview({
          topic: values.topic,
          difficulty: values.difficulty,
          messages: [initialMessage]
      });

      setMessages([
          initialMessage,
          { role: 'model', content: response.text }
      ]);

      if (response.audioDataUri && audioPlayerRef.current) {
          audioPlayerRef.current.src = response.audioDataUri;
          audioPlayerRef.current.play();
      }

      setIsInterviewing(true);
    } catch (error) {
      console.error("Error starting interview:", error);
      toast({ variant: 'destructive', title: 'Failed to start interview.' });
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleSendResponse(values: z.infer<typeof userResponseSchema>) {
    setIsLoading(true);
    const newMessages: InterviewMessage[] = [...messages, { role: 'user', content: values.text }];
    setMessages(newMessages);
    responseForm.reset();

    try {
      if (!interviewSettings) throw new Error("Interview settings not found.");

      const response = await conductInterview({
        ...interviewSettings,
        messages: newMessages,
      });

      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
      
       if (response.audioDataUri && audioPlayerRef.current) {
          audioPlayerRef.current.src = response.audioDataUri;
          audioPlayerRef.current.play();
      }

    } catch (error) {
       console.error("Error sending response:", error);
       toast({ variant: 'destructive', title: 'Failed to get response.' });
    } finally {
       setIsLoading(false);
    }
  }

  async function handleEndInterview() {
      setIsLoading(true);
      try {
          const result = await summarizeInterview({ messages });
          setSummary(result.summary);
           await addHistoryItem({
            type: 'AI Interview',
            description: `Completed a ${interviewSettings?.difficulty} ${interviewSettings?.topic} mock interview.`,
          });
          toast({ title: "Interview Complete!", description: "Check out your performance summary." });

      } catch(error) {
          console.error("Error summarizing interview:", error);
          toast({ variant: 'destructive', title: 'Failed to get summary.' });
      } finally {
          setIsInterviewing(false);
          setIsLoading(false);
      }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">AI Interview Prep</h1>
        <p className="text-muted-foreground mt-2">
          Practice your skills with Alex, your personal AI interviewer.
        </p>
      </div>

      {!isInterviewing && !summary && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Setup</CardTitle>
            <CardDescription>Choose your topic and difficulty to begin.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...setupForm}>
              <form onSubmit={setupForm.handleSubmit(handleStartInterview)} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <FormField control={setupForm.control} name="topic" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl><Input placeholder="e.g., System Design" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={setupForm.control} name="difficulty" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <Button type="submit" disabled={isLoading} className="md:col-start-3">
                  {isLoading ? <Loader2 className="animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
                  Start Interview
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {(isInterviewing || summary) && (
        <Card>
            <CardHeader>
                <CardTitle>Interview with Alex: {interviewSettings?.topic} ({interviewSettings?.difficulty})</CardTitle>
                 <audio ref={audioPlayerRef} className="hidden" />
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px] w-full p-4 border rounded-md" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.slice(1).map((msg, index) => (
                             <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && <Avatar className="h-8 w-8"><AvatarFallback><Bot /></AvatarFallback></Avatar>}
                                <div className={`max-w-lg p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                    <p>{msg.content}</p>
                                </div>
                                {msg.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User /></AvatarFallback></Avatar>}
                            </div>
                        ))}
                         {isLoading && messages.length > 0 && (
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8"><AvatarFallback><Bot /></AvatarFallback></Avatar>
                                <div className="max-w-lg p-3 rounded-lg bg-secondary flex items-center">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                {isInterviewing && (
                    <Form {...responseForm}>
                        <form onSubmit={responseForm.handleSubmit(handleSendResponse)} className="mt-4 flex gap-4 items-start">
                             <FormField control={responseForm.control} name="text" render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl><Textarea placeholder="Type your answer..." {...field} disabled={isLoading} /></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isLoading} size="icon"><Send/></Button>
                        </form>
                    </Form>
                )}

                <div className="mt-4 flex justify-end gap-2">
                    {isInterviewing && <Button variant="destructive" onClick={handleEndInterview} disabled={isLoading}>End Interview</Button>}
                    {!isInterviewing && <Button onClick={() => { setIsInterviewing(false); setSummary(null); }}>Start New Interview</Button>}
                </div>
            </CardContent>
        </Card>
      )}

      {summary && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{summary}</div>
            </CardContent>
        </Card>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Audio Playback</AlertTitle>
        <AlertDescription>
          Ensure your device's volume is up to hear the interviewer's questions. Audio will play automatically.
        </AlertDescription>
      </Alert>

    </div>
  );
}
