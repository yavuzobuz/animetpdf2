
"use client";

import Link from 'next/link';
import { Home, LogIn, UserPlus, Film, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

// Yeni ve daha yaratıcı SVG Logo Komponenti
const PdfAnimateLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7 mr-2 animate-pulse"
  >
    {/* Arka Plan Sayfa Katmanı (hafif opak) */}
    <path d="M8 2H16L20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7L8 2Z" opacity="0.5" strokeWidth="1.2"/>
    {/* Ön Plan Sayfa Katmanı (daha belirgin) */}
    <path d="M7 4H14.5L18 7.5V17C18 17.8284 17.3284 18.5 16.5 18.5H7.5C6.67157 18.5 6 17.8284 6 17V5C6 4.44772 6.44772 4 7 4Z" />
    {/* Köşesi Kıvrık Detayı (Dog-ear) */}
    <polyline points="14.5 4 14.5 7.5 18 7.5" />
    {/* Merkezi Oynatma Simgesi (dolu) */}
    <path d="M10.5 14.5L15.5 11.25L10.5 8V14.5Z" fill="currentColor" strokeWidth="1"/>
  </svg>
);


export function Navbar() {
  const navLinks = [
    { href: "/", label: "Ana Sayfa", icon: <Home className="mr-2 h-5 w-5" /> },
    { href: "/animate", label: "Anime Et", icon: <Film className="mr-2 h-5 w-5" /> },
    { href: "/login", label: "Giriş Yap", icon: <LogIn className="mr-2 h-5 w-5" /> },
    { href: "/signup", label: "Kayıt Ol", icon: <UserPlus className="mr-2 h-5 w-5" /> },
  ];

  return (
    <nav className="bg-background border-b border-border p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-xl font-bold text-primary hover:bg-primary/10 p-2 h-auto">
            <PdfAnimateLogo />
            AnimatePDF
          </Button>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-accent/10">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menüyü Aç</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="top" className="w-full bg-background text-foreground p-0">
            <SheetHeader className="flex flex-row items-center justify-between p-4 border-b border-border">
              <SheetTitle asChild>
                <Link href="/" passHref>
                  <Button variant="ghost" className="text-xl font-bold text-primary hover:bg-primary/10 p-2 h-auto">
                    <PdfAnimateLogo />
                    AnimatePDF
                  </Button>
                </Link>
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-accent/10">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Menüyü Kapat</span>
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="p-4">
              <ul className="space-y-2">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <SheetClose asChild>
                       <Link
                        href={item.href}
                        className="flex items-center text-md font-medium text-foreground hover:text-primary transition-colors px-3 py-3 rounded-md hover:bg-accent/10 w-full"
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
    </nav>
  );
}
