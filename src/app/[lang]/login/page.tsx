
"use client";

import Link from 'next/link';
import React, { useEffect, useActionState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedSection from '@/components/custom/animated-section';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/app/auth/actions'; // Assuming actions are not language-specific yet
import { SubmitButton } from '@/components/custom/submit-button';
import { useLanguage } from '@/contexts/language-context';

interface LoginPageProps {
  params: { lang: 'en' | 'tr' };
}

const pageUIText = {
  tr: {
    title: "Giriş Yap",
    description: "Hesabınıza erişin ve animasyonlarınıza devam edin.",
    emailLabel: "E-posta Adresiniz",
    emailPlaceholder: "ornek@eposta.com",
    passwordLabel: "Şifreniz",
    passwordPlaceholder: "••••••••",
    submitButton: "Giriş Yap",
    submitPending: "Giriş Yapılıyor...",
    signupPrompt: "Hesabınız yok mu?",
    signupLink: "Kayıt Olun",
    toastSuccessTitle: "Başarılı",
    toastErrorTitle: "Hata"
  },
  en: {
    title: "Login",
    description: "Access your account and continue with your animations.",
    emailLabel: "Your Email Address",
    emailPlaceholder: "example@email.com",
    passwordLabel: "Your Password",
    passwordPlaceholder: "••••••••",
    submitButton: "Login",
    submitPending: "Logging in...",
    signupPrompt: "Don't have an account?",
    signupLink: "Sign Up",
    toastSuccessTitle: "Success",
    toastErrorTitle: "Error"
  }
};

export default function LoginPage({ params }: LoginPageProps) {
  const { language } = useLanguage();
  const currentLang = language || params.lang || 'tr';
  const uiText = pageUIText[currentLang] || pageUIText.tr;

  const { toast } = useToast();
  const router = useRouter();
  // Pass currentLang to loginUser if it needs to construct language-specific redirect URLs
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
      // Potentially pass currentLang or use it to modify redirectPath
      const result = await loginUser(prevState, formData);
      if (result.type === 'success' && result.redirectPath) {
          // Ensure redirect path is language-aware if needed
          // For now, using the path as is. If it's always /animate, middleware will prefix lang
      }
      return result;
  }, null);


  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.type === 'success' ? uiText.toastSuccessTitle : uiText.toastErrorTitle,
        description: state.message, // Messages from server actions are assumed to be language-agnostic or pre-translated
        variant: state.type === 'error' ? "destructive" : "default",
      });
      if (state.type === 'success' && state.redirectPath) {
        // Middleware should handle prefixing the language to redirectPath if it's a root-relative path like '/animate'
        router.push(state.redirectPath);
      }
    }
  }, [state, toast, router, uiText, currentLang]);

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8 space-y-8 font-body bg-background">
      <AnimatedSection tag="div" className="w-full max-w-md">
        <Card className="w-full transition-all duration-300">
          <CardHeader className="text-center">
            <LogIn className="h-12 w-12 mx-auto text-primary mb-2" />
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
              {uiText.signupPrompt}{' '}
              <Link href={`/${currentLang}/signup`} className="font-medium text-primary hover:underline">
                {uiText.signupLink}
              </Link>
            </p>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
