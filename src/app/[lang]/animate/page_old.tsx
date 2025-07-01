"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link'; 
import { analyzePdf, AnalyzePdfInput, AnalyzePdfOutput } from '@/ai/flows/analyze-pdf';
import { generateAnimationScenario, GenerateAnimationScenarioInput, GenerateAnimationScenarioOutput } from '@/ai/flows/generate-animation-scenario';
import { generateFrameImage, GenerateFrameImageInput } from '@/ai/flows/generate-frame-image-flow';
import { generateQa, GenerateQaInput, GenerateQaOutput, QAPair as AIQAPair } from '@/ai/flows/generate-qa-flow';
import { generateSpeech, GenerateSpeechInput } from '@/ai/flows/generate-speech-flow';
import { chatWithPdf, type ChatWithPdfInput, type ChatWithPdfOutput } from '@/ai/flows/chat-with-pdf-flow';
import { generatePdfDiagram, type GeneratePdfDiagramInput, type GeneratePdfDiagramOutput } from '@/ai/flows/generate-pdf-diagram-flow';

import AnimatedSection from '@/components/custom/animated-section';
import { PdfUploadForm } from '@/components/custom/pdf-upload-form';
import ScenarioDisplay from '@/components/custom/scenario-display';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { PlaybackControls } from '@/components/custom/playback-controls';
import { QaDisplay } from '@/components/custom/qa-display';
import { PdfChat } from '@/components/custom/pdf-chat';
import { PdfDiagramGenerator } from '@/components/custom/pdf-diagram-generator';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, FileText, Clapperboard, RotateCcw, Image as ImageIcon, HelpCircle, Cpu, Twitter, Linkedin, Github, Palette, Volume2, Mic, GitFork, DollarSign, ArrowRight, Eye, Zap, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context'; 

type AppStep = "upload" | "analyzing" | "generatingScenario" | "styleSelection" | "generatingContent" | "ready";

interface AnimationFrameData {
  sceneDescription: string;
  keyTopic: string;
  frameSummary: string;
}

interface AnimatePdfAppPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}


