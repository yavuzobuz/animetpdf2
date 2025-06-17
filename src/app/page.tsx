
"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clapperboard, FileText, Sparkles, ImageIcon, MousePointerClick, HelpCircle, MessageSquareText, ChevronRight, UploadCloud, Cpu, Film, Eye, Twitter, Linkedin, Github } from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { Separator } from '@/components/ui/separator';


export default function LandingPage() {
  const features = [
    {
      icon: <FileText className="h-10 w-10 text-primary mb-4" />,
      title: "Otomatik PDF Analizi ve Özetleme",
      description: "Yapay zeka, karmaşık PDF'lerinizin anahtar noktalarını saniyeler içinde Türkçe olarak özetler, size zaman kazandırır.",
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
      title: "Tamamen Türkçe İçerik",
      description: "Uygulama içerisindeki tüm özetler, senaryolar, açıklamalar ve testler akıcı ve doğal bir Türkçe ile sunulur.",
    }
  ];

  const howItWorksSteps = [
    { icon: <UploadCloud className="h-12 w-12 text-primary mx-auto mb-4" />, title: "1. PDF Yükle", description: "Animasyona dönüştürmek istediğiniz PDF dosyasını seçin ve güvenle yükleyin." },
    { icon: <Cpu className="h-12 w-12 text-primary mx-auto mb-4" />, title: "2. Yapay Zeka Analizi", description: "Gelişmiş yapay zekamız belgenizi anında analiz eder, Türkçe özetler ve senaryo için hazırlar." },
    { icon: <Film className="h-12 w-12 text-primary mx-auto mb-4" />, title: "3. Otomatik Oluşturma", description: "Özetlenmiş içerikten hareketle animasyon senaryosu, kare görselleri ve mini testler otomatik olarak oluşturulur." },
    { icon: <Eye className="h-12 w-12 text-primary mx-auto mb-4" />, title: "4. İzle & Etkileşim Kur", description: "Hazırlanan animasyonunuzu izleyin, detayları keşfedin ve interaktif testlerle öğrenmenizi pekiştirin." },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <Clapperboard className="h-20 w-20 text-primary mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 font-headline">
            AnimatePDF: PDF'lerinizi Hayata Geçirin!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Karmaşık PDF belgelerinizi saniyeler içinde etkileyici animasyonlu hikayelere, açıklayıcı videolara ve interaktif mini testlere dönüştürün. Tamamen Türkçe!
          </p>
          <Link href="/animate" passHref>
            <Button
              size="lg"
              className="text-primary-foreground text-lg px-10 py-7 rounded-lg animate-border-glow transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-primary-dark to-primary"
            >
              Hemen Ücretsiz Başla <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection sectionId="features" className="py-16 md:py-24 bg-background" delay="delay-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-headline">Neden AnimatePDF?</h2>
            <p className="text-md md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
              Bilgiyi sıkıcı metin yığınlarından kurtarın, onu herkes için anlaşılır ve akılda kalıcı hale getirin.
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-headline">Nasıl Çalışır?</h2>
            <p className="text-md md:text-lg text-muted-foreground mt-3 max-w-xl mx-auto">Sadece 4 basit adımda PDF'inizi sihirli bir animasyona dönüştürün.</p>
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
            Bilgiyi Dönüştürmeye Hazır mısınız?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            AnimatePDF ile öğrenmeyi ve öğretmeyi bir sonraki seviyeye taşıyın. Statik PDF'lere veda edin, dinamik hikayelere merhaba deyin!
          </p>
          <Link href="/animate" passHref>
            <Button
              size="lg"
              className="text-primary-foreground text-lg px-10 py-7 rounded-lg animate-border-glow transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-primary-dark to-primary"
            >
              PDF'ini Şimdi Anime Et <ChevronRight className="ml-2 h-5 w-5" />
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
                PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">Bağlantılar</h5>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Hakkımızda</Link></li>
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Kullanım Koşulları</Link></li>
                <li><Link href="/animate" className="text-sm hover:opacity-80 transition-opacity">Uygulamayı Kullan</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">Bizi Takip Edin</h5>
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
            &copy; {new Date().getFullYear()} AnimatePDF. Tüm hakları saklıdır.
            <Sparkles className="inline-block h-4 w-4 mx-1" />
            Üretken Yapay Zeka
            <Cpu className="inline-block h-4 w-4 ml-1 mr-1" />
            ile güçlendirilmiştir.
          </p>
        </div>
      </footer>
    </div>
  );
}
    
