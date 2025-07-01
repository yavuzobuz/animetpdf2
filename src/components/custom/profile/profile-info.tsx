"use client";

import React, { useState, useActionState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, X, User, Mail, Calendar, Crown, Zap, FileText, TrendingUp, Sparkles, Rocket, ArrowRight, Clock } from 'lucide-react';
import { updateProfile } from '@/app/auth/actions';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import { getUserSubscription, getUserCurrentUsage, getAllSubscriptionPlans } from '@/lib/database';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProfileInfoProps {
  profile: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    bio?: string;
    avatar_url?: string;
    created_at: string;
    full_name: string | null;
  };
  isOwner: boolean;
}

export default function ProfileInfo({ profile, isOwner }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const [subscription, setSubscription] = React.useState<any>(null);
  const [usage, setUsage] = React.useState<any>(null);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await updateProfile(prevState, formData);
    if (result.type === 'success') {
      setIsEditing(false);
      toast({
        title: "Başarılı",
        description: result.message,
      });
    } else {
      toast({
        title: "Hata",
        description: result.message,
        variant: "destructive",
      });
    }
    return result;
  }, null);

  const handleCancel = () => {
    setIsEditing(false);
  };

  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : profile.username || 'Adsız Kullanıcı';

  const initials = profile.first_name && profile.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`
    : profile.username ? profile.username[0].toUpperCase()
    : 'U';

  React.useEffect(() => {
    if (profile?.id) {
      loadSubscriptionData();
    }
  }, [profile?.id]);

  const loadSubscriptionData = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const [subResult, usageResult, plansResult] = await Promise.all([
        getUserSubscription(profile.id),
        getUserCurrentUsage(profile.id),
        getAllSubscriptionPlans()
      ]);

      if (subResult.success) setSubscription(subResult.data);
      if (usageResult.success) setUsage(usageResult.data);
      if (plansResult.success) setPlans(plansResult.data);
    } catch (error) {
      console.error('Subscription data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'free': return <Sparkles className="h-5 w-5" />;
      case 'starter': return <Crown className="h-5 w-5" />;
      case 'pro': return <Rocket className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case 'free': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'starter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pro': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US');
  };

  if (!profile) return null;

  // Get current plan details
  const currentPlan = subscription?.plan || plans.find(p => p.name === 'free');
  const currentUsage = usage?.pdfs_processed || 0;
  const planLimit = currentPlan?.monthly_pdf_limit || 3;
  const remainingPDFs = Math.max(0, planLimit - currentUsage);
  const usagePercentage = planLimit > 0 ? (currentUsage / planLimit) * 100 : 0;

  const text = {
    tr: {
      title: "Profil Bilgileri",
      email: "E-posta",
      fullName: "Ad Soyad",
      joinDate: "Katılım Tarihi",
      editProfile: "Profili Düzenle",
      currentPlan: "Mevcut Plan",
      usage: "Bu Ay Kullanım",
      pdfLimit: "PDF Limiti",
      remaining: "Kalan",
      unlimited: "Sınırsız",
      upgrade: "Planı Yükselt",
      freePlan: "Ücretsiz Plan",
      starterPlan: "Başlangıç Planı",
      proPlan: "Profesyonel Plan",
      usageProgress: "Kullanım Oranı",
      renewalDate: "Yenileme Tarihi",
      monthlyUsage: "Aylık Kullanım"
    },
    en: {
      title: "Profile Information",
      email: "Email",
      fullName: "Full Name",
      joinDate: "Join Date",
      editProfile: "Edit Profile",
      currentPlan: "Current Plan",
      usage: "This Month Usage",
      pdfLimit: "PDF Limit",
      remaining: "Remaining",
      unlimited: "Unlimited",
      upgrade: "Upgrade Plan",
      freePlan: "Free Plan",
      starterPlan: "Starter Plan",
      proPlan: "Professional Plan",
      usageProgress: "Usage Progress",
      renewalDate: "Renewal Date",
      monthlyUsage: "Monthly Usage"
    }
  };

  const currentText = text[language as keyof typeof text] || text.tr;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {currentText.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || ''} />
              <AvatarFallback className="text-lg">
                {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">
                {profile.full_name || profile.email}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{currentText.joinDate}: {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription & Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              {currentText.currentPlan}
            </div>
            <Link href="/pricing">
              <Button variant="outline" size="sm" className="gap-2">
                {currentText.upgrade}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Display */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${getPlanColor(currentPlan?.name || 'free')}`}>
                {getPlanIcon(currentPlan?.name || 'free')}
              </div>
              <div>
                <h4 className="font-semibold">
                  {language === 'tr' ? currentPlan?.display_name_tr : currentPlan?.display_name_en}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {currentPlan?.monthly_price_usd > 0 
                    ? `$${currentPlan.monthly_price_usd}/ay`
                    : currentText.freePlan
                  }
                </p>
              </div>
            </div>
            
            {subscription?.current_period_end && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {currentText.renewalDate}
                </div>
                <p className="text-sm font-medium">
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
            )}
          </div>

          {/* Usage Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {currentText.monthlyUsage}
              </h5>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                {currentUsage}/{planLimit} PDF
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentText.usageProgress}</span>
                <span>{Math.min(100, Math.round(usagePercentage))}%</span>
              </div>
              <Progress 
                value={Math.min(100, usagePercentage)} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentText.remaining}: {remainingPDFs} PDF</span>
                <span>
                  {new Date().toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            </div>

            {/* Warning if close to limit */}
            {usagePercentage > 80 && (
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ {language === 'tr' 
                    ? 'Aylık limitinize yaklaşıyorsunuz. Planınızı yükseltmeyi düşünün.'
                    : 'You are approaching your monthly limit. Consider upgrading your plan.'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
