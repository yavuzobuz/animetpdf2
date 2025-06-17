
"use client";

import Link from 'next/link';
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedSection from '@/components/custom/animated-section';
import { HelpCircle, Clapperboard, Sparkles, Cpu, Twitter, Linkedin, Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const faqItems = [
  {
    question: "AnimatePDF nedir ve ne işe yarar?",
    answer: "AnimatePDF, PDF belgelerinizi yükleyerek otomatik olarak Türkçe özetler çıkaran, bu özetlerden animasyon senaryoları, kare görselleri ve seslendirmeler üreten bir yapay zeka uygulamasıdır. Ayrıca, interaktif mini testler, PDF içeriğiyle sohbet ve süreçleri gösteren metinsel akış diyagramları oluşturma imkanı sunar."
  },
  {
    question: "Hangi tür PDF'leri yükleyebilirim?",
    answer: "Metin tabanlı PDF'ler en iyi sonuçları verir. Çok fazla karmaşık grafik içeren veya taranmış (resim formatında) PDF'lerde metin çıkarımı ve analiz performansı düşebilir."
  },
  {
    question: "Animasyon senaryosu, görseller ve seslendirme nasıl oluşturuluyor?",
    answer: "PDF'inizden çıkarılan özet, gelişmiş üretken yapay zeka modellerine gönderilir. Bu modeller, özete uygun senaryo adımlarını, sahne açıklamalarını (metafor ve ikon önerileriyle), bu açıklamalara dayalı görselleri ve karelerin anahtar konuları için seslendirmeleri üretir."
  },
  {
    question: "Oluşturulan animasyonları/içerikleri indirebilir miyim?",
    answer: "Şu anki sürümde doğrudan animasyon veya tüm içerik paketini indirme özelliği bulunmamaktadır. Animasyonları uygulama üzerinden önizleyebilir ve interaktif özelliklerini kullanabilirsiniz. Kare görselleri genellikle tarayıcı üzerinden kaydedilebilir."
  },
  {
    question: "Mini testler, PDF sohbeti ve akış diyagramları ne kadar güvenilir?",
    answer: "Bu özellikler, PDF'ten çıkarılan özete dayanarak yapay zeka tarafından oluşturulur. Her zaman %100 doğruluk garanti edilemese de, içeriği anlamanıza ve pekiştirmenize yardımcı olmayı amaçlar. Kritik bilgiler için orijinal PDF'e başvurmanız önerilir."
  },
  {
    question: "Uygulama ücretsiz mi?",
    answer: "AnimatePDF'in temel özellikleri şu anda ücretsiz olarak sunulmaktadır. Gelecekte bazı gelişmiş özellikler veya daha yoğun kullanım için premium planlar sunulabilir."
  },
  {
    question: "Veri gizliliğim nasıl korunuyor?",
    answer: "Yüklediğiniz PDF'ler yalnızca analiz ve içerik üretimi amacıyla geçici olarak işlenir. Gizliliğiniz bizim için önemlidir. Daha fazla bilgi için Gizlilik Politikamıza (varsa) göz atabilirsiniz."
  }
];

export default function FaqPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <HelpCircle className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
            Sıkça Sorulan Sorular (SSS)
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            AnimatePDF hakkında merak ettiğiniz her şey burada.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection sectionId="faq-content" className="py-12 md:py-16 bg-background" delay="delay-100">
        <div className="container mx-auto px-6 max-w-3xl">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Sorularınızın Cevapları</CardTitle>
              <CardDescription>Aşağıda sıkça sorulan soruları ve cevaplarını bulabilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-md hover:border-primary/50 transition-colors">
                    <AccordionTrigger className="text-left hover:no-underline font-semibold px-4 py-3 text-lg">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 px-4 pb-4 text-md text-foreground/80">
                      <p className="whitespace-pre-wrap">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
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
                <li><Link href="/" className="text-sm hover:opacity-80 transition-opacity">Ana Sayfa</Link></li>
                <li><Link href="/animate" className="text-sm hover:opacity-80 transition-opacity">Uygulamayı Kullan</Link></li>
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
