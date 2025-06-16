
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScenarioDisplayProps {
  scenario: string | null;
}

export function ScenarioDisplay({ scenario }: ScenarioDisplayProps) {
  if (!scenario) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Animation Scenario</CardTitle>
        <CardDescription>This is the AI-generated script for your animation.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/20">
          <pre className="whitespace-pre-wrap text-sm font-body leading-relaxed">{scenario}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