const pageUIText = {
  tr: {
    mainTitle: "AnimatePDF",
    mainSubtitle: "PDF'inizi Yükleyin; Otomatik Özet, Animasyon, Ses, Test, Sohbet ve Diyagram ile Bilgiyi Keşfedin!",
    pdfAnalysisComplete: "PDF Analizi Tamamlandı",
    pdfAnalysisDescription: "Özet çıkarıldı. Animasyon senaryosu oluşturuluyor...",
    pdfAnalysisFailed: "PDF Analizi Başarısız Oldu",
    scenarioGenerated: "Animasyon Senaryosu Oluşturuldu",
    scenarioGeneratedDescription: "Şimdi animasyon stilini seçin. Ardından her kare için görseller, seslendirmeler ve mini test eş zamanlı oluşturulacak...",
    scenarioGenerationFailed: "Senaryo Oluşturma Başarısız Oldu",
    qaGenerated: "Mini Test Oluşturuldu",
    qaGeneratedDescription: "Sorular ve cevaplar hazır!",
    qaGenerationFailed: "Mini Test Oluşturma Başarısız Oldu",
    styleSelectedToast: "Stil Seçildi",
    styleSelectedToastDescription: (style: string) => `İçerikler "${style}" stilinde oluşturulacak.`,
    contentGenerationInProgress: (style: string, imgLoaded: number, audLoaded: number, total: number) => `İçerikler Hazırlanıyor... "${style}" stilinde görseller (${imgLoaded}/${total}), seslendirmeler (${audLoaded}/${total}) ve mini test hazırlanıyor. Bu süreç biraz zaman alabilir.`,
    contentGenerationInProgressTitle: "Görseller, Seslendirmeler ve Mini Test Hazırlanıyor",
    contentGenerationInProgressDescription: (style: string, frames: number) => `${frames} kare için içerikler (${style} stiliyle) oluşturuluyor. Bu biraz zaman alabilir...`,
    contentGenerationComplete: "İçerik Oluşturma Tamamlandı!",
    contentGenerationCompleteDescription: "Tüm kare görselleri ve seslendirmeler işlendi. Animasyonunuz önizlemeye hazır.",
    imageGenerationError: (index: number) => `Görsel Oluşturma Hatası (Kare ${index + 1})`,
    audioGenerationError: (index: number) => `Seslendirme Oluşturma Hatası (Kare ${index + 1})`,
    contentGenerationError: "Bu içerik oluşturulamadı.",
    promiseRejectionError: "Bir İçerik Oluşturma Hatası (Promise Rejection)",
    unknownError: "Bilinmeyen bir hata oluştu.",
    analyzingStateTitle: "PDF Analiz Ediliyor...",
    analyzingStateDesc: "Yapay zekamız PDF'inizi okuyor ve anahtar temaları çıkarıyor. Lütfen bekleyin...",
    generatingScenarioStateTitle: "Senaryo Oluşturuluyor...",
    generatingScenarioStateDesc: "PDF özetine dayalı ilgi çekici bir animasyon senaryosu hazırlanıyor. Sabırlı olun!",
    styleSelectionCardTitle: "Animasyon Stilini Seçin",
    styleSelectionCardDesc: "Oluşturulacak görseller için bir stil belirleyin. Bu stil tüm karelere uygulanacaktır.",
    styleSelectPlaceholder: "Bir stil seçin...",
    startContentGenerationButton: "İçerikleri Oluşturmaya Başla",
    startNewPdfButton: "Yeni Bir PDF İle Başla",
    footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
    footerLinksTitle: "Bağlantılar",
    footerFollowTitle: "Bizi Takip Edin",
    footerRights: "Tüm hakları saklıdır.",
    footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
    footerNavLinks: [
        { href: "/", text: "Ana Sayfa" },
        { href: "/about", text: "Hakkımızda" },
        { href: "/pricing", text: "Fiyatlandırma" },
        { href: "/faq", text: "SSS" },
        { href: "#", text: "Gizlilik Politikası" },
        { href: "#", text: "Kullanım Koşulları" },
    ]
  },
  en: {
    mainTitle: "AnimatePDF",
    mainSubtitle: "Upload Your PDF; Explore Information with Auto Summary, Animation, Audio, Quiz, Chat, and Diagram!",
    pdfAnalysisComplete: "PDF Analysis Complete",
    pdfAnalysisDescription: "Summary extracted. Generating animation script...",
    pdfAnalysisFailed: "PDF Analysis Failed",
    scenarioGenerated: "Animation Script Generated",
    scenarioGeneratedDescription: "Now choose an animation style. Then, visuals, voiceovers, and a mini-quiz will be generated simultaneously for each frame...",
    scenarioGenerationFailed: "Script Generation Failed",
    qaGenerated: "Mini-Quiz Generated",
    qaGeneratedDescription: "Questions and answers are ready!",
    qaGenerationFailed: "Mini-Quiz Generation Failed",
    styleSelectedToast: "Style Selected",
    styleSelectedToastDescription: (style: string) => `Content will be generated in "${style}" style.`,
    contentGenerationInProgress: (style: string, imgLoaded: number, audLoaded: number, total: number) => `Generating Content... Visuals (${imgLoaded}/${total}), voiceovers (${audLoaded}/${total}) and mini-quiz are being prepared in "${style}" style. This may take some time.`,
    contentGenerationInProgressTitle: "Preparing Visuals, Voiceovers, and Mini-Quiz",
    contentGenerationInProgressDescription: (style: string, frames: number) => `Content for ${frames} frames is being generated (with ${style} style). This may take some time...`,
    contentGenerationComplete: "Content Generation Complete!",
    contentGenerationCompleteDescription: "All frame visuals and voiceovers have been processed. Your animation is ready for preview.",
    imageGenerationError: (index: number) => `Image Generation Error (Frame ${index + 1})`,
    audioGenerationError: (index: number) => `Voiceover Generation Error (Frame ${index + 1})`,
    contentGenerationError: "This content could not be generated.",
    promiseRejectionError: "A Content Generation Error (Promise Rejection)",
    unknownError: "An unknown error occurred.",
    analyzingStateTitle: "Analyzing PDF...",
    analyzingStateDesc: "Our AI is reading your PDF and extracting key themes. Please wait...",
    generatingScenarioStateTitle: "Generating Script...",
    generatingScenarioStateDesc: "An engaging animation script based on the PDF summary is being prepared. Be patient!",
    styleSelectionCardTitle: "Select Animation Style",
    styleSelectionCardDesc: "Choose a style for the visuals to be generated. This style will be applied to all frames.",
    styleSelectPlaceholder: "Select a style...",
    startContentGenerationButton: "Start Content Generation",
    startNewPdfButton: "Start With a New PDF",
    footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
    footerLinksTitle: "Links",
    footerFollowTitle: "Follow Us",
    footerRights: "All rights reserved.",
    footerPoweredBy: "Powered by Generative AI",
    footerNavLinks: [
        { href: "/", text: "Home" },
        { href: "/about", text: "About Us" },
        { href: "/pricing", text: "Pricing" },
        { href: "/faq", text: "FAQ" },
        { href: "#", text: "Privacy Policy" },
        { href: "#", text: "Terms of Use" },
    ]
  }
};

