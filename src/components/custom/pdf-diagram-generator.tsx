"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, AlertTriangle, Network, GitFork, Eye, Download, Maximize2, Workflow, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { GeneratePdfDiagramInput, GeneratePdfDiagramOutput } from '@/ai/flows/generate-pdf-diagram-flow';
import { cn } from '@/lib/utils';
import { ReactFlowDiagram, parseFlowDescriptionToSteps } from './react-flow-diagram';
import { createBrowserClient } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

interface PdfDiagramGeneratorProps {
  pdfSummary: string | null;
  generatePdfDiagramFlow: (input: GeneratePdfDiagramInput) => Promise<GeneratePdfDiagramOutput>;
}

interface FlowStep {
  id: string;
  text: string;
  type: 'start' | 'end' | 'io' | 'process' | 'decision' | 'branch-label' | 'comment' | 'raw' | 'parallel' | 'loop';
  indentLevel: number;
  connections?: string[]; // Bağlı olduğu adımların ID'leri
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

    // Paralel işlemler ve döngüler için yeni kontroller
    if (line.match(/^\s*\*\s*PARALEL/i)) {
      type = 'parallel';
      text = trimmedLine.replace(/^\*?\s*/, '');
      indentLevel = 1;
    } else if (line.match(/^\s*\*\s*DÖNGÜ/i) || line.match(/^\s*\*\s*TEKRAR/i)) {
      type = 'loop';
      text = trimmedLine.replace(/^\*?\s*/, '');
      indentLevel = 1;
    } else if (line.match(/^\s*\*\s*EVET ise/i) || line.match(/^\s*\*\s*HAYIR ise/i)) {
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
    } else if (normalizedTextForTypeDetection.includes('PARALEL') || normalizedTextForTypeDetection.includes('EŞ ZAMANLI')) {
      type = 'parallel';
    } else if (normalizedTextForTypeDetection.includes('DÖNGÜ') || normalizedTextForTypeDetection.includes('TEKRAR')) {
      type = 'loop';
    }
    
    steps.push({ id: `step-${index}`, text: text.replace(/^[:\s]+/, ''), type, indentLevel });
  });

  return steps;
};

const getStepStyles = (type: FlowStep['type'], isHovered: boolean = false): string => {
  const baseTransition = 'transition-all duration-180 ease-in-out';
  const hoverEffect = isHovered ? 'scale-105 shadow-lg' : '';
  
  switch (type) {
    case 'start':
      return `bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-500 text-emerald-800 rounded-full px-6 py-3 text-center shadow-md font-semibold min-w-[180px] ${baseTransition} ${hoverEffect} hover:from-emerald-200 hover:to-green-200`;
    case 'end':
      return `bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-500 text-red-800 rounded-full px-6 py-3 text-center shadow-md font-semibold min-w-[180px] ${baseTransition} ${hoverEffect} hover:from-red-200 hover:to-rose-200`;
    case 'io':
      return `bg-gradient-to-r from-sky-100 to-blue-100 border-2 border-sky-500 text-sky-800 px-6 py-4 shadow-md transform -skew-x-12 min-w-[220px] text-center font-medium ${baseTransition} ${hoverEffect} hover:from-sky-200 hover:to-blue-200`;
    case 'process':
      return `bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-500 text-violet-800 px-6 py-4 rounded-lg shadow-md min-w-[220px] font-medium ${baseTransition} ${hoverEffect} hover:from-violet-200 hover:to-purple-200`;
    case 'decision':
      return `bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-500 text-amber-800 p-4 shadow-md transform rotate-45 w-auto inline-block aspect-square flex items-center justify-center min-w-[120px] min-h-[120px] font-medium ${baseTransition} ${hoverEffect} hover:from-amber-200 hover:to-yellow-200`;
    case 'parallel':
      return `bg-gradient-to-r from-cyan-100 to-teal-100 border-2 border-cyan-500 text-cyan-800 px-6 py-4 rounded-lg shadow-md min-w-[220px] font-medium border-dashed ${baseTransition} ${hoverEffect} hover:from-cyan-200 hover:to-teal-200`;
    case 'loop':
      return `bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-500 text-indigo-800 px-6 py-4 rounded-lg shadow-md min-w-[220px] font-medium border-dotted ${baseTransition} ${hoverEffect} hover:from-indigo-200 hover:to-purple-200`;
    case 'branch-label':
      return `font-bold text-primary mt-3 mb-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 ${baseTransition}`;
    case 'comment':
      return `bg-gradient-to-r from-slate-50 to-gray-50 border-2 border-slate-300 border-dashed text-slate-700 italic px-6 py-3 rounded-lg text-sm max-w-md shadow-sm ${baseTransition} ${hoverEffect}`;
    case 'raw':
       return `text-muted-foreground text-sm py-2 px-3 rounded-md bg-muted/50 ${baseTransition}`;
    default:
      return `bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400 text-gray-800 px-6 py-4 rounded-lg shadow-md min-w-[220px] font-medium ${baseTransition} ${hoverEffect} hover:from-gray-200 hover:to-gray-300`;
  }
};

