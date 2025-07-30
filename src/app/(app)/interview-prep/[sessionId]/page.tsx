// src/app/(app)/interview-prep/[sessionId]/page.tsx
"use client";

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, Video, VideoOff, Phone, ChevronRight, Loader2, Play, CircleDot, Pause, BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { InterviewMessage } from '@/ai/flows/interview-stream-flow';

type InterviewStatus = 'connecting' | 'ready' | 'listening' | 'processing' | 'speaking' | 'ended';

export default function InterviewSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    
    // Media and device state
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    // Interview state
    const [status, setStatus] = useState<InterviewStatus>('connecting');
    const [history, setHistory] = useState<InterviewMessage[]>([]);
    const [activeTranscript, setActiveTranscript] = useState('');
    const [isFinishing, setIsFinishing] = useState(false);

    // WebSocket and audio state
    const ws = useRef<WebSocket | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioQueue = useRef<string[]>([]);
    const isPlayingAudio = useRef(false);
    const audioContext = useRef<AudioContext | null>(null);


    useEffect(() => {
        // Initialize camera
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
            mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          } catch (error) {
            console.error('Error accessing media devices:', error);
            setHasCameraPermission(false);
            toast({ variant: 'destructive', title: 'Media Access Denied', description: 'Please enable camera and microphone permissions.' });
          }
        };
        getCameraPermission();
        
        // Initialize WebSocket
        const socket = new WebSocket('ws://localhost:3001'); // Use environment variables in a real app
        ws.current = socket;

        socket.onopen = () => {
            console.log('WebSocket connected');
            setStatus('ready');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'transcript') {
                setActiveTranscript(data.text);
            } else if (data.type === 'ai_text_chunk') {
                setActiveTranscript(prev => prev + data.chunk);
            } else if (data.type === 'ai_audio_chunk') {
                audioQueue.current.push(data.chunk);
                if (!isPlayingAudio.current) {
                    playNextAudioChunk();
                }
            } else if (data.type === 'ai_response_start') {
                setActiveTranscript(''); // Clear user transcript for AI response
                setStatus('speaking');
            } else if (data.type === 'ai_response_end') {
                setHistory(prev => [...prev, { role: 'model', content: activeTranscript + data.fullText }]);
                setActiveTranscript('');
                setStatus('ready'); // Ready for next user input
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            setStatus('ended');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setStatus('ended');
            toast({ variant: 'destructive', title: 'Connection Error', description: 'Could not connect to the interview service.' });
        };
        
        return () => {
            socket.close();
            if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
                mediaRecorder.current.stop();
            }
        };

    }, [toast]);
    
     const playNextAudioChunk = async () => {
        if (audioQueue.current.length === 0) {
            isPlayingAudio.current = false;
            return;
        }

        isPlayingAudio.current = true;
        const base64Chunk = audioQueue.current.shift();

        if (base64Chunk) {
            try {
                if (!audioContext.current) {
                    audioContext.current = new AudioContext();
                }
                const audioBuffer = Buffer.from(base64Chunk, 'base64');
                const decodedAudio = await audioContext.current.decodeAudioData(audioBuffer.buffer);
                const source = audioContext.current.createBufferSource();
                source.buffer = decodedAudio;
                source.connect(audioContext.current.destination);
                source.start();
                source.onended = playNextAudioChunk;
            } catch (e) {
                console.error('Error playing audio chunk:', e);
                playNextAudioChunk();
            }
        } else {
            playNextAudioChunk();
        }
    };


    const handleToggleRecording = () => {
        if (status === 'listening') {
            // Stop recording
            mediaRecorder.current?.stop();
            setStatus('processing');
        } else if (status === 'ready') {
            // Start recording
            mediaRecorder.current?.start(500); // Send data every 500ms
            mediaRecorder.current?.addEventListener('dataavailable', (event) => {
                if (event.data.size > 0 && ws.current?.readyState === WebSocket.OPEN) {
                    ws.current.send(event.data);
                }
            });
            setStatus('listening');
        }
    };

    const handleFinishInterview = () => {
        setIsFinishing(true);
        toast({
            title: "Finishing Interview...",
            description: "Your session has ended. Redirecting to results."
        });
        // In a real app, you would save the history and navigate
        router.push(`/interview-prep/${sessionId}/results`);
    };
    
    const getStatusIndicator = () => {
        switch (status) {
            case 'connecting':
                return <><Loader2 className="mr-2 animate-spin" /> Connecting...</>;
            case 'ready':
                return <><CircleDot className="mr-2 text-primary animate-pulse" /> Ready</>;
            case 'listening':
                return <><Mic className="mr-2 text-destructive animate-pulse" /> Listening...</>;
            case 'processing':
                return <><BrainCircuit className="mr-2 animate-spin" /> Processing...</>;
             case 'speaking':
                return <><Loader2 className="mr-2 animate-spin" /> AI Speaking...</>;
            case 'ended':
                 return <>Session Ended</>;
            default:
                return null;
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.14)-2px)] bg-black text-white p-4 gap-4">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                         <Alert variant="destructive" className="absolute w-auto max-w-md m-4 bg-background/80 backdrop-blur-sm">
                            <AlertTitle>Camera Access & Mic Denied</AlertTitle>
                            <AlertDescription>
                                Please enable permissions for the full experience.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                <Card className="lg:col-span-1 bg-secondary/50 border-border text-foreground flex flex-col">
                    <CardHeader>
                        <CardTitle>AI Interviewer</CardTitle>
                        <CardDescription className="flex items-center">{getStatusIndicator()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                         <div className="space-y-4 overflow-y-auto pr-2">
                             {history.map((msg, i) => (
                                <div key={i} className={`p-3 rounded-lg max-w-[90%] ${msg.role === 'user' ? 'bg-primary/20 self-end text-right' : 'bg-secondary'}`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                             ))}
                             {activeTranscript && (
                                <div className="p-3 rounded-lg bg-primary/20 max-w-[90%] self-end text-right">
                                    <p className="text-sm italic">{activeTranscript}</p>
                                </div>
                             )}
                        </div>
                        <Button onClick={handleFinishInterview} disabled={isFinishing} className="w-full mt-4">
                            {isFinishing ? <><Loader2 className="animate-spin mr-2"/>Finishing...</> : 'End Interview'}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center items-center p-2 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-4">
                    <Button 
                        variant={status === 'listening' ? 'destructive' : 'secondary'}
                        size="lg" 
                        className="rounded-full h-16 w-16"
                        onClick={handleToggleRecording}
                        disabled={status !== 'ready' && status !== 'listening'}
                    >
                        {status === 'listening' ? <Pause className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
                        <span className="sr-only">{status === 'listening' ? "Stop Recording" : "Start Recording"}</span>
                    </Button>
                     <Button variant="secondary" size="icon" className="h-12 w-12 rounded-full">
                        <VideoOff className="h-6 w-6" />
                    </Button>
                    <Button variant="destructive" size="icon" className="h-12 w-12 rounded-full" onClick={handleFinishInterview}>
                        <Phone className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
