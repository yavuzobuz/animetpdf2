
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
    let type: FlowStep['type'] = 'process'; // Default
    let indentLevel = 0;

    // Determine indent level based on leading spaces/patterns
    if (line.match(/^\s{4,}\*\s/)) { // EVET/HAYIR içindeki alt adım (örn: "    *   1. ÇIKIŞ:") - daha spesifik hale getirilmeli
      indentLevel = 2;
      text = trimmedLine.replace(/^\*?\s*\d*\.?\s*/, '');
    } else if (line.match(/^\s{2,}\*\s/)) { // EVET/HAYIR etiketi (örn: "  *   **EVET ise...:**")
      indentLevel = 1;
      text = trimmedLine.replace(/^\*?\s*/, '');
    } else if (line.match(/^\s*\d+\./)) { // Numaralandırılmış genel adım
        const leadingSpaces = line.match(/^(\s*)/)?.[0].length || 0;
        if (leadingSpaces >= 6) indentLevel = 2; // Örn: "      1. İşlem"
        else if (leadingSpaces >= 2 && !line.match(/^\s{2,}\d+\.\s*\*\*/)) indentLevel = 1; // Örn: "  1. Alt İşlem" (ama üst seviye anahtar kelime değilse)
        else indentLevel = 0; // Örn: "1. İşlem"
         text = trimmedLine.replace(/^\d*\.?\s*/, ''); // Numarayı kaldır
    }


    // Remove markdown bolding for keyword matching and final text
    text = text.replace(/\*\*/g, '');

    // Determine type based on keywords (case-insensitive)
    if (text.match(/^BAŞLANGIÇ/i)) {
      type = 'start';
      text = 'BAŞLANGIÇ'; // Keep it simple
      indentLevel = 0;
    } else if (text.match(/^BİTİŞ/i)) {
      type = 'end';
      text = 'BİTİŞ';
      indentLevel = 0;
    } else if (text.match(/^(GİRİŞ|ÇIKIŞ):/i)) {
      type = 'io';
    } else if (text.match(/^İŞLEM:/i)) {
      type = 'process';
    } else if (text.match(/^KARAR:/i)) {
      type = 'decision';
    } else if (text.match(/^(EVET İSE|HAYIR İSE)/i)) {
      type = 'branch-label';
      // Indent level for branch labels might be determined by `*` prefix
      if (line.match(/^\s*\*\s/)) indentLevel = Math.max(indentLevel, 1);

    } else if (trimmedLine.startsWith('(') && trimmedLine.endsWith(')')) {
      type = 'comment';
      text = trimmedLine.substring(1, trimmedLine.length - 1);
    } else if (!trimmedLine.match(/^(BAŞLANGIÇ|BİTİŞ|GİRİŞ:|ÇIKIŞ:|İŞLEM:|KARAR:|EVET İSE|HAYIR İSE)/i) && indentLevel > 0) {
      // Numbered or plain text under a branch
      type = 'process'; // Treat as a process step by default if indented
    } else {
        type = 'raw'; // For lines that don't fit structured types
        text = trimmedLine;
    }
    
    steps.push({ id: `step-${index}`, text, type, indentLevel });
  });

  return steps;
};

const getStepStyles = (type: FlowStep['type']): string => {
  switch (type) {
    case 'start':
      return 'bg-green-100 border-green-500 text-green-700 rounded-full px-6 py-2 text-center shadow-sm font-medium';
    case 'end':
      return 'bg-red-100 border-red-500 text-red-700 rounded-full px-6 py-2 text-center shadow-sm font-medium';
    case 'io': // Giriş/Çıkış
      return 'bg-blue-100 border-blue-500 text-blue-700 px-4 py-3 shadow-sm transform -skew-x-12';
    case 'process':
      return 'bg-purple-100 border-purple-500 text-purple-700 px-4 py-3 rounded-md shadow-sm';
    case 'decision': // Karar
      return 'bg-yellow-100 border-yellow-500 text-yellow-700 px-4 py-3 shadow-sm transform rotate-45 w-auto inline-block'; // Diamond attempt
    case 'branch-label':
      return 'font-semibold text-primary mt-2 mb-1'; // No box, just styled text
    case 'comment':
      return 'bg-slate-100 border-slate-400 border-dashed text-slate-600 italic px-4 py-2 rounded-md text-xs';
    case 'raw':
       return 'text-muted-foreground text-sm py-1'; // For unstyled or fallback lines
    default:
      return 'bg-gray-100 border-gray-400 text-gray-800 px-4 py-2 rounded-md shadow-sm';
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
            <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/20">
              <div className="space-y-3">
                {parsedSteps.map((step) => {
                  const stepStyle = getStepStyles(step.type);
                  const indentStyle = getIndentClasses(step.indentLevel);

                  if (step.type === 'branch-label' || step.type === 'raw') {
                    return (
                      <div
                        key={step.id}
                        className={cn('text-sm whitespace-pre-wrap', stepStyle, indentStyle)}
                      >
                        {step.text}
                      </div>
                    );
                  }
                  
                  if (step.type === 'decision') { // Special wrapper for diamond
                     return (
                       <div key={step.id} className={cn('flex', indentStyle, step.indentLevel > 0 ? 'justify-start' : 'justify-center')}>
                         <div className={cn('p-1', stepStyle)}> {/* Outer div for rotation */}
                            <div className="transform -rotate-45 text-center"> {/* Inner div for text */}
                                {step.text}
                            </div>
                         </div>
                       </div>
                     );
                  }
                   if (step.type === 'io') { // Special wrapper for parallelogram
                     return (
                       <div key={step.id} className={cn('flex', indentStyle, step.indentLevel > 0 ? 'justify-start' : 'justify-center')}>
                         <div className={cn(stepStyle)}>
                           {step.text}
                         </div>
                       </div>
                     );
                   }

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'border text-sm transition-all hover:shadow-md min-h-[40px] flex items-center',
                        stepStyle,
                        indentStyle,
                         (step.type === 'start' || step.type === 'end') ? 'justify-center' : 'justify-start'
                      )}
                    >
                      <span className="whitespace-pre-wrap">{step.text}</span>
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

    