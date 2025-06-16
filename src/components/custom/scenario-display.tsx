
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AnimationFrameData {
  sceneDescription: string;
  keyTopic: string;
}

interface ScenarioDisplayProps {
  framesData: AnimationFrameData[] | null;
}

export function ScenarioDisplay({ framesData }: ScenarioDisplayProps) {
  if (!framesData || framesData.length === 0) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Animasyon Senaryosu</CardTitle>
          <CardDescription>PDF'iniz için oluşturulan yapay zeka senaryosu.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Henüz senaryo oluşturulmadı.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Animasyon Senaryosu</CardTitle>
        <CardDescription>PDF'inizden üretilen yapay zeka destekli animasyon senaryosu ve anahtar konuları aşağıdadır.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-1">
          <Accordion type="single" collapsible className="w-full">
            {framesData.map((frame, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="px-3 hover:no-underline">
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-base">Kare {index + 1}: {frame.keyTopic}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <p className="text-sm font-body leading-relaxed whitespace-pre-wrap bg-muted/30 p-3 rounded-md">
                    {frame.sceneDescription}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

