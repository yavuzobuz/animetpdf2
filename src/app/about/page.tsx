
"use client";

import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card'; // CardTitle ve CardDescription'ı hala kullanabiliriz başlık için.
import { Info, Clapperboard, Sparkles, Cpu, Twitter, Linkedin, Github, Building2 } from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <Building2 className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
            Hakkımızda
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AnimatePDF ve arkasındaki ekip hakkında daha fazla bilgi edinin.
          </p>
        </div>
      </AnimatedSection>

      <main className="flex-grow">
        <AnimatedSection sectionId="about-content" className="py-12 md:py-16 bg-background" delay="delay-100">
          <div className="container mx-auto px-6 max-w-3xl">
            {/* Card bileşeni kaldırıldı, içerik doğrudan section'ın arka planını kullanacak */}
            <div className="mb-6"> {/* Başlık için bir sarmalayıcı */}
              <h2 className="text-2xl font-headline text-primary-dark">AnimatePDF & Zubo Bilişim</h2>
            </div>
            <div className="space-y-6 text-foreground/80 text-lg">
              <p className="text-justify">
                AnimatePDF, karmaşık bilgileri anlaşılır ve etkileşimli deneyimlere dönüştürme vizyonuyla geliştirilmiş bir projedir.
                Amacımız, yapay zeka teknolojilerini kullanarak öğrenme ve bilgi paylaşım süreçlerini daha verimli ve keyifli hale getirmektir.
              </p>
              <p className="font-semibold text-primary-dark text-justify">
                AnimatePDF bir <span className="text-foreground font-bold">Zubo Bilişim</span> ürünüdür.
              </p>
              <p className="text-justify">
                Zubo Bilişim olarak, yenilikçi yazılım çözümleri ve yapay zeka uygulamaları geliştirme konusunda tutkuluyuz.
                Kullanıcılarımızın hayatını kolaylaştıran, onlara değer katan ve teknolojik sınırları zorlayan projeler üretmek temel motivasyonumuzdur.
                AnimatePDF de bu motivasyonun bir yansımasıdır.
              </p>
              <p className="text-justify">
                Misyonumuz, en son teknolojileri kullanarak erişilebilir, kullanıcı dostu ve etkili araçlar sunmaktır.
                Geleceğin bilgiye erişim ve etkileşim biçimlerini şekillendirmede aktif rol oynamayı hedefliyoruz.
              </p>
            </div>

            <AnimatedSection tag="div" className="text-center mt-12" delay="delay-200">
                <Link href="/animate" passHref>
                    <Button
                    size="lg"
                    className="text-primary-foreground text-lg px-10 py-7 rounded-lg transform transition-all hover:scale-105 active:scale-95 bg-gradient-to-br from-primary-dark to-primary"
                    >
                    Uygulamayı Deneyin
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
                PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">Bağlantılar</h5>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm hover:opacity-80 transition-opacity">Ana Sayfa</Link></li>
                <li><Link href="/animate" className="text-sm hover:opacity-80 transition-opacity">Uygulamayı Kullan</Link></li>
                <li><Link href="/faq" className="text-sm hover:opacity-80 transition-opacity">SSS</Link></li>
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Gizlilik Politikası</Link></li>
                <li><Link href="#" className="text-sm hover:opacity-80 transition-opacity">Kullanım Koşulları</Link></li>
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
            &copy; {new Date().getFullYear()} AnimatePDF - Zubo Bilişim. Tüm hakları saklıdır.
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
