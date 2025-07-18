import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeXml, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Welcome to DevPro Ascent</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered career copilot. Let's get you ready for your next role.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-accent/20">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">Resume Studio</CardTitle>
            </div>
            <CardDescription className="pt-2">
              Generate a brand-new resume or optimize your existing one. Our AI will help you stand out.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Craft professional resumes from scratch.</li>
              <li>Tailor your resume for specific job descriptions.</li>
              <li>Get suggestions for improvement.</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/resume-builder">Go to Resume Studio <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-md bg-accent/20">
                <CodeXml className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl">Coding Gym</CardTitle>
            </div>
            <CardDescription className="pt-2">
              Practice with AI-generated questions and get instant feedback on your code solutions.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Personalized questions for your skill level.</li>
              <li>Write code in our integrated editor.</li>
              <li>Receive AI feedback to improve your solutions.</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/coding-practice">Enter Coding Gym <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
