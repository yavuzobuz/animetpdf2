
"use client";

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation'; // For client-side redirection

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedSection from '@/components/custom/animated-section';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signupUser } from '@/app/auth/actions';
import { SubmitButton } from '@/components/custom/submit-button';

export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction] = useFormState(signupUser, null);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.type === 'success' ? "Başarılı" : "Hata",
        description: state.message,
        variant: state.type === 'error' ? "destructive" : "default",
      });
      if (state.type === 'success') {
        // Optionally redirect to login page or clear form
        // router.push('/login');
      }
    }
  }, [state, toast, router]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8 space-y-8 font-body bg-background">
      <AnimatedSection tag="div" className="w-full max-w-md">
        <Card className="w-full transition-all duration-300">
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-3xl font-bold font-headline text-primary">Hesap Oluştur</CardTitle>
            <CardDescription>Aramıza katılın ve PDF'lerinizi canlandırmaya başlayın!</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresiniz</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ornek@eposta.com"
                  required
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifreniz</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Şifrenizi Tekrar Girin</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="bg-background/70"
                />
              </div>
              <SubmitButton
                pendingText="Kayıt Olunuyor..."
                className="w-full text-primary-foreground text-lg py-6 rounded-lg transition-all duration-300 bg-gradient-to-br from-primary-dark to-primary"
              >
                Kayıt Ol
              </SubmitButton>
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
    </div>
  );
}
