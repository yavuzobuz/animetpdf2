
"use client";

import Link from 'next/link';
import { Home, LogIn, UserPlus, Film, Menu, X } from 'lucide-react'; // Clapperboard importu kaldırıldı
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

// Yeni SVG Logo Komponenti
const PdfAnimateLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-7 w-7 mr-2 animate-pulse"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <polygon points="10 9 15 12 10 15" fill="currentColor" />
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
            <PdfAnimateLogo /> {/* Clapperboard yerine yeni SVG logo */}
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
                    <PdfAnimateLogo /> {/* Clapperboard yerine yeni SVG logo */}
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
