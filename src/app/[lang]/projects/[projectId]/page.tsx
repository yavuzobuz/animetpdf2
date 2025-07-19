
"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { createBrowserClient } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { ScenarioDisplay } from '@/components/custom/scenario-display';
import { ReactFlowDiagram } from '@/components/custom/react-flow-diagram';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { 
  FileText, 
  Network, 
  Play, 
  Pause, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Info,
  GitFork,
  Workflow,
  Sparkles, 
  Wand2, 
  Star, 
  Brain,
  Zap,
  Upload,
  Palette
} from 'lucide-react';
import { QaDisplay } from '@/components/custom/qa-display';
import { PdfChat } from '@/components/custom/pdf-chat';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Translation dictionary for project detail page
const I18N = {
  en: {
    badge: 'AI Wizard',
    heroLine1: "Transform Your Questions, Text and PDFs into ",
    heroHighlight: 'Magical Animations',
    heroDescription: 'Write any topic or upload a PDF, and let AI turn it into captivating animations and interactive experiences! ✨',
    howTitle: 'How It Works?',
    howSubtitle: 'Create awesome animations in just 3 simple steps',
    steps: [
      {title: 'Write Topic or Upload PDF', desc: 'Type the topic you want to learn or upload your existing PDF', iconColor: 'bg-orange-500'},
      {title: 'AI Analyzes', desc: 'Artificial intelligence analyzes your content and prepares the best animation scenario', iconColor: 'bg-blue-500'},
      {title: 'Watch Animation', desc: 'Watch your interactive animation and enjoy learning', iconColor: 'bg-green-500'},
    ],
    showcaseTitle: 'What Will You Get?',
    showcaseSubtitle: 'We create a comprehensive learning experience from every PDF',
    showcase: [
      {title:'Animated Stories', desc:'We turn your content into animations enriched with visual metaphors', iconColor:'bg-red-500', bg:'bg-red-50'},
      {title:'Interactive Quizzes', desc:'Smart multiple-choice quizzes to reinforce what you have learned', iconColor:'bg-blue-500', bg:'bg-blue-50'},
      {title:'PDF Chatbot', desc:'AI-powered assistant you can ask questions about the content', iconColor:'bg-purple-500', bg:'bg-purple-50'},
      {title:'Voice Narration', desc:'Professional-quality voice-over for each animation frame', iconColor:'bg-green-500', bg:'bg-green-50'},
      {title:'Flow Diagrams', desc:'Visual flowcharts explaining complex processes', iconColor:'bg-orange-500', bg:'bg-orange-50'},
      {title:'PDF Summaries', desc:'Comprehensive summaries highlighting main topics', iconColor:'bg-pink-500', bg:'bg-pink-50'},
    ],
  },
  tr: {
    badge: 'AI Sihirbazı',
    heroLine1: "Sorularınızı, metinlerinizi ve PDF'lerinizi ",
    heroHighlight: 'Sihirli Animasyonlara',
    heroDescription: 'Herhangi bir konuyu yazın veya PDF yükleyin, yapay zeka ile büyüleyici animasyonlara ve interaktif deneyimlere dönüştürelim! ✨',
    howTitle: 'Nasıl Kullanılır?',
    howSubtitle: 'Sadece 3 basit adımda harika animasyonlar oluşturun',
    steps: [
      {title: 'Konuyu Yazın veya PDF Yükleyin', desc: 'Öğrenmek istediğiniz konuyu yazın ya da mevcut PDF dosyanızı yükleyin', iconColor: 'bg-orange-500'},
      {title: 'AI Analiz Etsin', desc: 'Yapay zeka içeriğinizi analiz ederek en uygun animasyon senaryosunu hazırlasın', iconColor: 'bg-blue-500'},
      {title: 'Animasyonu İzleyin', desc: 'Hazır olan interaktif animasyonunuzu izleyin ve öğrenmenin keyfini çıkarın', iconColor: 'bg-green-500'},
    ],
    showcaseTitle: 'Neler Elde Edeceksiniz?',
    showcaseSubtitle: 'Her PDF\'den kapsamlı bir öğrenme deneyimi yaratıyoruz',
    showcase: [
      {title:'Animasyonlu Hikayeler', desc:'İçeriğinizi görsel metaforlarla zenginleştirilmiş animasyonlara dönüştürüyoruz', iconColor:'bg-red-500', bg:'bg-red-50'},
      {title:'İnteraktif Testler', desc:'Öğrendiklerinizi pekiştirmek için akıllı çoktan seçmeli testler', iconColor:'bg-blue-500', bg:'bg-blue-50'},
      {title:'PDF Sohbet Botu', desc:'İçerik hakkında soru sorabileceğiniz yapay zeka destekli asistan', iconColor:'bg-purple-500', bg:'bg-purple-50'},
      {title:'Sesli Anlatım', desc:'Her animasyon karesi için profesyonel kalitede seslendirme', iconColor:'bg-green-500', bg:'bg-green-50'},
      {title:'Akış Diyagramları', desc:'Karmaşık süreçleri anlatan görsel akış şemaları', iconColor:'bg-orange-500', bg:'bg-orange-50'},
      {title:'PDF Özetleri', desc:'Ana konuların vurgulandığı kapsamlı özetler', iconColor:'bg-pink-500', bg:'bg-pink-50'},
    ],
  }
} as const;

