"use client";

import Link from 'next/link';
import { Home, LogIn, UserPlus, Film, Menu, X, HelpCircle, Info, Languages, DollarSign, User, LogOut, Sparkles } from 'lucide-react';
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
import { useAuth } from '@/contexts/auth-context';
import { useParams } from 'next/navigation'; 

const PdfAnimateLogo = () => (
  <div className="relative group">
    <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 75"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
      className="relative h-12 w-8 mr-3 transition-transform duration-300 group-hover:scale-110"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#8B5CF6', stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: '#EC4899', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#3B82F6', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="46" height="71" rx="7" fill="url(#logoGradient)" stroke="none" />
      <rect x="5" y="5" width="40" height="24" rx="4" fill="white" stroke="none" opacity="0.95" />
      <rect x="9" y="13" width="5" height="11" rx="1.5" fill="url(#logoGradient)" stroke="none" />
      <rect x="17" y="9" width="5" height="19" rx="1.5" fill="url(#logoGradient)" stroke="none" />
      <rect x="25" y="9" width="5" height="19" rx="1.5" fill="url(#logoGradient)" stroke="none" />
      <rect x="33" y="11" width="5" height="15" rx="1.5" fill="url(#logoGradient)" stroke="none" />
      <circle cx="17" cy="46" r="7" fill="white" stroke="none" opacity="0.95" />
      <path d="M14.5 42.5 L14.5 49.5 L21 46 Z" fill="url(#logoGradient)" stroke="none"/>
      <rect x="28" y="43" width="13" height="2.5" rx="1" fill="white" stroke="none" opacity="0.95"/>
      <rect x="28" y="47.5" width="13" height="2.5" rx="1" fill="white" stroke="none" opacity="0.95"/>
      <rect x="9" y="58" width="32" height="10" rx="2.5" fill="white" stroke="none" opacity="0.95"/>
    <text
      x="25"
      y="65.2"
      fontFamily="Inter, sans-serif"
      fontSize="7"
        fill="url(#logoGradient)"
      textAnchor="middle"
      fontWeight="bold"
    >
      ANIM
    </text>
  </svg>
  </div>
);

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { user, loading, signOut } = useAuth();
  const params = useParams();
  const currentLang = params.lang as string || 'tr'; 

  const navLinksContent = {
    en: [
      { href: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
      { href: "/animate", label: "Animate", icon: <Film className="mr-2 h-4 w-4" /> },
      { href: "/pricing", label: "Pricing", icon: <DollarSign className="mr-2 h-4 w-4" /> },
      { href: "/faq", label: "FAQ", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
      { href: "/about", label: "About Us", icon: <Info className="mr-2 h-4 w-4" /> },
      { href: "/profil", label: "Profile", icon: <User className="mr-2 h-4 w-4" /> },
      { href: "/login", label: "Login", icon: <LogIn className="mr-2 h-4 w-4" /> },
      { href: "/signup", label: "Sign Up", icon: <UserPlus className="mr-2 h-4 w-4" /> },
    ],
    tr: [
      { href: "/", label: "Ana Sayfa", icon: <Home className="mr-2 h-4 w-4" /> },
      { href: "/animate", label: "Anime Et", icon: <Film className="mr-2 h-4 w-4" /> },
      { href: "/pricing", label: "Fiyatlandırma", icon: <DollarSign className="mr-2 h-4 w-4" /> },
      { href: "/faq", label: "SSS", icon: <HelpCircle className="mr-2 h-4 w-4" /> },
      { href: "/about", label: "Hakkımızda", icon: <Info className="mr-2 h-4 w-4" /> },
      { href: "/profil", label: "Profil", icon: <User className="mr-2 h-4 w-4" /> },
      { href: "/login", label: "Giriş Yap", icon: <LogIn className="mr-2 h-4 w-4" /> },
      { href: "/signup", label: "Kayıt Ol", icon: <UserPlus className="mr-2 h-4 w-4" /> },
    ]
  };

  const activeNavLinks = navLinksContent[language] || navLinksContent.tr;

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-700/20 shadow-lg shadow-gray-900/5">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
      <div className="relative container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
        <Link 
          href={getLocalizedPath("/")} 
            className="group flex items-center space-x-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          <PdfAnimateLogo />
            <span className="hidden sm:block">AnimatePDF</span>
        </Link>

          {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          {activeNavLinks.slice(0, 5).map((item) => (
            <Link 
              key={item.label} 
              href={getLocalizedPath(item.href)}
                className="group relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
            >
                <span className="relative z-10 flex items-center">
                  {item.icon}
              {item.label}
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </Link>
          ))}
        </div>

          {/* Desktop Auth & Language */}
          <div className="flex items-center space-x-3">
            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3" style={{visibility: loading ? 'hidden' : 'visible'}}>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="group relative h-10 px-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 rounded-xl"
                    >
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.email?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm">{user.email}</span>
                      </div>
                  </Button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl shadow-gray-900/10"
                  >
                    <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
                      {language === 'en' ? 'My Account' : 'Hesabım'}
                  </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                  <DropdownMenuItem
                      className="group cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                    asChild
                  >
                      <Link href={getLocalizedPath('/profil')} className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {language === 'en' ? 'Profile' : 'Profil'}
                        </span>
                    </Link>
                  </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                  <DropdownMenuItem
                      className="group cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                    onClick={signOut}
                  >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
                    {language === 'en' ? 'Sign Out' : 'Çıkış Yap'}
                      </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link 
                  href={getLocalizedPath("/login")}
                    className="group relative px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                >
                    <span className="relative z-10">
                  {activeNavLinks.find(link => link.href === '/login')?.label}
                    </span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  href={getLocalizedPath("/signup")}
                    className="group relative px-4 py-2 text-sm font-medium text-white rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
                >
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                  {activeNavLinks.find(link => link.href === '/signup')?.label}
                    </span>
                </Link>
              </>
            )}
            </div>            {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="group relative w-10 h-10 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 rounded-xl"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <Languages className="relative z-10 h-5 w-5" />
                <span className="sr-only">{language === 'en' ? 'Select Language' : 'Dil Seçin'}</span>
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20 shadow-xl shadow-gray-900/10"
              >
                <DropdownMenuLabel className="text-gray-900 dark:text-gray-100">
                  {language === 'en' ? 'Language' : 'Dil'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200/50 dark:bg-gray-700/50" />
                <DropdownMenuItem
                  className={`cursor-pointer transition-all duration-200 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400' 
                      : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20'
                  }`}
                  onClick={() => setLanguage('en')}
                >
                  🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem
                  className={`cursor-pointer transition-all duration-200 ${
                    language === 'tr' 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400' 
                      : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20'
                  }`}
                onClick={() => setLanguage('tr')}
              >
                  🇹🇷 Türkçe
              </DropdownMenuItem>
                <DropdownMenuItem className="opacity-50 text-gray-500 dark:text-gray-400" disabled>
                  🇫🇷 Français ({language === 'en' ? 'Soon' : 'Yakında'})
              </DropdownMenuItem>
                <DropdownMenuItem className="opacity-50 text-gray-500 dark:text-gray-400" disabled>
                  🇩🇪 Deutsch ({language === 'en' ? 'Soon' : 'Yakında'})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

            {/* Mobile Menu */}
            <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="group relative w-10 h-10 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300 rounded-xl"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Menu className="relative z-10 h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/20 dark:border-gray-700/20"
                >
                  <SheetHeader className="space-y-4">
                    <SheetTitle className="text-left">
                      <div className="flex items-center space-x-3">
                        <PdfAnimateLogo />
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          AnimatePDF
                        </span>
                      </div>
                    </SheetTitle>
              </SheetHeader>
                  
                  <div className="mt-8 space-y-4">
                    {/* Navigation Links */}
                    <div className="space-y-2">
                      {activeNavLinks.slice(0, 5).map((item) => (
                        <SheetClose key={item.label} asChild>
                        <Link
                          href={getLocalizedPath(item.href)}
                            className="group flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                        >
                            <div className="text-purple-600 dark:text-purple-400">
                          {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                      </SheetClose>
                      ))}
                    </div>
                    
                    {/* Mobile Auth */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                      {user ? (
                        <>
                          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                              {user.email?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {language === 'en' ? 'Logged in' : 'Giriş yapıldı'}
                              </p>
                            </div>
                          </div>
                          <SheetClose asChild>
                            <Link 
                              href={getLocalizedPath('/profil')}
                              className="flex items-center space-x-3 p-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                            >
                              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="font-medium">
                                {language === 'en' ? 'Profile' : 'Profil'}
                              </span>
                            </Link>
                          </SheetClose>
                          <button
                            onClick={signOut}
                            className="flex items-center space-x-3 p-3 w-full text-left text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20"
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="font-medium">
                              {language === 'en' ? 'Sign Out' : 'Çıkış Yap'}
                            </span>
                          </button>
                        </>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Link 
                              href={getLocalizedPath("/login")}
                              className="flex items-center justify-center space-x-2 p-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                            >
                              <LogIn className="h-4 w-4" />
                              <span className="font-medium">
                                {activeNavLinks.find(link => link.href === '/login')?.label}
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link 
                              href={getLocalizedPath("/signup")}
                              className="flex items-center justify-center space-x-2 p-3 text-white font-medium rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/25"
                            >
                              <Sparkles className="h-4 w-4" />
                              <span>
                                {activeNavLinks.find(link => link.href === '/signup')?.label}
                              </span>
                            </Link>
                          </SheetClose>
                        </>
                      )}
                    </div>
              </div>
            </SheetContent>
          </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}