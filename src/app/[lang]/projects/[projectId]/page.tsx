"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { createBrowserClient } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { ScenarioDisplay } from '@/components/custom/scenario-display';
import { ReactFlowDiagram } from '@/components/custom/react-flow-diagram';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Loader2, Network, Play, FileText, Eye, Workflow, GitFork } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  const params = useParams();
  const projectId = params?.projectId as string;
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const [currentLang] = React.useState<'en' | 'tr'>(language || 'tr');
  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState<any | null>(null);

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
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: project.diagram_svg }}
                    />
                  </div>
            </CardContent>
          </Card>
        )}

        {/* QA Display */}
        {(project.qa_pairs || project.qa_data) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Soru & Cevaplar
              </CardTitle>
        </CardHeader>
        <CardContent>
              <div className="text-sm text-muted-foreground">
                📋 {(project.qa_data?.questions?.length || project.qa_pairs?.length || 0)} soru mevcut
              </div>
            </CardContent>
          </Card>
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

            {/* Animasyon Sahneleri */}
            {(project.animation_svgs && project.animation_svgs.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Eğitici Animasyon
                  </CardTitle>
                  <CardDescription>
                    {project.animation_svgs.length} sahne animasyonu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Animasyon Sahneleri</h3>
                    <Carousel className="w-full max-w-4xl mx-auto" opts={{ loop: true }}>
                      <CarouselContent>
                        {project.animation_svgs.map((svgContent: string, idx: number) => (
                          <CarouselItem key={idx} className="flex flex-col items-center text-center">
                            <div className="p-2 border bg-muted rounded-lg shadow-inner w-full h-[500px] flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full flex items-center justify-center scale-95" dangerouslySetInnerHTML={{ __html: svgContent || '' }} />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2 px-2 text-center leading-tight">
                              {project.animation_scenario?.[idx]?.keyTopic || project.animation_scenario?.[idx]?.frameSummary || `Sahne ${idx + 1}`}
                            </p>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Animasyon Senaryo metni yedek */}
            {hasAnimation && !project.animation_svgs && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Eğitici Animasyon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.animation_scenario.map((scene: any, idx: number) => {
                        const text = typeof scene === 'string' ? scene : (scene.sceneDescription || scene.frameSummary || scene.keyTopic || `Sahne ${idx+1}`);
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
