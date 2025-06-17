
"use client";

import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// This QAPair type is specific to this component's needs.
// The AI flow will produce a compatible type (AIQAPair).
export interface QAPair {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QaDisplayProps {
  qaPairs: QAPair[] | null;
}

interface SingleQaItemProps {
  qaItem: QAPair;
  index: number;
}

function SingleQaItem({ qaItem, index }: SingleQaItemProps) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleCheckAnswer = () => {
    if (selectedOptionIndex !== null) {
      setIsAnswered(true);
    }
  };

  const getOptionLabelClass = (optionIndex: number) => {
    if (!isAnswered) return "text-foreground";
    if (optionIndex === qaItem.correctAnswerIndex) return "text-green-600 font-semibold";
    if (optionIndex === selectedOptionIndex && optionIndex !== qaItem.correctAnswerIndex) return "text-red-600 line-through";
    return "text-muted-foreground";
  };

  const getOptionIndicator = (optionIndex: number) => {
    if (!isAnswered) return null;
    if (optionIndex === qaItem.correctAnswerIndex) return <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />;
    if (optionIndex === selectedOptionIndex && optionIndex !== qaItem.correctAnswerIndex) return <XCircle className="h-5 w-5 text-red-600 ml-2" />;
    return null;
  };

  return (
    <AccordionItem value={`item-${index}`}>
      <AccordionTrigger className="text-left hover:no-underline font-semibold">
        {index + 1}. {qaItem.question}
      </AccordionTrigger>
      <AccordionContent className="space-y-4">
        <RadioGroup
          value={selectedOptionIndex !== null ? selectedOptionIndex.toString() : undefined}
          onValueChange={(value) => setSelectedOptionIndex(parseInt(value))}
          disabled={isAnswered}
          className="space-y-2"
        >
          {qaItem.options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center space-x-2 p-2 rounded-md border border-transparent hover:border-primary/50 data-[state=checked]:border-primary data-[disabled]:opacity-70">
              <RadioGroupItem 
                value={optIndex.toString()} 
                id={`q${index}-opt${optIndex}`} 
                disabled={isAnswered}
                className={cn(
                  isAnswered && selectedOptionIndex === optIndex && optIndex === qaItem.correctAnswerIndex && "border-green-500 ring-green-500",
                  isAnswered && selectedOptionIndex === optIndex && optIndex !== qaItem.correctAnswerIndex && "border-red-500 ring-red-500",
                )}
              />
              <Label htmlFor={`q${index}-opt${optIndex}`} className={cn("flex-1 cursor-pointer", getOptionLabelClass(optIndex))}>
                {option}
              </Label>
              {getOptionIndicator(optIndex)}
            </div>
          ))}
        </RadioGroup>
        {!isAnswered && (
          <Button onClick={handleCheckAnswer} disabled={selectedOptionIndex === null} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Cevabı Kontrol Et
          </Button>
        )}
        {isAnswered && (
          <div className={cn(
            "mt-3 p-3 rounded-md text-sm",
            selectedOptionIndex === qaItem.correctAnswerIndex ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"
          )}>
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold mb-1">
                  {selectedOptionIndex === qaItem.correctAnswerIndex ? "Doğru Cevap!" : "Yanlış Cevap."}
                </p>
                <p>{qaItem.explanation}</p>
                {selectedOptionIndex !== qaItem.correctAnswerIndex && (
                  <p className="mt-1">Doğru şık: <span className="font-semibold">{qaItem.options[qaItem.correctAnswerIndex]}</span></p>
                )}
              </div>
            </div>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}


export function QaDisplay({ qaPairs }: QaDisplayProps) {
  if (!qaPairs || qaPairs.length === 0) {
    return (
       <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <HelpCircle className="mr-2 h-6 w-6 text-primary" /> Mini Test
          </CardTitle>
          <CardDescription>Bu bölüm için henüz soru-cevap oluşturulmadı veya yükleniyor.</CardDescription>
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
        <CardDescription>Aşağıdaki çoktan seçmeli sorularla konuyu ne kadar anladığınızı test edin.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-2">
          {qaPairs.map((qa, index) => (
            <SingleQaItem qaItem={qa} index={index} key={index} />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
