
"use client";

import Link from 'next/link';
import React, { useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation'; 

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedSection from '@/components/custom/animated-section';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signupUser } from '@/app/auth/actions'; // Assuming actions are not language-specific yet
import { SubmitButton } from '@/components/custom/submit-button';
import { useLanguage } from '@/contexts/language-context';

interface SignUpPageProps {
  params: { lang: 'en' | 'tr' };
}

const pageUIText = {
  tr: {
    title: "Hesap Oluştur",
    description: "Aramıza katılın ve PDF'lerinizi canlandırmaya başlayın!",
    emailLabel: "E-posta Adresiniz",
    emailPlaceholder: "ornek@eposta.com",
    passwordLabel: "Şifreniz",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Şifrenizi Tekrar Girin",
    submitButton: "Kayıt Ol",
    submitPending: "Kayıt Olunuyor...",
    loginPrompt: "Zaten bir hesabınız var mı?",
    loginLink: "Giriş Yapın",
    toastSuccessTitle: "Başarılı",
    toastErrorTitle: "Hata"
  },
  en: {
    title: "Create Account",
    description: "Join us and start bringing your PDFs to life!",
    emailLabel: "Your Email Address",
    emailPlaceholder: "example@email.com",
    passwordLabel: "Your Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Your Password",
    submitButton: "Sign Up",
    submitPending: "Signing Up...",
    loginPrompt: "Already have an account?",
    loginLink: "Login",
    toastSuccessTitle: "Success",
    toastErrorTitle: "Error"
  }
};

export default function SignUpPage({ params }: SignUpPageProps) {
  const { language } = useLanguage();
  const currentLang = language || params.lang || 'tr';
  const uiText = pageUIText[currentLang] || pageUIText.tr;
  
  const { toast } = useToast();
  const router = useRouter();
  const [state, formAction] = useActionState(signupUser, null);

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.type === 'success' ? uiText.toastSuccessTitle : uiText.toastErrorTitle,
        description: state.message, // Server action messages assumed language-agnostic for now
        variant: state.type === 'error' ? "destructive" : "default",
      });
      if (state.type === 'success') {
        // router.push(`/${currentLang}/login`); // Optionally redirect
      }
    }
  }, [state, toast, router, uiText, currentLang]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8 space-y-8 font-body bg-background">
      <AnimatedSection tag="div" className="w-full max-w-md">
        <Card className="w-full transition-all duration-300">
          <CardHeader className="text-center">
            <UserPlus className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-3xl font-bold font-headline text-primary">{uiText.title}</CardTitle>
            <CardDescription>{uiText.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{uiText.emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={uiText.emailPlaceholder}
                  required
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{uiText.passwordLabel}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={uiText.passwordPlaceholder}
                  required
                  minLength={6}
                  className="bg-background/70"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{uiText.confirmPasswordLabel}</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder={uiText.passwordPlaceholder}
                  required
                  minLength={6}
                  className="bg-background/70"
                />
              </div>
              <SubmitButton
                pendingText={uiText.submitPending}
                className="w-full text-primary-foreground text-lg py-6 rounded-lg transition-all duration-300 bg-gradient-to-br from-primary-dark to-primary"
              >
                {uiText.submitButton}
              </SubmitButton>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {uiText.loginPrompt}{' '}
              <Link href={`/${currentLang}/login`} className="font-medium text-primary hover:underline">
                {uiText.loginLink}
              </Link>
            </p>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
