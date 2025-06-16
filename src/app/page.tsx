
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { analyzePdf, AnalyzePdfInput, AnalyzePdfOutput } from '@/ai/flows/analyze-pdf';
import { generateAnimationScenario, GenerateAnimationScenarioInput, GenerateAnimationScenarioOutput } from '@/ai/flows/generate-animation-scenario';
import { generateFrameImage, GenerateFrameImageInput, GenerateFrameImageOutput } from '@/ai/flows/generate-frame-image-flow';
import { PdfUploadForm } from '@/components/custom/pdf-upload-form';
import { ScenarioDisplay } from '@/components/custom/scenario-display';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { PlaybackControls } from '@/components/custom/playback-controls';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, FileText, Clapperboard, RotateCcw, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

type AppStep = "upload" | "analyzing" | "generatingScenario" | "generatingImages" | "ready";

export default function AnimatePdfPage() {
  const [step, setStep] = useState<AppStep>("upload");
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSummary, setPdfSummary] = useState<string | null>(null);
  const [animationScenario, setAnimationScenario] = useState<string | null>(null);
  
  const [storyboardFrames, setStoryboardFrames] = useState<string[]>([]);
  const [storyboardImages, setStoryboardImages] = useState<(string | null)[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { toast } = useToast();
  const playerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetState = () => {
    setStep("upload");
    setPdfFile(null);
    setPdfSummary(null);
    setAnimationScenario(null);
    setStoryboardFrames([]);
    setStoryboardImages([]);
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
    setAnimationScenario(null);
    setStoryboardFrames([]);
    setStoryboardImages([]);
    setCurrentFrameIndex(0);

    try {
      const analysisInput: AnalyzePdfInput = { pdfDataUri: dataUri };
      const analysisResult: AnalyzePdfOutput = await analyzePdf(analysisInput);
      setPdfSummary(analysisResult.summary);
      toast({
        title: "PDF Analysis Complete",
        description: "Summary extracted. Generating animation scenario...",
      });
      setStep("generatingScenario");
    } catch (error) {
      console.error("PDF Analysis Error:", error);
      toast({
        title: "PDF Analysis Failed",
        description: (error as Error).message || "Could not analyze the PDF.",
        variant: "destructive",
      });
      setStep("upload");
    }
  };

  useEffect(() => {
    if (step === "generatingScenario" && pdfSummary) {
      const generateScenario = async () => {
        try {
          const scenarioInput: GenerateAnimationScenarioInput = { pdfSummary };
          const scenarioResult: GenerateAnimationScenarioOutput = await generateAnimationScenario(scenarioInput);
          setAnimationScenario(scenarioResult.animationScenario);
          
          const frames = scenarioResult.animationScenario
            .split(/\n\s*\n/) 
            .map(frame => frame.trim())
            .filter(frame => frame.length > 0);
          
          setStoryboardFrames(frames);
          setStoryboardImages(Array(frames.length).fill(null)); // Initialize with nulls
          setCurrentFrameIndex(0);
          toast({
            title: "Animation Scenario Generated",
            description: "Now generating images for each frame...",
          });
          setStep("generatingImages");
        } catch (error) {
          console.error("Scenario Generation Error:", error);
          toast({
            title: "Scenario Generation Failed",
            description: (error as Error).message || "Could not generate animation scenario.",
            variant: "destructive",
          });
          setStep("upload"); 
        }
      };
      generateScenario();
    }
  }, [step, pdfSummary, toast]);

  useEffect(() => {
    if (step === "generatingImages" && storyboardFrames.length > 0) {
      const generateAllImages = async () => {
        toast({
          title: "Generating Frame Images",
          description: `Creating visuals for ${storyboardFrames.length} frames. This may take some time...`,
        });

        const imageGenerationPromises = storyboardFrames.map(async (description, index) => {
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
            // Image will remain null, AnimationPreview will show placeholder
            toast({
                title: `Image Gen Error (Frame ${index + 1})`,
                description: (error as Error).message || "Could not generate image for this frame.",
                variant: "destructive",
            });
          }
        });

        await Promise.allSettled(imageGenerationPromises);
        
        toast({
          title: "Image Generation Complete!",
          description: "All frame images processed. Your animation is ready to preview.",
        });
        setStep("ready");
      };
      generateAllImages();
    }
  }, [step, storyboardFrames, toast]);


  const handlePlay = useCallback(() => {
    if (storyboardFrames.length > 0 && currentFrameIndex < storyboardFrames.length -1) {
      setIsPlaying(true);
    }
  }, [storyboardFrames, currentFrameIndex]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentFrameIndex((prev) => Math.min(prev + 1, storyboardFrames.length - 1));
    setIsPlaying(false);
  }, [storyboardFrames.length]);

  const handlePrev = useCallback(() => {
    setCurrentFrameIndex((prev) => Math.max(prev - 1, 0));
    setIsPlaying(false);
  }, []);
  
  const handleSeek = useCallback((frameIndex: number) => {
    setCurrentFrameIndex(Math.max(0, Math.min(frameIndex, storyboardFrames.length - 1)));
    setIsPlaying(false);
  }, [storyboardFrames.length]);

  const handleAnimationReset = useCallback(() => {
    setCurrentFrameIndex(0);
    setIsPlaying(false);
  }, []);


  useEffect(() => {
    if (isPlaying) {
      playerIntervalRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => {
          if (prev < storyboardFrames.length - 1) {
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
  }, [isPlaying, storyboardFrames.length]);


  const isLoading = step === "analyzing" || step === "generatingScenario" || step === "generatingImages";
  const isProcessing = step === "analyzing" || step === "generatingScenario" || step === "generatingImages";


  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 space-y-8 font-body">
      <header className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold font-headline text-primary">
          <Clapperboard className="inline-block h-12 w-12 mr-2 -mt-1" /> AnimatePDF
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Turn your PDFs into animated stories, effortlessly.
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
            {!["analyzing", "generatingScenario", "generatingImages"].includes(step) && <Loader2 className="h-5 w-5 animate-spin text-primary" /> }


            <AlertTitle className="font-headline">
              {step === "analyzing" && "Analyzing PDF..."}
              {step === "generatingScenario" && "Generating Scenario..."}
              {step === "generatingImages" && `Generating Images (${storyboardImages.filter(img => img !== null).length}/${storyboardFrames.length})...`}
            </AlertTitle>
            <AlertDescription>
              {step === "analyzing" && "Our AI is reading your PDF and extracting key themes. Please wait..."}
              {step === "generatingScenario" && "Crafting an engaging animation script based on the PDF summary. Hold tight!"}
              {step === "generatingImages" && "Our AI is now creating a unique image for each animation frame. This might take a few moments."}
            </AlertDescription>
          </Alert>
        )}

        {step === "ready" && animationScenario && (
          <>
            <section aria-labelledby="scenario-section-title">
              <ScenarioDisplay scenario={animationScenario} />
            </section>
            
            <Separator className="my-8" />

            <section aria-labelledby="animation-preview-section-title" className="space-y-6">
              <AnimationPreview 
                frames={storyboardFrames} 
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
                totalFrames={storyboardFrames.length}
                disabled={storyboardFrames.length === 0 || step === "generatingImages"}
              />
            </section>
            
            <div className="text-center mt-8">
                <Button onClick={resetState} variant="outline" className="text-primary border-primary hover:bg-primary/10">
                    <RotateCcw className="mr-2 h-4 w-4" /> Start Over with a New PDF
                </Button>
            </div>
          </>
        )}
      </main>

      <footer className="w-full max-w-4xl text-center py-8 mt-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AnimatePDF. Powered by Generative AI.
        </p>
      </footer>
    </div>
  );
}
