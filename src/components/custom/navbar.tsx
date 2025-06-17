
import Link from 'next/link';
import { Clapperboard, Home, LogIn, UserPlus, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="bg-card text-card-foreground p-4 shadow-lg animate-border-glow sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-xl font-bold text-primary hover:bg-primary/10 p-2 h-auto">
            <Clapperboard className="h-7 w-7 mr-2 animate-pulse" />
            AnimatePDF
          </Button>
        </Link>
        <div className="space-x-2 md:space-x-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="hover:text-primary hover:bg-primary/10">
              <Home className="mr-1 h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Ana Sayfa</span>
            </Button>
          </Link>
          <Link href="/animate" passHref>
            <Button variant="ghost" className="hover:text-primary hover:bg-primary/10">
              <Film className="mr-1 h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Anime Et</span>
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button variant="ghost" className="hover:text-primary hover:bg-primary/10">
              <LogIn className="mr-1 h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Giriş Yap</span>
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button variant="ghost" className="hover:text-primary hover:bg-primary/10">
              <UserPlus className="mr-1 h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Kayıt Ol</span>
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
