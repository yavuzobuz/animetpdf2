"use client";

import React from 'react';
import { TopicSimplifierForm } from '@/components/custom/topic-simplifier-form';
import AnimatedSection from '@/components/custom/animated-section';
import { useLanguage } from '@/contexts/language-context'; 
import { Sparkles, Wand2, Star } from 'lucide-react';

interface AnimatePdfAppPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

const pageUIText = {
  tr: {
    mainTitle: "Öğrenme Sihirbazı",
    mainSubtitle: "Herhangi bir konuyu yazın veya PDF yükleyin, sihirli animasyonlara ve büyüleyici diyagramlara dönüştürelim! ✨",
    trustIndicators: [
      { icon: "🧬", text: "AI Destekli" },
      { icon: "⚡", text: "Anında İşlem" },
      { icon: "🎨", text: "Görsel Zenginlik" },
      { icon: "🎯", text: "Eğitim Odaklı" }
    ]
  },
  en: {
    mainTitle: "Learning Wizard", 
    mainSubtitle: "Enter any topic or upload PDF, let's transform them into magical animations and enchanting diagrams! ✨",
    trustIndicators: [
      { icon: "🧬", text: "AI Powered" },
      { icon: "⚡", text: "Instant Processing" },
      { icon: "🎨", text: "Visual Rich" },
      { icon: "🎯", text: "Education Focused" }
    ]
  }
};

export default function AnimatePdfAppPage({ params }: AnimatePdfAppPageProps) {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = React.useState<'en' | 'tr'>('tr');
  
  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);
  
  const uiText = pageUIText[currentLang] || pageUIText.tr;

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Gradient Orbs - Ana sayfadan */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      
      <div className="relative container mx-auto px-4 pt-32 pb-16">
        {/* Hero Section */}
        <AnimatedSection tag="div" className="text-center mb-16">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
            <Wand2 className="h-12 w-12 text-purple-500 animate-bounce-subtle" />
            <Star className="h-8 w-8 text-pink-400 animate-pulse delay-500" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black font-headline gradient-animate mb-8 leading-tight tracking-tight">
            {uiText.mainTitle}
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto font-light leading-relaxed mb-12">
            {uiText.mainSubtitle}
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-12 opacity-80">
            {uiText.trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                <span className="text-xl">{indicator.icon}</span>
                <span className="text-sm font-medium text-white">{indicator.text}</span>
              </div>
            ))}
        </div>
        </AnimatedSection>

        {/* Main Content */}
        <AnimatedSection tag="div" delay="delay-300" className="max-w-5xl mx-auto">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-xl">
              <TopicSimplifierForm />
                    </div>
        </AnimatedSection>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <Sparkles className="h-16 w-16 text-yellow-300 animate-pulse" />
                    </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Sparkles className="h-12 w-12 text-purple-300 animate-bounce delay-1000" />
                  </div>
        <div className="absolute top-1/2 right-20 opacity-20">
          <Star className="h-8 w-8 text-pink-300 animate-pulse delay-2000" />
        </div>
      </div>
    </div>
  );
}
