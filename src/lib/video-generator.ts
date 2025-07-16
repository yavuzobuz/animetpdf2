/**
 * Video Generator Utility
 * Görselleri ve seslendirmeleri birleştirerek video oluşturur
 */

export interface VideoFrame {
  imageUrl?: string;
  svgContent?: string;
  audioUrl?: string;
  text: string;
  duration: number; // saniye cinsinden
}

export interface VideoGenerationOptions {
  frames: VideoFrame[];
  width?: number;
  height?: number;
  fps?: number;
  format?: 'webm' | 'mp4';
}

export class VideoGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  constructor(width = 800, height = 600) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
  }

  async generateVideo(options: VideoGenerationOptions): Promise<Blob> {
    const { frames, fps = 30 } = options;
    this.recordedChunks = [];

    // Canvas'ı video stream'e çevir
    const stream = this.canvas.captureStream(fps);
    
    // Audio context oluştur
    const audioContext = new AudioContext();
    const audioDestination = audioContext.createMediaStreamDestination();
    
    // Audio stream'i video stream'e ekle
    const audioTrack = audioDestination.stream.getAudioTracks()[0];
    if (audioTrack) {
      stream.addTrack(audioTrack);
    }

    // MediaRecorder oluştur
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9,opus'
    });

    return new Promise(async (resolve, reject) => {
      this.mediaRecorder!.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder!.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        resolve(blob);
      };

      this.mediaRecorder!.onerror = (event) => {
        reject(new Error('Video recording failed'));
      };

      // Kayıt başlat
      this.mediaRecorder!.start();

      try {
        // Her frame'i işle
        for (let i = 0; i < frames.length; i++) {
          const frame = frames[i];
          await this.renderFrame(frame, audioContext, audioDestination);
          
          // Frame süresince bekle
          await this.wait(frame.duration * 1000);
        }

        // Kayıt durdur
        this.mediaRecorder!.stop();
        audioContext.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  private async renderFrame(
    frame: VideoFrame, 
    audioContext: AudioContext, 
    audioDestination: MediaStreamAudioDestinationNode
  ): Promise<void> {
    // Canvas'ı temizle
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Görsel render et
    if (frame.svgContent) {
      await this.renderSVG(frame.svgContent);
    } else if (frame.imageUrl) {
      await this.renderImage(frame.imageUrl);
    }

    // Metin ekle
    this.renderText(frame.text);

    // Audio çal
    if (frame.audioUrl) {
      await this.playAudio(frame.audioUrl, audioContext, audioDestination);
    }
  }

  private async renderSVG(svgContent: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // SVG'yi canvas'a çiz (ortalanmış)
        const scale = Math.min(
          (this.canvas.width * 0.8) / img.width,
          (this.canvas.height * 0.7) / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (this.canvas.width - scaledWidth) / 2;
        const y = (this.canvas.height - scaledHeight) / 2 - 50; // Metin için yer bırak

        this.ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        URL.revokeObjectURL(url);
        resolve();
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('SVG loading failed'));
      };

      img.src = url;
    });
  }

  private async renderImage(imageUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Resmi canvas'a çiz (ortalanmış)
        const scale = Math.min(
          (this.canvas.width * 0.8) / img.width,
          (this.canvas.height * 0.7) / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (this.canvas.width - scaledWidth) / 2;
        const y = (this.canvas.height - scaledHeight) / 2 - 50; // Metin için yer bırak

        this.ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        resolve();
      };

      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };

      img.src = imageUrl;
    });
  }

  private renderText(text: string): void {
    const maxWidth = this.canvas.width - 40;
    const lineHeight = 30;
    const startY = this.canvas.height - 120;

    this.ctx.fillStyle = '#333333';
    this.ctx.font = 'bold 20px Arial, sans-serif';
    this.ctx.textAlign = 'center';

    // Metni satırlara böl
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = this.ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }

    // Satırları çiz
    lines.forEach((line, index) => {
      this.ctx.fillText(
        line,
        this.canvas.width / 2,
        startY + (index * lineHeight)
      );
    });
  }

  private async playAudio(
    audioUrl: string, 
    audioContext: AudioContext, 
    destination: MediaStreamAudioDestinationNode
  ): Promise<void> {
    try {
      // Audio data'yı fetch et
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Audio source oluştur ve çal
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(destination);
      source.start();
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  // Basitleştirilmiş createVideo metodu - slides formatını destekler
  async createVideo(slides: Array<{ text: string; imageUrl: string; duration: number }>): Promise<Blob> {
    const frames: VideoFrame[] = slides.map(slide => ({
      text: slide.text,
      imageUrl: slide.imageUrl,
      duration: slide.duration / 1000, // milisaniyeden saniyeye çevir
    }));

    return this.generateVideo({ frames });
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Utility fonksiyon: Video blob'unu download et
export function downloadVideo(blob: Blob, filename = 'animation-video.webm'): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Utility fonksiyon: Text-to-Speech ile audio oluştur
export async function generateAudioFromText(text: string, lang = 'tr-TR'): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Web Speech API ile ses oluştur ve data URL'e çevir
    // Not: Bu basit bir implementasyon, gerçek projede server-side TTS kullanılmalı
    const mediaRecorder = new MediaRecorder(new MediaStream());
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };

    utterance.onstart = () => {
      mediaRecorder.start();
    };

    utterance.onend = () => {
      mediaRecorder.stop();
    };

    utterance.onerror = () => {
      reject(new Error('Speech synthesis failed'));
    };

    window.speechSynthesis.speak(utterance);
  });
}