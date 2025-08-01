"use client";

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Sparkles, Wand2, FileText, Network, Film, Image as ImageIcon, Upload, File, HelpCircle, MessageSquare, AlertTriangle, GaugeCircle, Play, PlayIcon, Volume2, Pause } from 'lucide-react';
import { useSpeech } from '@/hooks/use-speech';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createBrowserClient } from '@/lib/supabase';
import { getUserStats } from '@/lib/database';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { useT } from '@/i18n/translations';

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
import { useSubscription } from '@/hooks/use-subscription';
import { QaDisplay, QAPair } from '@/components/custom/qa-display';
import AnimatedSection from '@/components/custom/animated-section';
import { PdfChat } from '@/components/custom/pdf-chat';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VideoGenerator, downloadVideo, generateAudioFromText } from '@/lib/video-generator';

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

// PDF Icon Component - matching the image design
const PDFIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Document background */}
    <path 
      d="M6 2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" 
      fill="#dc2626" 
      stroke="#dc2626" 
      strokeWidth="1"
    />
    {/* Folded corner */}
    <path 
      d="M14 2v6h6" 
      fill="none" 
      stroke="#b91c1c" 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    {/* PDF text */}
    <text 
      x="12" 
      y="16" 
      fill="white" 
      fontSize="4" 
      fontWeight="bold" 
      textAnchor="middle" 
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      PDF
    </text>
  </svg>
);

interface TopicSimplifierFormProps {
  onFormSubmit?: () => void;
}

