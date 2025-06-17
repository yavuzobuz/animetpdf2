
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
    {/* Stylized Document Page */}
    <path d="M6.5 2H14.5L19 6.5V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V4C5 2.89543 5.89543 2 7 2H7.5" strokeWidth="1.5"/>
    <polyline points="14 2 14 7 19 7" strokeWidth="1.5"/>

    {/* Dynamic Play Button - slightly larger and offset, filled */}
    <path d="M9.5 11.5L16.5 15.5L16.5 7.5L9.5 11.5Z" fill="currentColor" strokeWidth="1"/>

    {/* Subtle motion/transformation arc */}
    <path d="M5.5 15C6 12.5 7.5 10 10 9.5" strokeDasharray="2 2" strokeWidth="1"/>
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