const getStepIcon = (type: FlowStep['type']) => {
  switch (type) {
    case 'start': return '🚀';
    case 'end': return '🏁';
    case 'io': return '📋';
    case 'process': return '⚙️';
    case 'decision': return '🤔';
    case 'parallel': return '🔀';
    case 'loop': return '🔄';
    case 'comment': return '💭';
    default: return '📌';
  }
};

const getIndentClasses = (level: number): string => {
  if (level === 1) return 'ml-8 sm:ml-12';
  if (level >= 2) return 'ml-16 sm:ml-24';
  return 'ml-0';
};

const ConnectionLine = ({ isVertical = true, isDashed = false, className = "" }: {
  isVertical?: boolean;
  isDashed?: boolean;
  className?: string;
}) => (
  <div className={cn(
    "bg-slate-400",
    isVertical ? "w-0.5 h-6" : "h-0.5 w-6",
    isDashed && "border border-dashed border-slate-400 bg-transparent",
    className
  )} />
);

const Arrow = ({ direction = 'down', className = "" }: { 
  direction?: 'down' | 'up' | 'left' | 'right'; 
  className?: string;
}) => {
  const arrowClasses = {
    down: "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-500",
    up: "w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-slate-500",
    left: "w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-slate-500",
    right: "w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-slate-500"
  } as const;
  
  return <div className={cn(arrowClasses[direction], className)} />;
};