// Proje tipini belirle
const getProjectType = (project: any) => {
  if (project.animation_settings?.type === 'diagram' || project.analysis_result?.diagram) {
    return 'diagram';
  }
  if (project.animation_scenario && project.animation_scenario.length > 0) {
    return 'animation';
  }
  return 'pdf';
};

// Klasik diyagram görüntüleme bileşeni
const ClassicDiagramView = ({ steps }: { steps: any[] }) => {
  const getStepIcon = (type: string) => {
    switch (type) {
      case 'start': return '🚀';
      case 'end': return '🏁';
      case 'io': return '📋';
      case 'process': return '⚙️';
      case 'decision': return '🤔';
      case 'parallel': return '🔀';
      case 'loop': return '🔄';
      case 'comment': return '💭';
      default: return '📌';
    }
  };

  const getStepStyles = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-gradient-to-r from-emerald-100 to-green-100 border-2 border-emerald-500 text-emerald-800 rounded-full px-6 py-3 text-center shadow-md font-semibold min-w-[180px]';
      case 'end':
        return 'bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-500 text-red-800 rounded-full px-6 py-3 text-center shadow-md font-semibold min-w-[180px]';
      case 'decision':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-500 text-amber-800 p-4 shadow-md transform rotate-45 w-auto inline-block aspect-square flex items-center justify-center min-w-[120px] min-h-[120px] font-medium';
      case 'process':
        return 'bg-gradient-to-r from-violet-100 to-purple-100 border-2 border-violet-500 text-violet-800 px-6 py-4 rounded-lg shadow-md min-w-[220px] font-medium';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400 text-gray-800 px-6 py-4 rounded-lg shadow-md min-w-[220px] font-medium';
    }
  };

  return (
    <div className="space-y-4 p-6">
      {steps.map((step, idx) => (
        <div key={step.id} className="flex flex-col items-center space-y-2">
          <div className={cn('flex items-center', getStepStyles(step.type))}>
            <span className="mr-2 text-lg">
              {getStepIcon(step.type)}
            </span>
            <span>{step.text}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="h-6 w-0.5 bg-slate-400"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function ProjectDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const params = useParams();
  const projectId = params?.projectId as string;
  const [project, setProject] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentFrameIndex, setCurrentFrameIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);
  const [playbackSpeed, setPlaybackSpeed] = React.useState(1);
  
  const t = I18N[language] ?? I18N.tr;

  // Animasyon kontrol fonksiyonları
  const togglePlayback = React.useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const goToFrame = React.useCallback((frameIndex: number) => {
    if (project?.animation_scenario) {
      const maxIndex = project.animation_scenario.length - 1;
      setCurrentFrameIndex(Math.max(0, Math.min(frameIndex, maxIndex)));
    }
  }, [project?.animation_scenario]);

  const nextFrame = React.useCallback(() => {
    goToFrame(currentFrameIndex + 1);
  }, [currentFrameIndex, goToFrame]);

  const prevFrame = React.useCallback(() => {
    goToFrame(currentFrameIndex - 1);
  }, [currentFrameIndex, goToFrame]);

  // Otomatik oynatma
  React.useEffect(() => {
    if (!isPlaying || !project?.animation_scenario) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => {
        const next = prev + 1;
        if (next >= project.animation_scenario.length) {
          setIsPlaying(false);
          return 0; // Başa döner
        }
        return next;
      });
    }, 3000 / playbackSpeed); // 3 saniye per frame

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, project?.animation_scenario]);

  // Klavye event listener'ları
  React.useEffect(() => {
    const handleGlobalEvents = (event: Event) => {
      switch (event.type) {
        case 'prevFrame':
          prevFrame();
          break;
        case 'nextFrame':
          nextFrame();
          break;
        case 'playPause':
          togglePlayback();
          break;
      }
    };

    window.addEventListener('prevFrame', handleGlobalEvents);
    window.addEventListener('nextFrame', handleGlobalEvents);
    window.addEventListener('playPause', handleGlobalEvents);

    return () => {
      window.removeEventListener('prevFrame', handleGlobalEvents);
      window.removeEventListener('nextFrame', handleGlobalEvents);
      window.removeEventListener('playPause', handleGlobalEvents);
    };
  }, [prevFrame, nextFrame, togglePlayback]);

  React.useEffect(() => {
    const fetchProject = async () => {
      if (!user || !projectId) {
        return;
      }
      const supabase = createBrowserClient();
      let { data, error } = await supabase.from('pdf_projects').select('*').eq('id', projectId).single();
      if (error && error.code !== 'PGRST116') console.error(error);

      // Eğer pdf_projects içinde yoksa animation_pages tablosuna bak
      if (!data) {
        const { data: anim, error: animErr } = await supabase.from('animation_pages').select('*').eq('id', projectId).single();
        if (animErr && animErr.code !== 'PGRST116') console.error(animErr);
        if (anim) {
          // pdf_projects alanlarına uyacak şekilde dönüştür
          data = {
            id: anim.id,
            title: anim.topic,
            animation_scenario: anim.scenes,
            animation_svgs: anim.animation_svgs,
            diagram_svg: anim.diagram_svg,
            images: anim.images,
            qa_pairs: anim.qa_pairs,
            analysis_result: { summary: anim.script_summary },
            animation_settings: { type: 'animation' },
            status: 'completed',
            created_at: anim.created_at,
            updated_at: anim.updated_at || anim.created_at
          };
        }
      }

      setProject(data);
      setLoading(false);
    };
    if (user) fetchProject();
  }, [user, projectId]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Loading">
          <circle cx="15" cy="15" r="15" fill="#8b5cf6">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0s"/>
          </circle>
          <circle cx="60" cy="15" r="15" fill="#ec4899">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0.2s"/>
          </circle>
          <circle cx="105" cy="15" r="15" fill="#06b6d4">
            <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" begin="0.4s"/>
          </circle>
        </svg>
      </div>
    );
  }

  if (!project) {
    return <div className="container mx-auto py-20">Proje bulunamadı.</div>;
  }

  const projectType = getProjectType(project);
  const hasDiagram = project.analysis_result?.diagram;
  const hasDiagramSvg = !!project.diagram_svg;
  const hasAnimation = (project.animation_svgs && project.animation_svgs.length > 0) ||
    (Array.isArray(project.animation_scenario) && project.animation_scenario.length > 0);

  const hasImages = project.images && project.images.length > 0;

  // Proje tipi badge rengi
  const getProjectTypeColor = () => {
    switch (projectType) {
      case 'diagram':
        return 'bg-purple-100 text-purple-800';
      case 'animation':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Proje tipi ikonu
  const getProjectIcon = () => {
    switch (projectType) {
      case 'diagram':
        return <Network className="w-4 h-4" />;
      case 'animation':
        return <Play className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-purple-200 py-16">
      <div className="container mx-auto px-4">
         <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl p-10 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">
                {(() => {
                  const words = (project.title || '').split(/\s+/);
                  const short = words.slice(0, 12).join(' ');
                  return words.length > 12 ? short + '…' : short;
                })()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getProjectTypeColor()}`}>
                  {getProjectIcon()}
                  <span className="ml-1">
                    {projectType === 'diagram' ? 'Diyagram Projesi' : 
                     projectType === 'animation' ? 'Animasyon Projesi' : 'PDF Projesi'}
                  </span>
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {project.status === 'completed' ? 'Tamamlandı' : 
                   project.status === 'processing' ? 'İşleniyor' : 'Yüklendi'}
                </Badge>
              </div>
              <CardDescription>
                Oluşturulma: {new Date(project.created_at).toLocaleString('tr-TR')}
              </CardDescription>
            </div>
                <div></div>
          </div>
        </CardHeader>
      </Card>

      {/* İçerik */}
      <div className="space-y-6">
        {/* PDF Özeti */}
        {project.analysis_result?.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Konu Özeti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {project.analysis_result.summary.split('\n\n').filter((p: string) => p.trim()).map((paragraph: string, idx: number) => (
                  <div key={idx} className="p-4 border rounded-lg bg-muted/20">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {paragraph}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Diyagram Görüntüleme */}
        {hasDiagram && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Akış Diyagramı
              </CardTitle>
              <CardDescription>
                {project.analysis_result.diagram.stepCount} adımlı süreç diyagramı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="classic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="classic" className="flex items-center gap-2">
                    <GitFork className="h-4 w-4" />
                    Klasik Görünüm
                  </TabsTrigger>
                  <TabsTrigger value="reactflow" className="flex items-center gap-2">
                    <Workflow className="h-4 w-4" />
                    İnteraktif React Flow
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="classic" className="mt-4">
                  <Card>
                    <CardContent className="p-0">
                      <div className="max-h-[600px] overflow-y-auto">
                        <ClassicDiagramView steps={project.analysis_result.diagram.steps} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reactflow" className="mt-4">
                  <Card>
                    <CardContent className="p-0">
                      <div className="h-[600px] w-full">
                        <ReactFlowDiagram 
                          steps={project.analysis_result.diagram.steps}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

            {/* Statik SVG Diyagram */}
            {hasDiagramSvg && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Diyagram (SVG)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-auto border rounded-lg p-4 bg-muted/20">
                    <div
                      className="w-full h-full min-h-[400px] flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: project.diagram_svg }}
                    />
                  </div>
                  
                  {/* SVG Açıklaması - QA verilerinden */}
                  {(project.qa_pairs || project.qa_data?.questions) && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Diyagram Açıklaması
                      </h4>
                      <div className="space-y-2 text-sm text-blue-700">
                        {project.qa_pairs ? (
                          project.qa_pairs.slice(0, 3).map((qa: any, idx: number) => (
                            <p key={idx} className="leading-relaxed">
                              <strong>• {qa.question}</strong><br />
                              <span className="text-blue-600">{qa.explanation}</span>
                            </p>
                          ))
                        ) : project.qa_data?.questions ? (
                          project.qa_data.questions.slice(0, 3).map((qa: any, idx: number) => (
                            <p key={idx} className="leading-relaxed">
                              <strong>• {qa.question}</strong><br />
                              <span className="text-blue-600">{qa.explanation || 'Açıklama mevcut değil.'}</span>
                            </p>
                          ))
                        ) : null}
                      </div>
                    </div>
                  )}

        {/* PDF Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              AI Sohbet
            </CardTitle>
            <CardDescription>
              Bu proje hakkında sorularınızı sorun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PdfChat 
              pdfSummary={project.analysis_result?.summary || ''}
              projectId={projectId}
              chatWithPdfFlow={async (input: { prompt: string; pdfContent: string }) => {
                // Basit bir chat flow implementasyonu
                try {
                  const response = await fetch('/api/chat-with-pdf', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      message: input.prompt,
                      summary: input.pdfContent,
                      projectTitle: project.title
                    }),
                  });
                  
                  if (!response.ok) {
                    throw new Error('Chat API hatası');
                  }
                  
                  const data = await response.json();
                  return { success: true, response: data.response };
                } catch (error) {
                  console.error('Chat error:', error);
                  return { 
                    success: false, 
                    error: 'Sohbet sırasında bir hata oluştu. Lütfen tekrar deneyin.' 
                  };
                }
              }}
            />
          </CardContent>
        </Card>
            </CardContent>
          </Card>
        )}

        {/* QA Display */}
        {(project.qa_pairs || project.qa_data) && (
          <QaDisplay qaPairs={project.qa_pairs || project.qa_data?.questions || []} />
        )}

            {/* Animasyon Senaryosu: PDF özeti yoksa göster */}
            {hasAnimation && !project.analysis_result?.summary && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Animasyon Senaryosu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScenarioDisplay 
                data={{
                  title: project.title,
                  summary: project.analysis_result?.summary || '',
                  detailed_scenario: project.analysis_result?.summary || '',
                  educational_objectives: [],
                  key_concepts: [],
                  target_audience: '',
                  estimated_duration: ''
                }} 
              />
        </CardContent>
      </Card>
        )}

            {/* Animasyon Sahneleri - Sesli Oynatma ile */}
            {(project.animation_svgs && project.animation_svgs.length > 0) && (
              <div className="space-y-6">
                {/* Animasyon Oynatma Kontrolleri */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Eğitici Animasyon
                  </CardTitle>
                  <CardDescription>
                      {project.animation_svgs.length} sahne animasyonu - Sesli oynatma destekli
                  </CardDescription>
                  <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      ✨ Herhangi bir konuyu yazın veya PDF yükleyin, yapay zeka ile büyüleyici animasyonlara ve interaktif deneyimlere dönüştürelim!
                    </p>
                  </div>
                </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Oynatma Kontrolleri */}
                    <div className="flex items-center justify-center gap-4 p-4 bg-muted/20 rounded-lg">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevFrame}
                        disabled={currentFrameIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="default"
                        size="sm"
                        onClick={togglePlayback}
                        className="min-w-[100px]"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Durdur
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Oynat
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextFrame}
                        disabled={currentFrameIndex >= project.animation_svgs.length - 1}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      
                      <Badge variant="outline">
                        {currentFrameIndex + 1} / {project.animation_svgs.length}
                      </Badge>
                  </div>
                </CardContent>
              </Card>

                {/* AnimationPreview Component - Sesli Oynatma */}
                <AnimationPreview
                  sceneDescriptions={project.animation_scenario?.map((scene: any) => scene.sceneDescription || '') || []}
                  currentSceneDescription={project.animation_scenario?.[currentFrameIndex]?.sceneDescription || ''}
                  currentKeyTopic={project.animation_scenario?.[currentFrameIndex]?.keyTopic || ''}
                  currentFrameSummary={project.animation_scenario?.[currentFrameIndex]?.frameSummary || ''}
                  storyboardImages={project.animation_svgs?.map((svgContent: string) => 
                    `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`
                  ) || []}
                  currentAudioUrl={null}
                  currentFrameIndex={currentFrameIndex}
                  isGeneratingInitialContent={false}
                  isPlaying={isPlaying}
                />
              </div>
            )}

            {/* Animasyon Senaryo metni yedek */}
            {hasAnimation && !project.animation_svgs && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Eğitici Animasyon
              </CardTitle>
              <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-700 leading-relaxed">
                  ✨ Herhangi bir konuyu yazın veya PDF yükleyin, yapay zeka ile büyüleyici animasyonlara ve interaktif deneyimlere dönüştürelim!
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                    {project.animation_scenario.map((scene: any, idx: number) => {
                        const text = scene?.frameSummary || scene?.sceneDescription || `Sahne ${idx+1} açıklaması`;
                        return (
                          <div key={idx} className="p-4 border rounded-lg bg-muted/20">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                                {idx + 1}
                              </div>
                              <p className="text-gray-700 leading-relaxed font-medium">
                                {text}
                              </p>
                            </div>
                          </div>
                        );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Kaydedilmiş Görseller */}
            {hasImages && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Oluşturulan Görseller
                  </CardTitle>
                  <CardDescription>
                    {project.images.length} görsel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
                    <CarouselContent>
                      {project.images.map((img: string, idx: number) => (
                        <CarouselItem key={idx} className="flex flex-col items-center text-center">
                          <div className="p-2 border bg-muted rounded-lg shadow-inner w-full h-[500px] flex items-center justify-center overflow-hidden">
                            <img src={img} alt={`Görsel ${idx+1}`} className="w-full h-full object-contain" />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
