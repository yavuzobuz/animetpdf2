"use client";

import React, { useState, useEffect } from 'react'
import { TopicSimplifierForm } from '@/components/custom/topic-simplifier-form'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useLanguage } from '@/contexts/language-context'
import { useParams } from 'next/navigation'
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
} from 'lucide-react'

interface AnimatePdfAppPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

// Simple translation dictionary for this page
const I18N = {
  en: {
    badge: 'AI Wizard',
    heroLine1: "Transform Your Questions, Text and PDFs into ",
    heroHighlight: 'Magical Animations',
    heroDescription: 'Write any topic or upload a PDF, and let AI turn it into captivating animations and interactive experiences! ✨',
    features: ['AI Powered', 'Instant Processing', 'Visual Richness', 'Interactive'],
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
    features: ['AI Destekli', 'Anında İşlem', 'Görsel Zenginlik', 'İnteraktif'],
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

export default function AnimatePdfAppPage({ params: paramsPromise }: AnimatePdfAppPageProps) {
  const { language } = useLanguage()
  const urlParams = useParams()
  const currentLang = urlParams.lang as string || 'tr'
  const [isVisible, setIsVisible] = useState(false)
  const t = I18N[language] ?? I18N.tr;

  useEffect(() => {
    setIsVisible(true)
  }, [])

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

            {/* Main Form Section */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-8 -left-8 opacity-20">
                <Sparkles className="w-16 h-16 text-orange-300 animate-pulse" />
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-20">
                <Star className="w-12 h-12 text-purple-300 animate-bounce delay-1000" />
              </div>

              {/* Single frame: directly render the form without extra wrapper */}
                  <TopicSimplifierForm />
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
  )
}
