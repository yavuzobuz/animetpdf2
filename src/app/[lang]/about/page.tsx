"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Users, 
  Lightbulb, 
  Rocket, 
  Heart, 
  Globe,
  Sparkles, // Sparkles ikonu zaten mevcut
  Award,
  TrendingUp,
  Shield,
  Zap,
  BookOpen,
  Brain,
  Cpu,
  Eye,
  ArrowRight,
  CheckCircle,
  Clapperboard, 
  Twitter,      
  Linkedin,     
  Github        
} from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function AboutPage({ params }: LangPageProps) {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = React.useState<'en' | 'tr'>('tr');
  
  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);

  const pageContent = {
    tr: {
      heroTitle: "Eğitimi Yeniden Tanımlıyoruz",
      heroSubtitle: "AnimatePDF, yapay zeka gücüyle statik PDF'leri dinamik, etkileşimli öğrenme deneyimlerine dönüştüren devrim niteliğinde bir platformdur.",
      missionTitle: "Misyonumuz",
      missionDescription: "Bilgiyi daha erişilebilir, anlaşılır ve etkileşimli hale getirerek öğrenme deneyimini köklü bir şekilde değiştirmek ve herkesi güçlendirmek.",
      visionTitle: "Vizyonumuz",
      visionDescription: "Dünya çapında eğitim teknolojisinde öncü konumda yer alarak, her bireyin potansiyelini ortaya çıkarabileceği bir gelecek yaratmak.",
      valuesTitle: "Değerlerimiz",
      teamTitle: "Takımımız",
      teamSubtitle: "Tutkulu mühendisler, yaratıcı tasarımcılar ve eğitim uzmanlarından oluşan ekibimiz",
      achievementsTitle: "Başarılarımız",
      ctaTitle: "Bizimle Bu Yolculuğa Çıkın",
      ctaSubtitle: "AnimatePDF ile öğrenmenin geleceğini şekillendirelim ve birlikte daha akıllı bir dünya yaratmaya başlayalım.",
      ctaButton: "Hemen Başlayın",
      // Animate sayfasından gelen footer metinleri
      footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
      footerLinksTitle: "Bağlantılar",
      footerFollowTitle: "Bizi Takip Edin",
      footerRights: "Tüm hakları saklıdır.",
      footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
      footerNavLinks: [
          { href: "/", text: "Ana Sayfa" },
          { href: "/about", text: "Hakkımızda" },
          { href: "/pricing", text: "Fiyatlandırma" },
          { href: "/faq", text: "SSS" },
          { href: "#", text: "Gizlilik Politikası" },
          { href: "#", text: "Kullanım Koşulları" },
      ],
      values: [
        {
          icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
          title: "İnovasyon",
          description: "Sürekli yenilik yaparak teknolojinin sınırlarını zorluyoruz."
        },
        {
          icon: <Users className="h-8 w-8 text-blue-500" />,
          title: "Kullanıcı Odaklılık",
          description: "Her kararımızda kullanıcı deneyimini merkeze alıyoruz."
        },
        {
          icon: <Heart className="h-8 w-8 text-red-500" />,
          title: "Tutku",
          description: "İşimizi seviyoruz ve bu tutkumuzu ürünlerimize yansıtıyoruz."
        },
        {
          icon: <Shield className="h-8 w-8 text-green-500" />,
          title: "Güvenilirlik",
          description: "Verilerinizin güvenliği ve gizliliği bizim önceliğimizdir."
        },
        {
          icon: <Globe className="h-8 w-8 text-purple-500" />,
          title: "Erişilebilirlik",
          description: "Teknolojimizi herkesçin kullanılabilir hale getiriyoruz."
        },
        {
          icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
          title: "Sürekli Gelişim",
          description: "Hiç durmadan öğreniyor ve gelişiyoruz."
        }
      ],
      team: [
        {
          name: "Ahmet Yılmaz",
          role: "Kurucu & CEO",
          description: "15 yıllık tech deneyimi ile eğitime yenilik getiriyor.",
          expertise: ["AI/ML", "Product Strategy", "Leadership"]
        },
        {
          name: "Zeynep Kaya", 
          role: "CTO",
          description: "Yapay zeka ve makine öğrenmesi alanında uzman.",
          expertise: ["AI Engineering", "System Architecture", "Innovation"]
        },
        {
          name: "Mehmet Özkan",
          role: "Lead Developer",
          description: "Full-stack geliştirici ve teknoloji tutkunu.",
          expertise: ["React", "Node.js", "Cloud Computing"]
        },
        {
          name: "Ayşe Demir",
          role: "UX/UI Designer",
          description: "Kullanıcı deneyimi ve arayüz tasarımında yaratıcı çözümler.",
          expertise: ["User Experience", "Visual Design", "Prototyping"]
        }
      ],
      achievements: [
        {
          icon: <Award className="h-12 w-12 text-yellow-500" />,
          title: "TechCrunch Startup Ödülü",
          description: "2024 yılında en yenilikçi eğitim teknolojisi startupı ödülü"
        },
        {
          icon: <Users className="h-12 w-12 text-blue-500" />,
          title: "10,000+ Aktif Kullanıcı",
          description: "Dünya çapında binlerce öğrenci ve eğitimcinin tercihi"
        },
        {
          icon: <TrendingUp className="h-12 w-12 text-green-500" />,
          title: "%300 Büyüme",
          description: "Son 6 ayda kullanıcı tabanımızda üç kat artış"
        },
        {
          icon: <Brain className="h-12 w-12 text-purple-500" />,
          title: "AI Teknoloji Lideri",
          description: "Eğitim sektöründe yapay zeka kullanımında öncü"
        }
      ]
    },
    en: {
      heroTitle: "Redefining Education",
      heroSubtitle: "AnimatePDF is a revolutionary platform that transforms static PDFs into dynamic, interactive learning experiences using the power of artificial intelligence.",
      missionTitle: "Our Mission",
      missionDescription: "To fundamentally transform the learning experience by making knowledge more accessible, understandable, and interactive, empowering everyone.",
      visionTitle: "Our Vision",
      visionDescription: "To be a global leader in educational technology, creating a future where every individual can unlock their full potential.",
      valuesTitle: "Our Values",
      teamTitle: "Our Team",
      teamSubtitle: "Our team consists of passionate engineers, creative designers, and education experts",
      achievementsTitle: "Our Achievements",
      ctaTitle: "Join Us on This Journey",
      ctaSubtitle: "Let's shape the future of learning with AnimatePDF and start creating a smarter world together.",
      ctaButton: "Get Started Now",
      // Animate sayfasından gelen footer metinleri
      footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
      footerLinksTitle: "Links",
      footerFollowTitle: "Follow Us",
      footerRights: "All rights reserved.",
      footerPoweredBy: "Powered by Generative AI",
      footerNavLinks: [
          { href: "/", text: "Home" },
          { href: "/about", text: "About Us" },
          { href: "/pricing", text: "Pricing" },
          { href: "/faq", text: "FAQ" },
          { href: "#", text: "Privacy Policy" },
          { href: "#", text: "Terms of Use" },
      ],
      values: [
        {
          icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
          title: "Innovation",
          description: "We constantly innovate and push the boundaries of technology."
        },
        {
          icon: <Users className="h-8 w-8 text-blue-500" />,
          title: "User-Centric",
          description: "We put user experience at the center of every decision we make."
        },
        {
          icon: <Heart className="h-8 w-8 text-red-500" />,
          title: "Passion",
          description: "We love what we do and reflect this passion in our products."
        },
        {
          icon: <Shield className="h-8 w-8 text-green-500" />,
          title: "Reliability",
          description: "Your data security and privacy is our priority."
        },
        {
          icon: <Globe className="h-8 w-8 text-purple-500" />,
          title: "Accessibility",
          description: "We make our technology accessible to everyone."
        },
        {
          icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
          title: "Continuous Growth",
          description: "We never stop learning and developing."
        }
      ],
      team: [
        {
          name: "Ahmet Yılmaz",
          role: "Founder & CEO",
          description: "Bringing innovation to education with 15 years of tech experience.",
          expertise: ["AI/ML", "Product Strategy", "Leadership"]
        },
        {
          name: "Zeynep Kaya",
          role: "CTO", 
          description: "Expert in artificial intelligence and machine learning.",
          expertise: ["AI Engineering", "System Architecture", "Innovation"]
        },
        {
          name: "Mehmet Özkan",
          role: "Lead Developer",
          description: "Full-stack developer and technology enthusiast.",
          expertise: ["React", "Node.js", "Cloud Computing"]
        },
        {
          name: "Ayşe Demir",
          role: "UX/UI Designer",
          description: "Creative solutions in user experience and interface design.",
          expertise: ["User Experience", "Visual Design", "Prototyping"]
        }
      ],
      achievements: [
        {
          icon: <Award className="h-12 w-12 text-yellow-500" />,
          title: "TechCrunch Startup Award",
          description: "Most innovative education technology startup award in 2024"
        },
        {
          icon: <Users className="h-12 w-12 text-blue-500" />,
          title: "10,000+ Active Users",
          description: "Preferred by thousands of students and educators worldwide"
        },
        {
          icon: <TrendingUp className="h-12 w-12 text-green-500" />,
          title: "300% Growth",
          description: "Three-fold increase in our user base in the last 6 months"
        },
        {
          icon: <Brain className="h-12 w-12 text-purple-500" />,
          title: "AI Technology Leader",
          description: "Pioneer in the use of artificial intelligence in education"
        }
      ]
    }
  };

  const content = pageContent[currentLang] || pageContent.tr;

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatedSection tag="div" className="space-y-8">
              {/* Floating elements */}
              <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
              <div className="absolute top-32 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-20 float-animation"></div>
              <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-40 pulse-soft"></div>
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span>Hakkımızda • About Us</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-7xl font-bold headline-modern">
                <span className="gradient-animate">
                  {content.heroTitle}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl subheading-modern max-w-3xl mx-auto text-balance">
                {content.heroSubtitle}
              </p>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </section>      {/* Mission & Vision Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <AnimatedSection tag="div">
              <Card className="glass-card h-full transform hover:scale-105 transition-all duration-750 border border-white/20">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold headline-modern">
                    {content.missionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {content.missionDescription}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection tag="div" delay="delay-200">
              <Card className="glass-card h-full transform hover:scale-105 transition-all duration-750 border border-white/20">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold headline-modern">
                    {content.visionTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {content.visionDescription}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.valuesTitle}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.values.map((value, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 100}ms]`}>
                <Card className="gradient-card h-full transform hover:scale-105 transition-all duration-750 border-0 shadow-xl hover:shadow-2xl">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      {value.icon}
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.teamTitle}
            </h2>
            <p className="text-xl subheading-modern max-w-2xl mx-auto">
              {content.teamSubtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.team.map((member, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 150}ms]`}>
                <Card className="glass-card h-full transform hover:scale-105 transition-all duration-750 border border-white/20 overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    {/* Avatar placeholder */}
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold">
                      {member.name}
                    </CardTitle>
                    <p className="text-purple-600 dark:text-purple-400 font-semibold">
                      {member.role}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {member.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge 
                          key={skillIndex} 
                          variant="outline" 
                          className="text-xs bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.achievementsTitle}
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.achievements.map((achievement, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 100}ms]`}>
                <Card className="gradient-card h-full text-center transform hover:scale-105 transition-all duration-750 border-0 shadow-xl hover:shadow-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex justify-center mb-6">
                      {achievement.icon}
                    </div>
                    <CardTitle className="text-lg font-bold">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
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
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-450"
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