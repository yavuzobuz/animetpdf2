
"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedSection from '@/components/custom/animated-section';
import { HelpCircle, Clapperboard, Sparkles, Cpu, Twitter, Linkedin, Github, MessageSquare, Bot, User, Send, Loader2, X, Info, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useLanguage } from '@/contexts/language-context';
import { faqChat, type FaqChatInput, type FaqChatOutput } from '@/ai/flows/faq-chat-flow';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

interface FaqPageProps {
  params: { lang: 'en' | 'tr' };
}

const faqContentData = {
  tr: {
    pageTitle: "Sıkça Sorulan Sorular (SSS)",
    pageSubtitle: "AnimatePDF hakkında merak ettiğiniz her şey burada. Aşağıdaki chatbot'u kullanarak da sorularınıza hızlıca yanıt bulabilirsiniz!",
    accordionTitle: "Detaylı Soru & Cevaplar",
    accordionDesc: "Aşağıda sıkça sorulan soruları ve cevaplarını bulabilirsiniz.",
    chatbotDialogTitle: "SSS Asistanı",
    chatbotDialogDesc: "Sorularınızı yanıtlamak için buradayım. Sadece aşağıdaki SSS listesindeki bilgilere dayanarak cevap verebilirim.",
    chatbotPlaceholder: "Sorunuzu buraya yazın...",
    chatbotSend: "Gönder",
    chatbotClose: "Kapat",
    chatbotWaiting: "Sorularınızı bekliyorum...",
    chatbotErrorTitle: "SSS Chatbot Hatası",
    chatbotErrorDesc: "Chatbot ile iletişim kurulamadı.",
    chatbotGenericError: "Üzgünüm, bir sorunla karşılaştım ve şu anda cevap veremiyorum.",
    footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
    footerLinksTitle: "Bağlantılar",
    footerFollowTitle: "Bizi Takip Edin",
    footerRights: "Tüm hakları saklıdır.",
    footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
    items: [
      { question: "AnimatePDF nedir ve ne işe yarar?", answer: "AnimatePDF, PDF belgelerinizi yükleyerek otomatik olarak Türkçe özetler çıkaran, bu özetlerden animasyon senaryoları, kare görselleri ve seslendirmeler üreten bir yapay zeka uygulamasıdır. Ayrıca, interaktif mini testler, PDF içeriğiyle sohbet ve süreçleri gösteren metinsel akış diyagramları oluşturma imkanı sunar." },
      { question: "Hangi tür PDF'leri yükleyebilirim?", answer: "Metin tabanlı PDF'ler en iyi sonuçları verir. Çok fazla karmaşık grafik içeren veya taranmış (resim formatında) PDF'lerde metin çıkarımı ve analiz performansı düşebilir. İçeriğin net ve iyi yapılandırılmış olması önemlidir." },
      { question: "Animasyon senaryosu, görseller ve seslendirme nasıl oluşturuluyor?", answer: "PDF'inizden çıkarılan özet, gelişmiş üretken yapay zeka modellerine gönderilir. Bu modeller, özete uygun senaryo adımlarını, sahne açıklamalarını (metafor ve ikon önerileriyle), bu açıklamalara dayalı görselleri (seçtiğiniz stilde) ve karelerin anahtar konuları için seslendirmeleri üretir." },
      { question: "Görsellerin kalitesi nasıl ve stilini seçebilir miyim?", answer: "Yapay zeka ile üretilen görsellerin kalitesi seçilen stile ve PDF içeriğinin karmaşıklığına göre değişebilir. Amacımız, anlatımınıza uygun, anlaşılır ve estetik görseller sunmaktır. 'Temiz ve Canlı', 'Çizgi Film', 'Minimalist', 'Fotogerçekçi', 'Eskiz' ve 'Suluboya' gibi farklı sanatsal stiller arasından seçim yaparak animasyonunuzun görsel tonunu belirleyebilirsiniz." },
      { question: "Oluşturulan senaryoyu veya içerikleri (görsel, ses) sonradan düzenleyebilir miyim?", answer: "Şu anki sürümde, yapay zeka tarafından oluşturulan senaryo metinleri (anahtar konu, kare özeti, sahne açıklaması), görseller veya seslendirmeler doğrudan uygulama içinden düzenlenememektedir. Senaryo, PDF özetinizden otomatik olarak türetilir. Görsel stili, içerik üretimi başlamadan önce seçilebilir. Gelecekte içerik düzenleme ve kişiselleştirme özelliklerinin eklenmesi değerlendirilmektedir." },
      { question: "Oluşturulan animasyonları/içerikleri indirebilir miyim?", answer: "Şu anki sürümde doğrudan animasyon veya tüm içerik paketini indirme özelliği bulunmamaktadır. Animasyonları uygulama üzerinden önizleyebilir ve interaktif özelliklerini kullanabilirsiniz. Kare görselleri genellikle tarayıcı üzerinden sağ tıklayarak kaydedilebilir, seslendirmeler ise tarayıcının geliştirici araçları üzerinden bulunabilir ancak doğrudan indirme butonu yoktur." },
      { question: "Mini testler, PDF sohbeti ve akış diyagramları ne kadar güvenilir?", answer: "Bu özellikler, PDF'ten çıkarılan özete dayanarak yapay zeka tarafından oluşturulur. Her zaman %100 doğruluk garanti edilemese de, içeriği anlamanıza ve pekiştirmenize yardımcı olmayı amaçlar. Kritik bilgiler için orijinal PDF'e başvurmanız önerilir. Yapay zeka zaman zaman hatalı veya eksik yorumlar yapabilir." },
      { question: "PDF özetim çok uzun veya çok kısa olursa animasyon nasıl etkilenir?", answer: "Çok kısa özetler, az sayıda ve basit animasyon karesiyle sonuçlanabilir. Çok uzun veya karmaşık özetler ise daha fazla kare üretilmesine, üretim süresinin artmasına veya bazı durumlarda senaryo tutarlılığında zorluklara yol açabilir. En iyi sonuçlar için, PDF'in ana fikirlerini içeren, ne çok kısa ne de aşırı detaylı, dengeli ve anlaşılır bir özet hedeflenmelidir. Yapay zeka, özeti anlamlı sayıda kareye bölmeye çalışacaktır." },
      { question: "Desteklenen PDF boyutu veya sayfa sayısı sınırı var mı?", answer: "Şu anda belirli bir dosya boyutu veya sayfa sayısı için kesin bir üst sınır belirtilmemiştir. Ancak çok büyük (örneğin 50MB üzeri) veya çok fazla sayıda sayfa içeren (örneğin 100+ sayfa) PDF'lerin işlenmesi daha uzun sürebilir veya beklenmedik sorunlara yol açabilir. Daha iyi performans için makul boyutlarda ve odaklanmış içerikli PDF'ler kullanmanızı öneririz." },
      { question: "AnimatePDF'in ücretlendirme politikası nedir? Ücretsiz mi?", answer: "AnimatePDF, şu anda temel özellikleriyle ücretsiz olarak sunulmaktadır. Bu ücretsiz sürüm, belirli limitler dahilinde (örneğin, günlük işleme sayısı, animasyon kare sayısı, standart kalitede içerik üretimi) uygulamanın ana işlevlerini deneyimlemenizi sağlar.\n\nGelecekte, daha yoğun kullanım, daha yüksek limitler, premium kalitede içerik üretimi (örn: daha yüksek çözünürlüklü görseller, gelişmiş ses seçenekleri), gelişmiş analiz özellikleri ve öncelikli destek gibi avantajlar sunan 'Pro' ve 'Kurumsal' gibi ücretli abonelik planları sunmayı hedefliyoruz.\n\nAmacımız, bireysel kullanıcılar ve küçük ekipler için erişilebilir bir başlangıç noktası sunarken, daha kapsamlı ihtiyaçları olan profesyoneller ve işletmeler için de değer yaratan seçenekler oluşturmaktır. Detaylı fiyatlandırma ve plan özelliklerini kullanıma sunduğumuzda 'Fiyatlandırma' sayfamızdan duyuracağız." },
      { question: "Veri gizliliğim nasıl korunuyor?", answer: "Yüklediğiniz PDF'ler yalnızca analiz ve içerik üretimi amacıyla geçici olarak işlenir ve sunucularımızda saklanmaz. Üretilen içerikler (özetler, senaryolar vb.) kullanıcı deneyiminiz için geçici olarak tutulabilir, ancak bu veriler de gizlilik politikamız çerçevesinde korunur. Gizliliğiniz bizim için önemlidir. Daha fazla bilgi için (varsa) Gizlilik Politikamıza göz atabilirsiniz." },
      { question: "Bir sorunla karşılaşırsam veya geri bildirimde bulunmak istersem ne yapmalıyım?", answer: "Herhangi bir sorunla karşılaşırsanız, bir hata fark ederseniz veya uygulama hakkında geri bildirimde bulunmak isterseniz, lütfen [email protected] (varsayımsal e-posta adresi) adresinden bizimle iletişime geçin. Kullanıcı deneyimini iyileştirmek için geri bildirimleriniz bizim için çok değerlidir." }
    ],
    footerNavLinks: [
      { href: "/", text: "Ana Sayfa" },
      { href: "/animate", text: "Uygulamayı Kullan" },
      { href: "/pricing", text: "Fiyatlandırma" },
      { href: "/about", text: "Hakkımızda" },
      { href: "#", text: "Gizlilik Politikası" },
      { href: "#", text: "Kullanım Koşulları" },
    ]
  },
  en: {
    pageTitle: "Frequently Asked Questions (FAQ)",
    pageSubtitle: "Everything you want to know about AnimatePDF is here. You can also find quick answers to your questions using the chatbot below!",
    accordionTitle: "Detailed Questions & Answers",
    accordionDesc: "Below you can find frequently asked questions and their answers.",
    chatbotDialogTitle: "FAQ Assistant",
    chatbotDialogDesc: "I'm here to answer your questions. I can only answer based on the information in the FAQ list below.",
    chatbotPlaceholder: "Type your question here...",
    chatbotSend: "Send",
    chatbotClose: "Close",
    chatbotWaiting: "Waiting for your questions...",
    chatbotErrorTitle: "FAQ Chatbot Error",
    chatbotErrorDesc: "Could not communicate with the chatbot.",
    chatbotGenericError: "Sorry, I encountered an issue and cannot respond right now.",
    footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
    footerLinksTitle: "Links",
    footerFollowTitle: "Follow Us",
    footerRights: "All rights reserved.",
    footerPoweredBy: "Powered by Generative AI",
    items: [
        { question: "What is AnimatePDF and what does it do?", answer: "AnimatePDF is an AI application that automatically extracts English summaries from your uploaded PDF documents and generates animation scripts, frame visuals, and voiceovers from these summaries. It also offers the ability to create interactive mini-quizzes, chat with PDF content, and generate textual flow diagrams illustrating processes." },
        { question: "What types of PDFs can I upload?", answer: "Text-based PDFs yield the best results. Performance in text extraction and analysis may decrease for PDFs with many complex graphics or scanned (image format) PDFs. It's important for the content to be clear and well-structured." },
        { question: "How are animation scripts, visuals, and voiceovers created?", answer: "The summary extracted from your PDF is sent to advanced generative AI models. These models produce script steps suitable for the summary, scene descriptions (with metaphor and icon suggestions), visuals based on these descriptions (in your chosen style), and voiceovers for the key topics of the frames." },
        { question: "What is the quality of the visuals and can I choose the style?", answer: "The quality of AI-generated visuals can vary depending on the chosen style and the complexity of the PDF content. Our aim is to provide clear, aesthetic visuals suitable for your narrative. You can determine the visual tone of your animation by choosing from different artistic styles such as 'Clean and Vibrant', 'Cartoon', 'Minimalist', 'Photorealistic', 'Sketch', and 'Watercolor'." },
        { question: "Can I edit the generated script or content (visuals, audio) afterwards?", answer: "In the current version, script texts (key topic, frame summary, scene description), visuals, or voiceovers generated by AI cannot be directly edited within the application. The script is automatically derived from your PDF summary. The visual style can be selected before content generation begins. Adding content editing and personalization features is being considered for the future." },
        { question: "Can I download the generated animations/content?", answer: "The current version does not have a direct download feature for animations or the entire content package. You can preview animations through the application and use its interactive features. Frame visuals can usually be saved by right-clicking via the browser, and voiceovers can be found through browser developer tools, but there is no direct download button." },
        { question: "How reliable are mini-quizzes, PDF chat, and flowcharts?", answer: "These features are generated by AI based on the summary extracted from the PDF. While 100% accuracy cannot always be guaranteed, they aim to help you understand and reinforce the content. It is recommended to refer to the original PDF for critical information. AI may occasionally make incorrect or incomplete interpretations." },
        { question: "How does the animation get affected if my PDF summary is too long or too short?", answer: "Very short summaries may result in few and simple animation frames. Very long or complex summaries might lead to more frames, increased production time, or, in some cases, difficulties in script consistency. For best results, a balanced and understandable summary containing the main ideas of the PDF, neither too short nor overly detailed, should be aimed for. The AI will try to divide the summary into a meaningful number of frames." },
        { question: "Is there a limit to the supported PDF size or page count?", answer: "Currently, no specific upper limit for file size or page count has been stated. However, processing very large (e.g., over 50MB) or very numerous (e.g., 100+ pages) PDFs may take longer or lead to unexpected issues. We recommend using reasonably sized PDFs with focused content for better performance." },
        { question: "What is AnimatePDF's pricing policy? Is it free?", answer: "AnimatePDF is currently offered free of charge with its basic features. This free version allows you to experience the main functionalities of the application within certain limits (e.g., daily processing count, number of animation frames, standard quality content production).\n\nIn the future, we aim to offer paid subscription plans such as 'Pro' and 'Enterprise' that will provide advantages like more intensive use, higher limits, premium quality content production (e.g., higher resolution visuals, advanced audio options), advanced analysis features, and priority support.\n\nOur goal is to provide an accessible starting point for individual users and small teams, while also creating value-added options for professionals and businesses with more comprehensive needs. We will announce detailed pricing and plan features on our 'Pricing' page when they are available." },
        { question: "How is my data privacy protected?", answer: "The PDFs you upload are processed temporarily solely for analysis and content generation purposes and are not stored on our servers. Generated content (summaries, scripts, etc.) may be temporarily retained for your user experience, but this data is also protected under our privacy policy. Your privacy is important to us. For more information, you can review our Privacy Policy (if available)." },
        { question: "What should I do if I encounter a problem or want to provide feedback?", answer: "If you encounter any problems, notice an error, or wish to provide feedback about the application, please contact us at [email protected] (hypothetical email address). Your feedback is very valuable for us to improve the user experience." }
    ],
     footerNavLinks: [
      { href: "/", text: "Home" },
      { href: "/animate", text: "Use The App" },
      { href: "/pricing", text: "Pricing" },
      { href: "/about", text: "About Us" },
      { href: "#", text: "Privacy Policy" },
      { href: "#", text: "Terms of Use" },
    ]
  }
};


