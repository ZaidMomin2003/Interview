
// src/app/(app)/ai-interview/page.tsx
'use client';

import { useEffect, useState, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Bot, Bookmark, Loader2, Play, Pause, Square } from 'lucide-react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserData } from '@/hooks/use-user-data';
import { conductInterview, InterviewMessage, summarizeInterview } from '@/lib/actions';


// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

type InterviewStatus = 'NOT_STARTED' | 'LOADING' | 'AI_SPEAKING' | 'USER_SPEAKING' | 'ENDED';

function AiInterviewComponent() {
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic') || 'General';
  const difficulty = searchParams.get('difficulty') || 'mid-level';
  
  const { toast } = useToast();
  const { addHistoryItem, addBookmark, isBookmarked, removeBookmark } = useUserData();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState<InterviewStatus>('NOT_STARTED');
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [summary, setSummary] = useState('');
  const [isBookmarkedState, setIsBookmarkedState] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const interviewId = `interview-${topic}-${difficulty}`;

  useEffect(() => {
    setIsBookmarkedState(isBookmarked(interviewId));
  }, [interviewId, isBookmarked]);

  const handleBookmark = () => {
    if (isBookmarked(interviewId)) {
        removeBookmark(interviewId);
        setIsBookmarkedState(false);
        toast({ title: "Bookmark Removed" });
    } else {
        addBookmark({
            id: interviewId,
            type: 'interview',
            title: `Interview: ${topic}`,
            description: `Difficulty: ${difficulty}. Summary: ${summary.substring(0, 100)}...`,
            href: `/ai-interview?topic=${topic}&difficulty=${difficulty}`
        });
        setIsBookmarkedState(true);
        toast({
            title: "Summary Bookmarked!",
            description: "You can find it in your bookmarks section."
        });
    }
  }
  
  const getCameraAndMicPermission = async (withMic = false) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: withMic });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
        return true;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setHasCameraPermission(false);
        setIsCameraOn(false);
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
        return false;
      }
  }

  // Effect to get camera permission on load
  useEffect(() => {
    getCameraAndMicPermission(false);
  }, []); 

  // Initialize Speech Recognition
  useEffect(() => {
    if (!SpeechRecognition) {
      toast({ variant: 'destructive', title: 'Unsupported Browser' });
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
        // Clear silence timeout on new speech
        if(silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
        
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        
        if (finalTranscript) {
            console.log('Final transcript:', finalTranscript);
            setMessages(prev => [...prev, { role: 'user', content: finalTranscript.trim() }]);
            stopListening();
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
            toast({ variant: 'destructive', title: 'Speech Recognition Error' });
        }
        stopListening();
    };

  }, [toast]);
  
  const startListening = useCallback(async () => {
    const hasMicPermission = await getCameraAndMicPermission(true);
    if (!recognitionRef.current || !hasMicPermission) return;
    
    setIsMicOn(true);
    setInterviewStatus('USER_SPEAKING');
    recognitionRef.current.start();
    console.log("Started listening...");

     // Set a timeout to stop listening after a period of silence
    silenceTimeoutRef.current = setTimeout(() => {
        console.log("Silence detected, stopping listening.");
        stopListening();
    }, 4000); // 4 seconds of silence
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
    setIsMicOn(false);
    if (interviewStatus !== 'ENDED') {
        setInterviewStatus('LOADING');
    }
    console.log("Stopped listening.");
  }, [interviewStatus]);
  
  const startInterview = useCallback(async () => {
    setInterviewStatus('LOADING');
    setMessages([]);
    setSummary('');
    
    // Log history item
    addHistoryItem({
        id: `interview-start-${Date.now()}`,
        type: 'AI Interview',
        description: `Started a mock interview on "${topic || 'General'}" (${difficulty || 'standard'}).`,
    });

    try {
        const response = await conductInterview({ topic, difficulty, messages: [] });
        setMessages([{ role: 'model', content: response.text }]);
        if (audioRef.current) {
            audioRef.current.src = response.audioDataUri;
            audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    } catch(error) {
        console.error("Failed to start interview", error);
        toast({variant: 'destructive', title: 'Failed to start interview.'});
        setInterviewStatus('NOT_STARTED');
    }
  }, [topic, difficulty, addHistoryItem, toast]);
  
  const endInterview = useCallback(async () => {
    stopListening();
    setInterviewStatus('LOADING');
    try {
        const result = await summarizeInterview({ messages });
        setSummary(result.summary);
    } catch(error) {
        console.error("Failed to get summary", error);
        toast({variant: 'destructive', title: 'Failed to get interview summary.'});
    } finally {
        setInterviewStatus('ENDED');
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setHasCameraPermission(false);
        }
    }
  }, [messages, stopListening, toast]);


  // Effect to handle conversation turns
  useEffect(() => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user') {
          const getNextResponse = async () => {
              setInterviewStatus('LOADING');
              try {
                  const response = await conductInterview({ topic, difficulty, messages });
                  if (response.text.includes("That's all the questions I have.")) {
                      endInterview();
                  } else {
                      setMessages(prev => [...prev, { role: 'model', content: response.text }]);
                       if (audioRef.current) {
                          audioRef.current.src = response.audioDataUri;
                          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
                      }
                  }
              } catch (error) {
                  console.error("Failed to get next response", error);
                  toast({ variant: 'destructive', title: 'AI response error.' });
                  setInterviewStatus('ENDED');
              }
          };
          getNextResponse();
      }
  }, [messages, topic, difficulty, toast, endInterview]);


  // Effect for audio player events
  useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;
      const onPlaying = () => setInterviewStatus('AI_SPEAKING');
      const onEnded = () => {
          if(interviewStatus !== 'ENDED') startListening();
      };
      audio.addEventListener('playing', onPlaying);
      audio.addEventListener('ended', onEnded);
      return () => {
          audio.removeEventListener('playing', onPlaying);
          audio.removeEventListener('ended', onEnded);
      };
  }, [audioRef, startListening, interviewStatus]);


  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  const getStatusMessage = () => {
      switch(interviewStatus) {
          case 'NOT_STARTED': return 'Click Start to begin the interview.';
          case 'LOADING': return 'AI is thinking...';
          case 'AI_SPEAKING': return 'AI is speaking...';
          case 'USER_SPEAKING': return 'Listening for your response...';
          case 'ENDED': return 'Interview has ended.';
          default: return 'Ready when you are.';
      }
  }
  
  const lastAiMessage = messages.filter(m => m.role === 'model').pop()?.content;

  return (
    <div className="max-w-6xl mx-auto w-full p-0 sm:p-4">
      <audio ref={audioRef} className="hidden" />
      <div className="flex flex-col h-full bg-background text-foreground sm:p-4 gap-4 rounded-none sm:rounded-lg border-y sm:border border-border">
        
        <div className="p-4 sm:p-0">
            <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Interview Session</CardTitle>
                    <CardDescription>{getStatusMessage()}</CardDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="secondary">Topic: {topic}</Badge>
                      <Badge variant="secondary" className="capitalize">Difficulty: {difficulty}</Badge>
                    </div>
                </CardHeader>
            </Card>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-0">
          <div className="md:col-span-2 relative w-full h-full bg-secondary rounded-lg overflow-hidden flex items-center justify-center min-h-[30vh] md:min-h-0 md:aspect-video">
            <video ref={videoRef} className={cn("w-full h-full object-cover", isCameraOn ? 'block' : 'hidden')} autoPlay muted />
            {!hasCameraPermission && (
              <div className="text-center text-muted-foreground p-4">
                <AlertCircle className="mx-auto h-12 w-12" />
                <p className="mt-2">Camera access is required. Please allow access in your browser.</p>
              </div>
            )}
             {!isCameraOn && hasCameraPermission && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary">
                  <VideoOff className="h-16 w-16 text-muted-foreground"/>
                  <p className="mt-4 text-muted-foreground">Camera is off</p>
              </div>
            )}
             {interviewStatus === 'ENDED' && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
                    <CardTitle className="text-4xl font-headline text-primary">Interview Complete!</CardTitle>
                    <CardDescription className="mt-2">View your performance summary below.</CardDescription>
                </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Card className="w-full h-48 md:h-full bg-secondary border-border flex flex-col items-center justify-center">
               <CardContent className="p-6 text-center">
                  <Image
                      src="/ai-interviewer.png"
                      alt="AI Interviewer"
                      width={128}
                      height={128}
                      className="rounded-full object-cover h-24 w-24 md:h-32 md:w-32 border-4 border-primary/30"
                      data-ai-hint="professional person"
                  />
                 <p className="mt-4 font-headline text-lg text-foreground">AI Interviewer</p>
                 <p className="text-sm text-muted-foreground">{ getStatusMessage() }</p>
              </CardContent>
            </Card>
          </div>
        </div>
          
        <Card className="mx-4 sm:mx-0">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="font-headline">AI Response</CardTitle>
                        <CardDescription>The latest response from the AI interviewer.</CardDescription>
                    </div>
                    {summary && (
                        <Button variant="outline" size="sm" onClick={handleBookmark}>
                            <Bookmark className="mr-2 h-4 w-4"/>
                            {isBookmarkedState ? 'Bookmarked' : 'Bookmark Summary'}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground min-h-[100px]">
                    {interviewStatus === 'LOADING' && <Loader2 className="animate-spin" />}
                    {interviewStatus !== 'LOADING' && lastAiMessage}
                    {interviewStatus === 'ENDED' && (
                        <div>
                            <h3 className="font-bold text-primary mb-2">Interview Summary:</h3>
                            <p className="whitespace-pre-wrap">{summary || "Generating summary..."}</p>
                        </div>
                    )}
                </p>
            </CardContent>
        </Card>


        <div className="flex justify-center items-center p-4 bg-background/50 border-t border-border rounded-b-lg">
          <div className="flex items-center gap-4">
            {interviewStatus === 'NOT_STARTED' || interviewStatus === 'ENDED' ? (
                 <Button onClick={startInterview} size="lg" className="rounded-full w-24 h-16">
                   <Play className="h-6 w-6" /> <span className="ml-2">Start</span>
                 </Button>
            ) : (
                <>
                <Button variant={isMicOn ? 'destructive' : 'secondary'} size="lg" className="rounded-full w-16 h-16" disabled>
                    {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                </Button>
                <Button onClick={toggleCamera} variant="secondary" size="lg" className="rounded-full w-16 h-16" disabled={!hasCameraPermission}>
                    {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>
                <Button onClick={endInterview} variant="destructive" size="lg" className="rounded-full w-24 h-16">
                    <PhoneOff className="h-6 w-6" />
                </Button>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function AiInterviewPage() {
    return (
        <Suspense fallback={<div><Skeleton className="h-24 w-full" /><Skeleton className="h-96 w-full mt-4" /></div>}>
            <AiInterviewComponent />
        </Suspense>
    );
}
