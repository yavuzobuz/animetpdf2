"use client";

import Link from 'next/link';
import React, { useEffect, useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedSection from '@/components/custom/animated-section';
import { LogIn, Clapperboard, Twitter, Linkedin, Github, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { loginUser } from '@/app/auth/actions';
import { SubmitButton } from '@/components/custom/submit-button';
import { useLanguage } from '@/contexts/language-context';
import { useAuth } from '@/contexts/auth-context';

interface LoginPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

const pageUIText = {
  tr: {
    title: "Giriş Yap",
    subtitle: "Hesabınıza erişin ve animasyonlarınıza devam edin",
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
    toastErrorTitle: "Hata",
    googleLogin: "Google ile Giriş Yap",
    orDivider: "veya"
  },
  en: {
    title: "Login",
    subtitle: "Access your account and continue with your animations",
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
    toastErrorTitle: "Error",
    googleLogin: "Login with Google",
    orDivider: "or"
  }
};

// Google Icon Component
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </g>
  </svg>
);

export default function LoginPage({ params }: LoginPageProps) {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = React.useState<'en' | 'tr'>('tr');
  
  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);
  
  const uiText = pageUIText[currentLang] || pageUIText.tr;

  const { toast } = useToast();
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
      const result = await loginUser(prevState, formData, currentLang); // currentLang eklendi
      if (result.type === 'success' && result.redirectPath) {
          // Ensure redirect path is language-aware if needed
      }
      return result;
  }, null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: uiText.toastErrorTitle,
        description: 'Google ile giriş yapılırken hata oluştu.',
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.type === 'success' ? uiText.toastSuccessTitle : uiText.toastErrorTitle,
        description: state.message,
        variant: state.type === 'error' ? "destructive" : "default",
      });
      if (state.type === 'success' && state.redirectPath) {
        router.push(state.redirectPath);
      }
    }
  }, [state, toast, router, uiText, currentLang]);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <AnimatedSection tag="div" className="space-y-8">
              {/* Floating particles effect */}
              <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
              <div className="absolute top-32 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-20 float-animation"></div>
              <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-40 pulse-soft"></div>
              
              {/* Hero Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                <LogIn className="h-4 w-4 text-purple-500" />
                <span>{uiText.title} • Secure Login</span>
              </div>

              {/* Hero Title */}
              <h1 className="text-5xl lg:text-7xl font-bold headline-modern">
                <span className="gradient-animate">
                  {uiText.title}
                </span>
              </h1>

              {/* Hero Subtitle */}
              <p className="text-xl lg:text-2xl subheading-modern max-w-3xl mx-auto text-balance">
                {uiText.subtitle}
              </p>
            </AnimatedSection>
          </div>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Login Form Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
      <AnimatedSection tag="div" className="w-full max-w-md">
              <Card className="glass-card border border-white/20 shadow-2xl">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogIn className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold headline-modern">{uiText.title}</CardTitle>
                  <CardDescription className="text-lg subheading-modern">{uiText.description}</CardDescription>
          </CardHeader>
                <CardContent className="space-y-6">
            {/* Google Login Button */}
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full text-gray-700 border-gray-300 bg-white hover:bg-gray-50 text-lg py-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3"
              >
                <GoogleIcon />
                {uiText.googleLogin}
              </Button>

            {/* Divider */}
                  <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {uiText.orDivider}
                </span>
              </div>
            </div>

            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{uiText.emailLabel}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={uiText.emailPlaceholder}
                  required
                        className="bg-background/70 h-12"
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
                        className="bg-background/70 h-12"
                />
              </div>
              <SubmitButton
                pendingText={uiText.submitPending}
                      className="w-full btn-gradient text-lg py-6 rounded-lg"
              >
                {uiText.submitButton}
              </SubmitButton>
            </form>
                  <p className="text-center text-sm text-muted-foreground">
              {uiText.signupPrompt}{' '}
              <Link href={`/${currentLang}/signup`} className="font-medium text-primary hover:underline">
                {uiText.signupLink}
              </Link>
            </p>
          </CardContent>
        </Card>
      </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Clapperboard className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold gradient-animate">AnimatePDF</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {currentLang === 'tr' 
                  ? 'PDF belgelerinizi saniyeler içinde ilgi çekici animasyonlu hikayelere ve interaktif öğrenme deneyimlerine dönüştürün.'
                  : 'Transform your PDF documents into engaging animated stories and interactive learning experiences in seconds.'
                }
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white bg-white text-black hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-300">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white bg-white text-black hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-10 h-10 p-0 border-white bg-white text-black hover:border-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-300">
                  <Github className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Links Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-purple-400">{currentLang === 'tr' ? 'Bağlantılar' : 'Links'}</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    href={`/${currentLang}/about`} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {currentLang === 'tr' ? 'Hakkımızda' : 'About Us'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${currentLang}/pricing`} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {currentLang === 'tr' ? 'Fiyatlandırma' : 'Pricing'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${currentLang}/faq`} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {currentLang === 'tr' ? 'SSS' : 'FAQ'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {currentLang === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {currentLang === 'tr' ? 'Kullanım Koşulları' : 'Terms of Service'}
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${currentLang}/animate`} 
                    className="text-gray-400 hover:text-white transition-colors duration-300 hover:underline"
                  >
                    {currentLang === 'tr' ? 'Uygulamayı Kullan' : 'Use App'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-purple-400">İletişim</h3>
              <div className="space-y-3 text-gray-400">
                <p>support@animatepdf.com</p>
                <p>+90 (212) 123 45 67</p>
                <p>İstanbul, Türkiye</p>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-purple-400">Güncellemeler</h3>
              <p className="text-gray-400 text-sm">
                Yeni özellikler ve güncellemelerden haberdar olun.
              </p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors duration-300"
                />
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-12 bg-gray-700" />
          
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 AnimatePDF. {currentLang === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
              {currentLang === 'tr' ? 'Üretken Yapay Zeka ile güçlendirilmiştir.' : 'Powered by Generative AI.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
