
"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedSection from '@/components/custom/animated-section';
import { UserPlus, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Şifreler Eşleşmiyor",
        description: "Lütfen şifrelerinizi kontrol edin.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Placeholder for actual sign-up logic
    console.log('Signing up with:', { email, password });
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    toast({
      title: "Kayıt Başarılı (Simülasyon)",
      description: "Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.",
    });
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setIsLoading(false);
    // router.push('/login'); // Redirect to login after successful signup
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 space-y-8 font-body bg-background">
      <AnimatedSection tag="div" className="w-full max-w-md">
        <Card className="w-full animate-border-glow transition-all duration-300">
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-3xl font-bold font-headline text-primary">Hesap Oluştur</CardTitle>
            <CardDescription>Aramıza katılın ve PDF'lerinizi canlandırmaya başlayın!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresiniz</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@eposta.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifreniz</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Şifrenizi Tekrar Girin</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="bg-background/70"
                />
              </div>
              <Button
                type="submit"
                className="w-full text-primary-foreground text-lg py-6 rounded-lg animate-border-glow transition-all duration-300 bg-gradient-to-br from-primary-dark to-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kayıt Olunuyor...
                  </>
                ) : (
                  'Kayıt Ol'
                )}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Zaten bir hesabınız var mı?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </CardContent>
        </Card>
      </AnimatedSection>
      <footer className="w-full py-8 text-center">
          <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AnimatePDF. Tüm hakları saklıdır.
          </p>
      </footer>
    </div>
  );
}
