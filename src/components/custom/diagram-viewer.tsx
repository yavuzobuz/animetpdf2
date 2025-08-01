"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, ArrowDown, Circle, Square, Diamond } from 'lucide-react';

interface DiagramViewerProps {
  project: {
    id: string;
    title: string;
    analysis_result?: {
      diagram?: {
        description: string;
        steps: any[];
        reactFlowSteps?: any[];
        stepCount: number;
        flowType: string;
      };
    };
    animation_settings?: {
      type?: string;
      diagramType?: string;
    };
  };
  language: 'tr' | 'en';
}

export default function DiagramViewer({ project, language }: DiagramViewerProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const diagram = project.analysis_result?.diagram;
  const steps = diagram?.steps || [];
  const flowType = diagram?.flowType || project.animation_settings?.diagramType || 'process';

  const uiText = {
    tr: {
      title: 'Diyagram Görüntüleyici',
      description: 'Açıklama',
      steps: 'Adımlar',
      step: 'Adım',
      flowType: 'Akış Tipi',
      totalSteps: 'Toplam Adım',
      noDiagram: 'Diyagram verisi bulunamadı',
      clickStep: 'Detayları görmek için adıma tıklayın'
    },
    en: {
      title: 'Diagram Viewer',
      description: 'Description',
      steps: 'Steps',
      step: 'Step',
      flowType: 'Flow Type',
      totalSteps: 'Total Steps',
      noDiagram: 'No diagram data found',
      clickStep: 'Click on a step to see details'
    }
  };

  const text = uiText[language] || uiText.tr;

  const getStepIcon = (index: number, type: string = 'process') => {
    switch (type) {
      case 'decision':
        return <Diamond className="w-6 h-6" />;
      case 'process':
        return <Square className="w-6 h-6" />;
      case 'start':
      case 'end':
        return <Circle className="w-6 h-6" />;
      default:
        return <Square className="w-6 h-6" />;
    }
  };

  const getStepColor = (index: number, isSelected: boolean = false) => {
    if (isSelected) return 'bg-purple-600 text-white';
    
    const colors = [
      'bg-blue-500 text-white',
      'bg-green-500 text-white',
      'bg-orange-500 text-white',
      'bg-purple-500 text-white',
      'bg-pink-500 text-white',
      'bg-indigo-500 text-white'
    ];
    return colors[index % colors.length];
  };

  if (!diagram || steps.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <Network className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">{text.noDiagram}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diyagram Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-6 h-6" />
            {text.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="flex items-center gap-2">
              <span>{text.flowType}:</span>
              <span className="font-semibold">{flowType}</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <span>{text.totalSteps}:</span>
              <span className="font-semibold">{steps.length}</span>
            </Badge>
          </div>
          
          {diagram.description && (
            <div>
              <h3 className="font-semibold mb-2">{text.description}</h3>
              <p className="text-gray-700">{diagram.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diyagram Görselleştirme */}
      <Card>
        <CardHeader>
          <CardTitle>{text.steps}</CardTitle>
          <p className="text-sm text-gray-500">{text.clickStep}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                {/* Adım Numarası ve İkon */}
                <button
                  onClick={() => setSelectedStep(selectedStep === index ? null : index)}
                  className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all ${getStepColor(
                    index,
                    selectedStep === index
                  )} hover:scale-105`}
                >
                  {getStepIcon(index, step.type)}
                </button>

                {/* Adım İçeriği */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">
                      {text.step} {index + 1}: {step.title || step.name || `Adım ${index + 1}`}
                    </h4>
                    {selectedStep === index && (
                      <Badge variant="secondary">Seçili</Badge>
                    )}
                  </div>
                  
                  {selectedStep === index && (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">
                        {step.description || step.content || 'Bu adım için açıklama mevcut değil.'}
                      </p>
                      {step.details && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Detaylar:</strong> {step.details}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Ok İşareti (Son adım hariç) */}
                {index < steps.length - 1 && (
                  <div className="flex items-center justify-center w-8 h-8">
                    <ArrowDown className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adım Detayları (Seçili adım varsa) */}
      {selectedStep !== null && steps[selectedStep] && (
        <Card>
          <CardHeader>
            <CardTitle>
              {text.step} {selectedStep + 1} - Detaylar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Başlık</h4>
                <p>{steps[selectedStep].title || steps[selectedStep].name || `Adım ${selectedStep + 1}`}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Açıklama</h4>
                <p className="text-gray-700">
                  {steps[selectedStep].description || steps[selectedStep].content || 'Açıklama mevcut değil.'}
                </p>
              </div>

              {steps[selectedStep].type && (
                <div>
                  <h4 className="font-semibold mb-2">Tip</h4>
                  <Badge variant="outline">{steps[selectedStep].type}</Badge>
                </div>
              )}

              {steps[selectedStep].duration && (
                <div>
                  <h4 className="font-semibold mb-2">Süre</h4>
                  <p>{steps[selectedStep].duration}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}