export function TopicSimplifierForm({ onFormSubmit }: TopicSimplifierFormProps = {}) {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<AnimationScript | null>(null);
  const [visuals, setVisuals] = useState<Visual[]>([]);
  const [visualsLoading, setVisualsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = useT();
  const { speak, stop, isPlaying } = useSpeech();

  // Merkezi subscription hook'u kullan
  const subscriptionInfo = useSubscription();
  const limitExceeded = !subscriptionInfo.canProcess;

  const [diagramLoading, setDiagramLoading] = useState(false);
  const [diagramResult, setDiagramResult] = useState<{ svg: string } | null>(null);
  const [submittedTopic, setSubmittedTopic] = useState<string>('');
  const [projectId, setProjectId] = useState<string | null>(null);

  const [imageLoading, setImageLoading] = useState(false);
  const [imageResults, setImageResults] = useState<{ images: string[] } | null>(null);
  const [imageStyle, setImageStyle] = useState('Fotogerçekçi');
  const [animationPageId, setAnimationPageId] = useState<string | null>(null);
  const imageStyles = ['Fotogerçekçi', 'Dijital Sanat', 'Sulu Boya', 'Çizgi Roman', 'Düşük Poli', '3D Render'];

  // Anlatım tarzı state ve seçenekleri
  const [narrativeStyle, setNarrativeStyle] = useState('Varsayılan');
  const narrativeStyles = [
    { id: 'Varsayılan', name: 'Varsayılan', description: 'Standart, net ve bilgilendirici.' },
    { id: 'Basit ve Anlaşılır', name: 'Basit ve Anlaşılır', description: 'Karmaşık terimlerden kaçınan, en temel düzeyde açıklama.' },
    { id: 'Akademik', name: 'Akademik', description: 'Resmi, kaynaklara dayalı ve yapılandırılmış.' },
    { id: 'Teknik Derinlik', name: 'Teknik Derinlik', description: 'Uzmanlara yönelik, teknik jargon içeren anlatım.' },
    { id: 'Yaratıcı ve Eğlenceli', name: 'Yaratıcı ve Eğlenceli', description: 'Benzetmeler ve hikayelerle ilgi çekici anlatım.' },
    { id: 'Profesyonel (İş Odaklı)', name: 'Profesyonel (İş Odaklı)', description: 'Sonuç odaklı, net ve saygılı bir dil.' },
    { id: 'Samimi ve Sohbet Havasında', name: 'Samimi ve Sohbet Havasında', description: 'Kişisel ve rahat bir ton.' },
    { id: 'Eleştirel Bakış', name: 'Eleştirel Bakış', description: 'Konuyu farklı yönleriyle sorgulayan, objektif bir yaklaşım.' },
  ];

  // Seçilen anlatım tarzı objesi - trigger içinde kullanılır
  const currentNarrative = narrativeStyles.find((s) => s.id === narrativeStyle);

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
  // Yeni eklenen state'ler
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
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

  // Video generation states
  const [videoLoading, setVideoLoading] = useState(false);

  // Animasyon sahnelerinin metinlerini al
  let displayedParagraphs: string[] = [];
  if (script?.frames && script.frames.length > 0) {
    displayedParagraphs = script.frames.map(frame => {
      // Animasyonun altındaki metin (keyTopic) ile aynı olması için onu kullanalım.
      // Yoksa frameSummary, o da yoksa sceneDescription.
      return sanitizeKeyTopic(frame.keyTopic) || frame.frameSummary || frame.sceneDescription;
    }).filter(Boolean); // Boş olanları filtrele
  } else {
    // Fallback: eski mantık
    const rawSummary = (pdfAnalysisResult ?? script?.summary ?? '') as string;
    displayedParagraphs = rawSummary
      .split('\n\n')
      .filter(p => p.trim());
    if (displayedParagraphs.length < 2) {
      displayedParagraphs = rawSummary
        .split(/•\s+/)
        .map(p => p.trim())
        .filter(p => p);
    }
    if (displayedParagraphs.length < 2) {
      displayedParagraphs = rawSummary
        .split('\n')
        .filter(p => p.trim());
    }
    if (displayedParagraphs.length < 2) {
      displayedParagraphs = rawSummary
        .split(/\n?\s*\d+\.\s+/)
        .map(p => p.trim())
        .filter(p => p);
    }
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

  // Kullanıcı limitini kontrol et (PDF ve animasyon için)
  // Hook'tan limit kontrolü artık merkezi olarak yapılıyor
  const checkUserLimit = async (type: 'pdf' | 'animation' = 'pdf'): Promise<any> => {
    return subscriptionInfo.checkCanProcess(type);
  };

  // Limit aşıldığında fiyatlandırma sayfasına yönlendir
  const showLimitExceededModal = () => {
    const currentLang = language || 'tr';
    const isEnglish = currentLang === 'en';
    const { currentUsage, limit } = subscriptionInfo;
    
    toast({
      variant: 'destructive',
      title: isEnglish ? 'Credit Limit Exceeded' : 'Kredi Limiti Aşıldı',
      description: isEnglish 
        ? `You've reached your monthly limit of ${limit} credits (${currentUsage}/${limit}). Please upgrade your plan to continue.`
        : `Bu ay ${limit} kredi limitinize ulaştınız (${currentUsage}/${limit}). Devam etmek için planınızı yükseltin.`,
      action: (
        <button
          onClick={() => router.push(`/${currentLang}/pricing`)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
        >
          {isEnglish ? 'Upgrade Plan' : 'Planı Yükselt'}
        </button>
      ),
    });
  };

  // Hook otomatik olarak verileri yüklüyor, ayrı useEffect gerekmiyor

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

        // Daha detaylı SVG için sahne açıklamasına ek bilgiler ekle
        const svgPrompt = `${frame.sceneDescription}${frame.keyTopic ? `\nKavram: ${sanitizeKeyTopic(frame.keyTopic)}` : ''}${frame.frameSummary ? `\nAçıklama: ${frame.frameSummary}` : ''}`.trim();

        const svgCode = await generateSvg(svgPrompt);
        
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
      showLimitExceededModal();
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
          setPdfBase64(result);
          setPdfAnalyzing(false);
          setProjectLocked(false);
          toast({
            title: 'PDF yüklendi',
            description: 'Analiz için "PDF’yi Analiz Et" butonuna basın.',
          });
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // AI analizi bu aşamada tetiklenmiyor. Kullanıcı butona bastığında startPdfAnalysis çağrılacak.
      setPdfAnalyzing(false);
      // base64 zaten kaydedildi
      return;
      const { analyzePdf } = await import('@/ai/flows/analyze-pdf');
      const analysisResult = await analyzePdf({
        pdfDataUri: base64String,
        narrativeStyle: narrativeStyle,
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
        await checkUserLimit('pdf');

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
        const pageId = insertData?.id;
        if (!insErr && pageId) {
          setAnimationPageId(pageId);
          await generateVisuals(scriptData, pageId);
        }

        // Kullanım sayacını artır
        const uid = user?.id;
        if (uid) {
          fetch('/api/increment-usage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, type: 'pdf' })
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

    // PDF analizi fonksiyonu (form gönderiminden çağrılır)
  const startPdfAnalysis = async (): Promise<string | null> => {
    if (!pdfBase64) return null;
    setPdfAnalyzing(true);
    try {
      const { analyzePdf } = await import('@/ai/flows/analyze-pdf');
      const analysisResult = await analyzePdf({
        pdfDataUri: pdfBase64,
        narrativeStyle,
      });
      setPdfAnalysisResult(analysisResult.summary);
      return analysisResult.summary;

    } catch (error) {
      console.error('PDF analiz hatası:', error);
      toast({
        variant: 'destructive',
        title: 'PDF analiz hatası',
        description: 'AI analizi başarısız oldu, lütfen tekrar deneyin.',
      });
      return null;
    } finally {
      setPdfAnalyzing(false);
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
    // --- Genel Kontroller ---
    if (!pdfFile && values.topic.length < 10) {
      toast({
        variant: 'destructive',
        title: 'Konu çok kısa',
        description: 'Lütfen daha ayrıntılı bir konu girin (en az 10 karakter) veya PDF yükleyin.',
      });
      return;
    }

    const animationLimitCheck = await checkUserLimit('animation');
    if (animationLimitCheck && !animationLimitCheck.canProcess) {
      showLimitExceededModal();
      return;
    }

    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Giriş Gerekli',
        description: 'Animasyon oluşturmak için giriş yapmalısınız.',
      });
      return;
    }

    // Form gönderildiğini parent component'e bildir
    onFormSubmit?.();

    setLoading(true);
    setProjectLocked(true);
    setScript(null);
    setVisuals([]);
    setDiagramResult(null);
    setImageResults(null);
    setQuizData([]);

    let topicToProcess: string;

    // --- PDF Akışı ---
    if (pdfFile) {
      const analysisResult = await startPdfAnalysis();
      if (!analysisResult) {
        setLoading(false);
        setProjectLocked(false);
        return; // Hata mesajı startPdfAnalysis içinde gösterildi
      }
      topicToProcess = analysisResult;
    } else {
      // --- Metin Akışı ---
      topicToProcess = values.topic;
    }

    setSubmittedTopic(topicToProcess);

    try {
      // --- Ortak AI Akışı ---
      const { simplifyTopicGetScript } = await import('@/ai/flows/topic-simplifier');
      const topicScript = await simplifyTopicGetScript({ topic: topicToProcess, narrativeStyle: narrativeStyle });

      const { generateQa } = await import('@/ai/flows/generate-qa-flow');
      const quizResult = await generateQa({ pdfSummary: topicScript.summary });

      const { generateAnimationScenario } = await import('@/ai/flows/generate-animation-scenario');
      const scenarioResult = await generateAnimationScenario({
        pdfSummary: topicScript.summary,
        qaPairs: quizResult.qaPairs,
      });

      const scriptData: AnimationScript = {
        title: pdfFile ? pdfFile.name.replace('.pdf', '') : values.topic,
        summary: topicScript.summary,
        frames: scenarioResult.frames,
      };

      setScript(scriptData);
      toast({
        title: 'Başarılı!',
        description: 'Eğitici animasyon scripti oluşturuldu.',
      });

      // --- Veritabanı ve Görselleştirme ---
      await checkUserLimit('pdf');
      const supabaseClient = createBrowserClient();
      const { data: { user } } = await supabaseClient.auth.getUser();
      const insertPayload = {
        topic: scriptData.title,
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
        setProjectId(insertData.id); // Set project ID for chat history
        await generateVisuals(scriptData, insertData.id);
      }

      if (user) {
        // Hook'tan gelen incrementUsage fonksiyonunu kullan
        await subscriptionInfo.incrementUsage('animation');
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

  const handleGenerateVideo = async () => {
    if (!visuals || visuals.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Video oluşturulamıyor',
        description: 'Önce görseller oluşturulmalı.',
      });
      return;
    }

    setVideoLoading(true);
    try {
      const videoGenerator = new VideoGenerator();
      
      // Her görsel için metin ve görsel URL'sini hazırla
      const slides = visuals.map((visual, index) => ({
        text: visual.keyTopic || visual.description || `Sahne ${index + 1}`,
        imageUrl: visual.image || '', // Görsel URL'si
        duration: 3000 // Her sahne 3 saniye
      }));

      // Video oluştur
      const videoBlob = await videoGenerator.createVideo(slides);
      
      // Video dosyasını indir
      downloadVideo(videoBlob, `${submittedTopic || 'video'}.mp4`);
      
      toast({
        title: 'Video oluşturuldu!',
        description: 'Video başarıyla oluşturuldu ve indiriliyor.',
      });
    } catch (error) {
      console.error('Video generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Video oluşturma hatası',
        description: 'Video oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
      });
    } finally {
      setVideoLoading(false);
    }
  };

  const resetProject = () => {
    // Sayfayı tamamen yenile (F5 gibi)
    window.location.reload();
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-md rounded-2xl">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2 text-gray-900">
          <Wand2 className="text-yellow-400" />
          {t.topicSimplifier.title}
        </CardTitle>
        <CardDescription className="text-gray-700">
          {t.topicSimplifier.description}
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
                        placeholder={t.topicSimplifier.placeholder}
                        className="resize-none h-32 pr-12 rounded-xl border-2 border-purple-200/60 focus:border-orange-400 focus:ring-2 focus:ring-orange-300 bg-white/70 backdrop-blur-md placeholder:text-gray-400/80"
                        {...field}
                        disabled={pdfAnalyzing || projectLocked}
                      />
                      {/* PDF yükleme ikonu */}
                      <button
                        type="button"
                        onClick={handlePdfIconClick}
                        disabled={pdfAnalyzing || limitExceeded || projectLocked}
                        className={`absolute top-3 right-3 p-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                          limitExceeded ? 'text-red-400' : 'text-gray-600'
                        }`}
                        title={limitExceeded ? t.topicSimplifier.uploadLimitExceeded : t.topicSimplifier.uploadPdf}
                      >
                        {pdfAnalyzing ? (
                          <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                          <PDFIcon className="h-8 w-8" />
                        )}
                      </button>
                      {/* Konu gönderme (Play) ikonu */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="absolute bottom-3 right-3 p-2 rounded-md bg-orange-500 hover:bg-orange-600 text-white shadow-md disabled:opacity-40"
                        title={t.topicSimplifier.generateAnimation}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}

                        className="hidden"
                      />
                    </div>
                  </FormControl>
                  {!pdfFile && <FormMessage />}

                  {/* Anlatım Tarzı Seçimi */}
                  <div className="pt-2">
                    <Label htmlFor="narrative-style" className="text-sm font-medium text-gray-800">Anlatım Tarzı</Label>
                    <Select value={narrativeStyle} onValueChange={setNarrativeStyle}>
                      <SelectTrigger
                      id="narrative-style"
                      className="w-full mt-1 border-2 border-gray-200 rounded-lg px-4 py-3 hover:border-purple-400 focus:ring-2 focus:ring-purple-500 shadow-sm transition-colors"
                    >
                        {currentNarrative ? (
                          <div className="flex flex-col text-left">
                            <span className="font-semibold">{currentNarrative.name}</span>
                            <span className="text-xs text-muted-foreground">{currentNarrative.description}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Bir tarz seçin...</span>
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {narrativeStyles.map(style => (
                          <SelectItem key={style.id} value={style.id} className="p-3 hover:bg-purple-50">
                            <div className="flex flex-col">
                              <span className="font-semibold">{style.name}</span>
                              <span className="text-xs text-muted-foreground">{style.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {pdfFile && (
                    <div className="text-xs text-gray-700 font-medium mt-2">
                      📄 {t.topicSimplifier.uploadedFile}: {pdfFile.name}
                    </div>
                  )}
                  
                  {/* Kredi/Limit Uyarısı */}
                  {!subscriptionInfo.isLoading && (
                    <div className={`relative mt-3 rounded-xl border shadow-sm p-3 text-xs overflow-hidden ${
                        limitExceeded
                          ? 'border-red-300 bg-red-50/60 dark:bg-red-900/40'
                          : 'border-purple-300 bg-white/50 dark:bg-white/10'
                      }`}>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 font-medium">
                          <GaugeCircle className="h-4 w-4 text-purple-500" />
                          <span>Kredi Kullanımı</span>
                        </div>
                        <span className={`font-semibold ${limitExceeded ? 'text-red-600' : 'text-purple-600'}`}>
                          {subscriptionInfo.currentUsage}/{subscriptionInfo.limit}
                        </span>
                      </div>
                      {!limitExceeded && (
                          <div className="w-full bg-gray-200/70 dark:bg-gray-700 rounded-full h-1 mt-2">
                            <div
                              className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                              style={{ width: `${Math.min(subscriptionInfo.usagePercentage, 100)}%` }}
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
              <Button onClick={handleGenerateDiagram} disabled={diagramLoading || !script?.summary} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <Network className="mr-2 h-4 w-4" /> Diyagram Oluştur
              </Button>
              <Button onClick={handleGenerateImage} disabled={imageLoading || (!script?.frames && !script?.summary)} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <ImageIcon className="mr-2 h-4 w-4" /> Görsel Oluştur
              </Button>
              <Button onClick={handleGenerateVideo} disabled={videoLoading || !visuals || visuals.length === 0 || !imageResults?.images || imageResults.images.length === 0} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                {videoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />} Video Oluştur
              </Button>
              <Button onClick={handleGenerateQuiz} disabled={quizLoading || !script?.summary} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
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
            
            {/* PDF Analiz Sonucu için Aksiyon Butonları */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Button onClick={handleGenerateDiagram} disabled={diagramLoading || !script?.summary} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <Network className="mr-2 h-4 w-4" /> Diyagram Oluştur
              </Button>
              <Button onClick={handleGenerateImage} disabled={imageLoading || (!script?.frames && !script?.summary)} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <ImageIcon className="mr-2 h-4 w-4" /> Görsel Oluştur
              </Button>
              <Button onClick={handleGenerateVideo} disabled={videoLoading || !visuals || visuals.length === 0 || !imageResults?.images || imageResults.images.length === 0} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed">
                {videoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />} Video Oluştur
              </Button>
              <Button onClick={handleGenerateQuiz} disabled={quizLoading || !script?.summary} className="flex-1 min-w-[180px] px-5 h-9 text-sm rounded-md shadow-md flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                <HelpCircle className="mr-2 h-4 w-4" /> Mini Quiz
              </Button>
            </div>

            {/* PDF ile Sohbet - Popup */}
            <div className="mt-4 flex justify-center">
              <Dialog open={pdfChatOpen} onOpenChange={setPdfChatOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold"
                  >
                    <MessageSquare className="w-5 h-5" />
                    PDF ile Sohbet Et
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-100 shadow-2xl rounded-2xl">
                  <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      PDF İçeriği ile Sohbet
                    </DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <PdfChat 
                      pdfSummary={(pdfAnalysisResult ?? '') as string} 
                      narrativeStyle={narrativeStyle}
                      chatWithPdfFlow={async (input) => {
  try {
    const { chatWithPdf } = await import('@/ai/flows/chat-with-pdf-flow');
    const result = await chatWithPdf({
      pdfSummary: input.pdfContent,
      userQuery: input.prompt,
      narrativeStyle: input.narrativeStyle
    });
    return { success: true, response: result.botResponse };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
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
                          <div className="flex-shrink-0">
                            <button
                              onClick={() => {
                                if (isPlaying) {
                                  stop();
                                } else {
                                  speak(paragraph, 'tr-TR');
                                }
                              }}
                              className="p-2 rounded-full bg-white/80 hover:bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 hover:text-blue-600"
                              title={isPlaying ? 'Konuşmayı durdur' : 'Sesli oku'}
                            >
                              {isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </button>
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

                  {/* Konu Sohbet Botu */}
                  <div className="mt-6 flex justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:shadow-xl"
                        >
                          <MessageSquare className="mr-2 h-5 w-5" />
                          Konu Hakkında Sohbet Et
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-white border-2 border-gray-100 shadow-2xl rounded-2xl">
                        <DialogHeader className="pb-4 border-b border-gray-100">
                          <DialogTitle className="flex items-center gap-3 text-gray-900 text-xl font-bold">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                              <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            Konu Sohbet Botu
                          </DialogTitle>
                        </DialogHeader>
                        <div className="h-[70vh] overflow-auto pt-4">
                          <PdfChat
                             pdfSummary={pdfAnalysisResult ?? script.summary}
                             projectId={projectId || undefined}
                             narrativeStyle={narrativeStyle}
                             chatWithPdfFlow={async (input) => {
  try {
    const { chatWithPdf } = await import('@/ai/flows/chat-with-pdf-flow');
    const result = await chatWithPdf({
      pdfSummary: input.pdfContent,
      userQuery: input.prompt,
      narrativeStyle: input.narrativeStyle
    });
    return { success: true, response: result.botResponse };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}}
                           />
                        </div>
                      </DialogContent>
                    </Dialog>
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
                            alt={visuals[index]?.keyTopic || `Sahne ${index + 1}`}
                            className="w-full h-full object-contain"
                                      />
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
                        
                        {/* Video Oluştur Butonu - Eğitici Görseller Altında */}
                        <div className="mt-4 flex justify-center">
                          <Button 
                            onClick={handleGenerateVideo} 
                            disabled={videoLoading || !visuals || visuals.length === 0 || !imageResults?.images || imageResults.images.length === 0} 
                            className="px-6 py-2.5 text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl hover:scale-105"
                          >
                            {videoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />} 
                            Video Oluştur
                          </Button>
                        </div>
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
