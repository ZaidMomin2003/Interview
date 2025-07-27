// src/app/(app)/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, Video } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AppUser } from "@/hooks/use-user-data";

async function getUserData(uid: string): Promise<AppUser | null> {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
        return docSnap.data() as AppUser;
    }
    return null;
}


export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    // This should ideally not happen due to the AuthGuard, but it's good practice
    return (
        <div>
            <h1 className="text-3xl md:text-4xl font-bold font-headline">
                Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
                Please log in to view your dashboard.
            </p>
        </div>
    );
  }
  
  const profile = await getUserData(user.uid);

  const questionsGenerated =
    profile?.history?.filter((h) => h.type === "Coding Challenge").length || 0;
  const resumesOptimized = 
    profile?.history?.filter((h) => h.type === "Resume Optimization").length || 0;
  const interviewsCompleted =
    profile?.history?.filter((h) => h.type === "AI Interview").length || 0;


  return (
    <div className="space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold font-headline">
        Welcome, {profile?.displayName || 'Developer'}!
      </h1>
      <p className="text-muted-foreground mt-2">
        Here's a summary of your recent activity on your career co-pilot.
      </p>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Coding Questions
            </CardTitle>
            <CodeXml className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questionsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              generated in the gym
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Resumes Optimized
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumesOptimized}</div>
            <p className="text-xs text-muted-foreground">
              in the resume studio
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mock Interviews
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interviewsCompleted}</div>
            <p className="text-xs text-muted-foreground">
              completed with Alex
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
