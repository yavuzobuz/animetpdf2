"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Check, 
  X, 
  Crown, 
  Rocket, 
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Headphones,
} from "lucide-react"
import { useLanguage } from '@/contexts/language-context'
import { useParams } from 'next/navigation'

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function PricingPage({ params: paramsPromise }: LangPageProps) {
  const { language } = useLanguage()
  const urlParams = useParams()
  const currentLang = urlParams.lang as string || 'tr'
  const [isVisible, setIsVisible] = useState(false)
  const [isYearly, setIsYearly] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  const plans = [
        {
          name: "Başlangıç",
          subtitle: "Bireysel kullanım için",
      icon: Sparkles,
          monthlyPrice: 0,
          yearlyPrice: 0,
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      popular: false,
          description: "Temel özelliklerle tanışın",
          buttonText: "Ücretsiz Başla",
          buttonVariant: "outline" as const,
          features: [
        { text: "Ayda 5 PDF dönüştürme", included: true },
        { text: "Temel kalite animasyonlar", included: true },
        { text: "Standart seslendirme", included: true },
            { text: "Mini testler", included: true },
        { text: "2GB depolama", included: true },
        { text: "E-posta desteği", included: true },
        { text: "HD kalite", included: false },
            { text: "Öncelikli destek", included: false },
        { text: "API erişimi", included: false },
          ]
        },
        {
          name: "Pro",
          subtitle: "Profesyoneller için",
      icon: Crown,
      monthlyPrice: 29,
      yearlyPrice: 290,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      popular: true,
          description: "Günlük ihtiyaçlarınız için ideal",
      buttonText: "Pro'ya Başla",
          buttonVariant: "default" as const,
          features: [
        { text: "Sınırsız PDF dönüştürme", included: true },
        { text: "HD kalite animasyonlar", included: true },
            { text: "Profesyonel seslendirme", included: true },
        { text: "Gelişmiş testler", included: true },
        { text: "50GB depolama", included: true },
            { text: "Öncelikli e-posta desteği", included: true },
        { text: "Gelişmiş düzenleme araçları", included: true },
            { text: "PDF sohbet botu", included: true },
            { text: "Özel markalaşma", included: true },
          ]
        },
        {
      name: "Enterprise",
          subtitle: "Şirketler için",
      icon: Rocket,
      monthlyPrice: 99,
      yearlyPrice: 990,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      popular: false,
          description: "Ekibiniz için güçlü çözümler",
          buttonText: "Enterprise'a Başla",
          buttonVariant: "outline" as const,
          features: [
        { text: "Sınırsız kullanım", included: true },
        { text: "API erişimi", included: true },
        { text: "Özel marka entegrasyonu", included: true },
        { text: "Gelişmiş analitik", included: true },
        { text: "500GB depolama", included: true },
        { text: "7/24 öncelikli destek", included: true },
            { text: "Özel entegrasyonlar", included: true },
            { text: "Takım yönetimi", included: true },
        { text: "SLA garantisi", included: true },
      ]
    }
  ]

  const faqs = [
        {
          question: "Ücretsiz plan hangi özellikleri içeriyor?",
      answer: "Ücretsiz plan ile ayda 5 PDF dönüştürme, temel kalite animasyonlar, standart seslendirme ve 2GB depolama alanı kullanabilirsiniz. Hizmetimizi test etmek için mükemmel!"
        },
        {
          question: "Planımı istediğim zaman değiştirebilir miyim?",
      answer: "Evet! Planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Yükseltme anında etkili olur, düşürme işlemi bir sonraki fatura döneminde geçerli olur."
        },
        {
          question: "İptal politikanız nasıl?",
      answer: "İstediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar premium özellikleriniz aktif kalır. Herhangi bir erken iptal ücreti yoktur."
    },
    {
      question: "Ödeme güvenliği nasıl sağlanıyor?",
      answer: "Tüm ödemeler SSL şifrelemesi ile korunur ve PCI DSS standartlarına uygun olarak işlenir. Kredi kartı, banka kartı ve PayPal ile güvenle ödeme yapabilirsiniz."
    },
    {
      question: "Ücretsiz deneme süresi var mı?",
      answer: "Evet! Pro ve Enterprise planları için 7 günlük ücretsiz deneme sunuyoruz. Deneme süresinde tüm premium özellikleri kullanabilirsiniz."
    },
    {
      question: "Faturalama nasıl çalışır?",
      answer: "Faturalama kayıt olduğunuz tarihe göre aylık veya yıllık dönemlerle yapılır. Yıllık planlarında %17 indirim avantajı bulunur."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 animate-pulse">
                <Star className="w-4 h-4 mr-2" />
                Fiyatlandırma
              </Badge>
              </div>

            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Herkes İçin{" "}
              <span className="relative">
                <span className="text-orange-500 transition-all duration-500 hover:scale-110 inline-block">
                  Uygun Fiyat
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 -rotate-1 -z-10 animate-pulse"></div>
                </span>
              </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              İhtiyacınıza göre seçebileceğiniz esnek planlarımızla PDF'lerinizi büyülü animasyonlara dönüştürün. 
              Ücretsiz başlayın, istediğiniz zaman yükseltin!
              </p>

              {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg font-semibold ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Aylık
                </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-orange-500"
              />
              <span className={`text-lg font-semibold ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>
                Yıllık
                </span>
              {isYearly && (
                <Badge className="bg-green-100 text-green-700 ml-2">
                  %17 İndirim
                </Badge>
                )}
              </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <Card 
                  key={index}
                  className={`${plan.bgColor} border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden ${
                    plan.popular ? 'shadow-2xl ring-2 ring-orange-500' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-semibold">
                      En Popüler
                    </div>
                  )}

                  <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'} pb-2`}>
                    <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-4">{plan.subtitle}</p>
                    
                    <div className="mb-4">
                      <div className="text-4xl font-black text-gray-900 mb-2">
                        {plan.monthlyPrice === 0 ? (
                          "Ücretsiz"
                        ) : (
                          <>
                            ₺{isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                            <span className="text-lg font-normal text-gray-600">/ay</span>
                          </>
                        )}
                      </div>
                      {plan.monthlyPrice > 0 && isYearly && (
                        <p className="text-sm text-gray-600">
                          Yıllık ₺{plan.yearlyPrice} olarak faturalandırılır
                        </p>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6">{plan.description}</p>
                  </CardHeader>

                  <CardContent className="px-6 pb-6">
                    <Button 
                      className={`w-full h-12 mb-6 font-semibold transition-all duration-300 hover:scale-105 ${
                        plan.buttonVariant === 'default' 
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50'
                      }`}
                      variant={plan.buttonVariant}
                    >
                        {plan.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                            {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            ) : (
                            <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                            )}
                          <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Tüm Planlar İçin</h2>
              <p className="text-xl text-gray-600">
                Her planda yer alan temel özellikler
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Shield, label: "SSL Şifrelemesi", description: "Güvenli veri saklama" },
                { icon: Clock, label: "7/24 Erişim", description: "Kesintisiz platform erişimi" },
                { icon: Zap, label: "Hızlı İşleme", description: "Anında sonuçlar" },
                { icon: Users, label: "Çoklu Kullanıcı", description: "Takım çalışması desteği" },
                { icon: Star, label: "Premium Kalite", description: "Yüksek çözünürlük" },
                { icon: Headphones, label: "Müşteri Desteği", description: "Profesyonel yardım" },
              ].map((feature, index) => (
                <Card key={index} className="border-0 bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors duration-300">
                      <feature.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.label}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
                </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
              <p className="text-xl text-gray-600">
                Fiyatlandırma hakkında merak ettikleriniz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Hangi Planı Seçerseniz Seçin, Kazanan Sizsiniz!
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Bugün başlayın ve PDF'lerinizi etkileşimli deneyimlere dönüştürmeye başlayın.
              <br />
              Risk yok, taahhüt yok, sadece sınırsız yaratıcılık!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={getLocalizedPath('/animate')}>
              <Button 
                size="lg" 
                  className="bg-white text-orange-500 hover:bg-gray-100 font-bold h-16 px-12 text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}