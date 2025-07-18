import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and track your progress.</p>
      </div>

      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <User className="h-6 w-6" />
            <span>Coming Soon</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We are working hard to bring you a comprehensive profile experience. Soon, you'll be able to track your generated resumes, saved coding questions, and performance over time. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
