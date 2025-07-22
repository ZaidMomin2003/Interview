// src/components/feature/note-code-block.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleGetCodeFeedback } from "@/lib/actions";
import { Loader2, Sparkles, Terminal, Copy, Check, FileOutput } from "lucide-react";
import { GetCodeFeedbackOutput } from "@/ai/flows/get-code-feedback";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


interface NoteCodeBlockProps {
  code: string;
  language: string;
  problemDescription: string;
  result?: string | null;
}

export function NoteCodeBlock({ code, language, problemDescription, result }: NoteCodeBlockProps) {
  const [feedback, setFeedback] = useState<GetCodeFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getFeedback = async () => {
    if (feedback) return; // Don't re-fetch if feedback is already there
    setIsLoading(true);
    setFeedback(null);
    try {
      const response = await handleGetCodeFeedback({
        code,
        language,
        problemDescription,
      });
      setFeedback(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
     <div className="my-6">
      <Tabs defaultValue="code" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="code"><Terminal className="mr-2 h-4 w-4" /> Code Example</TabsTrigger>
          {result && <TabsTrigger value="result"><FileOutput className="mr-2 h-4 w-4" /> Result</TabsTrigger>}
          <TabsTrigger value="feedback" onClick={getFeedback} disabled={isLoading}>
            {isLoading ? 
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analyzing...</> :
                <><Sparkles className="mr-2 h-4 w-4" /> Get AI Feedback</>
            }
          </TabsTrigger>
        </TabsList>
        <TabsContent value="code">
          <Card className="bg-background/50 border-border">
            <CardContent className="p-0">
               <div className="relative">
                  <pre className="p-4 w-full bg-background rounded-md overflow-auto text-sm font-code whitespace-pre-wrap">
                      <code className={`language-${language}`}>{code}</code>
                  </pre>
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        {result && (
          <TabsContent value="result">
            <Card className="bg-background/50 border-border">
              <CardContent className="p-4">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-code">{result}</pre>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <TabsContent value="feedback">
          <AnimatePresence>
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </motion.div>
            )}
            {feedback && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                 <Card className="bg-background/50 border-border">
                    <CardContent className="p-4 space-y-4">
                       <div>
                            <h4 className="font-semibold text-primary mb-2">Feedback</h4>
                            <div className="prose prose-invert prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                                {feedback.feedback}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-primary mb-2">Suggested Improvements</h4>
                            <pre className="w-full bg-secondary p-4 rounded-md overflow-auto text-sm font-code whitespace-pre-wrap">
                                {feedback.improvements}
                            </pre>
                        </div>
                    </CardContent>
                 </Card>
               </motion.div>
            )}
            {!isLoading && !feedback && (
                <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
                    Click the "Get AI Feedback" tab to analyze this code snippet.
                </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}
