
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Info } from 'lucide-react';

interface AnimationPreviewProps {
  sceneDescriptions: string[]; 
  currentSceneDescription: string; // Full description for the current frame, for the dialog
  currentKeyTopic: string; 
  storyboardImages: (string | null)[]; 
  currentFrameIndex: number;
  isGeneratingInitialImages: boolean;
}

export function AnimationPreview({ 
  sceneDescriptions, 
  currentSceneDescription,
  currentKeyTopic,
  storyboardImages, 
  currentFrameIndex,
  isGeneratingInitialImages 
}: AnimationPreviewProps) {
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  if (sceneDescriptions.length === 0 || currentFrameIndex < 0 || currentFrameIndex >= sceneDescriptions.length) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Animasyon Önizleme</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Senaryo henüz oluşturulmadı veya kare mevcut değil.</p>
            </CardContent>
        </Card>
    );
  }

  // const currentSceneDescriptionForDialog = sceneDescriptions[currentFrameIndex]; // Already passed as prop
  const currentImageUrl = storyboardImages[currentFrameIndex];
  const isLoadingThisFrameImage = isGeneratingInitialImages && !currentImageUrl;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Animasyon Önizleme</CardTitle>
        <CardDescription>Kare {currentFrameIndex + 1} / {sceneDescriptions.length}</CardDescription>
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
              alt={`Animasyon karesi ${currentFrameIndex + 1}: ${sceneDescriptions[currentFrameIndex]?.substring(0, 100)}...`}
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
               <p className="text-center">Bu kare için görsel mevcut değil. Yer tutucu kullanılıyor.</p>
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
        </div>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="link" className="p-0 h-auto text-left w-full block hover:no-underline focus:outline-none">
              <ScrollArea 
                className="h-24 w-full rounded-md border p-3 bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => setIsDetailDialogOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsDetailDialogOpen(true);}}
                aria-label="Daha fazla detay için tıklayın"
              >
                <p className="text-sm font-body whitespace-pre-wrap font-semibold text-primary">{currentKeyTopic || "Anahtar konu yükleniyor..."}</p>
                <div className="absolute bottom-1 right-1 opacity-60">
                   <Info size={16} /> <span className="sr-only">Detayları gör</span>
                </div>
              </ScrollArea>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Sahne Detayı (Kare {currentFrameIndex + 1})</DialogTitle>
              <DialogDescription>
                Bu kare için oluşturulan tam sahne açıklaması.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] mt-4 pr-3">
              <p className="text-sm whitespace-pre-wrap">{currentSceneDescription}</p>
            </ScrollArea>
            <Button onClick={() => setIsDetailDialogOpen(false)} variant="outline" className="mt-4">Kapat</Button>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}
