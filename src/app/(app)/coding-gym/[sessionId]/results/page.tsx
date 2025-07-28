// src/app/(app)/coding-gym/[sessionId]/results/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Repeat, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useUserData } from '@/hooks/use-user-data';

const demoResults = {
    overallScore: 75,
    feedback: [
        {
            question: 'Two Sum',
            yourSolution: `function twoSum(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
}`,
            suggestedSolution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`,
            analysis: "Your solution works, but it has a time complexity of O(n^2) due to the nested loops. The suggested solution uses a hash map (Map object in JS) to achieve a much better time complexity of O(n) by storing complements as it iterates through the array.",
        },
        {
            question: 'Valid Parentheses',
            yourSolution: `// Incomplete solution`,
            suggestedSolution: `function isValid(s) {
    const stack = [];
    const map = {
        "(": ")",
        "{": "}",
        "[": "]"
    };

    for (let i = 0; i < s.length; i++) {
        let char = s[i];
        if (map[char]) {
            stack.push(char);
        } else {
            let lastOpen = stack.pop();
            if (char !== map[lastOpen]) {
                return false;
            }
        }
    }
    return stack.length === 0;
}`,
            analysis: "Your solution was incomplete. The standard approach for this problem is to use a stack. When you encounter an opening bracket, push it onto the stack. When you encounter a closing bracket, pop from the stack and check if it's the corresponding opening bracket. The final result depends on whether the stack is empty at the end.",
        },
    ]
};

export default function CodingResultsPage({ params }: { params: { sessionId: string } }) {
    const { toast } = useToast();
    const { addBookmark } = useUserData();

    const handleBookmark = () => {
        addBookmark({
            type: 'coding-review',
            title: `Coding Review: Session #${params.sessionId}`,
            url: `/coding-gym/${params.sessionId}/results`
        });
        toast({
            title: "Review Bookmarked!",
            description: "You can find this session review in your bookmarks.",
        });
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Button asChild variant="ghost" className="mb-2">
                        <Link href="/coding-gym"><ArrowLeft className="mr-2"/> Back to Gym</Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Coding Session Results</h1>
                    <p className="mt-2 text-muted-foreground">
                        Here's the breakdown of your performance for session #{params.sessionId}.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleBookmark}><Bookmark className="mr-2"/> Bookmark Review</Button>
                    <Button asChild>
                        <Link href="/coding-gym"><Repeat className="mr-2"/> Start New Session</Link>
                    </Button>
                </div>
            </div>

            {/* Detailed Feedback */}
            <Card>
                <CardHeader>
                    <CardTitle>Question by Question Breakdown</CardTitle>
                    <CardDescription>Review the analysis for each problem you attempted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {demoResults.feedback.map((item, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <p className="font-semibold text-foreground text-lg">{item.question}</p>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2">Your Solution</h4>
                                            <pre className="text-sm bg-secondary p-3 rounded-md font-code overflow-x-auto">
                                                <code>{item.yourSolution}</code>
                                            </pre>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-foreground mb-2">Suggested Solution</h4>
                                            <pre className="text-sm bg-secondary p-3 rounded-md font-code overflow-x-auto">
                                                <code>{item.suggestedSolution}</code>
                                            </pre>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-foreground mb-2">AI Analysis</h4>
                                        <p className="text-muted-foreground bg-secondary/50 p-3 rounded-md">{item.analysis}</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
}
