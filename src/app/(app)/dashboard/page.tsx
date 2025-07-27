// src/app/(app)/dashboard/page.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back! Here's a fresh start for your application.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your new, blank dashboard. You can start adding components and features here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
