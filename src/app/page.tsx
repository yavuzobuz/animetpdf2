
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { analyzePdf, AnalyzePdfInput, AnalyzePdfOutput } from '@/ai/flows/analyze-pdf';
import { generateAnimationScenario, GenerateAnimationScenarioInput, GenerateAnimationScenarioOutput } from '@/ai/flows/generate-animation-scenario';
import { generateFrameImage, GenerateFrameImageInput } from '@/ai/flows/generate-frame-image-flow';
import { generateQa, GenerateQaInput, GenerateQaOutput } from '@/ai/flows/generate-qa-flow';

import { PdfUploadForm } from '@/components/custom/pdf-upload-form';
import { ScenarioDisplay } from '@/components/custom/scenario-display';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { PlaybackControls } from '@/components/custom/playback-controls';
import { QaDisplay, QAPair } from '@/components/custom/qa-display';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, FileText, Clapperboard, RotateCcw, Image as ImageIcon, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

type AppStep = "upload" | "analyzing" | "generatingScenario" | "generatingImages" | "generatingQnA" | "ready";

interface AnimationFrameData {
  sceneDescription: string;
  keyTopic: string;
}

export default function AnimatePdfPage() {
  const [step, setStep] = useState<AppStep>("upload");
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSummary, setPdfSummary] = useState<string | null>(null);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrameData[] | null>(null); 
  
  const [storyboardSceneDescriptions, setStoryboardSceneDescriptions] = useState<string[]>([]);
  const [storyboardKeyTopics, setStoryboardKeyTopics] = useState<string[]>([]);
  const [storyboardImages, setStoryboardImages] = useState<(string | null)[]>([]);
  const [qaPairs, setQaPairs] = useState<QAPair[] | null>(null);
  
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { toast } = useToast();
  const playerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = () => {
    setStep("upload");
    setPdfFile(null);
    setPdfSummary(null);
    setAnimationFrames(null);
    setStoryboardSceneDescriptions([]);
    setStoryboardKeyTopics([]);
    setStoryboardImages([]);
    setQaPairs(null);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    if (playerIntervalRef.current) {
      clearInterval(playerIntervalRef.current);
      playerIntervalRef.current = null;
    }
  };

  const handlePdfUpload = async (file: File, dataUri: string) => {
    setPdfFile(file);
    setStep("analyzing");
    setPdfSummary(null); 
    setAnimationFrames(null);
    setStoryboardSceneDescriptions([]);
    setStoryboardKeyTopics([]);
    setStoryboardImages([]);
    setQaPairs(null);
    setCurrentFrameIndex(0);

    try {
      const analysisInput: AnalyzePdfInput = { pdfDataUri: dataUri };
      const analysisResult: AnalyzePdfOutput = await analyzePdf(analysisInput);
      setPdfSummary(analysisResult.summary);
      toast({
        title: "PDF Analizi Tamamlandı",
        description: "Özet çıkarıldı. Animasyon senaryosu oluşturuluyor...",
      });
      setStep("generatingScenario");
    } catch (error) {
      console.error("PDF Analysis Error:", error);
      toast({
        title: "PDF Analizi Başarısız Oldu",
        description: (error as Error).message || "PDF analiz edilemedi.",
        variant: "destructive",
      });
      setStep("upload");
    }
  };

  useEffect(() => {
    if (step === "generatingScenario" && pdfSummary) {
      const processScenarioAndQnA = async () => {
        try {
          // Generate Scenario
          const scenarioInput: GenerateAnimationScenarioInput = { pdfSummary };
          const scenarioResult: GenerateAnimationScenarioOutput = await generateAnimationScenario(scenarioInput);
          
          if (!scenarioResult.frames || scenarioResult.frames.length === 0) {
            throw new Error("Oluşturulan senaryo kare içermiyor.");
          }
          
          setAnimationFrames(scenarioResult.frames);
          setStoryboardSceneDescriptions(scenarioResult.frames.map(f => f.sceneDescription));
          setStoryboardKeyTopics(scenarioResult.frames.map(f => f.keyTopic));
          setStoryboardImages(Array(scenarioResult.frames.length).fill(null));
          setCurrentFrameIndex(0);

          toast({
            title: "Animasyon Senaryosu Oluşturuldu",
            description: "Şimdi her kare için görseller ve ardından mini test oluşturuluyor...",
          });
          setStep("generatingImages"); // Proceed to image generation

          // Generate Q&A (can happen after scenario is set, doesn't need to block image gen start)
          try {
            setStep("generatingQnA");
            const qaInput: GenerateQaInput = { pdfSummary };
            const qaResult: GenerateQaOutput = await generateQa(qaInput);
            setQaPairs(qaResult.qaPairs);
             toast({
              title: "Mini Test Oluşturuldu",
              description: "Sorular ve cevaplar hazır!",
            });
          } catch (qnaError) {
             console.error("Q&A Generation Error:", qnaError);
             toast({
                title: "Mini Test Oluşturma Başarısız Oldu",
                description: (qnaError as Error).message || "Sorular ve cevaplar oluşturulamadı.",
                variant: "destructive",
             });
             setQaPairs([]); // Set to empty array to prevent further attempts or indicate failure
          }


        } catch (error) {
          console.error("Scenario or Q&A Generation Error:", error);
          toast({
            title: "Senaryo veya Test Oluşturma Başarısız Oldu",
            description: (error as Error).message || "Animasyon senaryosu veya test oluşturulamadı.",
            variant: "destructive",
          });
          setStep("upload"); 
        }
      };
      processScenarioAndQnA();
    }
  }, [step, pdfSummary, toast]);

  useEffect(() => {
    if (step === "generatingImages" && storyboardSceneDescriptions.length > 0) {
      const generateAllImages = async () => {
        toast({
          title: "Kare Görselleri Oluşturuluyor",
          description: `${storyboardSceneDescriptions.length} kare için görseller oluşturuluyor. Bu biraz zaman alabilir...`,
        });

        const imageGenerationPromises = storyboardSceneDescriptions.map(async (description, index) => {
          try {
            const imageInput: GenerateFrameImageInput = { frameDescription: description };
            const imageResult = await generateFrameImage(imageInput);
            setStoryboardImages(prevImages => {
              const newImages = [...prevImages];
              if (index < newImages.length) {
                newImages[index] = imageResult.imageDataUri;
              }
              return newImages;
            });
          } catch (error) {
            console.error(`Error generating image for frame ${index + 1}:`, error);
            toast({
                title: `Görsel Oluşturma Hatası (Kare ${index + 1})`,
                description: (error as Error).message || "Bu kare için görsel oluşturulamadı.",
                variant: "destructive",
            });
          }
        });

        await Promise.allSettled(imageGenerationPromises);
        
        toast({
          title: "Görsel Oluşturma Tamamlandı!",
          description: "Tüm kare görselleri işlendi. Animasyonunuz önizlemeye hazır.",
        });
        // If Q&A was still generating or failed, this will just move to ready.
        // If Q&A is done, it's fine. If it failed, qaPairs might be null or empty.
        setStep("ready");
      };
      generateAllImages();
    }
  }, [step, storyboardSceneDescriptions, toast]);


  const handlePlay = useCallback(() => {
    if (storyboardSceneDescriptions.length > 0 && currentFrameIndex < storyboardSceneDescriptions.length -1) {
      setIsPlaying(true);
    }
  }, [storyboardSceneDescriptions, currentFrameIndex]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentFrameIndex((prev) => Math.min(prev + 1, storyboardSceneDescriptions.length - 1));
    setIsPlaying(false);
  }, [storyboardSceneDescriptions.length]);

  const handlePrev = useCallback(() => {
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
    setIsPlaying(false);
  }, []);
  
  const handleSeek = useCallback((frameIndex: number) => {
    setCurrentFrameIndex(Math.max(0, Math.min(frameIndex, storyboardSceneDescriptions.length - 1)));
    setIsPlaying(false);
  }, [storyboardSceneDescriptions.length]);

  const handleAnimationReset = useCallback(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
  }, []);


  useEffect(() => {
    if (isPlaying) {
      playerIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev < storyboardSceneDescriptions.length - 1) {
            return prev + 1;
          }
          setIsPlaying(false); 
          if (playerIntervalRef.current) clearInterval(playerIntervalRef.current);
          return prev;
        });
      }, 3000); 
    } else {
      if (playerIntervalRef.current) {
        clearInterval(playerIntervalRef.current);
        playerIntervalRef.current = null;
      }
    }
    return () => {
      if (playerIntervalRef.current) {
        clearInterval(playerIntervalRef.current);
      }
    };
  }, [isPlaying, storyboardSceneDescriptions.length]);


  const isLoading = step === "analyzing" || step === "generatingScenario" || step === "generatingImages" || step === "generatingQnA";
  const isProcessing = step === "analyzing" || step === "generatingScenario" || step === "generatingImages" || step === "generatingQnA";


  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8 font-body">
      <header className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold font-headline text-primary">
          <Clapperboard className="inline-block h-12 w-12 mr-2 -mt-1" /> AnimatePDF
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          PDF'lerinizi zahmetsizce animasyonlu hikayelere dönüştürün.
        </p>
      </header>

      <main className="w-full max-w-4xl space-y-8">
        {step === "upload" && (
          <section aria-labelledby="upload-section-title" className="flex justify-center">
             <PdfUploadForm onPdfUpload={handlePdfUpload} isLoading={isLoading} />
          </section>
        )}

        {isProcessing && (
          <Alert className="max-w-lg mx-auto shadow-md">
            {step === "analyzing" && <FileText className="h-5 w-5 animate-pulse text-primary" />}
            {step === "generatingScenario" && <Sparkles className="h-5 w-5 animate-spin text-primary" />}
            {step === "generatingImages" && <ImageIcon className="h-5 w-5 animate-spin text-primary" />}
            {step === "generatingQnA" && <HelpCircle className="h-5 w-5 animate-spin text-primary" />}
            {!["analyzing", "generatingScenario", "generatingImages", "generatingQnA"].includes(step) && <Loader2 className="h-5 w-5 animate-spin text-primary" /> }

            <AlertTitle className="font-headline">
              {step === "analyzing" && "PDF Analiz Ediliyor..."}
              {step === "generatingScenario" && "Senaryo Oluşturuluyor..."}
              {step === "generatingImages" && `Görseller Oluşturuluyor (${storyboardImages.filter(img => img !== null).length}/${storyboardSceneDescriptions.length})...`}
              {step === "generatingQnA" && "Mini Test Hazırlanıyor..."}
            </AlertTitle>
            <AlertDescription>
              {step === "analyzing" && "Yapay zekamız PDF'inizi okuyor ve anahtar temaları çıkarıyor. Lütfen bekleyin..."}
              {step === "generatingScenario" && "PDF özetine dayalı ilgi çekici bir animasyon senaryosu hazırlanıyor. Sabırlı olun!"}
              {step === "generatingImages" && "Yapay zekamız şimdi her animasyon karesi için benzersiz bir görsel oluşturuyor. Bu birkaç dakika sürebilir."}
              {step === "generatingQnA" && "Öğrenmenizi pekiştirmek için konuyla ilgili sorular ve cevaplar hazırlanıyor."}
            </AlertDescription>
          </Alert>
        )}

        {step === "ready" && pdfSummary && storyboardSceneDescriptions.length > 0 && (
          <>
            <section aria-labelledby="summary-section-title">
              <ScenarioDisplay pdfSummary={pdfSummary} />
            </section>
            
            <Separator className="my-8" />

            <section aria-labelledby="animation-preview-section-title" className="space-y-6">
              <AnimationPreview 
                sceneDescriptions={storyboardSceneDescriptions}
                currentSceneDescription={storyboardSceneDescriptions[currentFrameIndex] || ""}
                currentKeyTopic={storyboardKeyTopics[currentFrameIndex] || ""}
                storyboardImages={storyboardImages}
                currentFrameIndex={currentFrameIndex}
                isGeneratingInitialImages={step === "generatingImages"}
              />
              <PlaybackControls
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                onNext={handleNext}
                onPrev={handlePrev}
                onSeek={handleSeek}
                onReset={handleAnimationReset}
                currentFrameIndex={currentFrameIndex}
                totalFrames={storyboardSceneDescriptions.length}
                disabled={storyboardSceneDescriptions.length === 0 || step === "generatingImages"}
              />
            </section>

            {qaPairs && qaPairs.length > 0 && (
              <>
                <Separator className="my-8" />
                <section aria-labelledby="qa-section-title">
                  <QaDisplay qaPairs={qaPairs} />
                </section>
              </>
            )}
            
            <div className="text-center mt-8">
                <Button onClick={resetState} variant="outline" className="text-primary border-primary hover:bg-primary/10">
                    <RotateCcw className="mr-2 h-4 w-4" /> Yeni Bir PDF İle Başla
                </Button>
            </div>
          </>
        )}
      </main>

      <footer className="w-full max-w-4xl text-center py-8 mt-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AnimatePDF. Üretken Yapay Zeka ile güçlendirilmiştir.
        </p>
      </footer>
    </div>
  );
}
