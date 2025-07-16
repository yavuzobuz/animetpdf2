
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle2, XCircle, Info, Award, Play, Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QAPair {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface QaDisplayProps {
  qaPairs: QAPair[] | null;
}

interface AnswerData {
  selectedOption: number;
  isCorrect: boolean;
}

interface SingleQaItemProps {
  qaItem: QAPair;
  index: number;
  onAttempt: (questionIndex: number, selectedOption: number, isCorrect: boolean) => void;
  answerData?: AnswerData;
}

// Web Speech API hook for text-to-speech
function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
    
    const handleEnd = () => setIsSpeaking(false);
    const handleError = () => setIsSpeaking(false);
    
    return () => {
      if (speechRef.current) {
        speechRef.current.removeEventListener('end', handleEnd);
        speechRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!isSupported) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return { speak, stop, isSpeaking, isSupported };
}

function SingleQaItem({ qaItem, index, onAttempt, answerData }: SingleQaItemProps) {
  const [localSelectedOption, setLocalSelectedOption] = useState<number | null>(null);
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  const isAnswered = answerData !== undefined;
  const displayedSelection = isAnswered ? answerData.selectedOption : localSelectedOption;
  const isCorrectIfAnswered = isAnswered ? answerData.isCorrect : false;

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      const textToSpeak = `Soru ${index + 1}: ${qaItem.question}. Seçenekler: ${qaItem.options.map((opt, i) => `${i + 1}. ${opt}`).join('. ')}`;
      speak(textToSpeak);
    }
  };

  const speakExplanation = () => {
    if (isAnswered) {
      const explanationText = `Açıklama: ${qaItem.explanation}`;
      speak(explanationText);
    }
  };

  const handleCheckAnswer = () => {
    if (localSelectedOption !== null && !isAnswered) {
      const isCorrect = localSelectedOption === qaItem.correctAnswerIndex;
      onAttempt(index, localSelectedOption, isCorrect);
    }
  };

  const getOptionLabelClass = (optionIndex: number) => {
    if (!isAnswered) return "text-foreground";
    if (optionIndex === qaItem.correctAnswerIndex) return "text-green-600 font-semibold";
    if (optionIndex === displayedSelection && optionIndex !== qaItem.correctAnswerIndex) return "text-red-600 line-through";
    return "text-muted-foreground";
  };

  const getOptionIndicator = (optionIndex: number) => {
    if (!isAnswered) return null;
    if (optionIndex === qaItem.correctAnswerIndex) return <CheckCircle2 className="h-5 w-5 text-green-600 ml-2" />;
    if (optionIndex === displayedSelection && optionIndex !== qaItem.correctAnswerIndex) return <XCircle className="h-5 w-5 text-red-600 ml-2" />;
    return null;
  };

  return (
    <AccordionItem value={`item-${index}`} className="border-b-0">
      <div className="border rounded-md hover:border-primary/50 transition-colors">
        <AccordionTrigger className="text-left hover:no-underline font-semibold px-4 py-3">
          <div className="flex items-center justify-between w-full pr-4">
            <span>{index + 1}. {qaItem.question}</span>
            {isSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeechToggle();
                }}
                className="ml-2 h-8 w-8 p-0 hover:bg-primary/10"
              >
                {isSpeaking ? (
                  <Pause className="h-4 w-4 text-primary" />
                ) : (
                  <Volume2 className="h-4 w-4 text-primary" />
                )}
              </Button>
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4 px-4 pb-4">
          <RadioGroup
            value={displayedSelection !== null ? displayedSelection.toString() : undefined}
            onValueChange={(value) => !isAnswered && setLocalSelectedOption(parseInt(value))}
            disabled={isAnswered}
            className="space-y-2"
          >
            {qaItem.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center space-x-2 p-2 rounded-md border border-transparent hover:bg-muted/50 data-[state=checked]:border-primary data-[disabled]:opacity-70 transition-colors">
                <RadioGroupItem
                  value={optIndex.toString()}
                  id={`q${index}-opt${optIndex}`}
                  disabled={isAnswered}
                  className={cn(
                    isAnswered && displayedSelection === optIndex && optIndex === qaItem.correctAnswerIndex && "border-green-500 ring-green-500",
                    isAnswered && displayedSelection === optIndex && optIndex !== qaItem.correctAnswerIndex && "border-red-500 ring-red-500",
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
            <Button onClick={handleCheckAnswer} disabled={localSelectedOption === null} className="bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-[0_0_15px_hsl(var(--primary)/0.6)] transition-shadow">
              Cevabı Kontrol Et
            </Button>
          )}
          {isAnswered && (
            <div className={cn(
              "mt-3 p-3 rounded-md text-sm",
              isCorrectIfAnswered ? "bg-green-100 border border-green-300 text-green-700" : "bg-red-100 border border-red-300 text-red-700"
            )}>
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">
                      {isCorrectIfAnswered ? "Doğru Cevap!" : "Yanlış Cevap."}
                    </p>
                    {isSupported && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={speakExplanation}
                        className="h-6 w-6 p-0 hover:bg-white/20"
                      >
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <p>{qaItem.explanation}</p>
                  {!isCorrectIfAnswered && (
                    <p className="mt-1">Doğru şık: <span className="font-semibold">{qaItem.options[qaItem.correctAnswerIndex]}</span></p>
                  )}
                </div>
              </div>
            </div>
          )}
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}


export function QaDisplay({ qaPairs }: QaDisplayProps) {
  const [answeredMap, setAnsweredMap] = useState<Record<number, AnswerData>>({});

  const handleAttempt = (questionIndex: number, selectedOption: number, isCorrect: boolean) => {
    setAnsweredMap(prev => ({
      ...prev,
      [questionIndex]: { selectedOption, isCorrect }
    }));
  };

  if (!qaPairs || qaPairs.length === 0) {
    return (
       <Card className="w-full shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-450">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <HelpCircle className="mr-2 h-6 w-6 text-primary" /> Mini Test
          </CardTitle>
          <CardDescription>Bu bölüm için henüz soru-cevap oluşturulmadı veya yükleniyor.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const numCorrect = Object.values(answeredMap).filter(ans => ans.isCorrect).length;
  const numAttempted = Object.keys(answeredMap).length;

  return (
    <Card className="w-full shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-450">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center">
          <HelpCircle className="mr-2 h-6 w-6 text-primary" /> Mini Test
        </CardTitle>
        <CardDescription className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <span>Aşağıdaki çoktan seçmeli sorularla konuyu ne kadar anladığınızı test edin.</span>
          {qaPairs.length > 0 && (
            <span className="text-sm font-medium text-primary mt-2 sm:mt-0 flex items-center">
              <Award className="mr-1 h-4 w-4" />
              Skor: {numCorrect} / {numAttempted} (Toplam: {qaPairs.length})
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {qaPairs.map((qa, index) => (
            <SingleQaItem 
              qaItem={qa} 
              index={index} 
              key={index} 
              onAttempt={handleAttempt}
              answerData={answeredMap[index]}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

