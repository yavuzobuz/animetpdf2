
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
    answer: "Metin tabanlı PDF'ler en iyi sonuçları verir. Çok fazla karmaşık grafik içeren veya taranmış (resim formatında) PDF'lerde metin çıkarımı ve analiz performansı düşebilir. İçeriğin net ve iyi yapılandırılmış olması önemlidir."
  },
  {
    question: "Animasyon senaryosu, görseller ve seslendirme nasıl oluşturuluyor?",
    answer: "PDF'inizden çıkarılan özet, gelişmiş üretken yapay zeka modellerine gönderilir. Bu modeller, özete uygun senaryo adımlarını, sahne açıklamalarını (metafor ve ikon önerileriyle), bu açıklamalara dayalı görselleri (seçtiğiniz stilde) ve karelerin anahtar konuları için seslendirmeleri üretir."
  },
  {
    question: "Görsellerin kalitesi nasıl ve stilini seçebilir miyim?",
    answer: "Yapay zeka ile üretilen görsellerin kalitesi seçilen stile ve PDF içeriğinin karmaşıklığına göre değişebilir. Amacımız, anlatımınıza uygun, anlaşılır ve estetik görseller sunmaktır. 'Temiz ve Canlı', 'Çizgi Film', 'Minimalist', 'Fotogerçekçi', 'Eskiz' ve 'Suluboya' gibi farklı sanatsal stiller arasından seçim yaparak animasyonunuzun görsel tonunu belirleyebilirsiniz."
  },
  {
    question: "Oluşturulan senaryoyu veya içerikleri (görsel, ses) sonradan düzenleyebilir miyim?",
    answer: "Şu anki sürümde, yapay zeka tarafından oluşturulan senaryo metinleri (anahtar konu, kare özeti, sahne açıklaması), görseller veya seslendirmeler doğrudan uygulama içinden düzenlenememektedir. Senaryo, PDF özetinizden otomatik olarak türetilir. Görsel stili, içerik üretimi başlamadan önce seçilebilir. Gelecekte içerik düzenleme ve kişiselleştirme özelliklerinin eklenmesi değerlendirilmektedir."
  },
  {
    question: "Oluşturulan animasyonları/içerikleri indirebilir miyim?",
    answer: "Şu anki sürümde doğrudan animasyon veya tüm içerik paketini indirme özelliği bulunmamaktadır. Animasyonları uygulama üzerinden önizleyebilir ve interaktif özelliklerini kullanabilirsiniz. Kare görselleri genellikle tarayıcı üzerinden sağ tıklayarak kaydedilebilir, seslendirmeler ise tarayıcının geliştirici araçları üzerinden bulunabilir ancak doğrudan indirme butonu yoktur."
  },
  {
    question: "Mini testler, PDF sohbeti ve akış diyagramları ne kadar güvenilir?",
    answer: "Bu özellikler, PDF'ten çıkarılan özete dayanarak yapay zeka tarafından oluşturulur. Her zaman %100 doğruluk garanti edilemese de, içeriği anlamanıza ve pekiştirmenize yardımcı olmayı amaçlar. Kritik bilgiler için orijinal PDF'e başvurmanız önerilir. Yapay zeka zaman zaman hatalı veya eksik yorumlar yapabilir."
  },
  {
    question: "PDF özetim çok uzun veya çok kısa olursa animasyon nasıl etkilenir?",
    answer: "Çok kısa özetler, az sayıda ve basit animasyon karesiyle sonuçlanabilir. Çok uzun veya karmaşık özetler ise daha fazla kare üretilmesine, üretim süresinin artmasına veya bazı durumlarda senaryo tutarlılığında zorluklara yol açabilir. En iyi sonuçlar için, PDF'in ana fikirlerini içeren, ne çok kısa ne de aşırı detaylı, dengeli ve anlaşılır bir özet hedeflenmelidir. Yapay zeka, özeti anlamlı sayıda kareye bölmeye çalışacaktır."
  },
  {
    question: "Desteklenen PDF boyutu veya sayfa sayısı sınırı var mı?",
    answer: "Şu anda belirli bir dosya boyutu veya sayfa sayısı için kesin bir üst sınır belirtilmemiştir. Ancak çok büyük (örneğin 50MB üzeri) veya çok fazla sayıda sayfa içeren (örneğin 100+ sayfa) PDF'lerin işlenmesi daha uzun sürebilir veya beklenmedik sorunlara yol açabilir. Daha iyi performans için makul boyutlarda ve odaklanmış içerikli PDF'ler kullanmanızı öneririz."
  },
  {
    question: "AnimatePDF'in ücretlendirme politikası nedir? Ücretsiz mi?",
    answer: "AnimatePDF, şu anda temel özellikleriyle ücretsiz olarak sunulmaktadır. Bu ücretsiz sürüm, belirli limitler dahilinde (örneğin, günlük işleme sayısı, animasyon kare sayısı, standart kalitede içerik üretimi) uygulamanın ana işlevlerini deneyimlemenizi sağlar.\n\nGelecekte, daha yoğun kullanım, daha yüksek limitler, premium kalitede içerik üretimi (örn: daha yüksek çözünürlüklü görseller, gelişmiş ses seçenekleri), gelişmiş analiz özellikleri ve öncelikli destek gibi avantajlar sunan 'Pro' ve 'Kurumsal' gibi ücretli abonelik planları sunmayı hedefliyoruz.\n\nAmacımız, bireysel kullanıcılar ve küçük ekipler için erişilebilir bir başlangıç noktası sunarken, daha kapsamlı ihtiyaçları olan profesyoneller ve işletmeler için de değer yaratan seçenekler oluşturmaktır. Detaylı fiyatlandırma ve plan özelliklerini kullanıma sunduğumuzda 'Fiyatlandırma' sayfamızdan duyuracağız."
  },
  {
    question: "Veri gizliliğim nasıl korunuyor?",
    answer: "Yüklediğiniz PDF'ler yalnızca analiz ve içerik üretimi amacıyla geçici olarak işlenir ve sunucularımızda saklanmaz. Üretilen içerikler (özetler, senaryolar vb.) kullanıcı deneyiminiz için geçici olarak tutulabilir, ancak bu veriler de gizlilik politikamız çerçevesinde korunur. Gizliliğiniz bizim için önemlidir. Daha fazla bilgi için (varsa) Gizlilik Politikamıza göz atabilirsiniz."
  },
  {
    question: "Bir sorunla karşılaşırsam veya geri bildirimde bulunmak istersem ne yapmalıyım?",
    answer: "Herhangi bir sorunla karşılaşırsanız, bir hata fark ederseniz veya uygulama hakkında geri bildirimde bulunmak isterseniz, lütfen [email protected] (varsayımsal e-posta adresi) adresinden bizimle iletişime geçin. Kullanıcı deneyimini iyileştirmek için geri bildirimleriniz bizim için çok değerlidir."
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

    