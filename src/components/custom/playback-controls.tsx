
"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (frameIndex: number) => void;
  onReset: () => void;
  currentFrameIndex: number;
  totalFrames: number;
  disabled: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
  onReset,
  currentFrameIndex,
  totalFrames,
  disabled,
}: PlaybackControlsProps) {

  const handleSliderChange = (value: number[]) => {
    onSeek(value[0]);
  };

  return (
    <div className="w-full p-4 bg-card border rounded-lg shadow-md space-y-4 hover:ring-1 hover:ring-primary/30 transition-all">
      <div className="flex items-center justify-center space-x-3">
        <Button variant="ghost" size="icon" onClick={onReset} disabled={disabled} aria-label="Reset animation" className="hover:text-primary hover:bg-primary/10">
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onPrev} disabled={disabled || currentFrameIndex === 0} aria-label="Previous frame" className="hover:text-primary hover:bg-primary/10">
          <SkipBack className="h-5 w-5" />
        </Button>
        {isPlaying ? (
          <Button variant="outline" size="icon" onClick={onPause} disabled={disabled} className="bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-[0_0_15px_hsl(var(--accent)/0.7)] transition-shadow" aria-label="Pause animation">
            <Pause className="h-6 w-6" />
          </Button>
        ) : (
          <Button variant="outline" size="icon" onClick={onPlay} disabled={disabled || currentFrameIndex === totalFrames -1 && totalFrames > 0} className="bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-[0_0_15px_hsl(var(--accent)/0.7)] transition-shadow" aria-label="Play animation">
            <Play className="h-6 w-6" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={onNext} disabled={disabled || currentFrameIndex === totalFrames - 1} aria-label="Next frame" className="hover:text-primary hover:bg-primary/10">
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
      {totalFrames > 0 && (
         <div className="flex items-center space-x-3">
            <span className="text-xs text-muted-foreground w-12 text-center">{currentFrameIndex + 1} / {totalFrames}</span>
            <Slider
                value={[currentFrameIndex]}
                max={totalFrames - 1}
                step={1}
                onValueChange={handleSliderChange}
                disabled={disabled}
                aria-label="Animation progress"
                className="flex-grow"
            />
        </div>
      )}
    </div>
  );
}