export function PdfDiagramGenerator({ pdfSummary, generatePdfDiagramFlow }: PdfDiagramGeneratorProps) {
  const [diagramDescription, setDiagramDescription] = useState<string | null>(null);
  const [parsedSteps, setParsedSteps] = useState<FlowStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'classic' | 'reactflow'>('classic');
  const [isSaving, setIsSaving] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // React Flow için adımları dönüştür
  const reactFlowSteps = useMemo(() => {
    if (!diagramDescription) return [];
    return parseFlowDescriptionToSteps(diagramDescription);
  }, [diagramDescription]);

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
        title: "Akış Diyagramı Oluşturuldu",
        description: "PDF özetinizden çıkarılan süreç adımları görselleştirildi.",
        duration: 4000,
      });
    } catch (err) {
      console.error("Diagram Generation Error:", err);
      const errorMessage = (err as Error).message || "Akış diyagramı oluşturulurken bir hata oluştu.";
      setError(errorMessage);
      toast({
        title: "Diyagram Oluşturma Hatası",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportDiagram = () => {
    if (!diagramDescription) return;
    
    const element = document.createElement('a');
    const file = new Blob([diagramDescription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'akis-diyagrami.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Diyagram İndirildi",
      description: "Akış diyagramı metin dosyası olarak kaydedildi.",
    });
  };

  // Veritabanına kaydet
  const saveDiagramToDatabase = async () => {
    if (!user || !pdfSummary || !diagramDescription) {
      toast({
        title: "Kayıt Hatası",
        description: "Giriş yapmış olmanız ve diyagram oluşturulmuş olması gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const supabase = createBrowserClient();
      
      // Diyagram verilerini hazırla
      const diagramData = {
        description: diagramDescription,
        steps: parsedSteps,
        reactFlowSteps: reactFlowSteps,
        generatedAt: new Date().toISOString(),
        stepCount: parsedSteps.length,
        flowType: activeTab
      };

      // PDF başlığı oluştur (summary'den ilk 50 karakter + tarih)
      const projectTitle = `Diyagram - ${pdfSummary.substring(0, 50)}... (${new Date().toLocaleDateString('tr-TR')})`;

      const projectData = {
        user_id: user.id,
        title: projectTitle,
        description: 'PDF özetinden oluşturulmuş akış diyagramı',
        pdf_file_url: `diagram_${Date.now()}.pdf`, // Placeholder
        pdf_file_name: 'generated_diagram.pdf',
        pdf_file_size: 0,
        status: 'completed',
        analysis_result: { 
          summary: pdfSummary,
          diagram: diagramData
        },
        animation_scenario: [], // Boş - bu diyagram projesi
        qa_pairs: [], // Boş - bu diyagram projesi
        animation_settings: {
          type: 'diagram',
          diagramType: activeTab,
          stepCount: parsedSteps.length
        }
      };

      const { data, error } = await supabase.from('pdf_projects')
        .insert(projectData)
        .select()
        .single();

      if (error) {
        console.error('Database save error:', error);
        toast({
          title: "Kayıt Hatası",
          description: `Veritabanına kaydederken hata oluştu: ${error.message}`,
          variant: "destructive",
        });
      } else {
        setProjectId(data.id);
        toast({
          title: "Diyagram Kaydedildi! 🎉",
          description: `Diyagramınız "${projectTitle}" başlığıyla kaydedildi.`,
          duration: 5000,
        });
        console.log('Diagram saved successfully:', data);
      }
    } catch (e) {
      console.error('Save exception:', e);
      toast({
        title: "Kayıt Hatası",
        description: "Beklenmedik bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!pdfSummary) {
    return null;
  }

  const stepStats = parsedSteps.reduce((acc, step) => {
    acc[step.type] = (acc[step.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
      <Card className={cn(
        "w-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30",
      isFullscreen && "fixed inset-4 z-50 bg-background"
    )}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <GitFork className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                PDF Akış Diyagramı
        </CardTitle>
              <CardDescription className="mt-1">
                PDF içeriğinizden otomatik olarak oluşturulan görsel süreç haritası
        </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {parsedSteps.length > 0 && (
              <>
                {user && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveDiagramToDatabase}
                    disabled={isSaving || !diagramDescription}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {projectId ? 'Güncelle' : 'Kaydet'}
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportDiagram}
                  className="hidden sm:flex"
                >
                  <Download className="h-4 w-4 mr-2" />
                  İndir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="hidden sm:flex"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        {parsedSteps.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-4">
             {Object.entries(stepStats).map(([type, count]) => (
               <Badge key={type} variant="secondary" className="text-xs diagram-stats-badge">
                 {getStepIcon(type as FlowStep['type'])} {type}: {count}
               </Badge>
             ))}
           </div>
        )}
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-center w-full">
        <Button
          onClick={handleGenerateDiagram}
          disabled={isLoading || !pdfSummary}
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-270"
        >
          {isLoading ? (
            <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                <span className="font-medium">Diyagram Oluşturuluyor...</span>
            </>
          ) : (
            <>
                <Network className="mr-3 h-5 w-5" />
                <span className="font-medium">Akış Diyagramı Oluştur</span>
            </>
          )}
        </Button>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-destructive/10 to-red-50 border-2 border-destructive/30 text-destructive">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold text-lg">Hata Oluştu</p>
                <p className="mt-1 text-sm opacity-90">{error}</p>
              </div>
            </div>
          </div>
        )}

        {parsedSteps.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xl text-foreground flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Oluşturulan Akış Diyagramı
              </h3>
              <Badge variant="outline" className="text-sm">
                {parsedSteps.length} adım
              </Badge>
            </div>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'classic' | 'reactflow')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="classic" className="flex items-center gap-2">
                  <GitFork className="h-4 w-4" />
                  Klasik Görünüm
                </TabsTrigger>
                <TabsTrigger value="reactflow" className="flex items-center gap-2">
                  <Workflow className="h-4 w-4" />
                  İnteraktif React Flow
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="classic" className="mt-4">
                <div className="w-full pr-[10%]">
                  <ScrollArea className={cn(
                    "rounded-xl border-2 border-muted bg-gradient-to-br from-background to-muted/30 p-6 diagram-container w-full",
                    isFullscreen ? "h-[calc(100vh-250px)]" : "h-[600px]"
                  )}>
                <div className="space-y-3">
                {parsedSteps.map((step, idx) => {
                    const stepStyle = getStepStyles(step.type, hoveredStep === step.id);
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
                          className={cn('whitespace-pre-wrap', stepStyle, indentStyle)}
                          onMouseEnter={() => setHoveredStep(step.id)}
                          onMouseLeave={() => setHoveredStep(null)}
                      >
                          {step.type !== 'raw' && (
                            <span className="mr-2 text-lg">
                              {getStepIcon(step.type)}
                            </span>
                          )}
                        {step.text}
                      </div>
                    );
                  }
                  
                  return (
                    <div key={step.id} className={cn("flex flex-col w-full items-start", indentStyle)}>
                        <div className={cn("flex flex-col", step.indentLevel === 0 ? 'items-center w-full' : 'items-start')}>
                            {step.type === 'decision' ? (
                                                                   <div 
                                     className={cn('relative p-1 my-2 self-center cursor-pointer diagram-step diagram-step-decision', stepStyle)}
                                     onMouseEnter={() => setHoveredStep(step.id)}
                                     onMouseLeave={() => setHoveredStep(null)}
                                   > 
                                      <div className="transform -rotate-45 text-center min-w-[100px] min-h-[100px] flex items-center justify-center px-3">
                                          <span className="block max-w-[140px] break-words text-sm leading-tight">
                                            {step.text}
                                          </span>
                                    </div>
                                </div>
                            ) : step.type === 'io' ? (
                                     <div 
                                       className={cn('my-2 self-center cursor-pointer', stepStyle)}
                                       onMouseEnter={() => setHoveredStep(step.id)}
                                       onMouseLeave={() => setHoveredStep(null)}
                                     >
                                        <span className="block transform skew-x-12 px-3 py-1 flex items-center">
                                          <span className="mr-2 text-lg transform -skew-x-12">
                                            {getStepIcon(step.type)}
                                          </span>
                                          {step.text}
                                        </span>
                                 </div>
                            ) : (
                                <div
                                className={cn(
                                         'border cursor-pointer transition-all hover:shadow-lg my-2 flex items-center justify-center text-center relative group diagram-step',
                                         step.type === 'parallel' && 'diagram-step-parallel',
                                         step.type === 'loop' && 'diagram-step-loop',
                                    stepStyle,
                                    (step.type === 'start' || step.type === 'end') ? 'self-center' : 'self-start'
                                )}
                                     onMouseEnter={() => setHoveredStep(step.id)}
                                     onMouseLeave={() => setHoveredStep(null)}
                                     >
                                    <span className="whitespace-pre-wrap px-3 py-2 flex items-center">
                                      <span className="mr-2 text-lg">
                                        {getStepIcon(step.type)}
                                      </span>
                                      {step.text}
                                    </span>
                                </div>
                            )}

                            {showArrow && (
                                                                   <div className={cn(
                                     "flex flex-col items-center my-1", 
                                     step.indentLevel === 0 || step.type === 'decision' || step.type === 'io' 
                                       ? 'self-center' 
                                       : 'self-start ml-[calc(var(--min-box-width,220px)/2)] transform -translate-x-1/2'
                                   )}>
                                       <ConnectionLine isVertical={true} className="diagram-connection" />
                                       <Arrow direction="down" className="diagram-arrow" />
                                </div>
                            )}
                        </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="reactflow" className="mt-4">
                <ReactFlowDiagram 
                  steps={reactFlowSteps}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
         {!isLoading && parsedSteps.length === 0 && !error && diagramDescription === null && (
          <div className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-muted">
            <div className="max-w-md mx-auto">
              <Network className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h4 className="font-semibold text-lg mb-2">Diyagram Oluşturmaya Hazır</h4>
              <p className="text-muted-foreground text-sm">
                PDF özetinizdeki süreçleri görsel bir akış diyagramı olarak görmek için yukarıdaki butona tıklayın.
              </p>
            </div>
          </div>
        )}
        
         {!isLoading && parsedSteps.length === 0 && !error && diagramDescription !== null && (
            <div className="text-center py-8 border-2 border-dashed border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
              <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
              <p className="font-semibold mb-3 text-amber-800">Akış Adımları Yorumlanamadı</p>
              <p className="text-sm text-amber-700 mb-4">
                Oluşturulan metin akış diyagramı formatında değildi. Ham metin aşağıda gösterilmektedir:
              </p>
              <div className="max-w-2xl mx-auto">
                <ScrollArea className="h-32 bg-background/80 rounded-md border p-3">
                  <pre className="text-left text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                    {diagramDescription || "Veri yok."}
                  </pre>
                </ScrollArea>
              </div>
            </div>
         )}
      </CardContent>
    </Card>
  );
}
