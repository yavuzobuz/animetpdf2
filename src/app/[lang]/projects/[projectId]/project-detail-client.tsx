"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { createBrowserClient } from '@/lib/supabase';
import { AnimationPreview } from '@/components/custom/animation-preview';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sparkles, 
  Star, 
  Brain,
  Upload,
  Play,
  FileText,
  HelpCircle,
  Wand2
} from 'lucide-react';
import { QaDisplay } from '@/components/custom/qa-display';
import { PdfChat } from '@/components/custom/pdf-chat';

interface ProjectDetailClientProps {
  params: {
    projectId: string;
  };
}

export default function ProjectDetailClient({ params }: ProjectDetailClientProps) {
  const { user, loading: authLoading } = useAuth();
  const projectId = params.projectId;
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);



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
      <div className="min-h-screen bg-white">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 right-40 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>

        <section className="py-16 sm:py-24 bg-gradient-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center space-x-4 mb-8">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Sihirbazı
                  </Badge>
                </div>
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-4 border-orange-500 mx-auto mb-4 sm:mb-6"></div>
                <p className="text-lg sm:text-xl text-gray-600">Yükleniyor...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 right-40 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>

        <section className="py-16 sm:py-24 bg-gradient-to-b from-orange-50 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center space-x-4 mb-8">
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Sihirbazı
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Proje Bulunamadı</h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto">Aradığınız proje mevcut değil.</p>
              </div>
            </div>
          </div>
        </section>
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
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center space-x-4 mb-8">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Sihirbazı
                </Badge>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
                <span className="relative">
                  <span className="text-orange-500 transition-all duration-500 hover:scale-110 inline-block">
                    {project.title}
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 -rotate-1 -z-10 animate-pulse"></div>
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                Herhangi bir konuyu yazın veya PDF yükleyin, yapay zeka ile büyüleyici animasyonlara ve interaktif deneyimlere dönüştürelim! ✨
              </p>
            </div>

            {/* Project Content Section */}
            <div className="relative">
              {/* Decorative Elements - Hidden on mobile for cleaner look */}
              <div className="absolute -top-8 -left-8 opacity-20 hidden lg:block">
                <Sparkles className="w-16 h-16 text-orange-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-20 hidden lg:block">
                <Star className="w-12 h-12 text-purple-300 animate-bounce delay-1000" />
              </div>

              {/* Project Content Display */}
              <div className="grid gap-6 sm:gap-8">
                {/* Konu Özeti */}
                {project.analysis_result?.summary && (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-100 shadow-xl hover:shadow-xl transition-all duration-500 hover:scale-105 group">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Konu Özeti</h2>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {(() => {
                          // Önce \n\n ile böl, sonra . ile böl, sonra - ile böl
                          let paragraphs = project.analysis_result.summary.split('\n\n').filter((p: string) => p.trim());
                          
                          // Eğer tek paragraf varsa, cümlelere böl
                          if (paragraphs.length === 1) {
                            const sentences = paragraphs[0].split(/[.!?]+/).filter((s: string) => s.trim().length > 10);
                            if (sentences.length > 1) {
                              paragraphs = sentences.map((s: string) => s.trim()).filter((s: string) => s.length > 0);
                            }
                          }
                          
                          // Eğer hala tek paragraf varsa, - ile böl
                          if (paragraphs.length === 1) {
                            const bulletPoints = paragraphs[0].split(/[-•]\s*/).filter((p: string) => p.trim().length > 10);
                            if (bulletPoints.length > 1) {
                              paragraphs = bulletPoints.map((p: string) => p.trim()).filter((p: string) => p.length > 0);
                            }
                          }
                          
                          return paragraphs.map((paragraph: string, idx: number) => (
                            <div key={idx} className="p-3 sm:p-4 bg-orange-50/50 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors duration-300">
                              <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                                  {paragraph.endsWith('.') ? paragraph : paragraph + '.'}
                                </p>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Animasyon Görselleri */}
                {project.animation_svgs && project.animation_svgs.length > 0 && (
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Eğitici Animasyon</h2>
                      </div>
                      <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                          İçeriğinizi görsel metaforlarla zenginleştirilmiş animasyonlara dönüştürüyoruz. Her kare özenle tasarlanmış ve öğrenme deneyiminizi maksimize edecek şekilde hazırlanmıştır.
                        </p>
                      </div>
                      <AnimationPreview
                        sceneDescriptions={(() => {
                          // animation_scenario varsa ondan al, yoksa scenes array'inden al
                          if (project.animation_scenario && project.animation_scenario.length > 0) {
                            return project.animation_scenario.map((scene: any) => scene.sceneDescription || scene.frameSummary || '');
                          } else if (project.scenes && Array.isArray(project.scenes)) {
                            return project.scenes;
                          }
                          return [];
                        })()}
                        currentSceneDescription={(() => {
                          if (project.animation_scenario && project.animation_scenario.length > 0) {
                            return project.animation_scenario[0]?.sceneDescription || project.animation_scenario[0]?.frameSummary || '';
                          } else if (project.scenes && Array.isArray(project.scenes) && project.scenes.length > 0) {
                            return project.scenes[0];
                          }
                          return '';
                        })()}
                        currentKeyTopic={project.animation_scenario?.[0]?.keyTopic || project.title || ''}
                        currentFrameSummary={(() => {
                          if (project.animation_scenario && project.animation_scenario.length > 0) {
                            return project.animation_scenario[0]?.frameSummary || project.animation_scenario[0]?.sceneDescription || '';
                          } else if (project.scenes && Array.isArray(project.scenes) && project.scenes.length > 0) {
                            return project.scenes[0];
                          }
                          return '';
                        })()}
                        storyboardImages={project.animation_svgs?.map((svgContent: string) => 
                          `data:image/svg+xml;base64,${btoa(encodeURIComponent(svgContent))}`
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
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">Animasyon Senaryosu Metinleri</h2>
                      </div>
                      <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                          Her animasyon sahnesinin detaylı açıklaması ve hikaye akışı. Bu metinler animasyonunuzun temelini oluşturur ve öğrenme deneyiminizi zenginleştirir.
                        </p>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        {project.animation_scenario.map((scene: any, idx: number) => {
                          const text = scene?.frameSummary || scene?.sceneDescription || `Sahne ${idx+1} açıklaması`;
                          return (
                            <div key={idx} className="p-4 sm:p-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border-2 border-purple-100 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg group/scene">
                              <div className="flex items-start gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg transition-all duration-300 group-hover/scene:scale-110 group-hover/scene:rotate-3 flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="text-xs sm:text-sm font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                                      Sahne {idx + 1}
                                    </span>
                                    {scene?.keyTopic && (
                                      <span className="text-xs sm:text-sm font-medium text-pink-600 bg-pink-100 px-2 py-1 rounded-full">
                                        {scene.keyTopic}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                                    {text}
                                  </p>
                                </div>
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
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-indigo-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                          <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">PDF Sohbet Botu</h2>
                      </div>
                      <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                          İçerik hakkında soru sorabileceğiniz yapay zeka destekli asistan. Projenizle ilgili detaylı bilgi almak için sohbet edebilirsiniz.
                        </p>
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
                  <Card className="bg-white/80 backdrop-blur-sm border-2 border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                          <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">İnteraktif Quiz</h2>
                      </div>
                      <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                          Öğrendiklerinizi pekiştirmek için akıllı çoktan seçmeli testler. Her soruyu yanıtladıktan sonra detaylı açıklamalar ile konuyu daha iyi anlayabilirsiniz.
                        </p>
                      </div>
                      <QaDisplay qaPairs={project.qa_pairs || project.qa_data?.questions || []} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 sm:mb-6">Nasıl Kullanılır?</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Sadece 3 basit adımda harika animasyonlar oluşturun
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {title: 'Konuyu Yazın veya PDF Yükleyin', desc: 'Öğrenmek istediğiniz konuyu yazın ya da mevcut PDF dosyanızı yükleyin', iconColor: 'bg-orange-500', icon: Upload},
                {title: 'AI Analiz Etsin', desc: 'Yapay zeka içeriğinizi analiz ederek en uygun animasyon senaryosunu hazırlasın', iconColor: 'bg-blue-500', icon: Brain},
                {title: 'Animasyonu İzleyin', desc: 'Hazır olan interaktif animasyonunuzu izleyin ve öğrenmenin keyfini çıkarın', iconColor: 'bg-green-500', icon: Play},
              ].map((step, index) => (
                <Card
                  key={index}
                  className="text-center p-6 sm:p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 border-2 border-gray-100 group bg-white"
                >
                  <CardContent className="p-0">
                    <div className="relative mb-4 sm:mb-6">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 ${step.iconColor} rounded-full flex items-center justify-center mx-auto shadow-lg transition-all duration-500 group-hover:scale-110`}
                      >
                        <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{step.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 sm:mb-6">Neler Elde Edeceksiniz?</h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Her PDF'den kapsamlı bir öğrenme deneyimi yaratıyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                {title:'Animasyonlu Hikayeler', desc:'İçeriğinizi görsel metaforlarla zenginleştirilmiş animasyonlara dönüştürüyoruz', iconColor:'bg-red-500', bg:'bg-red-50', icon: Play},
                {title:'İnteraktif Testler', desc:'Öğrendiklerinizi pekiştirmek için akıllı çoktan seçmeli testler', iconColor:'bg-blue-500', bg:'bg-blue-50', icon: Brain},
                {title:'PDF Sohbet Botu', desc:'İçerik hakkında soru sorabileceğiniz yapay zeka destekli asistan', iconColor:'bg-purple-500', bg:'bg-purple-50', icon: Sparkles},
                {title:'Sesli Anlatım', desc:'Her animasyon karesi için profesyonel kalitede seslendirme', iconColor:'bg-green-500', bg:'bg-green-50', icon: Star},
                {title:'Akış Diyagramları', desc:'Karmaşık süreçleri anlatan görsel akış şemaları', iconColor:'bg-orange-500', bg:'bg-orange-50', icon: Wand2},
                {title:'PDF Özetleri', desc:'Ana konuların vurgulandığı kapsamlı özetler', iconColor:'bg-pink-500', bg:'bg-pink-50', icon: FileText},
              ].map((feature, index) => (
                <Card
                  key={index}
                  className={`${feature.bg} border-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1 group cursor-pointer`}
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${feature.iconColor} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}
                    >
                      <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
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