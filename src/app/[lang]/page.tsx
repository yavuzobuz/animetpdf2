"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Upload,
  FileText, 
  Zap,
  Brain,
  Palette,
  Users,
  ArrowRight,
  Play,
  Star,
  Sparkles, 
  MessageCircle,
  BarChart3,
  Volume2, 
  MousePointer,
  CheckCircle,
  Clock,
  Shield, 
  Headphones,
} from "lucide-react"
import { useLanguage } from '@/contexts/language-context'
import { useParams } from 'next/navigation'
import { useT } from '@/i18n/translations'

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function LandingPage({ params: paramsPromise }: LangPageProps) {
  const { language } = useLanguage()
  const t = useT()
  const urlParams = useParams()
  const currentLang = urlParams.lang as string || 'tr'
  const [isVisible, setIsVisible] = useState(false)
  const [currentWord, setCurrentWord] = useState(0)

  const animatedWords = t.home.animatedWords

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % animatedWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-40 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center space-x-4 mb-8">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                {t.home.badgeAi}
              </Badge>
              <Badge className="bg-green-100 text-green-700 px-4 py-2">{t.home.badgeFree}</Badge>
              </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              {t.home.heroPrefix}
              <span className="relative">
                <span className="text-orange-500 transition-all duration-500 hover:scale-110 inline-block">
                  {animatedWords[currentWord]}
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 -rotate-1 -z-10 animate-pulse"></div>
              </span>{" "}
              {t.home.heroSuffix}
              </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t.home.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href={getLocalizedPath('/animate')}>
                  <Button 
                    size="lg" 
                  className="bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-semibold px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                  <Zap className="w-5 h-5 mr-2 animate-pulse" />
                  {t.home.ctaStart}
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Button 
                  variant="outline" 
                  size="lg" 
                className="border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 h-14 text-lg font-semibold px-8 rounded-xl transition-all duration-300 hover:scale-105 bg-transparent"
                >
                <Play className="w-5 h-5 mr-2" />
                {t.home.ctaDemo}
                </Button>
              </div>

              {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                {t.home.trustSafe}
                </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-blue-500" />
                {t.home.trustUsers}
                </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2 text-orange-500" />
                {t.home.trustInstant}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {t.home.stats.map((s, idx) => ({ number: s.number, label: s.label, icon: [FileText, Star, Clock, Headphones][idx] })).map((stat, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-gray-50"
              >
                <CardContent className="p-0">
                  <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="text-3xl font-black text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
              ))}
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">{t.home.whyTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.whyDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.home.features.map((f, idx) => ({
                title: f.title,
                description: f.desc,
                icon: [Brain, Palette, Sparkles, Volume2, MousePointer, CheckCircle, MessageCircle, BarChart3][idx],
                color: [
                  'bg-purple-500','bg-pink-500','bg-blue-500','bg-green-500',
                  'bg-orange-500','bg-red-500','bg-indigo-500','bg-teal-500'] [idx],
                bgColor: [
                  'bg-purple-50','bg-pink-50','bg-blue-50','bg-green-50',
                  'bg-orange-50','bg-red-50','bg-indigo-50','bg-teal-50'][idx]
            })).map((feature,index)=>(
              <Card
                key={index}
                className={`${feature.bgColor} border-0 hover:shadow-xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1 group cursor-pointer`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}
                  >
                    <feature.icon className="w-8 h-8 text-white transition-transform duration-500 group-hover:scale-110" />
                    </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-500 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">{t.home.howTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t.home.howSubtitle}
            </p>

            {/* Animated SVG connector */}
            <div className="relative w-full max-w-4xl mx-auto my-12 hidden md:block">
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-24"
              >
                <path
                  d="M0 60 C 150 20, 350 100, 600 60 S 1050 20, 1200 60"
                  fill="none"
                  stroke="#F97316" /* orange-500 */
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-200"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.home.howSteps.map((s, idx) => ({
                step: `${idx+1}`,
                title: s.title,
                description: s.desc,
                icon: [Upload, Brain, Sparkles, Play][idx],
                color: ['bg-orange-500','bg-blue-500','bg-purple-500','bg-green-500'][idx]
            })).map((step,index)=>(
              <Card
                key={index}
                className="text-center p-8 hover:shadow-xl transition-all duration-500 hover:scale-105 border-2 border-gray-100 group"
              >
                <CardContent className="p-0">
                  <div className="relative mb-6">
                    <div
                      className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto shadow-lg transition-all duration-500 group-hover:scale-110`}
                    >
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              {t.home.finalCtaTitle}
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed whitespace-pre-line">
              {t.home.finalCtaSubtitle}
            </p>

            <Link href={getLocalizedPath('/animate')}>
              <Button 
                size="lg" 
                className="bg-white text-orange-500 hover:bg-gray-100 font-bold h-16 px-12 text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
              >
                <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                {t.home.finalCtaButton}
                <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}