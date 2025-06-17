
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertTriangle, Network, GitFork } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratePdfDiagramInput, GeneratePdfDiagramOutput } from '@/ai/flows/generate-pdf-diagram-flow';

interface PdfDiagramGeneratorProps {
  pdfSummary: string | null;
  generatePdfDiagramFlow: (input: GeneratePdfDiagramInput) => Promise<GeneratePdfDiagramOutput>;
}

export function PdfDiagramGenerator({ pdfSummary, generatePdfDiagramFlow }: PdfDiagramGeneratorProps) {
  const [diagramDescription, setDiagramDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateDiagram = async () => {
    if (!pdfSummary) {
      toast({
        title: "Özet Yok",
        description: "Kavram haritası oluşturmak için önce bir PDF özeti gereklidir.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagramDescription(null);

    try {
      const result = await generatePdfDiagramFlow({ pdfSummary });
      setDiagramDescription(result.diagramDescription);
      toast({
        title: "Akış Diyagramı Açıklaması Oluşturuldu",
        description: "Aşağıda PDF özetinizden çıkarılan süreç adımlarını görebilirsiniz.",
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
          <GitFork className="mr-2 h-6 w-6 text-primary" /> PDF Akış Diyagramı (Metinsel)
        </CardTitle>
        <CardDescription>
          PDF özetinizdeki bir süreci veya algoritmayı adım adım tanımlayan metinsel bir açıklama oluşturun.
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
              Akış Diyagramı Açıklaması Oluştur
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

        {diagramDescription && (
          <div>
            <h3 className="font-semibold mb-2 text-lg">Oluşturulan Akış Açıklaması:</h3>
            <ScrollArea className="h-60 w-full rounded-md border p-3 bg-muted/20">
              <pre className="text-sm font-mono whitespace-pre-wrap font-code">
                {diagramDescription}
              </pre>
            </ScrollArea>
          </div>
        )}
         {!isLoading && !diagramDescription && !error && (
          <div className="text-center text-muted-foreground py-4">
            <p>PDF özetinizdeki bir sürecin metinsel akış diyagramı açıklamasını görmek için yukarıdaki butona tıklayın.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
