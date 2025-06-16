
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ScenarioDisplayProps {
  pdfSummary: string | null;
}

export function ScenarioDisplay({ pdfSummary }: ScenarioDisplayProps) {
  if (!pdfSummary) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">PDF Özeti</CardTitle>
          <CardDescription>PDF'inizden çıkarılan özet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Henüz özet oluşturulmadı veya mevcut değil.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">PDF Özeti</CardTitle>
        <CardDescription>Yapay zeka tarafından PDF'inizden çıkarılan özet aşağıdadır.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 w-full rounded-md border p-3 bg-muted/20">
          <p className="text-sm font-body leading-relaxed whitespace-pre-wrap">
            {pdfSummary}
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
