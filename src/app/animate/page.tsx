
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { analyzePdf, AnalyzePdfInput, AnalyzePdfOutput } from '@/ai/flows/analyze-pdf';
import { generateAnimationScenario, GenerateAnimationScenarioInput, GenerateAnimationScenarioOutput } from '@/ai/flows/generate-animation-scenario';
import { generateFrameImage, GenerateFrameImageInput } from '@/ai/flows/generate-frame-image-flow';
import { generateQa, GenerateQaInput, GenerateQaOutput, QAPair as AIQAPair } from '@/ai/flows/generate-qa-flow';

import AnimatedSection from '@/components/custom/animated-section';
import { PdfUploadForm } from '@/components/custom/pdf-upload-form';
import { ScenarioDisplay } from '@/components/custom/scenario-display';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { PlaybackControls } from '@/components/custom/playback-controls';
import { QaDisplay } from '@/components/custom/qa-display';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, FileText, Clapperboard, RotateCcw, Image as ImageIcon, HelpCircle, Cpu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

type AppStep = "upload" | "analyzing" | "generatingScenario" | "generatingImages" | "ready";

interface AnimationFrameData {
  sceneDescription: string;
  keyTopic: string;
  frameSummary: string;
}

export default function AnimatePdfAppPage() {
  const [step, setStep] = useState<AppStep>("upload");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSummary, setPdfSummary] = useState<string | null>(null);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrameData[] | null>(null);

  const [storyboardSceneDescriptions, setStoryboardSceneDescriptions] = useState<string[]>([]);
  const [storyboardKeyTopics, setStoryboardKeyTopics] = useState<string[]>([]);
  const [storyboardFrameSummaries, setStoryboardFrameSummaries] = useState<string[]>([]);
  const [storyboardImages, setStoryboardImages] = useState<(string | null)[]>([]);
  const [qaPairs, setQaPairs] = useState<AIQAPair[] | null>(null);

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageGenerationStarted, setImageGenerationStarted] = useState(false);

  const { toast } = useToast();
  const playerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = () => {
    setStep("upload");
    setPdfFile(null);
    setPdfSummary(null);
    setAnimationFrames(null);
    setStoryboardSceneDescriptions([]);
    setStoryboardKeyTopics([]);
    setStoryboardFrameSummaries([]);
    setStoryboardImages([]);
    setQaPairs(null);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setImageGenerationStarted(false);
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
    setStoryboardFrameSummaries([]);
    setStoryboardImages([]);
    setQaPairs(null);
    setCurrentFrameIndex(0);
    setImageGenerationStarted(false);

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
      const processScenario = async () => {
        try {
          const scenarioInput: GenerateAnimationScenarioInput = { pdfSummary };
          const scenarioResult: GenerateAnimationScenarioOutput = await generateAnimationScenario(scenarioInput);

          if (!scenarioResult.frames || scenarioResult.frames.length === 0) {
            throw new Error("Oluşturulan senaryo kare içermiyor.");
          }

          setAnimationFrames(scenarioResult.frames);
          const newSceneDescriptions = scenarioResult.frames.map(f => f.sceneDescription);
          const newKeyTopics = scenarioResult.frames.map(f => f.keyTopic);
          const newFrameSummaries = scenarioResult.frames.map(f => f.frameSummary);


          setStoryboardSceneDescriptions(newSceneDescriptions);
          setStoryboardKeyTopics(newKeyTopics);
          setStoryboardFrameSummaries(newFrameSummaries);
          setStoryboardImages(Array(scenarioResult.frames.length).fill(null));
          setCurrentFrameIndex(0);

          toast({
            title: "Animasyon Senaryosu Oluşturuldu",
            description: "Şimdi her kare için görseller ve mini test eş zamanlı oluşturuluyor...",
          });

          setStep("generatingImages");

          // Generate Q&A in parallel, don't await here
          generateQa({ pdfSummary })
            .then(qaResult => {
              setQaPairs(qaResult.qaPairs);
              toast({
                title: "Mini Test Oluşturuldu",
                description: "Sorular ve cevaplar hazır!",
              });
            })
            .catch(qnaError => {
               console.error("Q&A Generation Error:", qnaError);
               toast({
                  title: "Mini Test Oluşturma Başarısız Oldu",
                  description: (qnaError as Error).message || "Sorular ve cevaplar oluşturulamadı.",
                  variant: "destructive",
               });
               setQaPairs([]);
            });

        } catch (error) {
          console.error("Scenario Generation Error:", error);
          toast({
            title: "Senaryo Oluşturma Başarısız Oldu",
            description: (error as Error).message || "Animasyon senaryosu oluşturulamadı.",
            variant: "destructive",
          });
          setStep("upload");
        }
      };
      processScenario();
    }
  }, [step, pdfSummary, toast]);

  useEffect(() => {
    if (step === "generatingImages" && storyboardSceneDescriptions.length > 0 && !imageGenerationStarted) {
      setImageGenerationStarted(true);
      const generateAllImages = async () => {
        toast({
          title: "Kare Görselleri ve Mini Test Hazırlanıyor",
          description: `${storyboardSceneDescriptions.length} kare için görseller ve test soruları oluşturuluyor. Bu biraz zaman alabilir...`,
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
        setStep("ready");
      };
      generateAllImages();
    }
  }, [step, storyboardSceneDescriptions, imageGenerationStarted, toast]);


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


  const isLoading = step === "analyzing" || step === "generatingScenario" || step === "generatingImages";
  const isProcessing = step === "analyzing" || step === "generatingScenario" || step === "generatingImages";


  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8 font-body">
      <AnimatedSection tag="header" className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold font-headline text-primary">
          <Clapperboard className="inline-block h-12 w-12 mr-2 -mt-1 animate-pulse" /> AnimatePDF
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          PDF'lerinizi zahmetsizce animasyonlu hikayelere dönüştürün.
        </p>
      </AnimatedSection>

      <main className="w-full max-w-4xl space-y-8">
        {step === "upload" && (
          <AnimatedSection sectionId="upload-section-title" className="flex justify-center" delay="delay-100">
             <PdfUploadForm onPdfUpload={handlePdfUpload} isLoading={isLoading} />
          </AnimatedSection>
        )}

        {isProcessing && (
          <AnimatedSection tag="div" className="flex justify-center" delay="delay-100">
            <Alert className="max-w-lg mx-auto shadow-md border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
              {step === "analyzing" && <FileText className="h-5 w-5 animate-pulse text-primary" />}
              {step === "generatingScenario" && <Sparkles className="h-5 w-5 animate-spin text-primary" />}
              {step === "generatingImages" && <ImageIcon className="h-5 w-5 animate-spin text-primary" />}
              {!["analyzing", "generatingScenario", "generatingImages"].includes(step) && <Loader2 className="h-5 w-5 animate-spin text-primary" /> }

              <AlertTitle className="font-headline">
                {step === "analyzing" && "PDF Analiz Ediliyor..."}
                {step === "generatingScenario" && "Senaryo Oluşturuluyor..."}
                {step === "generatingImages" && `Görseller ve Mini Test Hazırlanıyor... (${storyboardImages.filter(img => img !== null).length}/${storyboardSceneDescriptions.length} görsel tamamlandı)`}
              </AlertTitle>
              <AlertDescription>
                {step === "analyzing" && "Yapay zekamız PDF'inizi okuyor ve anahtar temaları çıkarıyor. Lütfen bekleyin..."}
                {step === "generatingScenario" && "PDF özetine dayalı ilgi çekici bir animasyon senaryosu hazırlanıyor. Sabırlı olun!"}
                {step === "generatingImages" && "Yapay zekamız animasyon kareleri için görseller ve öğrenmenizi pekiştirmek için mini test hazırlıyor. Bu süreç biraz zaman alabilir."}
              </AlertDescription>
            </Alert>
          </AnimatedSection>
        )}

        {step === "ready" && pdfSummary && storyboardSceneDescriptions.length > 0 && (
          <>
            <AnimatedSection sectionId="summary-section-title" delay="delay-100">
              <ScenarioDisplay pdfSummary={pdfSummary} />
            </AnimatedSection>

            <Separator className="my-8" />

            <AnimatedSection sectionId="animation-preview-section-title" className="space-y-6" delay="delay-200">
              <AnimationPreview
                sceneDescriptions={storyboardSceneDescriptions}
                currentSceneDescription={storyboardSceneDescriptions[currentFrameIndex] || ""}
                currentKeyTopic={storyboardKeyTopics[currentFrameIndex] || ""}
                currentFrameSummary={storyboardFrameSummaries[currentFrameIndex] || ""}
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
            </AnimatedSection>

            {qaPairs && qaPairs.length > 0 && (
              <>
                <Separator className="my-8" />
                <AnimatedSection sectionId="qa-section-title" delay="delay-300">
                  <QaDisplay qaPairs={qaPairs} />
                </AnimatedSection>
              </>
            )}

            <AnimatedSection tag="div" className="text-center mt-8" delay="delay-400">
                <Button onClick={resetState} variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all">
                    <RotateCcw className="mr-2 h-4 w-4" /> Yeni Bir PDF İle Başla
                </Button>
            </AnimatedSection>
          </>
        )}
      </main>

      <footer className="w-full max-w-4xl text-center py-8 mt-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AnimatePDF.
          <Sparkles className="inline-block h-4 w-4 mx-1 text-primary" />
          Üretken Yapay Zeka
          <Cpu className="inline-block h-4 w-4 ml-1 mr-1 text-primary" />
          ile güçlendirilmiştir.
        </p>
      </footer>
    </div>
  );
}
