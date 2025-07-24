
// src/app/(app)/dashboard/page.tsx
"use client";

import { useUserData } from "@/hooks/use-user-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml } from "lucide-react";

export default function DashboardPage() {
  const { profile } = useUserData();

  const questionsGenerated =
    profile?.history
      ?.filter((h) => h.type === "Coding Challenge")
      .reduce((total, h) => total + (h.count || 0), 0) || 0;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold font-headline">
        Dashboard
      </h1>
      <p className="text-muted-foreground mt-2">
        Welcome to your career co-pilot. New features will be added here.
      </p>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Generated
            </CardTitle>
            <CodeXml className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questionsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              from the Coding Gym
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
