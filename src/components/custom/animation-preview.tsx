"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertTriangle, Info, Volume2, VolumeX, Play, Pause, ArrowLeft, ArrowRight } from 'lucide-react';

interface AnimationPreviewProps {
  sceneDescriptions: string[];
  currentSceneDescription: string;
  currentKeyTopic: string;
  currentFrameSummary: string;
  storyboardImages: (string | null)[];
  currentAudioUrl: string | null;
  currentFrameIndex: number;
  isGeneratingInitialContent: boolean;
  isPlaying: boolean;
}

export const AnimationPreview = React.memo<AnimationPreviewProps>(({
  sceneDescriptions,
  currentSceneDescription,
  currentKeyTopic,
  currentFrameSummary,
  storyboardImages,
  currentAudioUrl,
  currentFrameIndex,
  isGeneratingInitialContent,
  isPlaying: isGlobalPlaying,
}) => {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Klavye navigasyonu için useEffect
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && currentFrameIndex > 0) {
        // Önceki kare için parent component'e event gönder
        const prevEvent = new CustomEvent('prevFrame');
        window.dispatchEvent(prevEvent);
      } else if (event.key === 'ArrowRight' && currentFrameIndex < sceneDescriptions.length - 1) {
        // Sonraki kare için parent component'e event gönder
        const nextEvent = new CustomEvent('nextFrame');
        window.dispatchEvent(nextEvent);
      } else if (event.key === ' ') {
        event.preventDefault();
        // Play/pause için parent component'e event gönder
        const playPauseEvent = new CustomEvent('playPause');
        window.dispatchEvent(playPauseEvent);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentFrameIndex, sceneDescriptions.length]);

  // Audio mute kontrolü
  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Audio error handler
  const handleAudioError = useCallback(() => {
    setAudioError(true);
    console.warn("Audio could not be loaded for frame:", currentFrameIndex);
  }, [currentFrameIndex]);

  // Audio load handler
  const handleAudioLoad = useCallback(() => {
    setAudioError(false);
  }, []);

  // Mute effect
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.muted = isMuted;
    }

    if (isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [isMuted]);

  // Audio playback control
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const playAudio = async () => {
      try {
        if (currentAudioUrl && currentAudioUrl !== audioElement.src) {
          audioElement.src = currentAudioUrl;
          audioElement.load(); 
        }
        
        if (isGlobalPlaying && currentAudioUrl && !audioError) {
          await audioElement.play();
        } else {
          audioElement.pause();
        }
      } catch (error) {
        console.error("Error managing audio playback:", error);
        setAudioError(true);
      }
    };

    playAudio();
  }, [currentAudioUrl, isGlobalPlaying, currentFrameIndex, audioError]);

  // Dialog handlers
  const openDetailDialog = useCallback(() => {
    setIsDetailDialogOpen(true);
  }, []);

  const closeDetailDialog = useCallback(() => {
    setIsDetailDialogOpen(false);
  }, []);

  if (sceneDescriptions.length === 0 || currentFrameIndex < 0 || currentFrameIndex >= sceneDescriptions.length) {
    return (
      <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">🎬 Animasyon Önizleme</CardTitle>
          <CardDescription>Eğitim animasyonu burada görüntülenecek</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground text-center">
              Animasyon henüz hazır değil.<br />
              <span className="text-sm">PDF yükleyip analiz ettikten sonra animasyon burada görünecek.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentImageUrl = storyboardImages[currentFrameIndex];
  const isLoadingThisFrameImage = isGeneratingInitialContent && !currentImageUrl;
  const isLoadingThisFrameAudio = isGeneratingInitialContent && !currentAudioUrl;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/80">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <div>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            🎬 Animasyon Önizleme
            <Badge variant="outline" className="text-xs font-mono">
              {currentFrameIndex + 1} / {sceneDescriptions.length}
            </Badge>
          </CardTitle>
          <CardDescription className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {currentKeyTopic || 'Bu kare için açıklama mevcut değil.'}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleMuteToggle}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Ana Animasyon Ekranı */}
        <div 
          className="relative w-full bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl overflow-hidden flex items-center justify-center border-2 border-primary/10 group transition-all duration-300 hover:border-primary/20"
          style={{ aspectRatio: '16/9', minHeight: '300px' }}
        >
          {isLoadingThisFrameImage ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground space-y-3">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <div className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"></div>
              </div>
              <p className="text-lg font-medium">Görsel oluşturuluyor...</p>
              <div className="text-sm text-muted-foreground/70">
                Kare {currentFrameIndex + 1} için AI görsel üretiyor
              </div>
            </div>
          ) : currentImageUrl ? (
            <>
              <Image
                src={currentImageUrl}
                alt={`Animasyon karesi ${currentFrameIndex + 1}: ${currentKeyTopic}`}
                width={800}
                height={450}
                className="object-contain transition-all duration-500 group-hover:scale-105"
                data-ai-hint="generated animation frame"
                priority={currentFrameIndex < 3}
                unoptimized={currentImageUrl.startsWith('data:image')}
                loading={currentFrameIndex < 3 ? "eager" : "lazy"}
              />
              
              {/* Overlay kontroller */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                  Kare {currentFrameIndex + 1}
                </Badge>
                <div className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded backdrop-blur-sm max-w-xs truncate">
                  {currentFrameSummary}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-6 space-y-4">
              <AlertTriangle className="h-16 w-16 text-destructive/60" />
              <div className="text-center">
                <p className="text-lg font-medium">Bu kare için görsel mevcut değil</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Görsel oluşturma işlemi başarısız olmuş olabilir</p>
              </div>
              <Image
                src="https://placehold.co/600x338.png"
                alt={`Animasyon karesi ${currentFrameIndex + 1} için yer tutucu`}
                width={600}
                height={338}
                className="object-contain opacity-30 rounded-lg"
                data-ai-hint="abstract scene"
                priority={false}
                loading="lazy"
              />
            </div>
          )}
          
          {/* Audio element */}
          <audio 
            ref={audioRef} 
            className="hidden"
            onError={handleAudioError}
            onLoadStart={handleAudioLoad}
            preload="metadata"
          />
        </div>

        {/* Audio Loading Indicator */}
        {isLoadingThisFrameAudio && (
          <div className="flex items-center justify-center text-sm text-muted-foreground bg-muted/20 rounded-lg py-3">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
            Seslendirme hazırlanıyor...
          </div>
        )}

        {/* Kare Bilgileri */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogTrigger asChild>
            <div
              className="w-full rounded-lg border-2 border-dashed border-primary/20 p-4 bg-primary/5 cursor-pointer hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 relative group"
              onClick={openDetailDialog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openDetailDialog();
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    📝 Kare Açıklaması
                    <Badge variant="outline" className="text-xs">
                      Tıklayın
                    </Badge>
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {currentFrameSummary || 'Bu kare için açıklama mevcut değil.'}
                  </p>
                </div>
                <Info className="h-5 w-5 text-primary/60 group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
              </div>
              
              {/* Hover efekti */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                🎯 Kare {currentFrameIndex + 1} - Detaylar
                <Badge variant="outline">{currentFrameSummary}</Badge>
              </DialogTitle>
              <DialogDescription>
                Animasyon karesi hakkında ayrıntılı bilgiler
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-96 pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-primary">📋 Eğitici Açıklama</h4>
                  <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-md">
                    {currentKeyTopic || 'Bu kare için açıklama mevcut değil.'}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-primary">🎨 Sahne Açıklaması</h4>
                  <p className="text-sm leading-relaxed bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                    {currentSceneDescription || 'Bu kare için sahne açıklaması mevcut değil.'}
                  </p>
                </div>
                
                <div className="text-xs text-muted-foreground bg-muted/20 p-2 rounded border-l-4 border-primary/30">
                  💡 <strong>İpucu:</strong> Ok tuşları (← →) ile kareler arasında geçiş yapabilir, 
                  boşluk tuşu ile animasyonu oynatabilir/durdurabilirsiniz.
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        
        {/* Klavye Kısayolları Bilgisi */}
        <div className="text-xs text-muted-foreground text-center bg-muted/10 py-2 px-4 rounded-lg border border-muted/20">
          <span className="font-medium">Klavye: </span>
          <kbd className="px-1 py-0.5 bg-muted text-muted-foreground rounded text-xs">←</kbd> Önceki
          <span className="mx-1">•</span>
          <kbd className="px-1 py-0.5 bg-muted text-muted-foreground rounded text-xs">→</kbd> Sonraki
          <span className="mx-1">•</span>
          <kbd className="px-1 py-0.5 bg-muted text-muted-foreground rounded text-xs">Space</kbd> Oynat/Durdur
        </div>
      </CardContent>
    </Card>
  );
});

AnimationPreview.displayName = 'AnimationPreview';
