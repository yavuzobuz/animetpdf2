"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PDFProject, AnimationPage, deleteProject, getSiteStatistics, SiteStatistics, UserStats } from '@/lib/database'; // PDFProject türünü ve fonksiyonu import et
import UserProjects from '@/components/custom/profile/user-projects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Download,
  Settings,
  LogOut,
  Edit,
  Shield,
  Star,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Sparkles,
  Award,
  Zap,
  Heart,
  Eye,
  BarChart3,
  PieChart,
  ArrowRight,
  Plus,
  PlayCircle,
  Clapperboard,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';
import AnimatedSection from '@/components/custom/animated-section';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import { useSubscription } from '@/hooks/use-subscription';

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function ProfilePage({ params }: LangPageProps) {
  const { user, loading, signOut } = useAuth();
  const { language } = useLanguage();
  const subscriptionInfo = useSubscription();
  const [currentLang, setCurrentLang] = useState<'en' | 'tr'>('tr');
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Gerçek kullanıcı istatistikleri
  const [stats, setStats] = useState<UserStats>({
    converted_pdfs: 0,
    created_animations: 0,
    total_downloads: 0,
    storage_used: 0,
    plan: 'Ücretsiz',
    joinDate: new Date().toISOString(),
    nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    monthly_pdf_count: 0,
    monthly_limit: 5,
    achievements: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Güvenli tarih formatı için yardımcı fonksiyon
  const formatDate = (dateString: string) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return 'Bugün';
    }
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  // Proje silme fonksiyonu
  const handleDeleteProject = async (projectId: string) => {
    if (!user?.id) return;
    
    const result = await deleteProject(projectId, user.id);
    if (result.success) {
      // Projeler listesini güncelle
      setUserProjects(prev => prev.filter(project => project.id !== projectId));
    } else {
      alert(result.error || 'Proje silinirken bir hata oluştu');
    }
  };
  
  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('/api/get-user-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.profile) {
              setProfile(data.profile);
            }
          } else {
            console.warn('Profile fetch failed:', response.status, response.statusText);
          }
        } catch (error) {
          console.error("Failed to fetch profile", error);
        }
      };

      const fetchStats = async () => {
        setLoadingStats(true);
        try {
          const response = await fetch('/api/get-user-stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setStats(result.data);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user stats", error);
        } finally {
          setLoadingStats(false);
        }
      };

      const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
          const response = await fetch('/api/get-user-projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id })
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              setUserProjects(result.data);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user projects", error);
        } finally {
          setLoadingProjects(false);
        }
      };

      fetchProfile();
      fetchStats();
      fetchProjects();
    } else {
      setLoadingProjects(false);
      setLoadingStats(false);
      setUserProjects([]);
    }
  }, [user]);

  React.useEffect(() => {
    params.then(({ lang }) => {
      setCurrentLang(language || lang || 'tr');
    });
  }, [params, language]);

  const pageContent = {
    tr: {
      title: "Profilim",
      subtitle: "Hesap bilgilerinizi ve istatistiklerinizi görüntüleyin",
      accountInfo: "Hesap Bilgileri",
      subscription: "Abonelik",
      statistics: "İstatistikler", 
      recentActivity: "Son Aktiviteler",
      settings: "Ayarlar",
      editProfile: "Profili Düzenle",
      changePassword: "Şifre Değiştir",
      signOut: "Çıkış Yap",
      memberSince: "Üyelik Tarihi",
      currentPlan: "Mevcut Plan",
      nextBilling: "Sonraki Faturalama",
      upgradeToEnterprise: "Enterprise'a Yükselt",
      pdfsConverted: "Dönüştürülen PDF",
      animationsCreated: "Oluşturulan Animasyon",
      projectsCreated: "Oluşturulan Proje",
      totalDownloads: "Toplam İndirme",
      storageUsed: "Kullanılan Depolama",
      recentProjects: "Son Projeler",
      viewAll: "Tümünü Görüntüle",
      createNew: "Yeni Oluştur",
      noProjects: "Henüz proje oluşturmadınız",
      getStarted: "Hemen Başlayın",
      achievements: "Başarılar",
      monthlyUsage: "Aylık Kullanım",
      usageLimit: "Kullanım Limiti"
    },
    en: {
      title: "My Profile",
      subtitle: "View your account information and statistics",
      accountInfo: "Account Information",
      subscription: "Subscription",
      statistics: "Statistics",
      recentActivity: "Recent Activity", 
      settings: "Settings",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      signOut: "Sign Out",
      memberSince: "Member Since",
      currentPlan: "Current Plan",
      nextBilling: "Next Billing",
      upgradeToEnterprise: "Upgrade to Enterprise",
      animationsCreated: "Animations Created",
      projectsCreated: "Projects Created",
      totalDownloads: "Total Downloads",
      storageUsed: "Storage Used",
      recentProjects: "Recent Projects",
      viewAll: "View All",
      createNew: "Create New",
      noProjects: "You haven't created any projects yet",
      getStarted: "Get Started",
      achievements: "Achievements",
      monthlyUsage: "Monthly Usage",
      usageLimit: "Usage Limit"
    }
  };

  const content = pageContent[currentLang] || pageContent.tr;

  // Mock recent projects - Bu satırı kaldırıyoruz, gerçek veriyi kullanacağız
  // const recentProjects: any[] = [];
 
  // const achievements: any[] = []; // Mock data kaldırıldı
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Giriş Yapmanız Gerekiyor</h1>
            <Link href={`/${currentLang}/login`}>
              <Button>Giriş Yap</Button>
            </Link>
          </div>
        </div>
      </div>
    );
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
      <section className="py-16 sm:py-24 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection tag="div" className="space-y-6">
             

              {/* Profile Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Avatar */}
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-3xl lg:text-4xl font-bold text-white">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold headline-modern mb-2">
                      <span className="gradient-animate">
                        {content.title}
                      </span>
                    </h1>
                    <p className="text-xl subheading-modern">
                      {content.subtitle}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-700">
                      <Crown className="h-3 w-3 mr-1" />
                      {subscriptionInfo.planDisplayName.tr} Plan
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700">
                      <Activity className="h-3 w-3 mr-1" />
                      {stats.created_animations} Animasyon Oluşturuldu
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(stats.joinDate)} tarihinden beri üye
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 w-full max-w-[190px]">
                  <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full" size="sm">
                    <Link href={`/${currentLang}/profil/edit`} scroll={false}>
                      <Edit className="h-4 w-4 mr-2" />
                      {content.editProfile}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/30 w-full">
                    <Link href={`/${currentLang}/profil/settings`} scroll={false}>
                      <Settings className="h-4 w-4 mr-2" />
                      {content.settings}
                    </Link>
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>      {/* Main Content */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Account Info & Subscription */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* Account Information */}
              <AnimatedSection tag="div">
                <Card className="border-0 bg-gray-50 shadow hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold">
                      <User className="h-5 w-5 mr-2 text-purple-600" />
                      {content.accountInfo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {content.memberSince}: {formatDate(stats.joinDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Hesap Doğrulanmış</span>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Subscription Card */}
              <AnimatedSection tag="div" delay="100">
                <Card className="gradient-card border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold">
                      <Crown className="h-5 w-5 mr-2 text-purple-600" />
                      {content.subscription}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold headline-modern mb-2">{subscriptionInfo.planDisplayName.tr} Plan</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {content.nextBilling}: {formatDate(subscriptionInfo.subscription?.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>{content.monthlyUsage}</span>
                        <span className="font-medium">{subscriptionInfo.currentUsage}/{subscriptionInfo.limit}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            subscriptionInfo.currentUsage >= subscriptionInfo.limit 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : 'bg-gradient-to-r from-purple-600 to-pink-600'
                          }`}
                          style={{ width: `${Math.min(subscriptionInfo.usagePercentage, 100)}%` }}
                        ></div>
                      </div>
                      {subscriptionInfo.currentUsage >= subscriptionInfo.limit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900/20 dark:border-red-800">
                          <p className="text-sm text-red-700 dark:text-red-300 text-center">
                            ⚠️ Bu ay kredi limitinize ulaştınız! Plan yükseltin.
                          </p>
                        </div>
                      )}
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {content.upgradeToEnterprise}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Achievements */}
              <AnimatedSection tag="div" delay="200">
                <Card className="border-0 bg-gray-50 shadow hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold">
                      <Award className="h-5 w-5 mr-2 text-yellow-600" />
                      {content.achievements}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {stats.achievements && stats.achievements.length > 0 ? (
                        stats.achievements.map((achievement: any, index: number) => (
                          <div key={index} className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:scale-105 transition-transform duration-300">
                            <div className="flex justify-center mb-2">
                            {achievement.icon}
                          </div>
                          <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                        </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 col-span-2 text-center">{currentLang === 'tr' ? 'Henüz bir başarımınız bulunmuyor.' : 'No achievements yet.'}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Right Column - Statistics & Activity */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Statistics Cards */}
              <AnimatedSection tag="div">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  
                  <Card className="gradient-card border-0 shadow-xl text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold headline-modern mb-2">{stats.created_animations}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.animationsCreated}</p>
                    </CardContent>
                  </Card>

                  <Card className="gradient-card border-0 shadow-xl text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold headline-modern mb-2">{stats.total_downloads}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.totalDownloads}</p>
                    </CardContent>
                  </Card>

                  <Card className="gradient-card border-0 shadow-xl text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold headline-modern mb-1">{stats.storage_used}GB</div>
                      <div className="text-xs text-gray-500 mb-2">/ 10GB</div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${Math.min((stats.storage_used / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.storageUsed}</p>
                    </CardContent>
                  </Card>

                </div>
              </AnimatedSection>

              {/* Recent Projects */}
              <AnimatedSection tag="div" delay="100">
                {loadingProjects ? (
                  <Card className="border-0 bg-gray-50 shadow hover:shadow-lg transition-all duration-300">
                    <CardContent>
                      <div className="text-center py-12">
                        <p>{currentLang === 'tr' ? 'Projeler yükleniyor...' : 'Loading projects...'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <UserProjects 
                    projects={userProjects}
                    isOwner={true}
                    currentLang={currentLang}
                    onDeleteProject={handleDeleteProject}
                  />
                )}
              </AnimatedSection>

              {/* Quick Actions */}
              <AnimatedSection tag="div" delay="200">
                <Card className="border-0 bg-gray-50 shadow hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      Hızlı İşlemler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link href={`/${currentLang}/animate`}>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white group">
                          <Plus className="h-4 w-4 mr-2" />
                          {content.createNew}
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                      
                      <Button asChild variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/30">
                        <Link href={`/${currentLang}/profil/settings`} scroll={false}>
                          <Settings className="h-4 w-4 mr-2" />
                          {content.settings}
                        </Link>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => signOut()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {content.signOut}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
