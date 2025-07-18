import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResumeGenerator } from "@/components/feature/resume-generator";
import { ResumeOptimizer } from "@/components/feature/resume-optimizer";
import { FileText, Sparkles } from "lucide-react";

export default function ResumeBuilderPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Resume Studio</h1>
        <p className="text-muted-foreground mt-2">Create and refine your professional resume with the power of AI.</p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="generate"><FileText className="mr-2 h-4 w-4" /> Generate Resume</TabsTrigger>
          <TabsTrigger value="optimize"><Sparkles className="mr-2 h-4 w-4" /> Optimize Resume</TabsTrigger>
        </TabsList>
        <TabsContent value="generate" className="mt-6">
          <ResumeGenerator />
        </TabsContent>
        <TabsContent value="optimize" className="mt-6">
          <ResumeOptimizer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
