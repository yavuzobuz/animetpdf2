"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Home, LogIn, UserPlus, Film, Menu, X, HelpCircle, Info, Languages, DollarSign, User, LogOut, Sparkles, FileText, Play } from 'lucide-react';
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
import { useParams, usePathname } from 'next/navigation';
import { useT } from '@/i18n/translations';

const PdfAnimateLogo = () => (
  <div className="flex items-center space-x-3 group cursor-pointer">
    <div className="relative">
      <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center transform rotate-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
        <FileText className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
        <Play className="w-2 h-2 text-white fill-white" />
      </div>
      <div className="absolute inset-0 bg-orange-500 rounded-xl opacity-0 group-hover:opacity-20 animate-ping"></div>
    </div>
    <div>
      <span className="text-2xl font-black text-gray-900 transition-colors duration-300 group-hover:text-orange-500">
        AnimatePDF
      </span>
      <div className="text-xs text-orange-500 font-medium animate-pulse">AI Powered</div>
    </div>
  </div>
);

export function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = useT();
  const { user, loading, signOut } = useAuth();
  const params = useParams();
  const pathname = usePathname();
  const isAdminRoute = pathname?.includes('/admin');
  const isAdminLoginPage = pathname?.includes('/admin/login');
  const currentLang = params.lang as string || 'tr'; 
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const navItems = [
    { key: 'home', href: '/', icon: <Home className="mr-2 h-4 w-4" /> },
    { key: 'animate', href: '/animate', icon: <Film className="mr-2 h-4 w-4" /> },
    { key: 'pricing', href: '/pricing', icon: <DollarSign className="mr-2 h-4 w-4" /> },
    { key: 'faq', href: '/faq', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
    { key: 'about', href: '/about', icon: <Info className="mr-2 h-4 w-4" /> },
    { key: 'profile', href: '/profil', icon: <User className="mr-2 h-4 w-4" /> },
  ];

  const authNavItems = [
    { key: 'login', href: '/login', icon: <LogIn className="mr-2 h-4 w-4" /> },
    { key: 'signup', href: '/signup', icon: <UserPlus className="mr-2 h-4 w-4" /> },
  ];

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  if (isAdminRoute) {
    // Minimal navbar for admin dashboard
    const handleAdminLogout = async () => {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = pathname.startsWith('/tr') ? '/tr/admin/login' : '/en/admin/login';
      } catch (err) {
        console.error('Admin logout failed', err);
        window.location.href = '/admin/login';
      }
    };

    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href={pathname.startsWith('/tr') ? '/tr' : '/en'} className="flex items-center space-x-2 font-bold text-lg">
            <PdfAnimateLogo />
          </Link>
          {!isAdminLoginPage && (
            <Button variant="destructive" size="sm" onClick={handleAdminLogout}>Çıkış Yap</Button>
          )}
        </div>
      </nav>
    );
  }

  return (
    <header
      className={`border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={getLocalizedPath("/")} >
            <PdfAnimateLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.slice(0,5).map((item, index) => {
              const label = t.navbar[item.key as keyof typeof t.navbar];
              return (
                <Link
                  key={item.key}
                  href={getLocalizedPath(item.href || "/")}
                  className={`text-gray-600 hover:text-gray-900 font-medium transition-all duration-300 hover:scale-105 relative group ${isVisible ? "animate-fade-in-down" : "opacity-0"}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-2 hover:bg-gray-200 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-xs font-bold">{user.email?.[0]?.toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.email}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-white/95 backdrop-blur-xl border border-gray-200/20 shadow-xl"
                  >
                    <DropdownMenuLabel className="text-gray-900">
                      {language === 'en' ? 'My Account' : 'Hesabım'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="group cursor-pointer hover:bg-orange-50 transition-all duration-200"
                      asChild
                    >
                      <Link href={getLocalizedPath('/profil')} className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-orange-500" />
                        <span className="text-gray-700 group-hover:text-orange-600">
                          {language === 'en' ? 'Profile' : 'Profil'}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="group cursor-pointer hover:bg-red-50 transition-all duration-200"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      <span className="text-gray-700 group-hover:text-red-600">
                        {language === 'en' ? 'Logout' : 'Çıkış Yap'}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href={getLocalizedPath('/login')}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:scale-105 transition-all duration-300 bg-transparent border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                    >
                      {language === 'en' ? 'Login' : 'Giriş Yap'}
                    </Button>
                  </Link>
                  <Link href={getLocalizedPath('/signup')}>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 hover:scale-105 transition-all duration-300"
                    >
                      {language === 'en' ? 'Sign Up' : 'Kayıt Ol'}
                    </Button>
                  </Link>
                </div>
              )}
              
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <Languages className="h-4 w-4 mr-1" />
                    {currentLang.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setLanguage('tr')}
                    className="cursor-pointer"
                  >
                    🇹🇷 Türkçe
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLanguage('en')}
                    className="cursor-pointer"
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              {navItems.slice(0,5).map((item, index) => (
                <Link 
                  key={item.key} 
                  href={getLocalizedPath(item.href)} 
                  className="text-gray-700 hover:text-orange-600 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {t.navbar[item.key as keyof typeof t.navbar]}
                </Link>
              ))}
              {!user && (
                <>
                  {authNavItems.map((item, index) => (
                    <Link 
                      key={item.key}
                      href={getLocalizedPath(item.href)} 
                      className="text-gray-700 hover:text-orange-600 transition-colors flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {t.navbar[item.key as keyof typeof t.navbar]}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}