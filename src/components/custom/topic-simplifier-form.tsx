"use client";

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Wand2, FileText, Network, Film, Image as ImageIcon, Upload, File, HelpCircle, MessageSquare, AlertTriangle, GaugeCircle, Play, PlayIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createBrowserClient } from '@/lib/supabase';
import { getUserStats } from '@/lib/database';
import { useAuth } from '@/contexts/auth-context';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { QaDisplay, QAPair } from '@/components/custom/qa-display';
import AnimatedSection from '@/components/custom/animated-section';
import { PdfChat } from '@/components/custom/pdf-chat';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Dinamik form schema - PDF analizi varsa validation daha esnek
const createFormSchema = (hasPdfAnalysis: boolean) => z.object({
  topic: z
    .string()
    .min(hasPdfAnalysis ? 0 : 10, {
      message: hasPdfAnalysis ? '' : 'Lütfen daha ayrıntılı bir konu girin (en az 10 karakter).',
    })
    .max(200, {
      message: 'Konu 200 karakterden uzun olmamalı.',
    }),
});

// Standart form schema - TypeScript için
const formSchema = z.object({
  topic: z
    .string()
    .max(200, {
      message: 'Konu 200 karakterden uzun olmamalı.',
    }),
});

type Visual = {
  description: string;
  svg?: string;
  image?: string;
  keyTopic?: string;
  frameSummary?: string;
};

type AnimationScript = {
  title: string;
  summary: string;
  frames: {
    sceneDescription: string;
    keyTopic: string;
    frameSummary: string;
  }[];
};

// Bilimsel yükleme animasyonu komponenti
const ScientificLoadingAnimation = ({ message = "Oluşturuluyor..." }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        {/* Modern dönen halka */}
        <svg className="animate-spin-slow" width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="#a5b4fc" strokeWidth="6" opacity="0.2" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="#6366f1" strokeWidth="6" strokeDasharray="44 100" />
        </svg>
        {/* Merkez nokta */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
        </div>
        </div>
      <p className="text-base text-gray-700 font-medium mt-2">{message}</p>
    </div>
  );
};

// Diyagram yükleme animasyonu
const DiagramLoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-20 h-20">
        {/* Şema ağ yapısı */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i} 
              className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        
        {/* Bağlantı çizgileri efekti */}
        <div className="absolute inset-0 border-2 border-dashed border-orange-300 rounded-lg animate-ping"></div>
      </div>
      
      <div className="flex space-x-2">
        <div className="animate-bounce" style={{ animationDelay: '0s' }}>📊</div>
        <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>📋</div>
        <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>🗂️</div>
      </div>
      
      <p className="text-sm text-muted-foreground animate-pulse font-medium">Diyagram şeması oluşturuluyor...</p>
    </div>
  );
};

// Yardımcı fonksiyon: "Metinde ... denilmektedir" tarzı ifadeleri temizler
const sanitizeKeyTopic = (text?: string): string => {
  if (!text) return text ?? '';
  return text
    .replace(/^[\s\u200B]*(Bu\s+metinde|Metinde|Metne\s+göre)[\s,:-]*/i, '')
    .replace(/[\s,:-]*(denilmektedir|denmektedir)\.?$/i, '')
    .trim();
};

