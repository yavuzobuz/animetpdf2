
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertTriangle, Network, GitFork } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratePdfDiagramInput, GeneratePdfDiagramOutput } from '@/ai/flows/generate-pdf-diagram-flow';
import { cn } from '@/lib/utils';

interface PdfDiagramGeneratorProps {
  pdfSummary: string | null;
  generatePdfDiagramFlow: (input: GeneratePdfDiagramInput) => Promise<GeneratePdfDiagramOutput>;
}

interface FlowStep {
  id: string;
  text: string;
  type: 'start' | 'end' | 'io' | 'process' | 'decision' | 'branch-label' | 'comment' | 'raw';
  indentLevel: number;
}

const parseFlowDescription = (description: string): FlowStep[] => {
  if (!description) return [];
  const lines = description.split('\n');
  const steps: FlowStep[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    let text = trimmedLine;
    let type: FlowStep['type'] = 'process';
    let indentLevel = 0;

    const leadingSpaces = line.match(/^(\s*)/)?.[0].length || 0;

    if (line.match(/^\s*\*\s*EVET ise/i) || line.match(/^\s*\*\s*HAYIR ise/i)) {
      indentLevel = 1;
      text = trimmedLine.replace(/^\*?\s*/, '');
      type = 'branch-label';
    } else if (line.match(/^\s*\d+\.\s+\*\*/)) { 
       indentLevel = 0;
       text = trimmedLine.replace(/^\d*\.?\s*/, '').replace(/\*\*/g, '');
    } else if (line.match(/^\s*\d+\./)) { 
        if (leadingSpaces >= 6 && line.match(/^\s{6,}\d+\./)) indentLevel = 2;
        else if (leadingSpaces >= 2 && line.match(/^\s{2,}\d+\./) ) indentLevel = 1;
        else indentLevel = 0;
        text = trimmedLine.replace(/^\d*\.?\s*/, '');
    } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
      type = 'comment';
      text = trimmedLine.substring(1, trimmedLine.length - 1);
      if (leadingSpaces >= 6) indentLevel = 2;
      else if (leadingSpaces >= 2) indentLevel = 1;
      else indentLevel = 0;
    }
     else { 
      if (leadingSpaces >= 6) indentLevel = 2;
      else if (leadingSpaces >= 2) indentLevel = 1;
      else indentLevel = 0;
      type = 'raw';
      text = trimmedLine;
    }
    
    const normalizedTextForTypeDetection = text.replace(/\*\*/g, '').toUpperCase();

    if (normalizedTextForTypeDetection.startsWith('BAŞLANGIÇ')) {
      type = 'start';
      text = 'BAŞLANGIÇ';
      indentLevel = 0;
    } else if (normalizedTextForTypeDetection.startsWith('BİTİŞ')) {
      type = 'end';
      text = 'BİTİŞ';
      indentLevel = 0;
    } else if (normalizedTextForTypeDetection.startsWith('GİRİŞ:')) {
      type = 'io';
    } else if (normalizedTextForTypeDetection.startsWith('ÇIKIŞ:')) {
      type = 'io';
    } else if (normalizedTextForTypeDetection.startsWith('İŞLEM:')) {
      type = 'process';
    } else if (normalizedTextForTypeDetection.startsWith('KARAR:')) {
      type = 'decision';
    } else if (normalizedTextForTypeDetection.includes('EVET İSE') || normalizedTextForTypeDetection.includes('HAYIR İSE')) {
      type = 'branch-label';
      if (!line.match(/^\s*\*\s/)) indentLevel = Math.max(indentLevel,1);
    }
    
    steps.push({ id: `step-${index}`, text: text.replace(/^[:\s]+/, ''), type, indentLevel });
  });

  return steps;
};

const getStepStyles = (type: FlowStep['type']): string => {
  switch (type) {
    case 'start':
      return 'bg-green-100 border-green-500 text-green-700 rounded-full px-6 py-2 text-center shadow-sm font-medium min-w-[150px]';
    case 'end':
      return 'bg-red-100 border-red-500 text-red-700 rounded-full px-6 py-2 text-center shadow-sm font-medium min-w-[150px]';
    case 'io':
      return 'bg-blue-100 border-blue-500 text-blue-700 px-4 py-3 shadow-sm transform -skew-x-12 min-w-[200px] text-center';
    case 'process':
      return 'bg-purple-100 border-purple-500 text-purple-700 px-4 py-3 rounded-md shadow-sm min-w-[200px]';
    case 'decision':
      return 'bg-yellow-100 border-yellow-500 text-yellow-700 p-3 shadow-sm transform rotate-45 w-auto inline-block aspect-square flex items-center justify-center min-w-[100px] min-h-[100px]';
    case 'branch-label':
      return 'font-semibold text-primary mt-2 mb-1 px-2';
    case 'comment':
      return 'bg-slate-100 border-slate-400 border-dashed text-slate-600 italic px-4 py-2 rounded-md text-xs max-w-md';
    case 'raw':
       return 'text-muted-foreground text-sm py-1 px-2';
    default:
      return 'bg-gray-100 border-gray-400 text-gray-800 px-4 py-2 rounded-md shadow-sm min-w-[200px]';
  }
};

const getIndentClasses = (level: number): string => {
  if (level === 1) return 'ml-6 sm:ml-10';
  if (level >= 2) return 'ml-12 sm:ml-20';
  return 'ml-0';
};


