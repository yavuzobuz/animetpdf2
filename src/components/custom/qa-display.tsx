
"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export interface QAPair {
  question: string;
  answer: string;
}

interface QaDisplayProps {
  qaPairs: QAPair[] | null;
}

export function QaDisplay({ qaPairs }: QaDisplayProps) {
  if (!qaPairs || qaPairs.length === 0) {
    return (
       <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <HelpCircle className="mr-2 h-6 w-6 text-primary" /> Mini Test
          </CardTitle>
          <CardDescription>Bu bölüm için henüz soru-cevap oluşturulmadı.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-primary" /> Mini Test
        </CardTitle>
        <CardDescription>Aşağıdaki sorularla konuyu ne kadar anladığınızı test edin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {qaPairs.map((qa, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left hover:no-underline font-semibold">
                {index + 1}. {qa.question}
              </AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                {qa.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
