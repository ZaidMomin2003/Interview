// src/app/(app)/history/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CodeXml, FileText, Video, BrainCircuit, History as HistoryIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useUserData } from '@/hooks/use-user-data';

const iconMap: { [key: string]: React.ReactNode } = {
  'AI Interview': <Video className="h-5 w-5 text-purple-400" />,
  'Coding Challenge': <CodeXml className="h-5 w-5 text-primary" />,
  'Resume Optimization': <FileText className="h-5 w-5 text-green-400" />,
  'Notes Generation': <BrainCircuit className="h-5 w-5 text-amber-400" />,
  'default': <HistoryIcon className="h-5 w-5 text-muted-foreground" />,
};

const getIconForType = (type: string) => {
    return iconMap[type] || iconMap['default'];
};

export default function HistoryPage() {
  const { profile } = useUserData();
  const history = profile?.history || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Activity History</h1>
        <p className="text-muted-foreground mt-2">A log of all your completed tasks and achievements.</p>
      </div>

      <Card className="bg-secondary/30 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <HistoryIcon className="h-6 w-6" />
            Your Timeline
          </CardTitle>
          <CardDescription>Review your progress over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] pr-4">
            {history.length > 0 ? (
                <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-8">
                    {history.map((item) => (
                    <div key={item.id} className="relative flex items-start gap-4">
                        {/* Dot on the timeline */}
                        <div className="absolute left-[-24px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                        <div className="p-2 bg-secondary/50 border border-border rounded-lg">
                        {getIconForType(item.type)}
                        </div>
                        <div className="flex-grow">
                        <p className="font-semibold text-foreground">{item.description}</p>
                        <p className="text-sm text-muted-foreground">
                            {item.type} &bull; {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center text-muted-foreground">
                    <HistoryIcon className="h-16 w-16 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">No History Yet</h3>
                    <p>Your recent activities will appear here once you start using the app.</p>
                </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
