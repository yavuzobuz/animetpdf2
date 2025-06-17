
"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clapperboard, FileText, Sparkles, ImageIcon, MousePointerClick, HelpCircle, MessageSquareText, ChevronRight, UploadCloud, Cpu, Film, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const AnimatedSection: React.FC<{ children: React.ReactNode, className?: string, sectionId?: string, tag?: keyof JSX.IntrinsicElements }> = ({ children, className, sectionId, tag = 'section' }) => {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const Tag = tag;

  return (
    <Tag
      id={sectionId}
      ref={ref as any}
      className={cn(
        "opacity-0 translate-y-8 transform transition-all duration-1000 ease-out",
        isVisible && "opacity-100 translate-y-0",
        className
      )}
    >
      {children}
    </Tag>
  );
};


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
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-lg shadow-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.7)] transform transition-all hover:scale-105 active:scale-95"
            >
              Hemen Ücretsiz Başla <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      <AnimatedSection sectionId="features" className="py-16 md:py-24 bg-background">
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

      <AnimatedSection sectionId="how-it-works" className="py-16 md:py-24 bg-muted/30">
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
      
      <AnimatedSection sectionId="cta" className="py-20 md:py-32 bg-gradient-to-tr from-primary/10 via-background to-background">
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 rounded-lg shadow-xl hover:shadow-[0_0_20px_hsl(var(--primary)/0.7)] transform transition-all hover:scale-105 active:scale-95"
            >
              PDF'ini Şimdi Anime Et <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

      <footer className="w-full text-center py-8 border-t border-border mt-auto">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AnimatePDF. Üretken Yapay Zeka ile güçlendirilmiştir.
        </p>
      </footer>
    </div>
  );
}

