'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ReactFlowDiagram } from './react-flow-diagram';
import { FileText, Zap, Eye, Download } from 'lucide-react';

interface ScenarioDisplayProps {
  data: {
    title?: string;
    summary?: string;
    detailed_scenario?: string;
    educational_objectives?: string[];
    key_concepts?: string[];
    target_audience?: string;
    estimated_duration?: string;
  };
  diagramData?: any;
  showDiagram?: boolean;
  className?: string;
}

const ScenarioDisplay = ({ data, diagramData, showDiagram = false, className }: ScenarioDisplayProps) => {
  if (!data) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Senaryo verisi yükleniyor...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-6 h-6" />
          PDF Özeti
        </CardTitle>
        <CardDescription>
          {data.title || 'Eğitim İçeriği'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showDiagram && diagramData ? (
          <Tabs defaultValue="classic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="classic">Klasik Görünüm</TabsTrigger>
              <TabsTrigger value="interactive">İnteraktif Görünüm</TabsTrigger>
            </TabsList>
            
            <TabsContent value="classic" className="space-y-4">
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {data.summary && (
                    <div>
                      <h3 className="font-semibold mb-2">Özet</h3>
                      <p className="text-sm text-muted-foreground">{data.summary}</p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {data.detailed_scenario && (
                    <div>
                      <h3 className="font-semibold mb-2">Detaylı Senaryo</h3>
                      <p className="text-sm whitespace-pre-wrap">{data.detailed_scenario}</p>
                    </div>
                  )}
                  
                  {data.educational_objectives && data.educational_objectives.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Eğitim Hedefleri</h3>
                        <ul className="text-sm space-y-1">
                          {data.educational_objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Zap className="w-4 h-4 mt-0.5 text-primary" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  
                  {data.key_concepts && data.key_concepts.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold mb-2">Anahtar Kavramlar</h3>
                        <div className="flex flex-wrap gap-2">
                          {data.key_concepts.map((concept, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="interactive" className="space-y-4">
              <div className="h-96 border rounded-lg">
                <ReactFlowDiagram steps={diagramData || []} />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Diyagramı keşfetmek için üzerine tıklayın ve sürükleyin
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {data.summary && (
                <div>
                  <h3 className="font-semibold mb-2">Özet</h3>
                  <p className="text-sm text-muted-foreground">{data.summary}</p>
                </div>
              )}
              
              <Separator />
              
              {data.detailed_scenario && (
                <div>
                  <h3 className="font-semibold mb-2">Detaylı Senaryo</h3>
                  <p className="text-sm whitespace-pre-wrap">{data.detailed_scenario}</p>
                </div>
              )}
              
              {data.educational_objectives && data.educational_objectives.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Eğitim Hedefleri</h3>
                    <ul className="text-sm space-y-1">
                      {data.educational_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Zap className="w-4 h-4 mt-0.5 text-primary" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {data.key_concepts && data.key_concepts.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Anahtar Kavramlar</h3>
                    <div className="flex flex-wrap gap-2">
                      {data.key_concepts.map((concept, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {data.target_audience && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Hedef Kitle</h3>
                    <p className="text-sm text-muted-foreground">{data.target_audience}</p>
                  </div>
                </>
              )}
              
              {data.estimated_duration && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Tahmini Süre</h3>
                    <p className="text-sm text-muted-foreground">{data.estimated_duration}</p>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export { ScenarioDisplay };
export default ScenarioDisplay; 