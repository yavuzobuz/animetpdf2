
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnimationPreviewProps {
  frames: string[];
  currentFrameIndex: number;
}

export function AnimationPreview({ frames, currentFrameIndex }: AnimationPreviewProps) {
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

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Animation Preview</CardTitle>
        <CardDescription>Frame {currentFrameIndex + 1} of {frames.length}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center border">
          <Image
            src={`https://placehold.co/600x338.png`} // Aspect ratio 16:9
            alt={`Animation frame ${currentFrameIndex + 1}`}
            width={600}
            height={338}
            className="object-contain"
            data-ai-hint="animation scene"
            priority={true} // Prioritize current frame image
          />
        </div>
        <ScrollArea className="h-32 w-full rounded-md border p-3 bg-muted/20">
          <p className="text-sm font-body whitespace-pre-wrap">{currentFrameContent}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