export function PdfDiagramGenerator({ pdfSummary, generatePdfDiagramFlow }: PdfDiagramGeneratorProps) {
  const [diagramDescription, setDiagramDescription] = useState<string | null>(null);
  const [parsedSteps, setParsedSteps] = useState<FlowStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateDiagram = async () => {
    if (!pdfSummary) {
      toast({
        title: "Özet Yok",
        description: "Akış diyagramı açıklaması oluşturmak için önce bir PDF özeti gereklidir.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagramDescription(null);
    setParsedSteps([]);

    try {
      const result = await generatePdfDiagramFlow({ pdfSummary });
      setDiagramDescription(result.diagramDescription);
      setParsedSteps(parseFlowDescription(result.diagramDescription));
      toast({
        title: "Akış Diyagramı Açıklaması Oluşturuldu",
        description: "Aşağıda PDF özetinizden çıkarılan süreç adımları görselleştirilmiştir.",
      });
    } catch (err) {
      console.error("Diagram Generation Error:", err);
      const errorMessage = (err as Error).message || "Akış diyagramı açıklaması oluşturulurken bir hata oluştu.";
      setError(errorMessage);
      toast({
        title: "Akış Diyagramı Oluşturma Hatası",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!pdfSummary) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <GitFork className="mr-2 h-6 w-6 text-primary" /> PDF Akış Diyagramı
        </CardTitle>
        <CardDescription>
          PDF özetinizdeki bir süreci veya algoritmayı adım adım tanımlayan görselleştirilmiş bir açıklama oluşturun.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGenerateDiagram}
          disabled={isLoading || !pdfSummary}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow hover:shadow-md"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <Network className="mr-2 h-4 w-4" />
              Akış Diyagramı Oluştur
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/30 text-destructive text-sm flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
            <div>
                <p className="font-semibold">Hata</p>
                <p>{error}</p>
            </div>
          </div>
        )}

        {parsedSteps.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-lg text-foreground">Oluşturulan Akış Adımları:</h3>
            <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/10">
              <div className="space-y-1">
                {parsedSteps.map((step, idx) => {
                  const stepStyle = getStepStyles(step.type);
                  const indentStyle = getIndentClasses(step.indentLevel);
                  const isLastOverallStep = idx === parsedSteps.length - 1;
                  
                  const isBoxType = !['branch-label', 'raw', 'comment'].includes(step.type);
                  
                  let showArrow = isBoxType && step.type !== 'end' && !isLastOverallStep;
                  
                  if (showArrow && idx + 1 < parsedSteps.length) {
                    const nextStep = parsedSteps[idx+1];
                    if (nextStep.type === 'end') {
                       if (step.type !== 'decision') showArrow = false;
                    }
                    if (nextStep.type === 'branch-label' && nextStep.indentLevel <= step.indentLevel) {
                       if (step.type !== 'decision') showArrow = false;
                    }
                    if (nextStep.indentLevel < step.indentLevel -1 && nextStep.type === 'end') {
                        showArrow = false;
                    }
                  }
                   if (step.type === 'comment' && idx + 1 < parsedSteps.length && parsedSteps[idx+1].type === 'end' ) {
                     showArrow = false;
                   }


                  if (step.type === 'branch-label' || step.type === 'raw' || step.type === 'comment') {
                    return (
                      <div
                        key={step.id}
                        className={cn('text-sm whitespace-pre-wrap py-1', stepStyle, indentStyle, step.type === 'comment' ? 'my-1 border' : '')}
                      >
                        {step.text}
                      </div>
                    );
                  }
                  
                  return (
                    <div key={step.id} className={cn("flex flex-col w-full items-start", indentStyle)}>
                        <div className={cn("flex flex-col", step.indentLevel === 0 ? 'items-center w-full' : 'items-start')}>
                            {step.type === 'decision' ? (
                                <div className={cn('relative p-1 my-1 self-center', stepStyle)}> 
                                    <div className="transform -rotate-45 text-center min-w-[80px] min-h-[80px] flex items-center justify-center px-2">
                                        <span className="block max-w-[120px] break-words">{step.text}</span>
                                    </div>
                                </div>
                            ) : step.type === 'io' ? (
                                 <div className={cn('my-1 self-center', stepStyle)}>
                                    <span className="block transform skew-x-12 px-2">{step.text}</span>
                                 </div>
                            ) : (
                                <div
                                className={cn(
                                    'border text-sm transition-all hover:shadow-md my-1 flex items-center justify-center text-center',
                                    stepStyle,
                                    (step.type === 'start' || step.type === 'end') ? 'self-center' : 'self-start'
                                )}
                                >
                                <span className="whitespace-pre-wrap px-2 py-1">{step.text}</span>
                                </div>
                            )}

                            {showArrow && (
                                <div className={cn("flex flex-col items-center my-1", step.indentLevel === 0 || step.type === 'decision' || step.type === 'io' ? 'self-center' : 'self-start ml-[calc(var(--min-box-width,200px)/2)] transform -translate-x-1/2')}>
                                    <div className="h-4 w-[1px] bg-slate-500" /> 
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-slate-500" />
                                </div>
                            )}
                        </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
         {!isLoading && parsedSteps.length === 0 && !error && diagramDescription === null && (
          <div className="text-center text-muted-foreground py-4">
            <p>PDF özetinizdeki bir sürecin görselleştirilmiş akışını görmek için yukarıdaki butona tıklayın.</p>
          </div>
        )}
         {!isLoading && parsedSteps.length === 0 && !error && diagramDescription !== null && (
            <div className="text-center text-muted-foreground py-4 border rounded-md bg-muted/30 p-4">
              <p className="font-semibold mb-2">Akış Adımları Yorumlanamadı</p>
              <p className="text-xs">Oluşturulan metin bir akış diyagramı olarak yorumlanacak yapıya sahip değildi veya boştu. Ham metin:</p>
              <pre className="mt-2 text-left text-xs font-mono whitespace-pre-wrap bg-background p-2 rounded-sm border">{diagramDescription || "Veri yok."}</pre>
            </div>
         )}
      </CardContent>
    </Card>
  );
}

    

    