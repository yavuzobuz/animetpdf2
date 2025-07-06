"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Twitter, Linkedin, Github, ArrowRight, Sparkles, Mail, Phone, MapPin, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useParams } from 'next/navigation';
import SupportTicketButton from '@/components/custom/support-ticket-button';

export function Footer() {
  const { language } = useLanguage();
  const params = useParams();
  const currentLang = params.lang as string || 'tr';

  const footerContent = {
    tr: {
      footerAnimatePdfDesc: "PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.",
      footerLinksTitle: "Bağlantılar",
      footerRights: "Tüm hakları saklıdır.",
      footerPoweredBy: "Üretken Yapay Zeka ile güçlendirilmiştir",
      contact: "İletişim",
      updates: "Güncellemeler",
      updatesDesc: "Yeni özellikler ve güncellemelerden haberdar olun.",
      emailPlaceholder: "E-posta adresiniz",
      subscribe: "Abone Ol",
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
      footerPoweredBy: "Powered by Generative AI",
      contact: "Contact",
      updates: "Updates",
      updatesDesc: "Stay informed about new features and updates.",
      emailPlaceholder: "Your email address",
      subscribe: "Subscribe",
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
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center transform rotate-3 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                  <Play className="w-2 h-2 text-white fill-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black group-hover:text-orange-400 transition-colors duration-300">
                  AnimatePDF
                </span>
                <div className="text-xs text-orange-400 animate-pulse">{content.footerPoweredBy}</div>
              </div>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md">
              {content.footerAnimatePdfDesc}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{content.footerLinksTitle}</h3>
            <ul className="space-y-3 text-gray-400">
              {content.footerLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={getLocalizedPath(link.href)} 
                    className="hover:text-white transition-all duration-300 hover:translate-x-2 inline-block"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">{content.contact}</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center hover:text-white transition-all duration-300 hover:translate-x-1 group">
                <Mail className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                support@animatepdf.com
              </li>
              <li className="flex items-center hover:text-white transition-all duration-300 hover:translate-x-1 group">
                <Phone className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                90 212 123 45 67
              </li>
              <li className="flex items-center hover:text-white transition-all duration-300 hover:translate-x-1 group">
                <MapPin className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                İstanbul, Türkiye
              </li>
            </ul>
          </div>
          </div>

          {/* Newsletter Section */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{content.updates}</h3>
          <p className="text-gray-400 mb-8">
              {content.updatesDesc}
            </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Input
                type="email" 
                placeholder={content.emailPlaceholder}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-orange-500 focus:ring-orange-500"
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-semibold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <Mail className="w-4 h-4 mr-2" />
              {content.subscribe}
              <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
          </div>
        </div>

        <div className="flex justify-center mb-8 mt-12">
          <SupportTicketButton inline />
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2024 AnimatePDF. {content.footerRights}</p>
        </div>
      </div>
    </footer>
  );
}