export function TopicSimplifierForm() {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<AnimationScript | null>(null);
  const [visuals, setVisuals] = useState<Visual[]>([]);
  const [visualsLoading, setVisualsLoading] = useState(false);
  const { toast } = useToast();

  // PDF limit kontrolü için state'ler
  const [userPdfLimit, setUserPdfLimit] = useState<{ monthly_pdf_count: number; monthly_limit: number } | null>(null);
  const [limitExceeded, setLimitExceeded] = useState(false);

  const [diagramLoading, setDiagramLoading] = useState(false);
  const [diagramResult, setDiagramResult] = useState<{ svg: string } | null>(null);
  const [submittedTopic, setSubmittedTopic] = useState<string>('');

  const [imageLoading, setImageLoading] = useState(false);
  const [imageResults, setImageResults] = useState<{ images: string[] } | null>(null);
  const [imageStyle, setImageStyle] = useState('Fotogerçekçi');
  const [animationPageId, setAnimationPageId] = useState<string | null>(null);
  const imageStyles = ['Fotogerçekçi', 'Dijital Sanat', 'Sulu Boya', 'Çizgi Roman', 'Düşük Poli', '3D Render'];

  // Diagram theme options
  const [diagramTheme, setDiagramTheme] = useState('Klasik');
  const diagramThemes = [
    { id: 'Klasik', name: 'Klasik', description: 'Geleneksel akış diyagramı' },
    { id: 'Modern', name: 'Modern', description: 'Minimal ve düz tasarım' },
    { id: 'Renkli', name: 'Renkli', description: 'Canlı renklerle vurgulama' },
    { id: 'Organik', name: 'Organik', description: 'Yumuşak ve doğal şekiller' },
    { id: 'Teknik', name: 'Teknik', description: 'Mühendislik tarzı çizim' },
    { id: 'Sanat', name: 'Sanat', description: 'Artistik ve yaratıcı' }
  ];

  // PDF upload states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfAnalyzing, setPdfAnalyzing] = useState(false);
  const [pdfAnalysisResult, setPdfAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quiz states
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizData, setQuizData] = useState<QAPair[]>([]);
  const [pdfChatOpen, setPdfChatOpen] = useState(false);

  // Diagram zoom and pan state
  const [diagramTransform, setDiagramTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const diagramRef = useRef<HTMLDivElement>(null);

  // Proje kilitleme durumu (tamamlandığında yeni giriş engellenir)
  const [projectLocked, setProjectLocked] = useState(false);

  // Drag & Drop state & handlers for PDF upload
  const [isDragOver, setIsDragOver] = useState(false);

  // Özet paragraflarını önceden hesapla (PDF analizi varsa onu, yoksa script.summary)
  const rawSummary = (pdfAnalysisResult ?? script?.summary ?? '') as string;
  let displayedParagraphs = rawSummary
    .split('\n\n')
    .filter(p => p.trim());
  if (displayedParagraphs.length < 2) {
    // Deneme 2: madde işareti "• " karakterine göre böl
    displayedParagraphs = rawSummary
      .split(/•\s+/)
      .map(p => p.trim())
      .filter(p => p);
  }
  if (displayedParagraphs.length < 2) {
    // Deneme 3: tek satır sonu
    displayedParagraphs = rawSummary
      .split('\n')
      .filter(p => p.trim());
  }
  displayedParagraphs = displayedParagraphs.slice(0, 15);

  // Her paragraf için özet açıklama (başlık çıkarılır, ilk ~200 karakter)
  const summaryCaptions = displayedParagraphs.map(par => {
    const lines = par.split('\n').map(l => l.trim()).filter(Boolean);
    let textBody = '';
    if (lines.length > 1) {
      // İkinci satırı (açıklama) kullan
      textBody = lines.slice(1).join(' ');
    } else {
      // Başlık ve açıklama aynı satırdaysa ':' sonrası veya ilk cümle
      const afterColon = par.includes(':') ? par.split(':').slice(1).join(':').trim() : par;
      textBody = afterColon;
    }
    // İlk cümleyi al
    const sentence = textBody.split(/(?<=\.)\s|(?<=!)\s|(?<=\?)\s/)[0] || textBody;
    const caption = sentence.length > 750 ? sentence.slice(0, 497) + '...' : sentence;
    return caption;
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (pdfAnalyzing || limitExceeded || projectLocked) return;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDropEvent = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (pdfAnalyzing || limitExceeded || projectLocked) return;
    setIsDragOver(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const droppedFile = files[0];

    if (droppedFile.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Geçersiz dosya formatı',
        description: 'Lütfen sadece PDF dosyası sürükleyin.',
      });
      return;
    }

    // Reuse existing upload handler with a mock event
    const mockEvent = {
      target: { files: [droppedFile] }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    await handlePdfUpload(mockEvent);
  };

  // Diagram interaction handlers
  const handleDiagramWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.9 : 1.1;
    setDiagramTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * scaleChange))
    }));
  };

  const handleDiagramMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleDiagramMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setDiagramTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleDiagramMouseUp = () => {
    setIsDragging(false);
  };

  const resetDiagramView = () => {
    setDiagramTransform({ scale: 1, x: 0, y: 0 });
  };

  // Kullanıcı PDF limitini kontrol et
  const checkUserLimit = async () => {
    try {
      const supabaseClient = createBrowserClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      
      if (user) {
        const response = await fetch('/api/check-pdf-limit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const limitCheck = await response.json();
        
        if (limitCheck && typeof limitCheck.canProcess !== 'undefined') {
          setUserPdfLimit({
            monthly_pdf_count: limitCheck.currentUsage,
            monthly_limit: limitCheck.limit
          });
          setLimitExceeded(!limitCheck.canProcess);
        }
      }
    } catch (error) {
      console.error('Limit kontrol hatası:', error);
    }
  };

  // Bileşen yüklendiğinde limit kontrolü yap
  useEffect(() => {
    checkUserLimit();
  }, []);

  const generateVisuals = async (scriptForVisuals: AnimationScript, pageId: string) => {
    if (!scriptForVisuals?.frames?.length) return;

    setVisualsLoading(true);
    
    // Görseller için tam sahne açıklamalarını kullan
    const initialVisuals: Visual[] = scriptForVisuals.frames.map(frame => ({
      description: frame.sceneDescription,
      keyTopic: sanitizeKeyTopic(frame.keyTopic),
      frameSummary: frame.frameSummary,
      svg: 'loading',
      image: undefined,
    }));
    setVisuals(initialVisuals);

    const generatedVisuals: Visual[] = [];
    for (let i = 0; i < scriptForVisuals.frames.length; i++) {
      const frame = scriptForVisuals.frames[i];
      if (!frame) continue;
      
      try {
        const { generateSvg } = await import('@/ai/actions/generate-svg');
        const svgCode = await generateSvg(frame.sceneDescription);
        
        const newVisual: Visual = { 
          description: frame.sceneDescription,
          keyTopic: sanitizeKeyTopic(frame.keyTopic),
          frameSummary: frame.frameSummary,
          svg: svgCode,
          image: undefined,
        };
        generatedVisuals.push(newVisual);
        
        setVisuals(currentVisuals => {
            const updatedVisuals = [...currentVisuals];
            if (updatedVisuals[i]) updatedVisuals[i] = newVisual;
            return updatedVisuals;
        });

      } catch (error) {
        console.error('SVG generation error:', error);
        const fallbackSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#f0f9ff"/>
          <circle cx="200" cy="150" r="80" fill="#3b82f6" opacity="0.7"/>
          <text x="200" y="250" text-anchor="middle" font-family="Arial" font-size="12" fill="#1e40af">
            Sahne ${i + 1}
          </text>
        </svg>`;
        
        const newVisual: Visual = {
          description: frame.sceneDescription,
          keyTopic: sanitizeKeyTopic(frame.keyTopic),
          frameSummary: frame.frameSummary,
          svg: fallbackSvg,
          image: undefined,
        };
        generatedVisuals.push(newVisual);
        
        setVisuals(currentVisuals => {
            const updatedVisuals = [...currentVisuals];
            if (updatedVisuals[i]) updatedVisuals[i] = newVisual;
            return updatedVisuals;
        });
      }
    }
    setVisualsLoading(false);

    if (pageId && generatedVisuals.length > 0) {
      try {
        const supabaseClient = createBrowserClient();
        await supabaseClient
          .from('animation_pages')
          .update({ animation_svgs: generatedVisuals.map(v => v.svg) })
          .eq('id', pageId);
        
        toast({
          title: 'Görseller Kaydedildi',
          description: `${generatedVisuals.length} sahne görseli başarıyla veritabanına kaydedildi.`,
        });
      } catch (e) {
        console.error('Toplu SVG kaydetme hatası', e);
        toast({
          variant: 'destructive',
          title: 'Görsel Kaydetme Hatası',
          description: 'Oluşturulan görseller veritabanına kaydedilemedi.',
        });
      }
    }
  };

  // PDF upload handlers
  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Limit kontrolü
    if (limitExceeded) {
      toast({
        variant: 'destructive',
        title: 'PDF Yükleme Limiti Aşıldı',
        description: `Bu ay ${userPdfLimit?.monthly_limit} PDF limitinize ulaştınız. Plan yükseltin veya sonraki ay deneyin.`,
      });
      return;
    }

    console.log('PDF yükleniyor:', file.name);

    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Geçersiz dosya formatı',
        description: 'Lütfen sadece PDF dosyası yükleyiniz.',
      });
      return;
    }

    setPdfFile(file);
    setPdfAnalyzing(true);
    setProjectLocked(true);

    try {
      console.log('PDF base64e çevriliyor...');
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          console.log('Base64 çevirme başarılı, uzunluk:', result.length);
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      console.log('AI analizi başlatılıyor...');
      const { analyzePdf } = await import('@/ai/flows/analyze-pdf');
      const analysisResult = await analyzePdf({
        pdfDataUri: base64String
      });

      console.log('AI analizi tamamlandı:', analysisResult);

      const extractedContent = analysisResult.summary;
      console.log('PDF analiz sonucu state\'e kaydediliyor:', extractedContent);
      setPdfAnalysisResult(extractedContent);

      toast({
        title: 'PDF başarıyla analiz edildi!',
        description: 'PDF içeriği analiz edildi. Animasyon oluşturuluyor...',
      });

      setLoading(true);
      setScript(null);
      setVisuals([]);
      setDiagramResult(null);
      setImageResults(null);
      setSubmittedTopic(extractedContent);
      
      try {
        const { generateQa } = await import('@/ai/flows/generate-qa-flow');
        const quizResult = await generateQa({ pdfSummary: extractedContent });
        // Quiz verisi şimdilik saklanmıyor; kullanıcı Mini Quiz butonuna bastığında üretilecek

        const { generateAnimationScenario } = await import('@/ai/flows/generate-animation-scenario');
        const scenarioResult = await generateAnimationScenario({
          pdfSummary: extractedContent,
          qaPairs: quizResult.qaPairs,
        });

        const scriptData: AnimationScript = {
          title: extractedContent,
          summary: extractedContent,
          frames: scenarioResult.frames,
        };
        
        // Pass the full frame data to the visuals state
        setVisuals(scenarioResult.frames.map(frame => ({
          description: frame.sceneDescription,
          keyTopic: sanitizeKeyTopic(frame.keyTopic),
          frameSummary: frame.frameSummary,
          svg: 'loading'
        })));

        setScript(scriptData);
        
        toast({
          title: 'Başarılı!',
          description: 'PDF analizi tamamlandı ve animasyon oluşturuldu.',
        });

        // PDF başarıyla yüklendikten sonra limit bilgisini güncelle
        await checkUserLimit();

        const supabaseClient = createBrowserClient();
        const { data: { user } } = await supabaseClient.auth.getUser();
        const insertPayload = {
          topic: extractedContent,
          script_summary: scriptData.summary,
          scenes: scriptData.frames.map(f => f.sceneDescription),
          user_id: user?.id ?? null,
        };
        const { data: insertData, error: insErr } = await supabaseClient
          .from('animation_pages')
          .insert(insertPayload)
          .select('id')
          .single();
        if (!insErr && insertData) {
          setAnimationPageId(insertData.id);
          await generateVisuals(scriptData, insertData.id);
        }

        // Kullanım sayacını artır
        if (user?.id) {
          fetch('/api/increment-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, type: 'pdf' })
          }).catch(e => console.error('Usage increment request failed', e));
        }
      } catch (scriptError) {
        console.error('Script oluşturma hatası:', scriptError);
        toast({
          variant: 'destructive',
          title: 'Animasyon oluşturma hatası',
          description: 'PDF analizi başarılı ama animasyon oluşturulamadı.',
        });
      } finally {
        setLoading(false);
      }

    } catch (error) {
      console.error('PDF analiz hatası:', error);
      
      const testContent = `PDF Dosyası: ${file.name}\n\nBu PDF dosyası başarıyla yüklendi ancak AI analizi tamamlanamadı. Test amaçlı içerik gösteriliyor.\n\nLütfen konu alanına manuel olarak konunuzu yazabilir veya bu test içeriğini kullanabilirsiniz.`;
      setPdfAnalysisResult(testContent);
      
      toast({
        variant: 'destructive',
        title: 'PDF analiz hatası - Test modu',
        description: 'AI analizi başarısız oldu, test içeriği gösteriliyor.',
      });
    } finally {
      setPdfAnalyzing(false);
      console.log('PDF upload işlemi tamamlandı');
    }
  };

  const handlePdfIconClick = () => {
    fileInputRef.current?.click();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  useEffect(() => {
    if (pdfAnalysisResult) {
      form.clearErrors('topic');
    }
  }, [pdfAnalysisResult, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (pdfAnalysisResult) {
    setLoading(true);
    setProjectLocked(true);
    setScript(null);
    setVisuals([]);
    setDiagramResult(null);
    setImageResults(null);
      setSubmittedTopic(pdfAnalysisResult);
    
    try {
      const { simplifyTopicGetScript } = await import('@/ai/flows/topic-simplifier');
      const topicScript = await simplifyTopicGetScript({ topic: values.topic });
      
      const { generateQa } = await import('@/ai/flows/generate-qa-flow');
      const quizResult = await generateQa({ pdfSummary: values.topic });
      // Quiz verisi hemen gösterilmeyecek; sadece senaryo üretimi için kullanılıyor

      const { generateAnimationScenario } = await import('@/ai/flows/generate-animation-scenario');
      const scenarioResult = await generateAnimationScenario({
        pdfSummary: values.topic,
        qaPairs: quizResult.qaPairs,
      });

      const scriptData: AnimationScript = {
        title: values.topic,
        summary: topicScript.summary,
        frames: scenarioResult.frames,
      };
      
      setScript(scriptData);
      
      toast({
        title: 'Başarılı!',
          description: 'PDF analizi kullanılarak animasyon oluşturuldu.',
        });

        // PDF başarıyla yüklendikten sonra limit bilgisini güncelle
        await checkUserLimit();

        const supabaseClient = createBrowserClient();
        const { data: { user } } = await supabaseClient.auth.getUser();
        const insertPayload = {
          topic: values.topic,
          script_summary: scriptData.summary,
          scenes: scriptData.frames.map(f => f.sceneDescription),
          user_id: user?.id ?? null,
        };
        const { data: insertData, error: insErr } = await supabaseClient
          .from('animation_pages')
          .insert(insertPayload)
          .select('id')
          .single();
        if (!insErr && insertData) {
          setAnimationPageId(insertData.id);
          await generateVisuals(scriptData, insertData.id);
        }

        // PDF olmadan da animasyon oluşturulmuşsa kullanım sayacını artır (animation)
        if (user?.id) {
          fetch('/api/increment-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, type: 'animation' })
          }).catch(e => console.error('Usage increment request failed', e));
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Bir hata oluştu.',
          description: 'Animasyon oluşturma işlemi başarısız. Lütfen tekrar deneyin.',
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (values.topic.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Konu çok kısa',
        description: 'Lütfen daha ayrıntılı bir konu girin (en az 10 karakter) veya PDF yükleyin.',
      });
      return;
    }
    
    setLoading(true);
    setProjectLocked(true);
    setScript(null);
    setVisuals([]);
    setDiagramResult(null);
    setImageResults(null);
    setQuizData([]);
    setSubmittedTopic(values.topic);
    
    try {
      const { simplifyTopicGetScript } = await import('@/ai/flows/topic-simplifier');
      const topicScript = await simplifyTopicGetScript({ topic: values.topic });

      const { generateQa } = await import('@/ai/flows/generate-qa-flow');
      const quizResult = await generateQa({ pdfSummary: topicScript.summary });
      // Quiz verisi hemen gösterilmeyecek; sadece senaryo üretimi için kullanılıyor

      const { generateAnimationScenario } = await import('@/ai/flows/generate-animation-scenario');
      const scenarioResult = await generateAnimationScenario({
        pdfSummary: topicScript.summary,
        qaPairs: quizResult.qaPairs,
      });

      const scriptData: AnimationScript = {
        title: values.topic,
        summary: topicScript.summary, // Use the generated summary
        frames: scenarioResult.frames,
      };

      // Pass the full frame data to the visuals state
      setVisuals(scenarioResult.frames.map(frame => ({
        description: frame.sceneDescription,
        keyTopic: sanitizeKeyTopic(frame.keyTopic),
        frameSummary: frame.frameSummary,
        svg: 'loading'
      })));
      
      setScript(scriptData);
      
      toast({
        title: 'Başarılı!',
        description: 'Eğitici animasyon scripti oluşturuldu.',
      });

      // PDF başarıyla yüklendikten sonra limit bilgisini güncelle
      await checkUserLimit();

      const supabaseClient = createBrowserClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      const insertPayload = {
        topic: values.topic,
        script_summary: scriptData.summary,
        scenes: scriptData.frames.map(f => f.sceneDescription),
        user_id: user?.id ?? null,
      };
      const { data: insertData, error: insErr } = await supabaseClient
        .from('animation_pages')
        .insert(insertPayload)
        .select('id')
        .single();
      if (!insErr && insertData) {
        setAnimationPageId(insertData.id);
        await generateVisuals(scriptData, insertData.id);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Bir hata oluştu.',
        description: 'Konu basitleştirme işlemi başarısız. Lütfen tekrar deneyin.',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateDiagram = async () => {
    if (!submittedTopic || !script?.summary) return;
    setDiagramLoading(true);
    setDiagramResult(null);
    try {
      const { simplifyTopicSummaryAsThemedDiagram } = await import('@/ai/flows/topic-simplifier');
      const result = await simplifyTopicSummaryAsThemedDiagram({ 
        topic: submittedTopic,
        summary: script.summary,
        theme: diagramTheme
      });
      
      setDiagramResult({ svg: result.svg });

      if (animationPageId) {
        try {
          const supabaseClient = createBrowserClient();
          await supabaseClient.from('animation_pages').update({ diagram_svg: result.svg }).eq('id', animationPageId);
        } catch (err) { console.error('Save diagram error', err);} 
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Bir hata oluştu.',
        description: 'Diyagram oluşturma işlemi başarısız. Lütfen tekrar deneyin.',
      });
    } finally {
      setDiagramLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!script?.frames && !script?.summary) return;
    
    setImageLoading(true);
    setImageResults(null);
    try {
      let sceneDescriptions: string[];
      
      if (script?.frames && script.frames.length > 0) {
        sceneDescriptions = script.frames.map(f => f.sceneDescription).slice(0, 8);
      } else if (visuals?.length > 0) {
        sceneDescriptions = visuals.map(s => s.description);
      } else if (script?.summary) {
        const summaryParts = script.summary.split('\n\n').filter(part => part.trim().length > 0);
        sceneDescriptions = summaryParts.slice(0, 4).map((part, index) => {
          const title = part.split(':')[0] || part.split('.')[0] || `Sahne ${index + 1}`;
          return `${submittedTopic} konusunda: ${title.trim()}`;
        });
      } else {
        return;
      }
      
      const { generateSceneImages } = await import('@/ai/flows/image-generator');
      const res = await generateSceneImages({
        scenes: sceneDescriptions,
        style: imageStyle,
      });
      
      setImageResults(res);

      if (animationPageId) {
        try {
          const supabaseClient = createBrowserClient();
          await supabaseClient
            .from('animation_pages')
            .update({ images: res.images })
            .eq('id', animationPageId);
        } catch (saveErr) {
          console.error('Supabase images update error', saveErr);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Bir hata oluştu.',
        description: 'Görsel oluşturma işlemi başarısız. Lütfen tekrar deneyin.',
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!script?.summary) return;
    
    setQuizLoading(true);
    setQuizData([]);
    try {
      const { generateQa } = await import('@/ai/flows/generate-qa-flow');
      const quizResult = await generateQa({ pdfSummary: script.summary });
      setQuizData(quizResult.qaPairs);
      
      toast({
        title: 'Quiz hazırlandı!',
        description: `${quizResult.qaPairs.length} adet çoktan seçmeli soru oluşturuldu.`,
      });

      if (animationPageId) {
        try {
          const supabaseClient = createBrowserClient();
          await supabaseClient.from('animation_pages').update({ qa_pairs: quizResult.qaPairs }).eq('id', animationPageId);
        } catch (e) {
          console.error('Save QA error', e);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Bir hata oluştu.',
        description: 'Quiz oluşturma işlemi başarısız. Lütfen tekrar deneyin.',
      });
    } finally {
      setQuizLoading(false);
    }
  };

  const resetProject = () => {
    setProjectLocked(false);
    setPdfFile(null);
    setPdfAnalysisResult(null);
    setScript(null);
    setVisuals([]);
    setDiagramResult(null);
    setImageResults(null);
    setQuizData([]);
    setSubmittedTopic('');
    form.reset({ topic: '' });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-gray-900">
          <Wand2 className="text-yellow-400" />
          Öğrenme Sihirbazı
        </CardTitle>
        <CardDescription className="text-gray-700">
          Herhangi bir konuyu yazın ya da PDF yükleyin, sihirli animasyonlara ve büyüleyici diyagramlara dönüştürelim! ✨
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`relative ${isDragOver ? 'border-2 border-dashed border-purple-500 rounded-lg' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDropEvent}
                    >
                      <Textarea
                        placeholder="örn: Fotosentez'i 5. sınıf öğrencisine açıkla veya sağ üstteki PDF ikonuna tıklayın 📄"
                        className="resize-none h-28 pr-12"
                        {...field}
                        disabled={pdfAnalyzing || projectLocked}
                      />
                      {/* PDF yükleme ikonu */}
                      <button
                        type="button"
                        onClick={handlePdfIconClick}
                        disabled={pdfAnalyzing || limitExceeded || projectLocked}
                        className={`absolute top-3 right-3 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${
                          limitExceeded ? 'text-red-400' : 'text-gray-600'
                        }`}
                        title={limitExceeded ? 'PDF yükleme limiti aşıldı' : 'PDF yükle'}
                      >
                        {pdfAnalyzing ? (
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                        ) : (
                          <File className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                      {/* Konu gönderme (Play) ikonu */}
                      {!pdfFile && (
                        <button
                          type="submit"
                          disabled={loading || (!form.watch('topic') && !pdfAnalysisResult) || projectLocked}
                          className="absolute bottom-3 right-3 p-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md disabled:opacity-40"
                          title="Animasyon Oluştur"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {pdfFile && (
                    <div className="text-xs text-gray-700 font-medium mt-2">
                      📄 Yüklenen dosya: {pdfFile.name}
                    </div>
                  )}
                  
                  {/* PDF Limit Uyarısı */}
                  {userPdfLimit && (
                    <div className={`relative mt-3 rounded-xl border shadow-sm p-3 text-xs overflow-hidden ${
                        limitExceeded
                          ? 'border-red-300 bg-red-50/60 dark:bg-red-900/40'
                          : 'border-purple-300 bg-white/50 dark:bg-white/10'
                      }`}>                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 font-medium">
                          <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                          <span>Aylık PDF Kullanımı</span>
                        </div>
                        <span className={`font-semibold ${limitExceeded ? 'text-red-600' : 'text-purple-600'}`}>{userPdfLimit.monthly_pdf_count}/{userPdfLimit.monthly_limit}</span>
                      </div>
                      {!limitExceeded && (
                        <div className="w-full bg-gray-200/70 dark:bg-gray-700 rounded-full h-1 mt-2">
                          <div
                            className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                            style={{ width: `${Math.min((userPdfLimit.monthly_pdf_count / userPdfLimit.monthly_limit) * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />
          </form>
        </Form>

        {/* İçerik Oluşturma Butonları (Animasyon Oluştur butonunun hemen altında) */}
        {script && !loading && (
          <>
            {/* Oluşturma Butonları */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Button onClick={handleGenerateDiagram} disabled={diagramLoading || !script?.summary} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <Network className="mr-2 h-4 w-4" /> Diyagram Oluştur
              </Button>
              <Button onClick={handleGenerateImage} disabled={imageLoading || (!script?.frames && !script?.summary)} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <ImageIcon className="mr-2 h-4 w-4" /> Görsel Oluştur
              </Button>
              <Button onClick={handleGenerateQuiz} disabled={quizLoading || !script?.summary} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                <HelpCircle className="mr-2 h-4 w-4" /> Mini Quiz
              </Button>
            </div>

            {/* Şablon Seçimleri */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4" /> Diyagram Teması
                </h4>
                <Select value={diagramTheme} onValueChange={setDiagramTheme}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tema seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {diagramThemes.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" /> Görsel Stili
                </h4>
                <Select value={imageStyle} onValueChange={setImageStyle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Stil seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {imageStyles.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="mt-6">
            <ScientificLoadingAnimation message="AI düşünüyor ve script oluşturuyor..." />
          </div>
        )}

        {/* PDF Analiz Sonucu */}
        {pdfAnalysisResult && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <File className="h-5 w-5" />
                  PDF Analiz Sonucu
                </CardTitle>
                <CardDescription>
                  PDF içeriği başarıyla analiz edildi. Aşağıdaki özeti inceleyebilir ve istediğiniz kısmı kullanabilirsiniz.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="max-h-60 overflow-y-auto space-y-4">
                    {displayedParagraphs.map((paragraph, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                          {idx + 1}
                        </div>
                        <p className="text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* PDF ile Sohbet - Popup */}
            <div className="mt-4 flex justify-center">
              <Dialog open={pdfChatOpen} onOpenChange={setPdfChatOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="block mx-auto px-6 h-10 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    PDF ile Sohbet Et
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto backdrop-blur-md bg-white/95 border border-white/20 rounded-xl shadow-xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900">
                      <MessageSquare className="h-5 w-5" />
                      PDF İçeriği ile Sohbet
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <PdfChat 
                      pdfSummary={(pdfAnalysisResult ?? '') as string} 
                      chatWithPdfFlow={async (input) => {
                        const { chatWithPdf } = await import('@/ai/flows/chat-with-pdf-flow');
                        const result = await chatWithPdf({
                          pdfSummary: input.pdfContent,
                          userQuery: input.prompt
                        });
                        return { response: result.botResponse };
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* Animasyon & İçerik Alanı */}
        {script && (
          <div className="mt-8">
            <Card className="backdrop-blur-md bg-white/95 border border-white/20 rounded-xl shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Film className="text-purple-600" />
                  Eğitici Animasyon
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Animasyon Sahneleri</h3>
                  <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
                    <CarouselContent>
                    {visuals.map((scene, index) => (
                        <CarouselItem key={index} className="flex flex-col items-center text-center">
                          <div className="p-2 border bg-muted rounded-lg shadow-inner w-full h-[500px] flex items-center justify-center overflow-hidden">
                          {scene.svg === 'loading' ? (
                               <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center rounded-md">
                             <ScientificLoadingAnimation message={`Sahne ${index + 1} oluşturuluyor...`} />
                               </div>
                          ) : (
                              <div className="w-full h-full flex items-center justify-center scale-95" dangerouslySetInnerHTML={{ __html: scene.svg || '' }} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 px-2 text-center leading-tight">
                          {visuals[index]?.keyTopic || `Sahne ${index + 1}`}
                        </p>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <FileText className="text-white h-5 w-5" />
                    </div>
                    {pdfAnalysisResult ? 'PDF Analiz Sonucu' : 'Konu Özeti'}
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-purple-200 ml-4"></div>
                  </h3>
                  <div className="grid gap-4">
                    {displayedParagraphs.map((paragraph, idx) => (
                      <div 
                        key={idx} 
                        className="group relative p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-300/60"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                              {idx + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-700 leading-relaxed font-medium text-base">
                              {paragraph}
                            </p>
                          </div>
                        </div>
                        {/* Decorative gradient line */}
                        <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary stats */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-xl">
                    <div className="flex items-center justify-center gap-6 text-sm text-emerald-700">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium">{displayedParagraphs.length} Ana Bölüm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="font-medium">~{Math.ceil((pdfAnalysisResult ?? script.summary).length / 1000)} Dakika Okuma</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sonuçlar Alanı */}
        {(diagramLoading || diagramResult || imageLoading || imageResults || quizLoading || (quizData && quizData.length > 0)) && (
          <div className="mt-8 space-y-6">
            {/* Diyagram Sonuçları */}
                  {diagramLoading && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Network /> Diyagram Şeması</h3>
                        <DiagramLoadingAnimation />
                      </div>
                  )}
                  {diagramResult && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Network /> Diyagram Şeması
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={resetDiagramView}
                            >
                              Sıfırla
                            </Button>
                            <div className="text-xs text-muted-foreground">
                              Zoom: {Math.round(diagramTransform.scale * 100)}%
                            </div>
                          </div>
                        </div>
                        <div 
                          ref={diagramRef}
                          className="border rounded-lg bg-muted/20 overflow-hidden cursor-move"
                          style={{ height: '500px' }}
                          onWheel={handleDiagramWheel}
                          onMouseDown={handleDiagramMouseDown}
                          onMouseMove={handleDiagramMouseMove}
                          onMouseUp={handleDiagramMouseUp}
                          onMouseLeave={handleDiagramMouseUp}
                        >
                          <div 
                            className="w-full h-full"
                            style={{
                              transform: `scale(${diagramTransform.scale}) translate(${diagramTransform.x}px, ${diagramTransform.y}px)`,
                              transformOrigin: 'center',
                              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                            }}
                            dangerouslySetInnerHTML={{ __html: diagramResult.svg }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 text-center">
                          🖱️ Sürükle | 🔍 Fare tekerleği ile zoom
                        </div>
                      </div>
                  )}

            {/* Görsel Sonuçları */}
                  {imageLoading && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><ImageIcon /> Eğitici Görseller</h3>
                        <ScientificLoadingAnimation message={`${imageStyle} tarzında görseller oluşturuluyor...`} />
                      </div>
                  )}
                  
                  {imageResults && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <ImageIcon /> Eğitici Görseller ({imageStyle} Tarzı)
                        </h3>
                        <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
                          <CarouselContent>
                            {imageResults.images.map((imageUrl, index) => (
                      <CarouselItem key={index} className="flex flex-col items-center text-center">
                        <div className="p-2 border bg-muted rounded-lg shadow-inner w-full h-[500px] flex items-center justify-center overflow-hidden">
                                      <img 
                                        src={imageUrl} 
                            alt={visuals[index]?.description && visuals[index]!.description.length > 750
                              ? visuals[index]!.description.slice(0, 747) + '…'
                              : visuals[index]?.description || `Sahne ${index + 1}`}
                            className="w-full h-full object-contain"
                                      />
                                </div>
                        <p className="text-sm text-muted-foreground mt-2 px-2 text-center leading-tight">
                          {visuals[index]?.description && visuals[index]!.description.length > 750
                            ? visuals[index]!.description.slice(0, 747) + '…'
                            : visuals[index]?.description || `Sahne ${index + 1}`}
                        </p>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                  )}

            {/* Quiz Sonuçları */}
            {quizLoading && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><HelpCircle /> Mini Quiz</h3>
                <ScientificLoadingAnimation message="İnteraktif quiz soruları oluşturuluyor..." />
                </div>
            )}

            {quizData && quizData.length > 0 && (
              <div className="mb-8">
                <QaDisplay qaPairs={quizData} />
                </div>
            )}
          </div>
        )}

        {projectLocked && (
          <div className="text-center mt-4">
            <Button onClick={resetProject} variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Yeni Proje Başlat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
