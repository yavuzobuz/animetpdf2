
"use client";

import Link from 'next/link';
import { Home, LogIn, UserPlus, Film, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';

const PdfAnimateLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 75"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-16 w-16 mr-2 animate-pulse"
  >
    {/* Main body - uses currentColor for fill (app's primary color, e.g., light blue) */}
    <rect x="2" y="2" width="46" height="71" rx="7" fill="currentColor" stroke="none" />

    {/* Top panel - white background */}
    <rect x="5" y="5" width="40" height="24" rx="4" fill="white" stroke="none" />

    {/* Bars in top panel - filled with currentColor */}
    <rect x="9" y="13" width="5" height="11" rx="1.5" fill="currentColor" stroke="none" /> {/* Bar 1 (short) */}
    <rect x="17" y="9" width="5" height="19" rx="1.5" fill="currentColor" stroke="none" /> {/* Bar 2 (tall) */}
    <rect x="25" y="9" width="5" height="19" rx="1.5" fill="currentColor" stroke="none" /> {/* Bar 3 (tall) */}
    <rect x="33" y="11" width="5" height="15" rx="1.5" fill="currentColor" stroke="none" /> {/* Bar 4 (medium) */}

    {/* Middle section containing play button and lines (on main body's currentColor background) */}
    {/* Play button: White circle, currentColor triangle */}
    <circle cx="17" cy="46" r="7" fill="white" stroke="none" />
    <path d="M14.5 42.5 L14.5 49.5 L21 46 Z" fill="currentColor" stroke="none"/>

    {/* Horizontal lines - white */}
    <rect x="28" y="43" width="13" height="2.5" rx="1" fill="white" stroke="none"/>
    <rect x="28" y="47.5" width="13" height="2.5" rx="1" fill="white" stroke="none"/>

    {/* "ANIM" text tab area - white background for the tab */}
    <rect x="9" y="58" width="32" height="10" rx="2.5" fill="white" stroke="none"/>
    {/* "ANIM" text - filled with currentColor, centered in the white tab */}
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
