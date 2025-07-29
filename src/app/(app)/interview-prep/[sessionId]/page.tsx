// src/app/(app)/interview-prep/[sessionId]/page.tsx
"use client";

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, Video, VideoOff, Phone, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const demoQuestions = [
    { type: 'Technical', text: 'Can you explain the difference between `let`, `const`, and `var` in JavaScript and when you would use each?' },
    { type: 'Behavioral', text: 'Tell me about a time you had a conflict with a coworker and how you resolved it.' },
    { type: 'Technical', text: 'Walk me through your process for designing a scalable REST API endpoint.' },
];

export default function InterviewSessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isFinishing, setIsFinishing] = useState(false);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
          }
        };
        getCameraPermission();
    }, []);
    
    const handleNextQuestion = () => {
        if (currentQuestionIndex < demoQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsRecording(false);
        } else {
            handleFinishInterview();
        }
    }

    const handleFinishInterview = () => {
        setIsFinishing(true);
        toast({
            title: "Finishing Interview...",
            description: "Analyzing your results. You will be redirected shortly."
        });
        // Simulate analysis delay
        setTimeout(() => {
            router.push(`/interview-prep/${sessionId}/results`);
        }, 2000);
    }
    
    const currentQuestion = demoQuestions[currentQuestionIndex];

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.14)-2px)] bg-black text-white p-4 gap-4">
            {/* Main Content */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Video Feed */}
                <div className="lg:col-span-3 bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                         <Alert variant="destructive" className="absolute w-auto max-w-md m-4 bg-background/80 backdrop-blur-sm">
                            <AlertTitle>Camera Access Denied</AlertTitle>
                            <AlertDescription>
                                Please enable camera permissions in your browser settings for the full experience.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* AI & Controls */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <Card className="bg-secondary/50 border-border text-foreground flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>AI Interviewer</CardTitle>
                            <CardDescription>Question {currentQuestionIndex + 1} of {demoQuestions.length}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <div>
                                <Badge variant="outline" className="mb-4">{currentQuestion.type}</Badge>
                                <p className="text-lg font-semibold">{currentQuestion.text}</p>
                            </div>
                           
                            {isFinishing ? (
                                 <Button disabled className="w-full">
                                    <Loader2 className="mr-2 animate-spin" />
                                    Analyzing...
                                </Button>
                            ) : (
                                currentQuestionIndex < demoQuestions.length - 1 ? (
                                    <Button onClick={handleNextQuestion} className="w-full">
                                        Next Question <ChevronRight className="ml-2" />
                                    </Button>
                                ) : (
                                    <Button onClick={handleFinishInterview} className="w-full bg-green-600 hover:bg-green-700">
                                        Finish & View Results
                                    </Button>
                                )
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex justify-center items-center p-2 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-4">
                    <Button 
                        variant={isRecording ? 'destructive' : 'secondary'}
                        size="lg" 
                        className="rounded-full h-16 w-16"
                        onClick={() => setIsRecording(prev => !prev)}
                    >
                        <Mic className="h-7 w-7" />
                        <span className="sr-only">{isRecording ? "Stop Recording" : "Start Recording"}</span>
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
