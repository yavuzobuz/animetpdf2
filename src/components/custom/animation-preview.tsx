
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AnimationPreviewProps {
  frames: string[]; // text descriptions
  storyboardImages: (string | null)[]; // data URIs for images
  currentFrameIndex: number;
  isGeneratingInitialImages: boolean; // True during the bulk "generatingImages" step
}

export function AnimationPreview({ 
  frames, 
  storyboardImages, 
  currentFrameIndex,
  isGeneratingInitialImages 
}: AnimationPreviewProps) {

  if (frames.length === 0 || currentFrameIndex < 0 || currentFrameIndex >= frames.length) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Animation Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Scenario not yet generated or no frames available.</p>
            </CardContent>
        </Card>
    );
  }

  const currentFrameContent = frames[currentFrameIndex];
  const currentImageUrl = storyboardImages[currentFrameIndex];
  const isLoadingThisFrameImage = isGeneratingInitialImages && !currentImageUrl;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Animation Preview</CardTitle>
        <CardDescription>Frame {currentFrameIndex + 1} of {frames.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center border relative">
          {isLoadingThisFrameImage ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-2" />
              <p>Generating image...</p>
            </div>
          ) : currentImageUrl ? (
            <Image
              src={currentImageUrl}
              alt={`Animation frame ${currentFrameIndex + 1}: ${currentFrameContent.substring(0, 100)}...`}
              width={600}
              height={338}
              className="object-contain"
              data-ai-hint="generated animation frame"
              priority={true} // Prioritize current frame image
              unoptimized={currentImageUrl.startsWith('data:image')} // Important for data URIs
            />
          ) : (
            // Fallback for when image is not available after loading or due to error
            <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
               <AlertTriangle className="h-12 w-12 text-destructive mb-2" />
               <p className="text-center">Image not available for this frame. Using placeholder.</p>
                 <Image
                    src={`https://placehold.co/600x338.png`} 
                    alt={`Placeholder for animation frame ${currentFrameIndex + 1}`}
                    width={600}
                    height={338}
                    className="object-contain opacity-50 mt-2"
                    data-ai-hint="abstract scene"
                    priority={true} 
                  />
            </div>
          )}
        </div>
        <ScrollArea className="h-32 w-full rounded-md border p-3 bg-muted/20">
          <p className="text-sm font-body whitespace-pre-wrap">{currentFrameContent}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
