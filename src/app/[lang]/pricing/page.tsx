"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  X, 
  Sparkles, 
  Crown, 
  Rocket, 
  Zap,
  Star,
  TrendingUp,
  Shield,
  Users,
  Infinity,
  Clock,
  FileText,
  Volume2,
  MessageSquare,
  Cpu,
  ArrowRight,
  Gift,
  Heart,
  Award,
  Clapperboard,
  DollarSign,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function PricingPage({ params }: LangPageProps) {
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = React.useState<'en' | 'tr'>('tr');
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'yearly'>('monthly');
  
  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);

  const pageContent = {
    tr: {
      heroTitle: "Herkes İçin Uygun Fiyat",
      heroSubtitle: "İhtiyacınıza göre seçebileceğiniz esnek planlarımızla PDF'lerinizi büyülü animasyonlara dönüştürün. Ücretsiz başlayın, istediğiniz zaman yükseltin!",
      billingToggle: "Yıllık faturalama ile %20 tasarruf edin",
      monthly: "Aylık",
      yearly: "Yıllık",
      mostPopular: "En Popüler",
      recommended: "Önerilen",
      getStarted: "Hemen Başla",
      upgradeNow: "Şimdi Yükselt", 
      contactSales: "Satış ile İletişim",
      freeForever: "Sonsuza Kadar Ücretsiz",
      perMonth: "/ay",
      perYear: "/yıl",
      save20: "%20 Tasarruf",
      featuresTitle: "Tüm Planlar İçin",
      featuresSubtitle: "Her planda yer alan temel özellikler",
      faqTitle: "Sıkça Sorulan Sorular",
      ctaTitle: "Hangi Planı Seçerseniz Seçin, Kazanan Sizsiniz!",
      ctaSubtitle: "Bugün başlayın ve PDF'lerinizi etkileşimli deneyimlere dönüştürmeye başlayın. Risk yok, taahhüt yok, sadece sınırsız yaratıcılık!",
      ctaButton: "Ücretsiz Hesap Oluştur",
      plans: [
        {
          name: "Başlangıç",
          subtitle: "Bireysel kullanım için",
          icon: <Sparkles className="h-8 w-8" />,
          monthlyPrice: 0,
          yearlyPrice: 0,
          description: "Temel özelliklerle tanışın",
          badge: "",
          buttonText: "Ücretsiz Başla",
          buttonVariant: "outline" as const,
          features: [
            { text: "10 PDF dönüştürme/ay", included: true },
            { text: "Temel animasyon şablonları", included: true },
            { text: "Temel seslendirme", included: true },
            { text: "Mini testler", included: true },
            { text: "Topluluk desteği", included: true },
            { text: "Gelişmiş özellikler", included: false },
            { text: "Öncelikli destek", included: false },
            { text: "API erişimi", included: false }
          ]
        },
        {
          name: "Pro",
          subtitle: "Profesyoneller için",
          icon: <Crown className="h-8 w-8" />,
          monthlyPrice: 9.99,
          yearlyPrice: 7.99,
          description: "Günlük ihtiyaçlarınız için ideal",
          badge: "En Popüler",
          buttonText: "Pro'ya Yükselt", 
          buttonVariant: "default" as const,
          features: [
            { text: "95 PDF dönüştürme/ay", included: true },
            { text: "Tüm animasyon şablonları", included: true },
            { text: "Profesyonel seslendirme", included: true },
            { text: "Gelişmiş testler ve Q&A", included: true },
            { text: "Öncelikli e-posta desteği", included: true },
            { text: "PDF sohbet botu", included: true },
            { text: "Özel markalaşma", included: true },
            { text: "Daha hızlı işleme", included: true }
          ]
        },
        {
          name: "Kurumsal",
          subtitle: "Şirketler için",
          icon: <Rocket className="h-8 w-8" />,
          monthlyPrice: 24.99,
          yearlyPrice: 19.99,
          description: "Ekibiniz için güçlü çözümler",
          badge: "Önerilen",
          buttonText: "Enterprise'a Başla",
          buttonVariant: "outline" as const,
          features: [
            { text: "220 PDF dönüştürme/ay", included: true },
            { text: "Özel animasyon şablonları", included: true },
            { text: "Premium seslendirme çeşitleri", included: true },
            { text: "Gelişmiş diyagram oluşturma", included: true },
            { text: "7/24 telefon desteği", included: true },
            { text: "Özel entegrasyonlar", included: true },
            { text: "Takım yönetimi", included: true },
            { text: "Tam API erişimi", included: true }
          ]
        }
      ],
      commonFeatures: [
        { icon: <Shield className="h-6 w-6 text-green-500" />, text: "SSL şifrelemesi ve güvenli veri saklama" },
        { icon: <Clock className="h-6 w-6 text-blue-500" />, text: "7/24 platform erişimi" },
        { icon: <FileText className="h-6 w-6 text-purple-500" />, text: "Tüm PDF formatları desteği" },
        { icon: <Volume2 className="h-6 w-6 text-orange-500" />, text: "Çoklu dil seslendirme" },
        { icon: <MessageSquare className="h-6 w-6 text-pink-500" />, text: "PDF sohbet botu" },
        { icon: <Cpu className="h-6 w-6 text-indigo-500" />, text: "Yapay zeka destekli analiz" }
      ],
      faqs: [
        {
          question: "Ücretsiz plan hangi özellikleri içeriyor?",
          answer: "Ücretsiz plan ile ayda 5 PDF dönüştürme, temel animasyon şablonları ve topluluk desteği alırsınız. Hizmetimizi test etmek için mükemmel!"
        },
        {
          question: "Planımı istediğim zaman değiştirebilir miyim?",
          answer: "Evet! Planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklikler bir sonraki fatura döneminde geçerli olur."
        },
        {
          question: "İptal politikanız nasıl?",
          answer: "Istediğiniz zaman iptal edebilirsiniz. İptal ettiğinizde mevcut dönem sonuna kadar hizmetiniz devam eder."
        },
        {
          question: "Kurumsal çözümler için özel fiyatlandırma var mı?",
          answer: "100+ kullanıcı için özel enterprise paketleri ve indirimler sunuyoruz. Detaylar için satış ekibimizle iletişime geçin."
        }
      ]
    },
    en: {
      heroTitle: "Affordable Pricing for Everyone", 
      heroSubtitle: "Transform your PDFs into magical animations with our flexible plans tailored to your needs. Start free, upgrade anytime!",
      billingToggle: "Save 20% with annual billing",
      monthly: "Monthly",
      yearly: "Yearly", 
      mostPopular: "Most Popular",
      recommended: "Recommended",
      getStarted: "Get Started",
      upgradeNow: "Upgrade Now",
      contactSales: "Contact Sales",
      freeForever: "Free Forever",
      perMonth: "/month",
      perYear: "/year",
      save20: "Save 20%",
      featuresTitle: "For All Plans",
      featuresSubtitle: "Core features included in every plan",
      faqTitle: "Frequently Asked Questions",
      ctaTitle: "Whatever Plan You Choose, You Win!",
      ctaSubtitle: "Start today and begin transforming your PDFs into interactive experiences. No risk, no commitment, just unlimited creativity!",
      ctaButton: "Create Free Account",
      plans: [
        {
          name: "Starter",
          subtitle: "For individual use",
          icon: <Sparkles className="h-8 w-8" />,
          monthlyPrice: 0,
          yearlyPrice: 0,
          description: "Get familiar with basic features",
          badge: "",
          buttonText: "Start Free",
          buttonVariant: "outline" as const,
          features: [
            { text: "5 PDF conversions/month", included: true },
            { text: "Basic animation templates", included: true },
            { text: "Basic voice narration", included: true },
            { text: "Mini quizzes", included: true },
            { text: "Community support", included: true },
            { text: "Advanced features", included: false },
            { text: "Priority support", included: false },
            { text: "API access", included: false }
          ]
        },
        {
          name: "Pro",
          subtitle: "For professionals",
          icon: <Crown className="h-8 w-8" />,
          monthlyPrice: 9.99,
          yearlyPrice: 7.99,
          description: "Ideal for daily needs",
          badge: "Most Popular",
          buttonText: "Upgrade to Pro",
          buttonVariant: "default" as const,
          features: [
            { text: "95 PDF conversions/month", included: true },
            { text: "All animation templates", included: true },
            { text: "Professional voice narration", included: true },
            { text: "Advanced quizzes and Q&A", included: true },
            { text: "Priority email support", included: true },
            { text: "PDF chat bot", included: true },
            { text: "Custom branding", included: true },
            { text: "Faster processing", included: true }
          ]
        },
        {
          name: "Enterprise",
          subtitle: "For companies",
          icon: <Rocket className="h-8 w-8" />,
          monthlyPrice: 24.99,
          yearlyPrice: 19.99,
          description: "Powerful solutions for your team",
          badge: "Recommended",
          buttonText: "Start Enterprise",
          buttonVariant: "outline" as const,
          features: [
            { text: "220 PDF conversions/month", included: true },
            { text: "Custom animation templates", included: true },
            { text: "Premium voice varieties", included: true },
            { text: "Advanced diagram creation", included: true },
            { text: "24/7 phone support", included: true },
            { text: "Custom integrations", included: true },
            { text: "Team management", included: true },
            { text: "Full API access", included: true }
          ]
        }
      ],
      commonFeatures: [
        { icon: <Shield className="h-6 w-6 text-green-500" />, text: "SSL encryption and secure data storage" },
        { icon: <Clock className="h-6 w-6 text-blue-500" />, text: "24/7 platform access" },
        { icon: <FileText className="h-6 w-6 text-purple-500" />, text: "All PDF formats supported" },
        { icon: <Volume2 className="h-6 w-6 text-orange-500" />, text: "Multi-language narration" },
        { icon: <MessageSquare className="h-6 w-6 text-pink-500" />, text: "PDF chat bot" },
        { icon: <Cpu className="h-6 w-6 text-indigo-500" />, text: "AI-powered analysis" }
      ],
      faqs: [
        {
          question: "What features are included in the free plan?",
          answer: "The free plan includes 5 PDF conversions per month, basic animation templates, and community support. Perfect for testing our service!"
        },
        {
          question: "Can I change my plan anytime?",
          answer: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect in the next billing cycle."
        },
        {
          question: "What's your cancellation policy?",
          answer: "You can cancel anytime. After cancellation, your service continues until the end of the current period."
        },
        {
          question: "Do you offer custom pricing for enterprise solutions?",
          answer: "We offer special enterprise packages and discounts for 100+ users. Contact our sales team for details."
        }
      ]
    }
  };

  const content = pageContent[currentLang];

  const formatPrice = (price: number, period: 'monthly' | 'yearly') => {
    if (price === 0) return content.freeForever;
    const displayPrice = period === 'yearly' ? price : price;
    return `$${displayPrice}${period === 'monthly' ? content.perMonth : content.perYear}`;
  };

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10" />
        
        {/* Floating particles effect */}
              <div className="absolute top-20 left-10 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-pink-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-blue-400 rounded-full opacity-40 animate-pulse-enhanced"></div>
              
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 text-center">
          <AnimatedSection tag="div" className="space-y-8 max-w-4xl mx-auto">
            {/* Hero Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span>{currentLang === 'tr' ? '2025 Güncellendi • Şeffaf Fiyatlandırma' : '2025 Updated • Transparent Pricing'}</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold headline-modern">
                <span className="gradient-animate">
                  {content.heroTitle}
                </span>
              </h1>

              <p className="text-xl lg:text-2xl subheading-modern max-w-3xl mx-auto text-balance">
                {content.heroSubtitle}
              </p>

              {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 pt-8">
              <span className={`text-lg ${billingPeriod === 'monthly' ? 'text-purple-600 font-semibold' : 'text-gray-300'}`}>
                  {content.monthly}
                </span>
              
              <div 
                className="relative w-16 h-8 bg-white/20 backdrop-blur-sm rounded-full cursor-pointer transition-all duration-300 hover:bg-white/30 border border-white/20"
                onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-transform duration-300 ${
                  billingPeriod === 'yearly' ? 'transform translate-x-8' : ''
                }`} />
              </div>
              
              <span className={`text-lg ${billingPeriod === 'yearly' ? 'text-purple-600 font-semibold' : 'text-gray-300'}`}>
                  {content.yearly}
                </span>
              
                {billingPeriod === 'yearly' && (
                <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 border border-green-200 rounded-full px-3 py-1 text-sm font-medium">
                  <span>{content.save20}</span>
                </div>
                )}
              </div>
            </AnimatedSection>
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.plans.map((plan, index) => (
              <AnimatedSection key={plan.name} tag="div" delay={`delay-[${index * 150}ms]`}>
                <Card 
                  style={{ overflow: 'visible' }}
                  className={`relative group h-full glass-card transform hover:scale-105 transition-all duration-450 border-0 shadow-xl hover:shadow-2xl ${
                    plan.badge === content.mostPopular ? 'ring-2 ring-purple-500 scale-105' : ''
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="flex justify-center mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform duration-450">
                      <div className="text-purple-600">
                      {plan.icon}
                      </div>
                    </div>

                    <CardTitle className="text-2xl font-bold headline-modern mb-2">
                      {plan.name}
                    </CardTitle>

                    <p className="subheading-modern text-sm mb-4">
                      {plan.subtitle}
                    </p>

                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-4xl font-bold gradient-purple-pink">
                        {plan.monthlyPrice === 0 ? '$0' : `$${billingPeriod === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice}`}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-gray-500">
                          {billingPeriod === 'monthly' ? content.perMonth : content.perYear}
                            </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Button 
                      className={`w-full mb-6 h-12 text-lg font-semibold transition-all duration-450 ${
                        plan.buttonVariant === 'default' 
                          ? 'btn-gradient group' 
                          : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white bg-white/50 backdrop-blur-sm'
                      }`}
                      variant={plan.buttonVariant}
                      asChild
                    >
                      <Link href={`/${currentLang}/signup`}>
                        {plan.buttonText}
                        {plan.buttonVariant === 'default' && (
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-450" />
                        )}
                      </Link>
                    </Button>
                    
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3 group-hover:translate-x-1 transition-transform duration-300">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-300 ${
                            feature.included 
                              ? 'bg-green-100 text-green-600 group-hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {feature.included ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                          </div>
                          <span className={`text-sm transition-colors duration-300 ${
                            feature.included ? 'text-gray-700 group-hover:text-gray-900' : 'text-gray-400'
                          }`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Common Features */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50/80 via-pink-50/80 to-blue-50/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.featuresTitle}
            </h2>
            <p className="text-xl subheading-modern max-w-2xl mx-auto">
              {content.featuresSubtitle}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {content.commonFeatures.map((feature, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 100}ms]`}>
                <div className="flex items-center gap-4 p-6 glass-card group h-full transform hover:scale-105 transition-all duration-450">
                  <div className="group-hover:scale-110 transition-transform duration-450">
                      {feature.icon}
                    </div>
                  <span className="text-gray-700 font-medium group-hover:gradient-animate transition-all duration-450">
                      {feature.text}
                  </span>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection tag="div" className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold headline-modern mb-6">
              {content.faqTitle}
            </h2>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-6">
            {content.faqs.map((faq, index) => (
              <AnimatedSection key={index} tag="div" delay={`delay-[${index * 100}ms]`}>
                <Card className="glass-card hover:scale-[1.02] transition-all duration-450 border-0 shadow-lg hover:shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 group-hover:gradient-animate transition-all duration-450">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 cta-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-blue-600/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white rounded-full mix-blend-overlay filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection tag="div" className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold headline-modern mb-6 text-white">
              {content.ctaTitle}
            </h2>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl mx-auto">
              {content.ctaSubtitle}
            </p>
            
              <Button 
                size="lg" 
              className="group bg-white text-purple-700 hover:bg-gray-100 px-10 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-450"
              asChild
              >
              <Link href={`/${currentLang}/signup`} className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                {content.ctaButton}
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-450" />
              </Link>
              </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
