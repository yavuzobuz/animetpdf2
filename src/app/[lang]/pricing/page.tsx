
"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, DollarSign, Sparkles, Clapperboard, Cpu, Twitter, Linkedin, Github, Star } from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context';

interface PricingPageProps {
  params: { lang: 'en' | 'tr' };
}

const pricingContent = {
  tr: {
    pageTitle: "Fiyatlandırma Planlarımız",
    pageSubtitle: "AnimatePDF'in tüm gücünü keşfedin. İhtiyaçlarınıza en uygun planı seçin.",
    freeTitle: "Ücretsiz Deneme",
    freePrice: "$0",
    freeFrequency: "/ay",
    freeFeatures: [
      "Ayda 1 PDF (max 10 sayfa)",
      "PDF başına max 3 animasyon karesi",
      "Standart görsel kalitesi",
      "Animasyonlarda filigran",
      "Temel özelliklere erişim",
    ],
    freeButton: "Ücretsiz Başla",
    standardTitle: "Standart Plan",
    standardPrice: "$14",
    standardFrequency: "/ay",
    standardFeatures: [
      "Ayda 10 PDF (max 50 sayfa/PDF)",
      "PDF başına max 15 animasyon karesi",
      "Yüksek kaliteli görseller",
      "Filigransız animasyonlar",
      "Tüm temel interaktif özellikler",
      "Standart e-posta desteği",
    ],
    standardButton: "Standart'ı Seç",
    proTitle: "Profesyonel Plan",
    proPrice: "$32",
    proFrequency: "/ay",
    proFeatures: [
      "Ayda 30 PDF (max 100 sayfa/PDF)",
      "PDF başına max 25 animasyon karesi",
      "En yüksek kalitede görseller",
      "Gelişmiş animasyon stilleri (Yakında)",
      "Tüm özelliklere tam erişim",
      "Öncelikli e-posta desteği",
    ],
    proButton: "Profesyonel'i Seç",
    footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
    footerLinksTitle: "Bağlantılar",
    footerFollowTitle: "Bizi Takip Edin",
    footerRights: "Tüm hakları saklıdır.",
    footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
    footerNavLinks: [
      { href: "/", text: "Ana Sayfa" },
      { href: "/animate", text: "Uygulamayı Kullan" },
      { href: "/faq", text: "SSS" },
      { href: "/about", text: "Hakkımızda" },
      { href: "#", text: "Gizlilik Politikası" },
      { href: "#", text: "Kullanım Koşulları" },
    ]
  },
  en: {
    pageTitle: "Our Pricing Plans",
    pageSubtitle: "Unlock the full power of AnimatePDF. Choose the plan that best suits your needs.",
    freeTitle: "Free Trial",
    freePrice: "$0",
    freeFrequency: "/month",
    freeFeatures: [
      "1 PDF per month (max 10 pages)",
      "Max 3 animation frames/PDF",
      "Standard image quality",
      "Watermark on animations",
      "Access to basic features",
    ],
    freeButton: "Get Started Free",
    standardTitle: "Standard Plan",
    standardPrice: "$14",
    standardFrequency: "/month",
    standardFeatures: [
      "10 PDFs per month (max 50 pages/PDF)",
      "Max 15 animation frames/PDF",
      "High-quality images",
      "No watermarks on animations",
      "All core interactive features",
      "Standard email support",
    ],
    standardButton: "Choose Standard",
    proTitle: "Professional Plan",
    proPrice: "$32",
    proFrequency: "/month",
    proFeatures: [
      "30 PDFs per month (max 100 pages/PDF)",
      "Max 25 animation frames/PDF",
      "Highest quality images",
      "Advanced animation styles (Coming Soon)",
      "Full access to all features",
      "Priority email support",
    ],
    proButton: "Choose Professional",
    footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
    footerLinksTitle: "Links",
    footerFollowTitle: "Follow Us",
    footerRights: "All rights reserved.",
    footerPoweredBy: "Powered by Generative AI",
    footerNavLinks: [
      { href: "/", text: "Home" },
      { href: "/animate", text: "Use The App" },
      { href: "/faq", text: "FAQ" },
      { href: "/about", text: "About Us" },
      { href: "#", text: "Privacy Policy" },
      { href: "#", text: "Terms of Use" },
    ]
  }
};

