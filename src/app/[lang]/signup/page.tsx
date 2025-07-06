"use client";

import { useState, useEffect, useActionState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { UserPlus, ArrowRight, Sparkles, Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { signupUser } from '@/app/auth/actions'
import { SubmitButton } from '@/components/custom/submit-button'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useParams } from 'next/navigation'

interface SignUpPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

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
)

export default function SignUpPage({ params: paramsPromise }: SignUpPageProps) {
  const { language } = useLanguage()
  const urlParams = useParams()
  const currentLang = urlParams.lang as string || 'tr'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  const uiText = {
    title: "Aramıza Katılın",
    subtitle: "Hesap oluşturun ve PDF'lerinizi canlandırmaya başlayın",
    emailLabel: "E-posta Adresiniz",
    emailPlaceholder: "ornek@eposta.com",
    passwordLabel: "Şifreniz",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Şifrenizi Tekrar Girin",
    submitButton: "Kayıt Ol",
    submitPending: "Kayıt Olunuyor...",
    loginPrompt: "Zaten bir hesabınız var mı?",
    loginLink: "Giriş Yapın",
    googleSignup: "Google ile Kayıt Ol",
    orDivider: "veya",
    joinToday: "Bugün Katılın"
  }
  
  const { toast } = useToast()
  const router = useRouter()
  const { signInWithGoogle } = useAuth()
  const [state, formAction] = useActionState(signupUser, null)

  const handleGoogleSignup = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      toast({
        title: 'Hata',
        description: 'Google ile kayıt olurken hata oluştu.',
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state.type === 'success' ? 'Başarılı' : 'Hata',
        description: state.message,
        variant: state.type === 'error' ? "destructive" : "default",
      })
      
      if (state.type === 'success' && state.redirectPath) {
        setTimeout(() => {
          router.push(`/${currentLang}${state.redirectPath}`)
        }, 2000)
      }
    }
  }, [state, toast, router, currentLang])

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-md mx-auto">
          
      {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                <Shield className="w-4 h-4 mr-2" />
                {uiText.joinToday}
              </Badge>
              </div>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              <span className="relative">
                <span className="text-orange-500 transition-all duration-500 hover:scale-110 inline-block">
                  {uiText.title}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 -rotate-1 -z-10 animate-pulse"></div>
                </span>
              </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {uiText.subtitle}
              </p>
        </div>
        
          {/* Signup Form Card */}
          <Card className="border-0 bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
            
            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:scale-110 transition-all duration-300">
                <UserPlus className="w-8 h-8 text-white" />
                  </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Hesap Oluşturun</CardTitle>
              <CardDescription className="text-gray-600">
                Birkaç adımda hesabınızı oluşturun ve hemen başlayın
              </CardDescription>
          </CardHeader>

            <CardContent className="px-8 pb-8">
            {/* Google Signup Button */}
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full h-12 text-gray-700 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-orange-300 text-lg rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mb-6 group"
              >
                <GoogleIcon />
                <span>{uiText.googleSignup}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>

            {/* Divider */}
              <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-200" />
              </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                  {uiText.orDivider}
                </span>
              </div>
            </div>

              {/* Signup Form */}
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">
                    {uiText.emailLabel}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={uiText.emailPlaceholder}
                  required
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-colors duration-300"
                />
              </div>
                </div>

              <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-semibold">
                    {uiText.passwordLabel}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                      type={showPassword ? "text" : "password"}
                  placeholder={uiText.passwordPlaceholder}
                  required
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-colors duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold">
                    {uiText.confirmPasswordLabel}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                  placeholder={uiText.passwordPlaceholder}
                  required
                      className="pl-10 pr-10 h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 transition-colors duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
              </div>

              <SubmitButton
                pendingText={uiText.submitPending}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                {uiText.submitButton}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </SubmitButton>
            </form>

              {/* Login Link */}
              <div className="text-center mt-8 pt-6 border-t border-gray-100">
                <p className="text-gray-600">
              {uiText.loginPrompt}{' '}
                  <Link 
                    href={getLocalizedPath('/login')} 
                    className="text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200 hover:underline"
                  >
                    {uiText.loginLink}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm">
              Ücretsiz başlayın, istediğiniz zaman yükseltin 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
