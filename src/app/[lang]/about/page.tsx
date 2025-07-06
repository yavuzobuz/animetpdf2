"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Users, 
  Lightbulb, 
  Rocket, 
  Heart, 
  Globe,
  Sparkles,
  Award,
  TrendingUp,
  Shield,
  Zap,
  BookOpen,
  Brain,
  Cpu,
  Eye,
  ArrowRight,
  CheckCircle,
  Star,
  Quote,
  Building,
  Calendar,
  Mail
} from "lucide-react"
import { useLanguage } from '@/contexts/language-context'
import { useParams } from 'next/navigation'

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function AboutPage({ params: paramsPromise }: LangPageProps) {
  const { language } = useLanguage()
  const urlParams = useParams()
  const currentLang = urlParams.lang as string || 'tr'
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getLocalizedPath = (path: string) => {
    const basePath = path === '/' ? '' : path;
    return `/${currentLang}${basePath}`;
  }

  const values = [
    {
      icon: Lightbulb,
          title: "İnovasyon",
      description: "Sürekli yenilik yaparak teknolojinin sınırlarını zorluyoruz",
      color: "bg-yellow-500"
        },
        {
      icon: Users,
          title: "Kullanıcı Odaklılık",
      description: "Her kararımızda kullanıcı deneyimini merkeze alıyoruz",
      color: "bg-blue-500"
        },
        {
      icon: Heart,
          title: "Tutku",
      description: "İşimizi seviyoruz ve bu tutkumuzu ürünlerimize yansıtıyoruz",
      color: "bg-red-500"
        },
        {
      icon: Shield,
          title: "Güvenilirlik",
      description: "Verilerinizin güvenliği ve gizliliği bizim önceliğimizdir",
      color: "bg-green-500"
        },
        {
      icon: Globe,
          title: "Erişilebilirlik",
      description: "Teknolojimizi herkes için kullanılabilir hale getiriyoruz",
      color: "bg-purple-500"
        },
        {
      icon: TrendingUp,
          title: "Sürekli Gelişim",
      description: "Hiç durmadan öğreniyor ve gelişiyoruz",
      color: "bg-orange-500"
        }
  ]

  const team = [
        {
          name: "Ahmet Yılmaz",
          role: "Kurucu & CEO",
      description: "15 yıllık tech deneyimi ile eğitime yenilik getiriyor",
      expertise: ["AI/ML", "Product Strategy", "Leadership"],
      image: "👨‍💼"
        },
        {
          name: "Zeynep Kaya", 
          role: "CTO",
      description: "Yapay zeka ve makine öğrenmesi alanında uzman",
      expertise: ["AI Engineering", "System Architecture", "Innovation"],
      image: "👩‍💻"
        },
        {
          name: "Mehmet Özkan",
          role: "Lead Developer",
      description: "Full-stack geliştirici ve teknoloji tutkunu",
      expertise: ["React", "Node.js", "Cloud Computing"],
      image: "👨‍💻"
        },
        {
          name: "Ayşe Demir",
          role: "UX/UI Designer",
      description: "Kullanıcı deneyimi ve arayüz tasarımında yaratıcı çözümler",
      expertise: ["User Experience", "Visual Design", "Prototyping"],
      image: "👩‍🎨"
        }
  ]

  const achievements = [
        {
      icon: Award,
          title: "TechCrunch Startup Ödülü",
      description: "2024 yılında en yenilikçi eğitim teknolojisi startupı ödülü",
      color: "bg-yellow-500"
        },
        {
      icon: Users,
          title: "10,000+ Aktif Kullanıcı",
      description: "Dünya çapında binlerce öğrenci ve eğitimcinin tercihi",
      color: "bg-blue-500"
        },
        {
      icon: TrendingUp,
          title: "%300 Büyüme",
      description: "Son 6 ayda kullanıcı tabanımızda üç kat artış",
      color: "bg-green-500"
        },
        {
      icon: Brain,
          title: "AI Teknoloji Lideri",
      description: "Eğitim sektöründe yapay zeka kullanımında öncü",
      color: "bg-purple-500"
    }
  ]

  const timeline = [
    {
      year: "2023",
      title: "Kuruluş",
      description: "AnimatePDF'in temelleri atıldı ve ilk prototip geliştirildi"
    },
    {
      year: "2024 Q1",
      title: "Beta Lansmanı",
      description: "İlk kullanıcılarımızla beta test süreci başlatıldı"
    },
    {
      year: "2024 Q2",
      title: "Resmi Lansmanı",
      description: "Platform halka açıldı ve hızlı büyüme dönemi başladı"
    },
    {
      year: "2024 Q3",
      title: "AI Geliştirmeleri",
      description: "Gelişmiş yapay zeka özellikleri ve yeni dil desteği eklendi"
    },
    {
      year: "2024 Q4",
      title: "Global Genişleme",
      description: "Uluslararası pazarlara açılım ve enterprise çözümler"
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
                <Building className="w-4 h-4 mr-2" />
                Hakkımızda
              </Badge>
              </div>

            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Eğitimi{" "}
              <span className="relative">
                <span className="text-orange-500 transition-all duration-500 hover:scale-110 inline-block">
                  Yeniden Tanımlıyoruz
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-200 -rotate-1 -z-10 animate-pulse"></div>
                </span>
              </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              AnimatePDF, yapay zeka gücüyle statik PDF'leri dinamik, etkileşimli öğrenme deneyimlerine 
              dönüştüren devrim niteliğinde bir platformdur. Bilgiyi daha erişilebilir hale getiriyoruz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={getLocalizedPath('/animate')}>
                <Button
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-16 px-12 text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                  Hemen Dene
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-0 bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-4">
                    Misyonumuz
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Bilgiyi daha erişilebilir, anlaşılır ve etkileşimli hale getirerek öğrenme deneyimini 
                    köklü bir şekilde değiştirmek ve herkesi güçlendirmek.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-black text-gray-900 mb-4">
                    Vizyonumuz
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Dünya çapında eğitim teknolojisinde öncü konumda yer alarak, her bireyin potansiyelini 
                    ortaya çıkarabileceği bir gelecek yaratmak.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Değerlerimiz</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Bizi yönlendiren temel değerler ve ilkeler
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="border-0 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Yolculuğumuz</h2>
              <p className="text-xl text-gray-600">
                AnimatePDF'in gelişim hikayesi
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-orange-200 h-full"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <CardContent className="p-6">
                        <Badge className="bg-orange-100 text-orange-600 mb-3">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.year}
                        </Badge>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="relative z-10 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
                    </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Takımımız</h2>
              <p className="text-xl text-gray-600">
                Tutkulu mühendisler, yaratıcı tasarımcılar ve eğitim uzmanları
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-0 bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105 group text-center">
                  <CardContent className="p-6">
                    <div className="text-6xl mb-4">{member.image}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                    <p className="text-orange-500 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} className="bg-orange-100 text-orange-600 text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-6">Başarılarımız</h2>
              <p className="text-xl text-gray-600">
                Kısa sürede elde ettiğimiz önemli kilometre taşları
              </p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <Card key={index} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group text-center">
                  <CardContent className="p-8">
                    <div className={`w-20 h-20 ${achievement.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-500 group-hover:scale-125 group-hover:rotate-12`}>
                      <achievement.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{achievement.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
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
              Bizimle Bu Yolculuğa Çıkın!
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              AnimatePDF ile öğrenmenin geleceğini şekillendirelim ve birlikte daha akıllı bir dünya yaratmaya başlayalım.
              <br />
              Hayallerinizi gerçeğe dönüştürün!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={getLocalizedPath('/animate')}>
                <Button
                  size="lg"
                  className="bg-white text-orange-500 hover:bg-gray-100 font-bold h-16 px-12 text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                >
                  <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                  Hemen Başlayın
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href={getLocalizedPath('/pricing')}>
              <Button 
                size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-500 font-bold h-16 px-12 text-xl rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
              >
                  <Star className="w-6 h-6 mr-3" />
                  Planları İncele
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}