export default function PricingPage({ params }: PricingPageProps) {
  const { language } = useLanguage();
  const currentLang = language || params.lang || 'tr';
  const c = pricingContent[currentLang] || pricingContent.tr;

  const plans = [
    {
      title: c.freeTitle,
      price: c.freePrice,
      frequency: c.freeFrequency,
      features: c.freeFeatures,
      buttonText: c.freeButton,
      buttonLink: `/${currentLang}/signup`,
      highlight: false,
      icon: <Sparkles className="h-8 w-8 text-primary mb-4" />
    },
    {
      title: c.standardTitle,
      price: c.standardPrice,
      frequency: c.standardFrequency,
      features: c.standardFeatures,
      buttonText: c.standardButton,
      buttonLink: `/${currentLang}/signup`, // Placeholder, ideally to a payment page
      highlight: true,
      icon: <Star className="h-8 w-8 text-yellow-500 mb-4" />
    },
    {
      title: c.proTitle,
      price: c.proPrice,
      frequency: c.proFrequency,
      features: c.proFeatures,
      buttonText: c.proButton,
      buttonLink: `/${currentLang}/signup`, // Placeholder
      highlight: false,
      icon: <Sparkles className="h-8 w-8 text-primary mb-4" />
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <DollarSign className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
            {c.pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {c.pageSubtitle}
          </p>
        </div>
      </AnimatedSection>

      <main className="flex-grow">
        <AnimatedSection sectionId="pricing-plans" className="py-12 md:py-20 bg-background" delay="delay-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {plans.map((plan, index) => (
                <AnimatedSection
                  key={plan.title}
                  tag="div"
                  className={`flex ${plan.highlight ? 'delay-200' : 'delay-100'}`}
                  delay={plan.highlight ? 'delay-300' : `delay-${200 + index * 100}`}
                >
                  <Card className={`w-full flex flex-col ${plan.highlight ? 'border-2 border-primary shadow-2xl relative ring-4 ring-primary/30' : 'shadow-lg hover:shadow-xl transition-shadow duration-300'}`}>
                    {plan.highlight && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {currentLang === 'tr' ? "En Popüler" : "Most Popular"}
                      </div>
                    )}
                    <CardHeader className="text-center pt-10">
                      {plan.icon}
                      <CardTitle className="text-2xl font-bold font-headline text-foreground">{plan.title}</CardTitle>
                      <div className="mt-2">
                        <span className="text-4xl font-extrabold text-primary-dark">{plan.price}</span>
                        <span className="text-md font-medium text-muted-foreground">{plan.frequency}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between p-6">
                      <ul className="space-y-3 mb-8 text-muted-foreground">
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link href={plan.buttonLink} passHref className="mt-auto">
                        <Button
                          size="lg"
                          className={`w-full text-lg py-3 rounded-md ${plan.highlight ? 'bg-gradient-to-br from-primary-dark to-primary text-primary-foreground hover:opacity-90' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                        >
                          {plan.buttonText}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="relative w-full mt-auto bg-primary text-foreground">
        <div className="absolute top-0 left-0 w-full h-16 bg-background rounded-bl-full rounded-br-full"></div>
        <div className="relative container mx-auto px-6 pt-28 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline flex items-center">
                <Clapperboard className="h-6 w-6 mr-2" /> AnimatePDF
              </h5>
              <p className="text-sm">
                {c.footerAnimatePdfDesc}
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">{c.footerLinksTitle}</h5>
              <ul className="space-y-2">
                {c.footerNavLinks.map(link => (
                  <li key={link.text}><Link href={link.href.startsWith("#") ? link.href : `/${currentLang}${link.href}`} className="text-sm hover:opacity-80 transition-opacity">{link.text}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">{c.footerFollowTitle}</h5>
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
            &copy; {new Date().getFullYear()} AnimatePDF - Zubo Bilişim. {c.footerRights}
            <Sparkles className="inline-block h-4 w-4 mx-1" />
            {c.footerPoweredBy}
            <Cpu className="inline-block h-4 w-4 ml-1 mr-1" />
          </p>
        </div>
      </footer>
    </div>
  );
}

    