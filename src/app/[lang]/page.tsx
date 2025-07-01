"use client"; 

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clapperboard, 
  FileText, 
  Sparkles, 
  ImageIcon, 
  MousePointerClick, 
  HelpCircle, 
  MessageSquareText, 
  ChevronRight, 
  UploadCloud, 
  Cpu, 
  Film, 
  Eye, 
  Twitter, 
  Linkedin, 
  Github, 
  Volume2, 
  GitFork, 
  DollarSign, 
  ArrowRight, 
  Zap, 
  Shield, 
  Users 
} from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context'; 
import { type StaticImageData } from 'next/image'; 

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function LandingPage({ params }: LangPageProps) {
  const { language } = useLanguage(); 
  const [currentLang, setCurrentLang] = React.useState<'en' | 'tr'>('tr');
  
  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);

  const pageContent = {
    tr: {
      heroTitle: "PDF'lerinizi Sihirli Animasyonlara Dönüştürün",
      heroSubtitle: "Yapay zeka ile sıkıcı PDF'lerinizi saniyeler içinde etkileşimli animasyonlara, sesli anlatımlara ve mini testlere çevirin. Öğrenme deneyimini tamamen değiştirin!",
      heroButton: "Hemen Ücretsiz Başla",
      heroSecondaryButton: "Demo Videoyu İzle",
      featuresTitle: "Neden AnimatePDF Seçmelisiniz?",
      featuresSubtitle: "Modern teknoloji ile öğrenme ve öğretmeyi bir sonraki seviyeye taşıyın",
      howItWorksTitle: "Nasıl Çalışır?",
      howItWorksSubtitle: "Sadece 4 basit adımda PDF'inizi büyülü bir deneyime dönüştürün",
      ctaTitle: "Geleceğin Öğrenme Deneyimini Yaşamaya Hazır mısınız?",
      ctaSubtitle: "AnimatePDF ile bilgiyi anlamlı, etkileşimli ve unutulmaz hale getirin. Statik belgelere elveda, dinamik hikayelere merhaba deyin!",
      ctaButton: "Şimdi Ücretsiz Deneyin",
      statsTitle: "Güvenilir Rakamlar",
      footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
      footerLinksTitle: "Bağlantılar",
      footerFollowTitle: "Bizi Takip Edin",
      footerRights: "Tüm hakları saklıdır.",
      footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
      features: [
        {
          icon: <FileText className="h-12 w-12 text-purple-600 mb-6" />,
          title: "Otomatik PDF Analizi",
          description: "Yapay zeka karmaşık PDF'lerinizin kilit noktalarını saniyeler içinde özetleyerek size değerli zaman kazandırır.",
        },
        {
          icon: <Sparkles className="h-12 w-12 text-pink-600 mb-6" />,
          title: "Dinamik Animasyon Senaryosu",
          description: "Görsel metaforlar ve modern ikonlarla zenginleştirilmiş, akıcı ve büyüleyici animasyon senaryoları oluşturur.",
        },
        {
          icon: <ImageIcon className="h-12 w-12 text-blue-600 mb-6" />,
          title: "AI Görselleştirme",
          description: "Her senaryo adımı için yapay zeka ile benzersiz ve konsepte uygun profesyonel görseller üretilir.",
        },
        {
          icon: <Volume2 className="h-12 w-12 text-green-600 mb-6" />,
          title: "Sesli Anlatım",
          description: "Doğal seslendirme teknolojisi ile her animasyon karesinin mesajını güçlü bir şekilde vurgulayın.",
        },
        {
          icon: <MousePointerClick className="h-12 w-12 text-orange-600 mb-6" />,
          title: "İnteraktif Keşif",
          description: "Animasyon karelerindeki anahtar konulara tıklayarak detaylı açıklamaları ve arka planını keşfedin.",
        },
        {
          icon: <HelpCircle className="h-12 w-12 text-indigo-600 mb-6" />,
          title: "Akıllı Mini Testler",
          description: "Öğrendiklerinizi eğlenceli çoktan seçmeli testlerle pekiştirin ve kalıcı hale getirin.",
        },
        {
          icon: <MessageSquareText className="h-12 w-12 text-red-600 mb-6" />,
          title: "PDF Sohbet Botu",
          description: "Yapay zeka destekli sohbet botu ile PDF içeriğiniz hakkında anlık sorular sorun ve yanıtlar alın.",
        },
        {
          icon: <GitFork className="h-12 w-12 text-teal-600 mb-6" />,
          title: "Otomatik Diyagramlar",
          description: "Karmaşık süreçleri görselleştiren, anlaşılır ve şık akış diyagramları otomatik oluşturun.",
        },
      ],
      howItWorksSteps: [
        { 
          icon: <UploadCloud className="h-16 w-16 text-purple-600 mx-auto mb-6" />, 
          title: "PDF Yükleyin", 
          description: "Animasyona dönüştürmek istediğiniz PDF dosyasını güvenle yükleyin. Tüm formatlar desteklenir." 
        },
        { 
          icon: <Cpu className="h-16 w-16 text-pink-600 mx-auto mb-6" />, 
          title: "AI Analiz Ediyor", 
          description: "Gelişmiş yapay zeka teknolojimiz belgenizi anında analiz eder ve özetler hazırlar." 
        },
        { 
          icon: <Film className="h-16 w-16 text-blue-600 mx-auto mb-6" />, 
          title: "Otomatik Oluşturma", 
          description: "Animasyon senaryosu, görseller, seslendirme, testler ve diyagramlar otomatik oluşturulur." 
        },
        { 
          icon: <Eye className="h-16 w-16 text-green-600 mx-auto mb-6" />, 
          title: "İzle & Etkileş", 
          description: "Hazır animasyonunuzu izleyin, testleri çözün ve içerikle etkileşimli sohbet edin." 
        },
      ],
      stats: [
        { number: "10K+", label: "PDF Dönüştürüldü" },
        { number: "95%", label: "Memnuniyet Oranı" },
        { number: "5 dk", label: "Ortalama İşlem Süresi" },
        { number: "24/7", label: "Teknik Destek" },
      ],
      footerLinks: [
        { href: "/about", text: "Hakkımızda" },
        { href: "/pricing", text: "Fiyatlandırma" },
        { href: "/faq", text: "SSS" },
        { href: "#", text: "Gizlilik Politikası" },
        { href: "#", text: "Kullanım Koşulları" },
        { href: "/animate", text: "Uygulamayı Kullan" },
      ],
    },
    en: {
      heroTitle: "Transform PDFs into Magical Animations",
      heroSubtitle: "Use AI to convert boring PDFs into interactive animations, voice narrations, and mini quizzes in seconds. Completely revolutionize the learning experience!",
      heroButton: "Start Free Now",
      heroSecondaryButton: "Watch Demo Video",
      featuresTitle: "Why Choose AnimatePDF?",
      featuresSubtitle: "Take learning and teaching to the next level with modern technology",
      howItWorksTitle: "How It Works?",
      howItWorksSubtitle: "Transform your PDF into a magical experience in just 4 simple steps",
      ctaTitle: "Ready to Experience the Future of Learning?",
      ctaSubtitle: "Make knowledge meaningful, interactive, and unforgettable with AnimatePDF. Say goodbye to static documents, hello to dynamic stories!",
      ctaButton: "Try Free Now",
      statsTitle: "Trusted Numbers",
      footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
      footerLinksTitle: "Links",
      footerFollowTitle: "Follow Us",
      footerRights: "All rights reserved.",
      footerPoweredBy: "Powered by Generative AI.",
      features: [
        {
          icon: <FileText className="h-12 w-12 text-purple-600 mb-6" />,
          title: "Automatic PDF Analysis",
          description: "AI summarizes key points from complex PDFs in seconds, saving you valuable time.",
        },
        {
          icon: <Sparkles className="h-12 w-12 text-pink-600 mb-6" />,
          title: "Dynamic Animation Scenarios",
          description: "Creates fluid and captivating animation scenarios enriched with visual metaphors and modern icons.",
        },
        {
          icon: <ImageIcon className="h-12 w-12 text-blue-600 mb-6" />,
          title: "AI Visualization",
          description: "Generates unique and concept-appropriate professional visuals for each scenario step with AI.",
        },
        {
          icon: <Volume2 className="h-12 w-12 text-green-600 mb-6" />,
          title: "Voice Narration",
          description: "Powerfully emphasize each animation frame's message with natural voice synthesis technology.",
        },
        {
          icon: <MousePointerClick className="h-12 w-12 text-orange-600 mb-6" />,
          title: "Interactive Exploration",
          description: "Click on key topics in animation frames to discover detailed explanations and background.",
        },
        {
          icon: <HelpCircle className="h-12 w-12 text-indigo-600 mb-6" />,
          title: "Smart Mini Quizzes",
          description: "Reinforce your learning with fun multiple-choice tests and make it permanent.",
        },
        {
          icon: <MessageSquareText className="h-12 w-12 text-red-600 mb-6" />,
          title: "PDF Chat Bot",
          description: "Ask instant questions about your PDF content and get answers with AI-powered chat bot.",
        },
        {
          icon: <GitFork className="h-12 w-12 text-teal-600 mb-6" />,
          title: "Automatic Diagrams",
          description: "Automatically create clear and elegant flow diagrams that visualize complex processes.",
        },
      ],
      howItWorksSteps: [
        { 
          icon: <UploadCloud className="h-16 w-16 text-purple-600 mx-auto mb-6" />, 
          title: "Upload PDF", 
          description: "Securely upload the PDF file you want to convert to animation. All formats supported." 
        },
        { 
          icon: <Cpu className="h-16 w-16 text-pink-600 mx-auto mb-6" />, 
          title: "AI Analyzes", 
          description: "Our advanced AI technology instantly analyzes your document and prepares summaries." 
        },
        { 
          icon: <Film className="h-16 w-16 text-blue-600 mx-auto mb-6" />, 
          title: "Auto Generation", 
          description: "Animation scenarios, visuals, narration, tests, and diagrams are automatically created." 
        },
        { 
          icon: <Eye className="h-16 w-16 text-green-600 mx-auto mb-6" />, 
          title: "Watch & Interact", 
          description: "Watch your ready animation, solve tests, and have interactive chat with the content." 
        },
      ],
      stats: [
        { number: "10K+", label: "PDFs Converted" },
        { number: "95%", label: "Satisfaction Rate" },
        { number: "5 min", label: "Average Processing Time" },
        { number: "24/7", label: "Technical Support" },
      ],
      footerLinks: [
        { href: "/about", text: "About Us" },
        { href: "/pricing", text: "Pricing" },
        { href: "/faq", text: "FAQ" },
        { href: "#", text: "Privacy Policy" },
        { href: "#", text: "Terms of Service" },
        { href: "/animate", text: "Use App" },
      ],
    }
  };

  const content = pageContent[currentLang] || pageContent.tr;

  return (
    <div className="page-container">
      {/* Modern Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatedSection tag="div" className="space-y-8">
              {/* Floating particles effect */}
              <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
              <div className="absolute top-32 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-20 float-animation"></div>
              <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-40 pulse-soft"></div>
              
              {/* Hero Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>AI Powered • Always Free to Start</span>
              </div>

              {/* Hero Title */}
              <h1 className="text-5xl lg:text-7xl font-bold headline-modern">
                <span className="gradient-animate">
                  {content.heroTitle}
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-xl lg:text-2xl subheading-modern max-w-3xl mx-auto text-balance">
                {content.heroSubtitle}
              </p>

              {/* Hero Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Link href={`/${currentLang}/animate`}>
                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transform hover:scale-105 transition-all duration-450"
                  >
                    {content.heroButton}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-450" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/20 text-gray-700 dark:text-gray-200 bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-full text-lg font-semibold rounded-xl transition-all duration-450"
                >
                  {content.heroSecondaryButton}
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 pt-12 opacity-60">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm">{currentLang === 'tr' ? '100% Güvenli' : '100% Secure'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">{currentLang === 'tr' ? '10,000+ Kullanıcı' : '10,000+ Users'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">{currentLang === 'tr' ? 'Anında İşlem' : 'Instant Processing'}</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <AnimatedSection tag="div">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-4xl lg:text-5xl font-bold gradient-purple-pink mb-2 group-hover:scale-110 transition-transform duration-450">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.featuresTitle}
            </h2>
            <p className="text-xl subheading-modern max-w-2xl mx-auto">
              {content.featuresSubtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {content.features.map((feature, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 100}ms]`}>
                <Card className="feature-card group h-full transform hover:scale-105 transition-all duration-1400 glass-card border border-white/20 hover:border-white/40">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center group-hover:scale-110 transition-transform duration-675">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:gradient-animate transition-all duration-675">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.howItWorksTitle}
            </h2>
            <p className="text-xl subheading-modern max-w-2xl mx-auto">
              {content.howItWorksSubtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.howItWorksSteps.map((step, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 150}ms]`}>
                <Card className="workflow-card relative group h-full text-center transform hover:scale-105 transition-all duration-750 gradient-card border-0 shadow-xl hover:shadow-2xl">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  <CardHeader className="pt-8">
                    <div className="flex justify-center group-hover:scale-110 transition-transform duration-675">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:gradient-animate transition-all duration-450">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>

                  {/* Arrow for connection (except last item) */}
                  {index < content.howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="h-8 w-8 text-purple-400 opacity-50" />
                    </div>
                  )}
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 cta-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
        <div className="relative container mx-auto px-4">
          <AnimatedSection tag="div" className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold headline-modern mb-6 text-white">
              {content.ctaTitle}
            </h2>
            <p className="text-xl lg:text-2xl text-gray-200 mb-10 leading-relaxed max-w-3xl mx-auto">
              {content.ctaSubtitle}
            </p>
            <Link href={`/${currentLang}/animate`}>
              <Button 
                size="lg" 
                className="group bg-white text-purple-700 hover:bg-gray-100 px-10 py-5 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-450"
              >
                <Sparkles className="mr-3 h-6 w-6" />
                {content.ctaButton}
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-450" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </section>
    </div>
  );
}