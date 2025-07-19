
// src/app/(app)/ai-interview/page.tsx
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Bot } from 'lucide-react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

export default function AiInterviewPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);
  
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript(''); // Clear transcript when starting
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.error("Could not start recognition:", e);
      if ((e as DOMException).name === 'NotAllowedError') {
         toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: `Please allow microphone access in your browser settings.`,
        });
      }
    }
  }, [toast]);


  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setIsCameraOn(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    };
    getCameraPermission();

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(transcript + finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'network') {
          console.log('Network error, attempting to restart recognition...');
          // Optional: Add a small delay before restarting
          setTimeout(() => {
            if (isListening) {
              stopListening();
              startListening();
            }
          }, 1000);
        } else {
          toast({
            variant: 'destructive',
            title: 'Speech Recognition Error',
            description: `An error occurred: ${event.error}. Please check microphone permissions.`,
          });
          stopListening();
        }
      };
      
    } else {
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Speech recognition is not supported by your browser.',
        });
    }

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        stopListening();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, stopListening, startListening, isListening]); 

  // This effect manages the onend behavior based on the isListening state
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
  
    const handleRecognitionEnd = () => {
      if (isListening) {
        console.log("Speech recognition ended, restarting...");
        try {
          // No need to call stopListening() here, just restart
          recognition.start();
        } catch(e) {
          console.error("Failed to restart recognition:", e);
          setIsListening(false); // Set to false on failure to restart
        }
      }
    };
  
    recognition.onend = handleRecognitionEnd;
  
  }, [isListening]);


  const toggleMic = () => {
    if (!SpeechRecognition) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex flex-col h-full bg-black text-white p-4 gap-4 rounded-lg border border-cyan-500/30">
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Video Panel (User) */}
          <div className="md:col-span-2 relative w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[30vh] md:min-h-0 md:aspect-video">
            <video ref={videoRef} className={cn("w-full h-full object-cover", isCameraOn ? 'block' : 'hidden')} autoPlay muted />
            {!hasCameraPermission && (
              <div className="text-center text-muted-foreground p-4">
                <AlertCircle className="mx-auto h-12 w-12" />
                <p className="mt-2">Camera access is required. Please allow access in your browser.</p>
              </div>
            )}
             {!isCameraOn && hasCameraPermission && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
                  <VideoOff className="h-16 w-16 text-muted-foreground"/>
                  <p className="mt-4 text-muted-foreground">Camera is off</p>
              </div>
            )}
          </div>

          {/* Right Panel (AI Interviewer & Transcript) */}
          <div className="flex flex-col gap-4">
            <Card className="w-full h-48 md:h-full bg-gray-900 border-cyan-500/30 flex flex-col items-center justify-center">
               <CardContent className="p-6 text-center">
                 <Bot className="h-16 md:h-24 w-16 md:w-24 text-cyan-400/70 mx-auto" />
                 <p className="mt-4 font-headline text-lg text-gray-200">AI Interviewer</p>
                 <p className="text-sm text-muted-foreground">Ready when you are.</p>
              </CardContent>
            </Card>
            <Card className="flex-grow bg-gray-900 border-cyan-500/30 flex flex-col min-h-[20vh] md:hidden">
              <CardHeader>
                <CardTitle className="text-cyan-400 font-headline">Transcript</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {transcript || (isListening ? 'Listening...' : 'Click the mic to start speaking.')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transcript for larger screens */}
        <Card className="hidden md:flex flex-grow bg-gray-900 border-cyan-500/30 flex-col min-h-[20vh]">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-headline">Transcript</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto">
              <p className="text-gray-300 whitespace-pre-wrap">
                {transcript || (isListening ? 'Listening...' : 'Click the mic to start speaking.')}
              </p>
            </CardContent>
          </Card>


        {/* Controls */}
        <div className="flex justify-center items-center p-4 bg-gray-900/50 border-t border-cyan-500/30 rounded-lg">
          <div className="flex items-center gap-4">
            <Button onClick={toggleMic} variant={isListening ? 'destructive' : 'secondary'} size="lg" className="rounded-full w-16 h-16">
              {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
            </Button>
            <Button onClick={toggleCamera} variant="secondary" size="lg" className="rounded-full w-16 h-16" disabled={!hasCameraPermission}>
              {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </Button>
            <Button variant="destructive" size="lg" className="rounded-full w-24 h-16">
              <PhoneOff className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
