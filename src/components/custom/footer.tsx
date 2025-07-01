"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clapperboard, Twitter, Linkedin, Github, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useParams } from 'next/navigation';

export function Footer() {
  const { language } = useLanguage();
  const params = useParams();
  const currentLang = params.lang as string || 'tr';

  const footerContent = {
    tr: {
      footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
      footerLinksTitle: "Bağlantılar",
      footerRights: "Tüm hakları saklıdır.",
      footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir.",
      contact: "İletişim",
      updates: "Güncellemeler",
      updatesDesc: "Yeni özellikler ve güncellemelerden haberdar olun.",
      emailPlaceholder: "E-posta adresiniz",
      footerLinks: [
        { href: "/about", text: "Hakkımızda" },
        { href: "/pricing", text: "Fiyatlandırma" },
        { href: "/faq", text: "SSS" },
        { href: "#", text: "Gizlilik Politikası" },
        { href: "#", text: "Kullanım Koşulları" },
        { href: "/animate", text: "Uygulamayı Kullan" },
      ]
    },
    en: {
      footerAnimatePdfDesc: "Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.",
      footerLinksTitle: "Links",
      footerRights: "All rights reserved.",
      footerPoweredBy: "Powered by Generative AI.",
      contact: "Contact",
      updates: "Updates",
      updatesDesc: "Stay informed about new features and updates.",
      emailPlaceholder: "Your email address",
      footerLinks: [
        { href: "/about", text: "About Us" },
        { href: "/pricing", text: "Pricing" },
        { href: "/faq", text: "FAQ" },
        { href: "#", text: "Privacy Policy" },
        { href: "#", text: "Terms of Service" },
        { href: "/animate", text: "Use App" },
      ]
    }
  };

  const content = footerContent[language] || footerContent.tr;

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Clapperboard className="h-8 w-8 text-purple-400" />
              <span className="text-2xl font-bold gradient-animate">AnimatePDF</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              {content.footerAnimatePdfDesc}
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white bg-white text-black hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-300">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white bg-white text-black hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white bg-white text-black hover:border-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-300">
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-400">{content.footerLinksTitle}</h3>
            <ul className="space-y-3">
              {content.footerLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={getLocalizedPath(link.href)} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-400">{content.contact}</h3>
            <div className="space-y-3 text-gray-400">
              <p>support@animatepdf.com</p>
              <p>+90 (212) 123 45 67</p>
              <p>İstanbul, Türkiye</p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-purple-400">{content.updates}</h3>
            <p className="text-gray-400 text-sm">
              {content.updatesDesc}
            </p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder={content.emailPlaceholder}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors duration-300"
              />
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 AnimatePDF. {content.footerRights}
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
            {content.footerPoweredBy}
          </p>
        </div>
      </div>
    </footer>
  );
}