const getFaqContentAsString = (lang: 'tr' | 'en'): string => {
  const items = faqContentData[lang]?.items || faqContentData.tr.items;
  return items.map(item => `Soru: ${item.question}\nCevap: ${item.answer}`).join('\n\n');
};

export default function FaqPage({ params }: FaqPageProps) {
  const { language } = useLanguage();
  const currentLang = language || params.lang || 'tr';
  const content = faqContentData[currentLang] || faqContentData.tr;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatbotDialogOpen, setIsChatbotDialogOpen] = useState(false);
  const { toast } = useToast();
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);
  const [faqContentString, setFaqContentString] = useState(() => getFaqContentAsString(currentLang));

  useEffect(() => {
    setFaqContentString(getFaqContentAsString(currentLang));
    setChatMessages([]);
    setUserInput('');
    if (isChatbotDialogOpen) {
      setChatMessages([{ sender: 'bot', text: content.chatbotWaiting }]);
    }
  }, [currentLang, content.chatbotWaiting, isChatbotDialogOpen]);


  const scrollToChatBottom = () => {
    if (chatScrollAreaRef.current) {
      const scrollViewport = chatScrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    if(isChatbotDialogOpen){
        const timer = setTimeout(() => {
            scrollToChatBottom();
        }, 50); 
        return () => clearTimeout(timer);
    }
  }, [chatMessages, isChatbotDialogOpen]);

  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: userInput.trim() };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsChatLoading(true);

    try {
      const input: FaqChatInput = {
        faqContent: faqContentString, 
        userQuery: newUserMessage.text,
        userLanguage: currentLang, 
      };
      const response = await faqChat(input);
      const botMessage: ChatMessage = { sender: 'bot', text: response.botResponse };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("FAQ Chat Error:", error);
      toast({
        title: content.chatbotErrorTitle,
        description: (error as Error).message || content.chatbotErrorDesc,
        variant: "destructive",
      });
       const botErrorMessage: ChatMessage = { sender: 'bot', text: content.chatbotGenericError };
      setChatMessages(prev => [...prev, botErrorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

   useEffect(() => {
    if (isChatbotDialogOpen && chatMessages.length === 0) {
      setChatMessages([{ sender: 'bot', text: content.chatbotWaiting }]);
    }
  }, [isChatbotDialogOpen, chatMessages.length, content.chatbotWaiting]);


  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AnimatedSection tag="header" className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-6 text-center">
          <HelpCircle className="h-20 w-20 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline">
            {content.pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.pageSubtitle}
          </p>
        </div>
      </AnimatedSection>

      <main className="flex-grow">
        <AnimatedSection sectionId="faq-content" className="py-12 md:py-16 bg-background" delay="delay-100">
          <div className="container mx-auto px-6 max-w-3xl">
            <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-headline text-primary-dark">{content.accordionTitle}</CardTitle>
                <CardDescription>{content.accordionDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {content.items.map((item, index) => (
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
      </main>

      <Dialog open={isChatbotDialogOpen} onOpenChange={(open) => {
        setIsChatbotDialogOpen(open);
        if (!open) {
        } else if (chatMessages.length === 0) {
           setChatMessages([{ sender: 'bot', text: content.chatbotWaiting }]);
        }
      }}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-bounce z-50"
            aria-label={content.chatbotDialogTitle}
          >
            <MessageSquare className="h-7 w-7" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] p-0">
          <Card className="w-full shadow-none border-none rounded-lg">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="text-xl font-headline flex items-center text-primary-dark">
                <Bot className="mr-2 h-6 w-6" /> {content.chatbotDialogTitle}
              </DialogTitle>
              <DialogDescription>
                {content.chatbotDialogDesc}
              </DialogDescription>
            </DialogHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-72 w-full rounded-md border p-3 bg-muted/20" ref={chatScrollAreaRef}>
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 my-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-full shadow">
                        <Bot size={18} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] p-3 rounded-lg shadow-md ${
                        msg.sender === 'user'
                          ? 'bg-accent text-accent-foreground rounded-br-none'
                          : 'bg-card text-card-foreground rounded-bl-none border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="flex-shrink-0 p-2 bg-secondary text-secondary-foreground rounded-full shadow">
                         <User size={18} />
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                   <div className="flex justify-start gap-3 my-3">
                      <div className="flex-shrink-0 p-2 bg-primary text-primary-foreground rounded-full shadow">
                        <Bot size={18} />
                      </div>
                      <div className="max-w-[85%] p-3 rounded-lg shadow-md bg-card text-card-foreground rounded-bl-none border">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                  </div>
                )}
              </ScrollArea>
              <form onSubmit={handleChatSubmit} className="mt-4 flex items-center gap-2">
                <Input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={content.chatbotPlaceholder}
                  className="flex-grow shadow-sm focus:ring-primary focus:border-primary"
                  disabled={isChatLoading}
                  aria-label={content.chatbotPlaceholder}
                />
                <Button type="submit" disabled={isChatLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow hover:shadow-md">
                  {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span className="sr-only">{content.chatbotSend}</span>
                </Button>
              </form>
            </CardContent>
             <div className="p-4 border-t flex justify-end">
                <DialogClose asChild>
                    <Button variant="outline">{content.chatbotClose}</Button>
                </DialogClose>
            </div>
          </Card>
        </DialogContent>
      </Dialog>

      <footer className="relative w-full mt-auto bg-primary text-foreground">
        <div className="absolute top-0 left-0 w-full h-16 bg-background rounded-bl-full rounded-br-full"></div>
        <div className="relative container mx-auto px-6 pt-28 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline flex items-center">
                <Clapperboard className="h-6 w-6 mr-2" /> AnimatePDF
              </h5>
              <p className="text-sm">
                {content.footerAnimatePdfDesc}
              </p>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">{content.footerLinksTitle}</h5>
              <ul className="space-y-2">
                 {content.footerNavLinks.map(link => (
                  <li key={link.text}><Link href={link.href.startsWith("#") ? link.href : `/${currentLang}${link.href}`} className="text-sm hover:opacity-80 transition-opacity">{link.text}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-lg mb-3 font-headline">{content.footerFollowTitle}</h5>
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
            &copy; {new Date().getFullYear()} AnimatePDF - Zubo Bilişim. {content.footerRights}
            <Sparkles className="inline-block h-4 w-4 mx-1" />
            {content.footerPoweredBy}
            <Cpu className="inline-block h-4 w-4 ml-1 mr-1" />
          </p>
        </div>
      </footer>
    </div>
  );
}

    