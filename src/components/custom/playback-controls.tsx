"use client";

import React, { useCallback } from "react";
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

export const PlaybackControls = React.memo<PlaybackControlsProps>(({
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
}) => {

  const handleSliderChange = useCallback((value: number[]) => {
    onSeek(value[0]);
  }, [onSeek]);

  const handlePlayToggle = useCallback(() => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  }, [isPlaying, onPlay, onPause]);

  const isAtStart = currentFrameIndex === 0;
  const isAtEnd = currentFrameIndex === totalFrames - 1;
  const hasFrames = totalFrames > 0;

  return (
    <div className="w-full p-4 bg-card border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 space-y-4">
      {/* Ana kontroller */}
      <div className="flex items-center justify-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onReset} 
          disabled={disabled || isAtStart} 
          aria-label="Animasyonu sıfırla"
          className="hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onPrev} 
          disabled={disabled || isAtStart} 
          aria-label="Önceki kare"
          className="hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayToggle}
          disabled={disabled || (!hasFrames)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground hover:shadow-[0_0_15px_hsl(var(--accent)/0.7)] transition-all duration-300 disabled:opacity-50"
          aria-label={isPlaying ? "Animasyonu duraklat" : "Animasyonu oynat"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onNext} 
          disabled={disabled || isAtEnd} 
          aria-label="Sonraki kare"
          className="hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* Progress slider */}
      {hasFrames && (
        <div className="flex items-center space-x-3">
          <span className="text-xs text-muted-foreground w-12 text-center font-mono">
            {currentFrameIndex + 1} / {totalFrames}
          </span>
          <Slider
            value={[currentFrameIndex]}
            max={totalFrames - 1}
            step={1}
            onValueChange={handleSliderChange}
            disabled={disabled}
            aria-label="Animasyon ilerlemesi"
            className="flex-grow"
          />
          <div className="w-12" /> {/* Spacing balance */}
        </div>
      )}

      {/* Status indicator */}
      {hasFrames && (
        <div className="flex justify-center">
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalFrames, 10) }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === currentFrameIndex
                    ? 'bg-primary scale-125'
                    : i < currentFrameIndex
                    ? 'bg-primary/50'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
            {totalFrames > 10 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{totalFrames - 10} kare
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

PlaybackControls.displayName = 'PlaybackControls';
