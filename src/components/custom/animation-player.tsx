"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AnimationPlayerProps {
  project: {
    id: string;
    title: string;
    animation_scenario: any[];
    animation_settings?: any;
  };
  language: 'tr' | 'en';
}

export default function AnimationPlayer({ project, language }: AnimationPlayerProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const frames = project.animation_scenario || [];
  const totalFrames = frames.length;

  const uiText = {
    tr: {
      title: 'Animasyon Oynatıcı',
      play: 'Oynat',
      pause: 'Duraklat',
      previous: 'Önceki',
      next: 'Sonraki',
      frame: 'Çerçeve',
      of: '/',
      noFrames: 'Animasyon çerçevesi bulunamadı'
    },
    en: {
      title: 'Animation Player',
      play: 'Play',
      pause: 'Pause',
      previous: 'Previous',
      next: 'Next',
      frame: 'Frame',
      of: '/',
      noFrames: 'No animation frames found'
    }
  };

  const text = uiText[language] || uiText.tr;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentFrame < totalFrames - 1) {
      interval = setInterval(() => {
        setCurrentFrame(prev => {
          const next = prev + 1;
          if (next >= totalFrames) {
            setIsPlaying(false);
            return totalFrames - 1;
          }
          return next;
        });
      }, 3000); // 3 saniye per frame
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentFrame, totalFrames]);

  useEffect(() => {
    setProgress(totalFrames > 0 ? ((currentFrame + 1) / totalFrames) * 100 : 0);
  }, [currentFrame, totalFrames]);

  const handlePlay = () => {
    if (currentFrame >= totalFrames - 1) {
      setCurrentFrame(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentFrame(prev => Math.max(0, prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentFrame(prev => Math.min(totalFrames - 1, prev + 1));
    setIsPlaying(false);
  };

  if (totalFrames === 0) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <p className="text-gray-500">{text.noFrames}</p>
        </CardContent>
      </Card>
    );
  }

  const currentFrameData = frames[currentFrame];

  return (
    <div className="space-y-6">
      {/* Ana Oynatıcı */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{text.title}</span>
            <span className="text-sm font-normal text-gray-500">
              {text.frame} {currentFrame + 1} {text.of} {totalFrames}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* İçerik Alanı */}
          <div className="bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
            {currentFrameData ? (
              <div className="text-center space-y-4">
                {currentFrameData.image_url && (
                  <img 
                    src={currentFrameData.image_url} 
                    alt={`Frame ${currentFrame + 1}`}
                    className="max-w-full max-h-80 mx-auto rounded-lg shadow-lg"
                  />
                )}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {currentFrameData.title || `${text.frame} ${currentFrame + 1}`}
                  </h3>
                  <p className="text-gray-700 max-w-2xl mx-auto">
                    {currentFrameData.description || currentFrameData.frame_description || 'Açıklama mevcut değil'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Play className="w-12 h-12 text-gray-500" />
                </div>
                <p className="text-gray-500">{text.frame} {currentFrame + 1}</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Kontroller */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentFrame === 0}
            >
              <SkipBack className="w-4 h-4" />
              {text.previous}
            </Button>

            <Button
              onClick={handlePlay}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {text.pause}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {text.play}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentFrame === totalFrames - 1}
            >
              {text.next}
              <SkipForward className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Frame Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Animasyon Çerçeveleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {frames.map((frame, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFrame(index);
                  setIsPlaying(false);
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  index === currentFrame
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {text.frame} {index + 1}
                </div>
                <div className="text-xs text-gray-500 line-clamp-2">
                  {frame.title || frame.description || frame.frame_description || 'Çerçeve'}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}