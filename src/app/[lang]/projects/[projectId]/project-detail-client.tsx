"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { createBrowserClient } from '@/lib/supabase';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Wand2, 
  Star, 
  Brain,
  Zap,
  Upload,
  Play,
  FileText,
  Palette
} from 'lucide-react';
import { QaDisplay } from '@/components/custom/qa-display';
import { PdfChat } from '@/components/custom/pdf-chat';

interface ProjectDetailClientProps {
  params: {
    lang: string;
    projectId: string;
  };
}

// Simple translation dictionary for this page
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

export default function ProjectDetailClient({ params }: ProjectDetailClientProps) {
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const projectId = params.projectId;
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  const t = I18N[language as keyof typeof I18N] ?? I18N.tr;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Proje bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center mb-8">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t.badge}
                </Badge>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
                {t.heroLine1}
                <span className="relative">
                  <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent transition-all duration-700 hover:animate-pulse-slow inline-block">
                    {t.heroHighlight}
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 -rotate-1 -z-10 animate-pulse"></div>
                </span>{" "}
                Dönüştürün
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                {t.heroDescription}
              </p>
            </div>

            {/* Project Content Section */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 opacity-20">
                <Sparkles className="w-16 h-16 text-orange-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-20">
                <Star className="w-12 h-12 text-purple-300 animate-bounce delay-1000" />
              </div>

              {/* Project Content Display */}
              <div className="space-y-8">
                {/* Konu Özeti */}
                {project.analysis_result?.summary && (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Konu Özeti</h2>
                      </div>
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

                {/* Animasyon Görselleri */}
                {project.animation_svgs && project.animation_svgs.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Eğitici Animasyon</h2>
                      </div>
                      <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          ✨ Herhangi bir konuyu yazın veya PDF yükleyin, yapay zeka ile büyüleyici animasyonlara ve interaktif deneyimlere dönüştürelim!
                        </p>
                      </div>
                      <AnimationPreview
                        sceneDescriptions={project.animation_scenario?.map((scene: any) => scene.sceneDescription || '') || []}
                        currentSceneDescription={project.animation_scenario?.[0]?.sceneDescription || ''}
                        currentKeyTopic={project.animation_scenario?.[0]?.keyTopic || ''}
                        currentFrameSummary={project.animation_scenario?.[0]?.frameSummary || ''}
                        storyboardImages={project.animation_svgs?.map((svgContent: string) => 
                          `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgContent)))}`
                        ) || []}
                        currentAudioUrl={null}
                        currentFrameIndex={0}
                        isGeneratingInitialContent={false}
                        isPlaying={false}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Animasyon Senaryosu Metinleri */}
                {project.animation_scenario && project.animation_scenario.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-green-100 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Animasyon Altındaki Metinler</h2>
                      </div>
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

                {/* PDF Chat */}
                {project.analysis_result?.summary && (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-xl">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">AI Sohbet</h2>
                      </div>
                      <PdfChat 
                        pdfSummary={project.analysis_result?.summary || ''}
                        projectId={projectId}
                        chatWithPdfFlow={async (input: { prompt: string; pdfContent: string }) => {
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
                )}

                {/* QA Display */}
                {(project.qa_pairs || project.qa_data) && (
                  <QaDisplay qaPairs={project.qa_pairs || project.qa_data?.questions || []} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">{t.howTitle}</h2>
              <p className="text-xl text-gray-600">
                {t.howSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.steps.map((stepObj, index) => ({...stepObj, step:`${index+1}`, icon: [Upload, Brain, Play][index] })).map((step, index) => (
                <Card
                  key={index}
                  className="text-center p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 border-2 border-gray-100 group bg-white"
                >
                  <CardContent className="p-0">
                    <div className="relative mb-6">
                      <div
                        className={`w-20 h-20 ${step.iconColor} rounded-full flex items-center justify-center mx-auto shadow-lg transition-all duration-500 group-hover:scale-110`}
                      >
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">{t.showcaseTitle}</h2>
              <p className="text-xl text-gray-600">
                {t.showcaseSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.showcase.map((f, index) => ({...f, icon:[Play,Brain,Sparkles,Star,Wand2,FileText][index]})).map((feature, index) => (
                <Card
                  key={index}
                  className={`${feature.bg} border-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 group cursor-pointer`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 ${feature.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}
                    >
                      <feature.icon className="w-8 h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}