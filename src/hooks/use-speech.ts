import { useState, useCallback } from 'react';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, lang: string = 'tr-TR') => {
    // Web Speech API desteği kontrolü
    if (!('speechSynthesis' in window)) {
      console.warn('Bu tarayıcı Web Speech API desteklemiyor.');
      return;
    }

    // Mevcut konuşmayı durdur
    if (currentUtterance) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentUtterance(null);
    };

    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  }, [currentUtterance]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    }
  }, []);

  return {
    speak,
    stop,
    isPlaying
  };
}