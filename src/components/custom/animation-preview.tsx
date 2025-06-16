
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AnimationPreviewProps {
  sceneDescriptions: string[]; // text descriptions for alt text and frame count
  currentKeyTopic: string; // Key topic for the current frame
  storyboardImages: (string | null)[]; // data URIs for images
  currentFrameIndex: number;
  isGeneratingInitialImages: boolean; // True during the bulk "generatingImages" step
}

export function AnimationPreview({ 
  sceneDescriptions, 
  currentKeyTopic,
  storyboardImages, 
  currentFrameIndex,
  isGeneratingInitialImages 
}: AnimationPreviewProps) {

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

  const currentSceneDescription = sceneDescriptions[currentFrameIndex];
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
              alt={`Animasyon karesi ${currentFrameIndex + 1}: ${currentSceneDescription.substring(0, 100)}...`}
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
        <ScrollArea className="h-24 w-full rounded-md border p-3 bg-muted/20">
          <p className="text-sm font-body whitespace-pre-wrap font-semibold text-primary">{currentKeyTopic || "Anahtar konu yükleniyor..."}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

