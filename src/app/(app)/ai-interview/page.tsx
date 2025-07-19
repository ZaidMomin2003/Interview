// src/app/(app)/ai-interview/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, Video, VideoOff, PhoneOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

export default function AiInterviewPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Request camera permission
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

    // Setup Speech Recognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
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
        toast({
            variant: 'destructive',
            title: 'Speech Recognition Error',
            description: `An error occurred: ${event.error}`,
        });
        setIsListening(false);
      };
      
      recognition.onend = () => {
        if(isListening) {
          // Restart recognition if it stops unexpectedly
          recognition.start();
        }
      }

      recognitionRef.current = recognition;
    }

    return () => {
        // Cleanup: stop camera and recognition
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [toast, isListening]);

  const toggleMic = () => {
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Speech recognition is not supported by your browser.',
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
      setTranscript(''); // Clear transcript when stopping
    } else {
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
    setIsMuted(!isMuted);
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
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-black text-white p-4 gap-4">
      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Video Panel (User) */}
        <div className="md:col-span-2 relative w-full h-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          {hasCameraPermission ? (
            <video ref={videoRef} className={cn("w-full h-full object-cover", isCameraOn ? 'block' : 'hidden')} autoPlay muted />
          ) : (
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
          <Card className="w-full h-64 bg-gray-900 border-cyan-500/30">
             <CardContent className="p-0 relative h-full flex items-center justify-center">
               <Image 
                src="https://placehold.co/600x400.png" 
                alt="AI Interviewer" 
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                data-ai-hint="robot face"
              />
               <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                AI Interviewer
              </div>
            </CardContent>
          </Card>
          <Card className="flex-grow bg-gray-900 border-cyan-500/30 flex flex-col">
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
  );
}