const animationStyleOptionsData = {
  tr: [
    { value: "Clean, vibrant", label: "Temiz ve Canlı (Varsayılan)" },
    { value: "Cartoon", label: "Çizgi Film" },
    { value: "Minimalist", label: "Minimalist" },
    { value: "Photorealistic", label: "Fotogerçekçi" },
    { value: "Sketch", label: "Eskiz Stili" },
    { value: "Watercolor", label: "Suluboya Efekti" },
    { value: "Pixel Art", label: "Piksel Sanatı" },
    { value: "Abstract", label: "Soyut" },
  ],
  en: [
    { value: "Clean, vibrant", label: "Clean and Vibrant (Default)" },
    { value: "Cartoon", label: "Cartoon" },
    { value: "Minimalist", label: "Minimalist" },
    { value: "Photorealistic", label: "Photorealistic" },
    { value: "Sketch", label: "Sketch Style" },
    { value: "Watercolor", label: "Watercolor Effect" },
    { value: "Pixel Art", label: "Pixel Art" },
    { value: "Abstract", label: "Abstract" },
  ]
};


export default function AnimatePdfAppPage({ params }: AnimatePdfAppPageProps) {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = React.useState<'en' | 'tr'>('tr');
  
  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);
  
  const uiText = pageUIText[currentLang] || pageUIText.tr;
  const animationStyleOptions = animationStyleOptionsData[currentLang] || animationStyleOptionsData.tr;


  const [step, setStep] = useState<AppStep>("upload");

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSummary, setPdfSummary] = useState<string | null>(null);
  const [animationFrames, setAnimationFrames] = useState<AnimationFrameData[] | null>(null);

  const [storyboardSceneDescriptions, setStoryboardSceneDescriptions] = useState<string[]>([]);
  const [storyboardKeyTopics, setStoryboardKeyTopics] = useState<string[]>([]);
  const [storyboardFrameSummaries, setStoryboardFrameSummaries] = useState<string[]>([]);
  const [storyboardImages, setStoryboardImages] = useState<(string | null)[]>([]);
  const [storyboardAudioUrls, setStoryboardAudioUrls] = useState<(string | null)[]>([]);
  const [qaPairs, setQaPairs] = useState<AIQAPair[] | null>(null);

  const [selectedAnimationStyle, setSelectedAnimationStyle] = useState<string>(animationStyleOptions[0].value);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentGenerationStarted, setContentGenerationStarted] = useState(false);

  const { toast } = useToast();
  const playerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const resetState = () => {
    setStep("upload");
    setPdfFile(null);
    setPdfSummary(null);
    setAnimationFrames(null);
    setStoryboardSceneDescriptions([]);
    setStoryboardKeyTopics([]);
    setStoryboardFrameSummaries([]);
    setStoryboardImages([]);
    setStoryboardAudioUrls([]);
    setQaPairs(null);
    setSelectedAnimationStyle(animationStyleOptions[0].value);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    setContentGenerationStarted(false);
    if (playerIntervalRef.current) {
      clearInterval(playerIntervalRef.current);
      playerIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
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
    setStoryboardAudioUrls([]);
    setQaPairs(null);
    setCurrentFrameIndex(0);
    setContentGenerationStarted(false);
    
    try {
      const analysisInput: AnalyzePdfInput = { pdfDataUri: dataUri };
      const analysisResult: AnalyzePdfOutput = await analyzePdf(analysisInput);
      setPdfSummary(analysisResult.summary);
      toast({
        title: uiText.pdfAnalysisComplete,
        description: uiText.pdfAnalysisDescription,
      });
      setStep("generatingScenario");
    } catch (error) {
      console.error("PDF Analysis Error:", error);
      toast({
        title: uiText.pdfAnalysisFailed,
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
          const qaResult = await generateQa({ pdfSummary });
          setQaPairs(qaResult.qaPairs);
          toast({
            title: uiText.qaGenerated,
            description: uiText.qaGeneratedDescription,
          });

          const scenarioInput: GenerateAnimationScenarioInput = { 
            pdfSummary,
            qaPairs: qaResult.qaPairs,
          };
          const scenarioResult: GenerateAnimationScenarioOutput = await generateAnimationScenario(scenarioInput);

          // "Metinde ... denilmektedir" gibi ifadeleri temizle
          const sanitizeKeyTopic = (text?: string) => {
            if (!text) return text ?? '';
            return text
              .replace(/^[\s\u200B]*(Bu\s+metinde|Metinde|Metne\s+göre)[\s,:-]*/i, '')
              .replace(/[\s,:-]*(denilmektedir|denmektedir)\.?$/i, '')
              .trim();
          };

          if (!scenarioResult.frames || scenarioResult.frames.length === 0) {
            throw new Error("Oluşturulan senaryo kare içermiyor.");
          }

          setAnimationFrames(scenarioResult.frames);
          const newSceneDescriptions = scenarioResult.frames.map(f => f.sceneDescription);
          const newKeyTopics = scenarioResult.frames.map(f => sanitizeKeyTopic(f.keyTopic));
          const newFrameSummaries = scenarioResult.frames.map(f => f.frameSummary);

          setStoryboardSceneDescriptions(newSceneDescriptions);
          setStoryboardKeyTopics(newKeyTopics);
          setStoryboardFrameSummaries(newFrameSummaries);
          setStoryboardImages(Array(scenarioResult.frames.length).fill(null));
          setStoryboardAudioUrls(Array(scenarioResult.frames.length).fill(null));
          setCurrentFrameIndex(0);

          toast({
            title: uiText.scenarioGenerated,
            description: uiText.scenarioGeneratedDescription,
          });

          setStep("styleSelection");

        } catch (error) {
          console.error("Scenario Generation Error:", error);
          toast({
            title: uiText.scenarioGenerationFailed,
            description: (error as Error).message || "Animasyon senaryosu oluşturulamadı.",
            variant: "destructive",
          });
          setStep("upload");
        }
      };
      processScenario();
    }
  }, [step, pdfSummary, toast, uiText]);

 useEffect(() => {
    if (step === "generatingContent" && storyboardSceneDescriptions.length > 0 && !contentGenerationStarted) {
      setContentGenerationStarted(true);
      
      const generateAllContent = async () => {
        toast({
          title: uiText.contentGenerationInProgressTitle,
          description: uiText.contentGenerationInProgressDescription(selectedAnimationStyle, storyboardSceneDescriptions.length),
        });

        const imagePromises = storyboardSceneDescriptions.map((description, index) => 
          generateFrameImage({ frameDescription: description, animationStyle: selectedAnimationStyle })
            .then(result => ({ index, type: 'image', data: result.imageDataUri }))
            .catch(error => ({ index, type: 'image', error }))
        );

        const audioPromises = storyboardKeyTopics.map((keyTopic, index) => 
          generateSpeech({ text: keyTopic, languageCode: currentLang === 'tr' ? 'tr-TR' : 'en-US' }) 
            .then(result => ({ index, type: 'audio', data: result.audioDataUri }))
            .catch(error => ({ index, type: 'audio', error }))
        );
        
        const allPromises = [...imagePromises, ...audioPromises];
        const results = await Promise.allSettled(allPromises);

        results.forEach(settledResult => {
          if (settledResult.status === 'fulfilled') {
            const result = settledResult.value;
            if (result.type === 'image' && 'data' in result) {
              setStoryboardImages(prev => {
                const newImages = [...prev];
                if (result.index < newImages.length) newImages[result.index] = result.data;
                return newImages;
              });
            } else if (result.type === 'audio' && 'data' in result) {
              setStoryboardAudioUrls(prev => {
                const newAudios = [...prev];
                if (result.index < newAudios.length) newAudios[result.index] = result.data;
                return newAudios;
              });
            } else if ('error' in result) {
               const errorTitle = result.type === 'image' 
                ? uiText.imageGenerationError(result.index)
                : uiText.audioGenerationError(result.index);
              console.error(`${errorTitle}:`, result.error);
              toast({
                  title: errorTitle,
                  description: (result.error as Error).message || uiText.contentGenerationError,
                  variant: "destructive",
              });
            }
          } else {
            
            console.error("Unhandled promise rejection in content generation:", settledResult.reason);
             toast({
                  title: uiText.promiseRejectionError,
                  description: (settledResult.reason as Error)?.message || uiText.unknownError,
                  variant: "destructive",
              });
          }
        });

        toast({
          title: uiText.contentGenerationComplete,
          description: uiText.contentGenerationCompleteDescription,
        });
        setStep("ready");
      };
      generateAllContent();
    }
 }, [step, storyboardSceneDescriptions, storyboardKeyTopics, contentGenerationStarted, toast, selectedAnimationStyle, currentLang, uiText]);


  const handlePlay = useCallback(() => {
    if (storyboardSceneDescriptions.length > 0 && currentFrameIndex < storyboardSceneDescriptions.length) {
      setIsPlaying(true);
      if (audioRef.current && storyboardAudioUrls[currentFrameIndex]) {
        audioRef.current.src = storyboardAudioUrls[currentFrameIndex]!;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    }
  }, [storyboardSceneDescriptions, currentFrameIndex, storyboardAudioUrls]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const handleNext = useCallback(() => {
    setCurrentFrameIndex((prev) => {
      const nextIndex = Math.min(prev + 1, storyboardSceneDescriptions.length - 1);
      if (audioRef.current) audioRef.current.pause();
      return nextIndex;
    });
    setIsPlaying(false);
  }, [storyboardSceneDescriptions.length]);

  const handlePrev = useCallback(() => {
    setCurrentFrameIndex((prev) => {
      const prevIndex = Math.max(prev - 1, 0);
       if (audioRef.current) audioRef.current.pause();
      return prevIndex;
    });
    setIsPlaying(false);
  }, []);

  const handleSeek = useCallback((frameIndex: number) => {
    const newIndex = Math.max(0, Math.min(frameIndex, storyboardSceneDescriptions.length - 1));
    setCurrentFrameIndex(newIndex);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [storyboardSceneDescriptions.length]);

  const handleAnimationReset = useCallback(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);


  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current && storyboardAudioUrls[currentFrameIndex] && audioRef.current.src !== storyboardAudioUrls[currentFrameIndex]) {
        audioRef.current.src = storyboardAudioUrls[currentFrameIndex]!;
      }
      audioRef.current?.play().catch(e => console.error("Error playing audio in interval:", e));

      playerIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev < storyboardSceneDescriptions.length - 1) {
            const nextIdx = prev + 1;
            if (audioRef.current && storyboardAudioUrls[nextIdx]) {
              audioRef.current.src = storyboardAudioUrls[nextIdx]!;
              audioRef.current.play().catch(e => console.error("Error playing next audio:", e));
            } else if (audioRef.current) {
              audioRef.current.pause(); 
            }
            return nextIdx;
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
      audioRef.current?.pause();
    }
    return () => {
      if (playerIntervalRef.current) {
        clearInterval(playerIntervalRef.current);
      }
    };
  }, [isPlaying, storyboardSceneDescriptions.length, currentFrameIndex, storyboardAudioUrls]);

   useEffect(() => {
    if (audioRef.current && storyboardAudioUrls[currentFrameIndex]) {
      if (audioRef.current.src !== storyboardAudioUrls[currentFrameIndex]) {
        audioRef.current.src = storyboardAudioUrls[currentFrameIndex]!;
        audioRef.current.load(); 
      }
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Error playing audio on frame change:", e));
      } else {
        audioRef.current.pause();
      }
    } else if (audioRef.current) {
        audioRef.current.pause(); 
    }
  }, [currentFrameIndex, storyboardAudioUrls, isPlaying]);


  const isLoading = step === "analyzing" || step === "generatingScenario" || step === "generatingContent";
  const isProcessingAlertVisible = step === "analyzing" || step === "generatingScenario" || step === "generatingContent";

  const totalImagesLoaded = storyboardImages.filter(img => img !== null).length;
  const totalAudioLoaded = storyboardAudioUrls.filter(aud => aud !== null).length;
  const totalFrames = storyboardSceneDescriptions.length;

  // PdfChat type adaptörü
  const chatWithPdfAdapter = async (input: { prompt: string; pdfContent: string }) => {
    const result = await chatWithPdf({ pdfSummary: input.pdfContent, userQuery: input.prompt });
    return { response: result.botResponse };
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      {/* Simple Header */}
      <header className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold headline-modern mb-4">
            <span className="gradient-animate">
              {uiText.mainTitle}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {uiText.mainSubtitle}
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-6 space-y-16 flex-1">
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
              {step === "generatingContent" && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
              
              <AlertTitle className="font-headline">
                {step === "analyzing" && uiText.analyzingStateTitle}
                {step === "generatingScenario" && uiText.generatingScenarioStateTitle}
                {step === "generatingContent" && uiText.contentGenerationInProgress(selectedAnimationStyle, totalImagesLoaded, totalAudioLoaded, totalFrames)}
              </AlertTitle>
              <AlertDescription>
                {step === "analyzing" && uiText.analyzingStateDesc}
                {step === "generatingScenario" && uiText.generatingScenarioStateDesc}
                {step === "generatingContent" && 
                  uiText.contentGenerationInProgress(selectedAnimationStyle, totalImagesLoaded, totalAudioLoaded, totalFrames)
                }
              </AlertDescription>
            </Alert>
          </AnimatedSection>
        )}

        {step === "styleSelection" && animationFrames && (
          <AnimatedSection sectionId="style-selection-section" className="flex justify-center" delay="delay-100">
            <Card className="w-full max-w-lg shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center">
                    <Palette className="mr-2 h-6 w-6 text-primary" /> {uiText.styleSelectionCardTitle}
                </CardTitle>
                <CardDescription>{uiText.styleSelectionCardDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedAnimationStyle} onValueChange={setSelectedAnimationStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={uiText.styleSelectPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {animationStyleOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={() => {
                    toast({ title: uiText.styleSelectedToast, description: uiText.styleSelectedToastDescription(selectedAnimationStyle) });
                    setStep("generatingContent");
                  }} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!selectedAnimationStyle}
                >
                  <Mic className="mr-2 h-4 w-4" /> {uiText.startContentGenerationButton}
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        )}


        {step === "ready" && pdfSummary && storyboardSceneDescriptions.length > 0 && (
          <>
            <AnimatedSection sectionId="summary-section-title" delay="delay-100">
              <ScenarioDisplay data={{ summary: pdfSummary }} />
            </AnimatedSection>

            <Separator className="my-8" />

            <AnimatedSection sectionId="animation-preview-section-title" className="space-y-6" delay="delay-200">
              <AnimationPreview
                sceneDescriptions={storyboardSceneDescriptions}
                currentSceneDescription={storyboardSceneDescriptions[currentFrameIndex] || ""}
                currentKeyTopic={storyboardKeyTopics[currentFrameIndex] || ""}
                currentFrameSummary={storyboardFrameSummaries[currentFrameIndex] || ""}
                storyboardImages={storyboardImages}
                currentAudioUrl={storyboardAudioUrls[currentFrameIndex] || null}
                currentFrameIndex={currentFrameIndex}
                isGeneratingInitialContent={false}
                isPlaying={isPlaying}
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
                disabled={storyboardSceneDescriptions.length === 0}
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

            {pdfSummary && (
              <>
                <Separator className="my-8" />
                <AnimatedSection sectionId="pdf-chat-section" delay="delay-350">
                  <PdfChat pdfSummary={pdfSummary} chatWithPdfFlow={chatWithPdfAdapter} />
                </AnimatedSection>
              </>
            )}
            
            {pdfSummary && (
              <>
                <Separator className="my-8" />
                <AnimatedSection sectionId="pdf-diagram-section" delay="delay-375">
                  <PdfDiagramGenerator pdfSummary={pdfSummary} generatePdfDiagramFlow={generatePdfDiagram} />
                </AnimatedSection>
              </>
            )}


            <AnimatedSection tag="div" className="text-center mt-8" delay="delay-400">
                <Button onClick={resetState} variant="outline" className="text-primary border-primary hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_15px_hsl(var(--primary)/0.5)] transition-all">
                    <RotateCcw className="mr-2 h-4 w-4" /> {uiText.startNewPdfButton}
                </Button>
            </AnimatedSection>
          </>
        )}
      </main>
    </div>
  );
}
