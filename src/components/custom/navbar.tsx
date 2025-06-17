
"use client";

import Link from 'next/link';
import { Home, LogIn, UserPlus, Film, Menu, X, HelpCircle, Info, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/contexts/language-context';
import { useParams } from 'next/navigation'; // To get current lang from URL for link construction

const PdfAnimateLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 75"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-24 w-auto mr-2 animate-pulse"
  >
    <rect x="2" y="2" width="46" height="71" rx="7" fill="currentColor" stroke="none" />
    <rect x="5" y="5" width="40" height="24" rx="4" fill="white" stroke="none" />
    <rect x="9" y="13" width="5" height="11" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="17" y="9" width="5" height="19" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="25" y="9" width="5" height="19" rx="1.5" fill="currentColor" stroke="none" />
    <rect x="33" y="11" width="5" height="15" rx="1.5" fill="currentColor" stroke="none" />
    <circle cx="17" cy="46" r="7" fill="white" stroke="none" />
    <path d="M14.5 42.5 L14.5 49.5 L21 46 Z" fill="currentColor" stroke="none"/>
    <rect x="28" y="43" width="13" height="2.5" rx="1" fill="white" stroke="none"/>
    <rect x="28" y="47.5" width="13" height="2.5" rx="1" fill="white" stroke="none"/>
    <rect x="9" y="58" width="32" height="10" rx="2.5" fill="white" stroke="none"/>
    <text
      x="25"
      y="65.2"
      fontFamily="Inter, sans-serif"
      fontSize="7"
      fill="currentColor"
      textAnchor="middle"
      fontWeight="bold"
    >
      ANIM
    </text>
  </svg>
);


export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const params = useParams();
  const currentLang = params.lang as string || 'tr'; // Fallback if params.lang is not available initially

  const navLinksContent = {
    en: [
      { href: "/", label: "Home", icon: <Home className="mr-2 h-5 w-5" /> },
      { href: "/animate", label: "Animate", icon: <Film className="mr-2 h-5 w-5" /> },
      { href: "/faq", label: "FAQ", icon: <HelpCircle className="mr-2 h-5 w-5" /> },
      { href: "/about", label: "About Us", icon: <Info className="mr-2 h-5 w-5" /> },
      { href: "/login", label: "Login", icon: <LogIn className="mr-2 h-5 w-5" /> },
      { href: "/signup", label: "Sign Up", icon: <UserPlus className="mr-2 h-5 w-5" /> },
    ],
    tr: [
      { href: "/", label: "Ana Sayfa", icon: <Home className="mr-2 h-5 w-5" /> },
      { href: "/animate", label: "Anime Et", icon: <Film className="mr-2 h-5 w-5" /> },
      { href: "/faq", label: "SSS", icon: <HelpCircle className="mr-2 h-5 w-5" /> },
      { href: "/about", label: "Hakkımızda", icon: <Info className="mr-2 h-5 w-5" /> },
      { href: "/login", label: "Giriş Yap", icon: <LogIn className="mr-2 h-5 w-5" /> },
      { href: "/signup", label: "Kayıt Ol", icon: <UserPlus className="mr-2 h-5 w-5" /> },
    ]
  };

  const activeNavLinks = navLinksContent[language] || navLinksContent.tr;

  const getLocalizedPath = (path: string) => {
    // If the path is just '/', we only want the language prefix (e.g. /en, /tr)
    // Otherwise, we want /<lang>/<path>
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  return (
    <nav className="bg-primary text-foreground border-b border-primary-dark/50 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href={getLocalizedPath("/")} passHref>
          <Button variant="ghost" className="text-xl font-bold text-foreground hover:bg-background/10 p-2 h-auto flex items-center">
            <PdfAnimateLogo />
            AnimatePDF
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-background/10">
                <Languages className="h-6 w-6" />
                <span className="sr-only">{language === 'en' ? 'Select Language' : 'Dil Seçin'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-primary border-primary-dark/30 text-foreground">
              <DropdownMenuLabel className="text-foreground/80">{language === 'en' ? 'Select Language' : 'Dil Seçin'}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-foreground/20" />
              <DropdownMenuItem
                className="hover:bg-background/10 focus:bg-background/10 cursor-pointer"
                onClick={() => setLanguage('en')}
                disabled={language === 'en'}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-background/10 focus:bg-background/10 cursor-pointer"
                onClick={() => setLanguage('tr')}
                disabled={language === 'tr'}
              >
                Türkçe
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-background/10 focus:bg-background/10 cursor-pointer" disabled>
                Français ({language === 'en' ? 'Soon' : 'Yakında'})
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-background/10 focus:bg-background/10 cursor-pointer" disabled>
                Deutsch ({language === 'en' ? 'Soon' : 'Yakında'})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-background/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{language === 'en' ? 'Open Menu' : 'Menüyü Aç'}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="w-full bg-primary text-foreground p-0 border-b-primary-dark/50">
              <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-foreground/20">
                <SheetTitle asChild>
                  <Link href={getLocalizedPath("/")} passHref>
                    <Button variant="ghost" className="text-xl font-bold text-foreground hover:bg-background/10 p-2 h-auto flex items-center">
                      <PdfAnimateLogo />
                      AnimatePDF
                    </Button>
                  </Link>
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-background/10">
                    <X className="h-6 w-6" />
                    <span className="sr-only">{language === 'en' ? 'Close Menu' : 'Menüyü Kapat'}</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div className="p-4">
                <ul className="space-y-2">
                  {activeNavLinks.map((item) => (
                    <li key={item.label}>
                      <SheetClose asChild>
                        <Link
                          href={getLocalizedPath(item.href)}
                          className="flex items-center text-md font-medium text-foreground hover:text-foreground hover:bg-background/10 transition-colors px-3 py-3 rounded-md w-full"
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
