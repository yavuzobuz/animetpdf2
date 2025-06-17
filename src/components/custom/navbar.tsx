
import Link from 'next/link';
import { Clapperboard, Home, LogIn, UserPlus, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="bg-background border-b border-border p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" passHref>
          <Button variant="ghost" className="text-xl font-bold text-primary hover:bg-primary/10 p-2 h-auto">
            <Clapperboard className="h-7 w-7 mr-2 animate-pulse" />
            AnimatePDF
          </Button>
        </Link>
        <div className="flex items-center space-x-1">
          <Link href="/" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/10">
            <Home className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>
          <Link href="/animate" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/10">
            <Film className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Anime Et</span>
          </Link>
          <Link href="/login" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/10">
            <LogIn className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Giriş Yap</span>
          </Link>
          <Link href="/signup" className="flex items-center text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/10">
            <UserPlus className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Kayıt Ol</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
