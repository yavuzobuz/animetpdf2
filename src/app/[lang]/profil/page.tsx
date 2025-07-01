"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserProjects, getUserAnimationPages, PDFProject, AnimationPage, deleteProject, getSiteStatistics, SiteStatistics, getUserStats, UserStats } from '@/lib/database'; // PDFProject türünü ve fonksiyonu import et
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

interface LangPageProps {
  params: Promise<{ lang: 'en' | 'tr' }>;
}

export default function ProfilePage({ params }: LangPageProps) {
  const { user, loading, signOut } = useAuth();
  const { language } = useLanguage();
  const [currentLang, setCurrentLang] = useState<'en' | 'tr'>('tr');
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    converted_pdfs: 0,
    created_animations: 0,
    total_downloads: 0,
    storage_used: 0,
    plan: 'Free',
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
      const fetchProjects = async () => {
        setLoadingProjects(true);
        const { success, data } = await getUserProjects(user.id);
        const animRes = await getUserAnimationPages(user.id);
        if (success) {
          let combined: any[] = [...data];
          if (animRes.success) {
            const mapped = animRes.data.map((ap: AnimationPage) => ({
              id: ap.id,
              title: ap.topic,
              animation_scenario: ap.scenes,
              animation_svgs: ap.animation_svgs,
              qa_pairs: ap.qa_pairs,
              status: 'completed',
              created_at: ap.created_at,
              updated_at: ap.updated_at || ap.created_at,
              analysis_result: { summary: ap.script_summary },
              animation_settings: { type: 'animation' }
            }));
            combined = [...combined, ...mapped];
          }
          setUserProjects(combined);
        }
        setLoadingProjects(false);
      };

      const fetchStats = async () => {
        setLoadingStats(true);
        const res = await getUserStats(user.id);
        if (res.success) {
          setStats(res.data);
        }
        setLoadingStats(false);
      };

      fetchProjects();
      fetchStats();
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
    <div className="page-container">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
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
                      {stats.plan} Plan
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
                <div className="flex flex-col space-y-2">
                  <Button className="btn-gradient" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    {content.editProfile}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/30">
                    <Settings className="h-4 w-4 mr-2" />
                    {content.settings}
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
                <Card className="glass-card border border-white/20">
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
                      <h3 className="text-2xl font-bold headline-modern mb-2">{stats.plan} Plan</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {content.nextBilling}: {formatDate(stats.nextBilling)}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>{content.monthlyUsage}</span>
                        <span className="font-medium">{stats.monthly_pdf_count}/{stats.monthly_limit}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            stats.monthly_pdf_count >= stats.monthly_limit 
                              ? 'bg-gradient-to-r from-red-500 to-red-600' 
                              : 'bg-gradient-to-r from-purple-600 to-pink-600'
                          }`}
                          style={{ width: `${Math.min((stats.monthly_pdf_count / stats.monthly_limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {stats.monthly_pdf_count >= stats.monthly_limit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900/20 dark:border-red-800">
                          <p className="text-sm text-red-700 dark:text-red-300 text-center">
                            ⚠️ Bu ay PDF limitinize ulaştınız! Plan yükseltin.
                          </p>
                        </div>
                      )}
                    </div>

                    <Button className="w-full btn-gradient" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      {content.upgradeToEnterprise}
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Achievements */}
              <AnimatedSection tag="div" delay="200">
                <Card className="glass-card border border-white/20">
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
                  
                  <Card className="gradient-card border-0 shadow-xl text-center transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold headline-modern mb-2">{stats.created_animations}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.projectsCreated}</p>
                    </CardContent>
                  </Card>

                  <Card className="gradient-card border-0 shadow-xl text-center transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold headline-modern mb-2">{stats.total_downloads}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.totalDownloads}</p>
                    </CardContent>
                  </Card>

                  <Card className="gradient-card border-0 shadow-xl text-center transform hover:scale-105 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold headline-modern mb-1">{stats.storage_used}GB</div>
                      <div className="text-xs text-gray-500 mb-2">/ 10GB</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{content.storageUsed}</p>
                    </CardContent>
                  </Card>

                </div>
              </AnimatedSection>

              {/* Recent Projects */}
              <AnimatedSection tag="div" delay="100">
                {loadingProjects ? (
                  <Card className="glass-card border border-white/20">
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
                <Card className="glass-card border border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl font-bold">
                      <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                      Hızlı İşlemler
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link href={`/${currentLang}/animate`}>
                        <Button className="w-full btn-gradient group">
                          <Plus className="h-4 w-4 mr-2" />
                          {content.createNew}
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                      
                      <Button variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white/30">
                        <Settings className="h-4 w-4 mr-2" />
                        {content.settings}
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
