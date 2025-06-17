
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, FileText, Clapperboard, RotateCcw, Image as ImageIcon, HelpCircle, Cpu, Twitter, Linkedin, Github, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

type AppStep = "upload" | "analyzing" | "generatingScenario" | "styleSelection" | "generatingImages" | "ready";

interface AnimationFrameData {
  sceneDescription: string;
  keyTopic: string;
  frameSummary: string;
}

const animationStyleOptions = [
  { value: "Clean, vibrant", label: "Temiz ve Canlı (Varsayılan)" },
  { value: "Cartoon", label: "Çizgi Film" },
  { value: "Minimalist", label: "Minimalist" },
  { value: "Photorealistic", label: "Fotogerçekçi" },
  { value: "Sketch", label: "Eskiz Stili" },
  { value: "Watercolor", label: "Suluboya Efekti" },
  { value: "Pixel Art", label: "Piksel Sanatı" },
  { value: "Abstract", label: "Soyut" },
];

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

  const [selectedAnimationStyle, setSelectedAnimationStyle] = useState<string>(animationStyleOptions[0].value);
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
    setSelectedAnimationStyle(animationStyleOptions[0].value);
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
    // selectedAnimationStyle is kept as is, or could be reset here if desired
    // setSelectedAnimationStyle(animationStyleOptions[0].value);


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
            description: "Şimdi animasyon stilini seçin. Ardından her kare için görseller ve mini test eş zamanlı oluşturulacak...",
          });

          setStep("styleSelection"); 

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
          description: `${storyboardSceneDescriptions.length} kare için görseller (${selectedAnimationStyle} stiliyle) ve test soruları oluşturuluyor. Bu biraz zaman alabilir...`,
        });

        const imageGenerationPromises = storyboardSceneDescriptions.map(async (description, index) => {
          try {
            const imageInput: GenerateFrameImageInput = { 
              frameDescription: description,
              animationStyle: selectedAnimationStyle 
            };
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
  }, [step, storyboardSceneDescriptions, imageGenerationStarted, toast, selectedAnimationStyle]);


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
  const isProcessingAlertVisible = step === "analyzing" || step === "generatingScenario" || step === "generatingImages";


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

        {isProcessingAlertVisible && (
          <AnimatedSection tag="div" className="flex justify-center" delay="delay-100">
            <Alert className="max-w-lg mx-auto shadow-md border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
              {step === "analyzing" && <FileText className="h-5 w-5 animate-pulse text-primary" />}
              {step === "generatingScenario" && <Sparkles className="h-5 w-5 animate-spin text-primary" />}
              {step === "generatingImages" && <ImageIcon className="h-5 w-5 animate-spin text-primary" />}
              
              <AlertTitle className="font-headline">
                {step === "analyzing" && "PDF Analiz Ediliyor..."}
                {step === "generatingScenario" && "Senaryo Oluşturuluyor..."}
                {step === "generatingImages" && `Görseller ve Mini Test Hazırlanıyor... (${storyboardImages.filter(img => img !== null).length}/${storyboardSceneDescriptions.length} görsel tamamlandı)`}
              </AlertTitle>
              <AlertDescription>
                {step === "analyzing" && "Yapay zekamız PDF'inizi okuyor ve anahtar temaları çıkarıyor. Lütfen bekleyin..."}
                {step === "generatingScenario" && "PDF özetine dayalı ilgi çekici bir animasyon senaryosu hazırlanıyor. Sabırlı olun!"}
                {step === "generatingImages" && `Yapay zekamız animasyon kareleri için "${selectedAnimationStyle}" stilinde görseller ve öğrenmenizi pekiştirmek için mini test hazırlıyor. Bu süreç biraz zaman alabilir.`}
              </AlertDescription>
            </Alert>
          </AnimatedSection>
        )}

        {step === "styleSelection" && animationFrames && (
          <AnimatedSection sectionId="style-selection-section" className="flex justify-center" delay="delay-100">
            <Card className="w-full max-w-lg shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center">
                    <Palette className="mr-2 h-6 w-6 text-primary" /> Animasyon Stilini Seçin
                </CardTitle>
                <CardDescription>Oluşturulacak görseller için bir stil belirleyin. Bu stil tüm karelere uygulanacaktır.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedAnimationStyle} onValueChange={setSelectedAnimationStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Bir stil seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {animationStyleOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => {
                    toast({ title: "Stil Seçildi", description: `Görseller "${selectedAnimationStyle}" stilinde oluşturulacak.`});
                    setStep("generatingImages");
                  }} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!selectedAnimationStyle}
                >
                  <ImageIcon className="mr-2 h-4 w-4" /> Görselleri Oluşturmaya Başla
                </Button>
              </CardContent>
            </Card>
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
                isGeneratingInitialImages={step === "generatingImages" && storyboardImages.some(img => img === null)}
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
                disabled={storyboardSceneDescriptions.length === 0 || (step === "generatingImages" && storyboardImages.some(img => img === null))}
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

      <footer className="w-full py-12 border-t border-border mt-auto bg-primary text-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline flex items-center">
                <Clapperboard className="h-6 w-6 mr-2" /> AnimatePDF
              </h5>
              <p className="text-sm">
                PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">Bağlantılar</h5>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Hakkımızda</Link></li>
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Kullanım Koşulları</Link></li>
                <li><Link href="/" className="text-sm hover:opacity-80 transition-opacity">Ana Sayfa</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">Bizi Takip Edin</h5>
              <div className="flex space-x-4">
                <Link href="#" aria-label="Twitter" className="hover:opacity-80 transition-opacity">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="GitHub" className="hover:opacity-80 transition-opacity">
                  <Github className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <Separator className="mb-8 bg-foreground/30" />
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} AnimatePDF. Tüm hakları saklıdır.
            <Sparkles className="inline-block h-4 w-4 mx-1" />
            Üretken Yapay Zeka
            <Cpu className="inline-block h-4 w-4 ml-1 mr-1" />
            ile güçlendirilmiştir.
          </p>
        </div>
      </footer>
    </div>
  );
}

