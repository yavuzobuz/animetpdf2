
"use client"; // useLanguage hook'u (useContext içerir) kullanıldığı için eklendi

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clapperboard, FileText, Sparkles, ImageIcon, MousePointerClick, HelpCircle, MessageSquareText, ChevronRight, UploadCloud, Cpu, Film, Eye, Twitter, Linkedin, Github, Volume2, GitFork, Info } from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context'; // useLanguage hook import edildi


export default function LandingPage() {
  const { language } = useLanguage(); // Dil bağlamından language alındı

  const featuresTr = [
    {
      icon: <FileText className="h-10 w-10 text-primary mb-4" />,
      title: "Otomatik PDF Analizi ve Özetleme",
      description: "Yapay zeka karmaşık PDF'lerinizin kilit noktalarını saniyeler içinde özetleyerek size zaman kazandırır.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "Dinamik Animasyon Senaryosu",
      description: "PDF özetlerinden yola çıkarak, görsel metaforlar ve ikon önerileriyle zenginleştirilmiş, akıcı ve ilgi çekici animasyon senaryoları oluşturur.",
    },
    {
      icon: <ImageIcon className="h-10 w-10 text-primary mb-4" />,
      title: "Yapay Zeka Destekli Görselleştirme",
      description: "Her senaryo adımı için yapay zeka ile benzersiz ve konsepte uygun görseller üretilir, anlatımınızı güçlendirir.",
    },
    {
      icon: <Volume2 className="h-10 w-10 text-primary mb-4" />,
      title: "Karelere Özel Sesli Anlatım",
      description: "Her animasyon karesinin anahtar mesajını, yapay zeka destekli doğal seslendirme ile vurgulayın, içeriğinizi daha etkileşimli ve akılda kalıcı kılın.",
    },
    {
      icon: <MousePointerClick className="h-10 w-10 text-primary mb-4" />,
      title: "İnteraktif Detay Keşfi",
      description: "Animasyon karelerindeki anahtar konulara tıklayarak, o sahnenin detaylı açıklamalarını ve arka planını keşfedin.",
    },
    {
      icon: <HelpCircle className="h-10 w-10 text-primary mb-4" />,
      title: "Pekiştirici Mini Testler",
      description: "Her PDF içeriğine özel, çoktan seçmeli mini testlerle öğrendiklerinizi eğlenceli bir şekilde pekiştirin ve kalıcı hale getirin.",
    },
    {
      icon: <MessageSquareText className="h-10 w-10 text-primary mb-4" />,
      title: "PDF İçeriğiyle İnteraktif Sohbet",
      description: "Yapay zeka destekli sohbet botu ile PDF özetiniz hakkında sorular sorun, önemli bilgileri hızla bulun ve içeriği daha derinlemesine anlayın.",
    },
    {
      icon: <GitFork className="h-10 w-10 text-primary mb-4" />,
      title: "Otomatik Akış Diyagramı",
      description: "PDF özetlerinizdeki karmaşık süreçleri veya algoritmaları adım adım görselleştiren, anlaşılır metinsel akış diyagramları oluşturun.",
    },
  ];

  const featuresEn = [
    {
      icon: <FileText className="h-10 w-10 text-primary mb-4" />,
      title: "Automatic PDF Analysis and Summarization",
      description: "AI summarizes the key points of your complex PDFs in seconds, saving you time.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "Dynamic Animation Script",
      description: "Generates fluid and engaging animation scripts from PDF summaries, enriched with visual metaphors and icon suggestions.",
    },
    {
      icon: <ImageIcon className="h-10 w-10 text-primary mb-4" />,
      title: "AI-Powered Visualization",
      description: "Produces unique, concept-appropriate visuals for each script step using AI, enhancing your narrative.",
    },
    {
      icon: <Volume2 className="h-10 w-10 text-primary mb-4" />,
      title: "Frame-Specific Voice Narration",
      description: "Highlight the key message of each animation frame with AI-powered natural voiceover, making your content more interactive and memorable.",
    },
    {
      icon: <MousePointerClick className="h-10 w-10 text-primary mb-4" />,
      title: "Interactive Detail Exploration",
      description: "Explore detailed descriptions and background of scenes by clicking on key topics in animation frames.",
    },
    {
      icon: <HelpCircle className="h-10 w-10 text-primary mb-4" />,
      title: "Reinforcing Mini-Quizzes",
      description: "Reinforce your learning in a fun way with custom multiple-choice mini-quizzes for each PDF's content.",
    },
    {
      icon: <MessageSquareText className="h-10 w-10 text-primary mb-4" />,
      title: "Interactive PDF Chat",
      description: "Ask questions about your PDF summary with an AI-powered chatbot, quickly find important information, and understand content more deeply.",
    },
    {
      icon: <GitFork className="h-10 w-10 text-primary mb-4" />,
      title: "Automatic Flowchart Generation",
      description: "Create understandable textual flowcharts that visualize complex processes or algorithms from your PDF summaries step-by-step.",
    },
  ];

  const features = language === 'en' ? featuresEn : featuresTr;

  const howItWorksStepsTr = [
    { icon: <UploadCloud className="h-12 w-12 text-primary mx-auto mb-4" />, title: "1. PDF Yükle", description: "Animasyona dönüştürmek istediğiniz PDF dosyasını seçin ve güvenle yükleyin." },
    { icon: <Cpu className="h-12 w-12 text-primary mx-auto mb-4" />, title: "2. Yapay Zeka Analizi", description: "Gelişmiş yapay zekamız belgenizi anında analiz eder, Türkçe özetler ve senaryo için hazırlar." },
    { icon: <Film className="h-12 w-12 text-primary mx-auto mb-4" />, title: "3. Otomatik Oluşturma", description: "Özetlenmiş içerikten hareketle animasyon senaryosu, kare görselleri, seslendirmeler, mini testler ve akış diyagramları otomatik olarak oluşturulur." },
    { icon: <Eye className="h-12 w-12 text-primary mx-auto mb-4" />, title: "4. İzle, Dinle, Etkileşim Kur & Sohbet Et", description: "Hazırlanan animasyonunuzu izleyin, sesli anlatımlarını dinleyin, detayları keşfedin, interaktif testlerle öğrenmenizi pekiştirin ve PDF içeriğiyle sohbet edin." },
  ];

  const howItWorksStepsEn = [
    { icon: <UploadCloud className="h-12 w-12 text-primary mx-auto mb-4" />, title: "1. Upload PDF", description: "Select and securely upload the PDF file you want to animate." },
    { icon: <Cpu className="h-12 w-12 text-primary mx-auto mb-4" />, title: "2. AI Analysis", description: "Our advanced AI instantly analyzes your document, prepares summaries, and gets it ready for scripting." },
    { icon: <Film className="h-12 w-12 text-primary mx-auto mb-4" />, title: "3. Automatic Generation", description: "Animation scripts, frame visuals, voiceovers, mini-quizzes, and flowcharts are automatically generated from the summarized content." },
    { icon: <Eye className="h-12 w-12 text-primary mx-auto mb-4" />, title: "4. Watch, Listen, Interact & Chat", description: "Watch your prepared animation, listen to voiceovers, explore details, reinforce learning with interactive quizzes, and chat with your PDF content." },
  ];

  const howItWorksSteps = language === 'en' ? howItWorksStepsEn : howItWorksStepsTr;

  const footerLinks = language === 'en' ? [
    { href: "/about", text: "About Us" },
    { href: "/faq", text: "FAQ" },
    { href: "#", text: "Privacy Policy" },
    { href: "#", text: "Terms of Use" },
    { href: "/animate", text: "Use The App" },
  ] : [
    { href: "/about", text: "Hakkımızda" },
    { href: "/faq", text: "SSS" },
    { href: "#", text: "Gizlilik Politikası" },
    { href: "#", text: "Kullanım Koşulları" },
    { href: "/animate", text: "Uygulamayı Kullan" },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <Clapperboard className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-headline">
            {language === 'en' ? "AnimatePDF: Bring Your PDFs to Life!" : "AnimatePDF: PDF'lerinizi Hayata Geçirin!"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            {language === 'en' ? "Bring Your PDFs to Life: Automatic Summaries, Fluent Animations, Interactive Chat, Mini-Tests, and Explanatory Diagrams in Seconds!" : "PDF'lerinizi Hayata Geçirin: Saniyeler İçinde Otomatik Özet, Akıcı Animasyon, Etkileşimli Sohbet, Mini Testler ve Açıklayıcı Diyagramlar!"}
          </p>
          <Link href="/animate" passHref>
            <Button
              size="lg"
              className="text-primary-foreground text-lg px-10 py-7 rounded-lg animate-border-glow transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-primary-dark to-primary"
            >
              {language === 'en' ? "Get Started for Free" : "Hemen Ücretsiz Başla"} <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection sectionId="features" className="py-16 md:py-24 bg-background" delay="delay-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-headline">
                {language === 'en' ? "Why AnimatePDF?" : "Neden AnimatePDF?"}
            </h2>
            <p className="text-md md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
                {language === 'en' ? "Rescue information from boring text piles, make it understandable and memorable for everyone." : "Sıkıcı metin yığınlarından bilgiyi kurtarın, herkes için anlaşılır ve akılda kalıcı hale getirin."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card shadow-lg hover:shadow-xl hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300 rounded-lg overflow-hidden flex flex-col text-center"
              >
                <CardHeader className="items-center p-6 bg-muted/20">
                  {feature.icon}
                  <CardTitle className="text-xl font-semibold text-foreground font-headline mt-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection sectionId="how-it-works" className="py-16 md:py-24 bg-muted/30" delay="delay-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-headline">
                {language === 'en' ? "How It Works?" : "Nasıl Çalışır?"}
            </h2>
            <p className="text-md md:text-lg text-muted-foreground mt-3 max-w-xl mx-auto">
                {language === 'en' ? "Transform your PDF into a magical animation in just 4 simple steps." : "Sadece 4 basit adımda PDF'inizi sihirli bir animasyona dönüştürün."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-primary/70 hover:ring-offset-2 hover:ring-offset-background transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="p-4 bg-primary/10 rounded-full mb-6 inline-block">
                   {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 font-headline">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection sectionId="cta" className="py-20 md:py-32 bg-gradient-to-tr from-primary/10 via-background to-background" delay="delay-300">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 font-headline">
            {language === 'en' ? "Ready to Transform Information?" : "Bilgiyi Dönüştürmeye Hazır mısınız?"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            {language === 'en' ? "Take learning and teaching to the next level with AnimatePDF. Say goodbye to static PDFs, hello to dynamic stories!" : "AnimatePDF ile öğrenmeyi ve öğretmeyi bir sonraki seviyeye taşıyın. Statik PDF'lere veda edin, dinamik hikayelere merhaba deyin!"}
          </p>
          <Link href="/animate" passHref>
            <Button
              size="lg"
              className="text-primary-foreground text-lg px-10 py-7 rounded-lg animate-border-glow transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-primary-dark to-primary"
            >
              {language === 'en' ? "Animate Your PDF Now" : "PDF'ini Şimdi Anime Et"} <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      <footer className="relative w-full mt-auto bg-primary text-foreground">
        <div className="absolute top-0 left-0 w-full h-16 bg-background rounded-bl-full rounded-br-full"></div>
        <div className="relative container mx-auto px-6 pt-28 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline flex items-center">
                <Clapperboard className="h-6 w-6 mr-2" /> AnimatePDF
              </h5>
              <p className="text-sm">
                {language === 'en' ? "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds." : "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün."}
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">
                {language === 'en' ? "Links" : "Bağlantılar"}
              </h5>
              <ul className="space-y-2">
                {footerLinks.map(link => (
                     <li key={link.text}><Link href={link.href} className="text-sm hover:opacity-80 transition-opacity">{link.text}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">
                {language === 'en' ? "Follow Us" : "Bizi Takip Edin"}
              </h5>
              <div className="flex space-x-4">
                <Link href="#" aria-label="Twitter" className="hover:opacity-80 transition-opacity">
                  <Twitter className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="LinkedIn" className="hover:opacity-80 transition-opacity">
                  <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="#" aria-label="GitHub" className="hover:opacity-80 transition-opacity">
                  <Github className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </div>
          <Separator className="mb-8 bg-foreground/30" />
          <p className="text-sm text-center">
            &copy; {new Date().getFullYear()} AnimatePDF - Zubo Bilişim. {language === 'en' ? "All rights reserved." : "Tüm hakları saklıdır."}
            <Sparkles className="inline-block h-4 w-4 mx-1" />
            {language === 'en' ? "Powered by Generative AI" : "Üretken Yapay Zeka ile güçlendirilmiştir."}
            <Cpu className="inline-block h-4 w-4 ml-1 mr-1" />
          </p>
        </div>
      </footer>
    </div>
  );
}
