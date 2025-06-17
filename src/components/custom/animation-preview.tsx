
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Info, Volume2, VolumeX } from 'lucide-react';

interface AnimationPreviewProps {
  sceneDescriptions: string[];
  currentSceneDescription: string;
  currentKeyTopic: string;
  currentFrameSummary: string;
  storyboardImages: (string | null)[];
  currentAudioUrl: string | null;
  currentFrameIndex: number;
  isGeneratingInitialContent: boolean;
  isPlaying: boolean; // To sync audio with external play/pause state
}

export function AnimationPreview({
  sceneDescriptions,
  currentSceneDescription,
  currentKeyTopic,
  currentFrameSummary,
  storyboardImages,
  currentAudioUrl,
  currentFrameIndex,
  isGeneratingInitialContent,
  isPlaying: isGlobalPlaying,
}: AnimationPreviewProps) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Local mute state for the preview

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (currentAudioUrl) {
        if (audioElement.src !== currentAudioUrl) {
          audioElement.src = currentAudioUrl;
          audioElement.load(); 
        }
        if (isGlobalPlaying) {
          audioElement.play().catch(e => console.error("Error playing audio in preview:", e));
        } else {
          audioElement.pause();
        }
      } else {
        audioElement.pause();
        audioElement.src = ""; // Clear src if no audio for this frame
      }
    }
  }, [currentAudioUrl, isGlobalPlaying, currentFrameIndex]);


  if (sceneDescriptions.length === 0 || currentFrameIndex < 0 || currentFrameIndex >= sceneDescriptions.length) {
    return (
        <Card className="w-full shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Animasyon Önizleme</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Senaryo henüz oluşturulmadı veya kare mevcut değil.</p>
            </CardContent>
        </Card>
    );
  }

  const currentImageUrl = storyboardImages[currentFrameIndex];
  const isLoadingThisFrameImage = isGeneratingInitialContent && !currentImageUrl;
  const isLoadingThisFrameAudio = isGeneratingInitialContent && !currentAudioUrl;


  return (
    <Card className="w-full shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
            <CardTitle className="text-2xl font-headline">Animasyon Önizleme</CardTitle>
            <CardDescription>Kare {currentFrameIndex + 1} / {sceneDescriptions.length}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="text-muted-foreground hover:text-primary">
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            <span className="sr-only">{isMuted ? "Sesi Aç" : "Sesi Kapat"}</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center border relative">
          {isLoadingThisFrameImage ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
              <p>Görsel oluşturuluyor...</p>
            </div>
          ) : currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt={`Animasyon karesi ${currentFrameIndex + 1}: ${currentKeyTopic}`}
              width={600}
              height={338}
              className="object-contain"
              data-ai-hint="generated animation frame"
              priority={true}
              unoptimized={currentImageUrl.startsWith('data:image')}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
               <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
               <p className="text-center">Bu kare için görsel mevcut değil.</p>
                 <Image
                    src={`https://placehold.co/600x338.png`}
                    alt={`Animasyon karesi ${currentFrameIndex + 1} için yer tutucu`}
                    width={600}
                    height={338}
                    className="object-contain opacity-50 mt-2"
                    data-ai-hint="abstract scene"
                    priority={true}
                  />
            </div>
          )}
           <audio ref={audioRef} className="hidden" />
        </div>

        {isLoadingThisFrameAudio && (
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seslendirme yükleniyor...
          </div>
        )}

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogTrigger asChild>
            <div
              className="w-full rounded-md border p-3 bg-muted/20 cursor-pointer hover:bg-muted/40 hover:ring-1 hover:ring-primary/50 transition-all relative"
              onClick={() => setIsDetailDialogOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsDetailDialogOpen(true);}}
              aria-label="Daha fazla detay için tıklayın"
            >
              <h4 className="text-md font-headline font-semibold text-primary mb-1">{currentKeyTopic || "Anahtar konu yükleniyor..."}</h4>
              <ScrollArea className="h-16">
                <p className="text-sm font-body whitespace-pre-wrap text-foreground/80">{currentFrameSummary || "Açıklama yükleniyor..."}</p>
              </ScrollArea>
              <div className="absolute bottom-1 right-1 opacity-60">
                 <Info size={16} /> <span className="sr-only">Detayları gör (tam sahne açıklaması)</span>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Tam Sahne Açıklaması (Kare {currentFrameIndex + 1})</DialogTitle>
              <DialogDescription>
                Bu kare için yapay zeka tarafından oluşturulan detaylı sahne açıklaması.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] mt-4 pr-3">
              <p className="text-sm whitespace-pre-wrap">{currentSceneDescription}</p>
            </ScrollArea>
            <Button onClick={() => setIsDetailDialogOpen(false)} variant="outline" className="mt-4 hover:border-primary hover:text-primary">Kapat</Button>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}
