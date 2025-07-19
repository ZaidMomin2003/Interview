// src/app/(app)/history/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeXml, FileText, Video, BrainCircuit, History as HistoryIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Placeholder data for activity logs
const activityLog = [
  {
    id: 1,
    type: 'AI Interview',
    description: 'Completed a mock interview for "Senior Frontend Engineer".',
    icon: <Video className="h-5 w-5 text-purple-400" />,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    type: 'Coding Challenge',
    description: 'Solved "Two Sum" problem in Python with 95% efficiency.',
    icon: <CodeXml className="h-5 w-5 text-cyan-400" />,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    type: 'Resume Optimization',
    description: 'Optimized resume for a "Data Scientist" role at Google.',
    icon: <FileText className="h-5 w-5 text-green-400" />,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 4,
    type: 'MCQ Quiz',
    description: 'Scored 8/10 on the "Data Structures Fundamentals" quiz.',
    icon: <BrainCircuit className="h-5 w-5 text-amber-400" />,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: 5,
    type: 'Coding Challenge',
    description: 'Attempted "Longest Substring Without Repeating Characters".',
    icon: <CodeXml className="h-5 w-5 text-cyan-400" />,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600000), // 3 days ago, 1 hour later
  },
  {
    id: 6,
    type: 'AI Interview',
    description: 'Completed a behavioral interview practice session.',
    icon: <Video className="h-5 w-5 text-purple-400" />,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 7,
    type: 'Resume Generation',
    description: 'Generated a new resume for "Backend Developer" roles.',
    icon: <FileText className="h-5 w-5 text-green-400" />,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Activity History</h1>
        <p className="text-muted-foreground mt-2">A log of all your completed tasks and achievements.</p>
      </div>

      <Card className="bg-gray-900/50 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <HistoryIcon className="h-6 w-6" />
            Your Timeline
          </CardTitle>
          <CardDescription>Review your progress over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500/30" />
              
              <div className="space-y-8">
                {activityLog.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-4">
                    {/* Dot on the timeline */}
                    <div className="absolute left-[-24px] top-1.5 h-4 w-4 rounded-full bg-cyan-400 border-4 border-gray-900" />
                    <div className="p-2 bg-gray-800/60 border border-gray-700/50 rounded-lg">
                      {item.icon}
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-200">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.type} &bull; {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}