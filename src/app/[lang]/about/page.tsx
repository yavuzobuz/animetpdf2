
"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building2, Clapperboard, Sparkles, Cpu, Twitter, Linkedin, Github, DollarSign } from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/language-context';

interface AboutPageProps {
  params: { lang: 'en' | 'tr' };
}

export default function AboutPage({ params }: AboutPageProps) {
  const { language } = useLanguage();
  const currentLang = language || params.lang || 'tr';

  const content = {
    tr: {
      title: "Hakkımızda",
      subtitle: "AnimatePDF ve arkasındaki ekip hakkında daha fazla bilgi edinin.",
      sectionTitle: "AnimatePDF & Zubo Bilişim",
      p1: "AnimatePDF, karmaşık bilgileri anlaşılır ve etkileşimli deneyimlere dönüştürme vizyonuyla geliştirilmiş bir projedir. Amacımız, yapay zeka teknolojilerini kullanarak öğrenme ve bilgi paylaşım süreçlerini daha verimli ve keyifli hale getirmektir.",
      p2_strong: "AnimatePDF bir",
      p2_normal: "ürünüdür.",
      p3: "Zubo Bilişim olarak, yenilikçi yazılım çözümleri ve yapay zeka uygulamaları geliştirme konusunda tutkuluyuz. Kullanıcılarımızın hayatını kolaylaştıran, onlara değer katan ve teknolojik sınırları zorlayan projeler üretmek temel motivasyonumuzdur. AnimatePDF de bu motivasyonun bir yansımasıdır.",
      p4: "Misyonumuz, en son teknolojileri kullanarak erişilebilir, kullanıcı dostu ve etkili araçlar sunmaktır. Geleceğin bilgiye erişim ve etkileşim biçimlerini şekillendirmede aktif rol oynamayı hedefliyoruz.",
      tryButton: "Uygulamayı Deneyin",
      footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
      footerLinksTitle: "Bağlantılar",
      footerFollowTitle: "Bizi Takip Edin",
      footerRights: "Tüm hakları saklıdır.",
      footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
      footerNavLinks: [
        { href: "/", text: "Ana Sayfa" },
        { href: "/animate", text: "Uygulamayı Kullan" },
        { href: "/pricing", text: "Fiyatlandırma" },
        { href: "/faq", text: "SSS" },
        { href: "#", text: "Gizlilik Politikası" },
        { href: "#", text: "Kullanım Koşulları" },
      ]
    },
    en: {
      title: "About Us",
      subtitle: "Learn more about AnimatePDF and the team behind it.",
      sectionTitle: "AnimatePDF & Zubo Bilişim",
      p1: "AnimatePDF is a project developed with the vision of transforming complex information into understandable and interactive experiences. Our goal is to make learning and information sharing processes more efficient and enjoyable using artificial intelligence technologies.",
      p2_strong: "AnimatePDF is a product of",
      p2_normal: ".",
      p3: "As Zubo Bilişim, we are passionate about developing innovative software solutions and artificial intelligence applications. Our main motivation is to produce projects that facilitate the lives of our users, add value to them, and push technological boundaries. AnimatePDF is a reflection of this motivation.",
      p4: "Our mission is to provide accessible, user-friendly, and effective tools using the latest technologies. We aim to play an active role in shaping the future forms of information access and interaction.",
      tryButton: "Try The App",
      footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
      footerLinksTitle: "Links",
      footerFollowTitle: "Follow Us",
      footerRights: "All rights reserved.",
      footerPoweredBy: "Powered by Generative AI",
      footerNavLinks: [
        { href: "/", text: "Home" },
        { href: "/animate", text: "Use The App" },
        { href: "/pricing", text: "Pricing" },
        { href: "/faq", text: "FAQ" },
        { href: "#", text: "Privacy Policy" },
        { href: "#", text: "Terms of Use" },
      ]
    }
  };

  const c = content[currentLang] || content.tr;


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <Building2 className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
            {c.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </div>
      </AnimatedSection>

      <main className="flex-grow">
        <AnimatedSection sectionId="about-content" className="py-12 md:py-16 bg-background" delay="delay-100">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="mb-6"> 
              <h2 className="text-2xl font-headline text-primary-dark">{c.sectionTitle}</h2>
            </div>
            <div className="space-y-6 text-foreground/80 text-lg">
              <p className="text-justify">
                {c.p1}
              </p>
              <p className="font-semibold text-primary-dark text-justify">
                {c.p2_strong} <span className="text-foreground font-bold">Zubo Bilişim</span> {c.p2_normal}
              </p>
              <p className="text-justify">
                {c.p3}
              </p>
              <p className="text-justify">
                {c.p4}
              </p>
            </div>

            <AnimatedSection tag="div" className="text-center mt-12" delay="delay-200">
                <Link href={`/${currentLang}/animate`} passHref>
                    <Button
                    size="lg"
                    className="text-primary-foreground text-lg px-10 py-7 rounded-lg transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-primary-dark to-primary"
                    >
                    {c.tryButton}
                    </Button>
                </Link>
            </AnimatedSection>
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

    