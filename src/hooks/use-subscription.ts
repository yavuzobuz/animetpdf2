"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { 
  getUserSubscription, 
  getUserCurrentUsage, 
  getAllSubscriptionPlans,
  SubscriptionPlan,
  UserSubscription,
  UserUsage
} from '@/lib/database';

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  subscription: UserSubscription | null;
  usage: UserUsage | null;
  currentUsage: number;
  pdfUsage: number;
  animationUsage: number;
  limit: number;
  remainingCredits: number;
  canProcess: boolean;
  usagePercentage: number;
  isLoading: boolean;
  error: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({
    plan: {
      id: '',
      name: 'free',
      display_name_tr: 'Ücretsiz Plan',
      display_name_en: 'Free Plan',
      monthly_price_usd: 0,
      monthly_pdf_limit: 5,
      features: [],
      is_active: true,
      sort_order: 0,
      created_at: '',
      updated_at: ''
    },
    subscription: null,
    usage: null,
    currentUsage: 0,
    pdfUsage: 0,
    animationUsage: 0,
    limit: 5,
    remainingCredits: 5,
    canProcess: true,
    usagePercentage: 0,
    isLoading: true,
    error: null
  });

  const refreshSubscriptionData = useCallback(async () => {
    if (!user?.id) {
      setSubscriptionInfo(prev => ({ ...prev, isLoading: false }));
      return;
    }

    setSubscriptionInfo(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Paralel olarak tüm verileri çek
      const [subscriptionResult, usageResult, plansResult] = await Promise.all([
        getUserSubscription(user.id),
        getUserCurrentUsage(user.id),
        getAllSubscriptionPlans()
      ]);

      // Plan bilgisini belirle - Güçlendirilmiş mantık
      let currentPlan: SubscriptionPlan;
      let currentSubscription: UserSubscription | null = null;

      if (subscriptionResult.success && subscriptionResult.data) {
        // user_subscriptions tablosunda aktif kayıt var
        currentPlan = subscriptionResult.data.plan;
        currentSubscription = subscriptionResult.data;
      } else {
        // user_subscriptions tablosunda kayıt yok, profiles tablosuna bak
        if (plansResult.success) {
          // Admin panelinden manuel plan ataması için profiles tablosunu kontrol et
          try {
            const profileResponse = await fetch('/api/get-user-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user.id })
            });
            
            if (profileResponse.ok) {
              const profileData = await profileResponse.json();
              if (profileData.profile?.current_plan_id) {
                const planFromProfile = plansResult.data.find(p => p.id === profileData.profile.current_plan_id);
                if (planFromProfile) {
                  currentPlan = planFromProfile;
                } else {
                  // Fallback: Free plan
                  currentPlan = plansResult.data.find(p => p.name === 'free') || plansResult.data[0];
                }
              } else {
                // Free plan
                currentPlan = plansResult.data.find(p => p.name === 'free') || plansResult.data[0];
              }
            } else {
              // API çağrısı başarısız, free plan kullan
              currentPlan = plansResult.data.find(p => p.name === 'free') || plansResult.data[0];
            }
          } catch (error) {
            console.warn('Profile fetch error, using free plan:', error);
            currentPlan = plansResult.data.find(p => p.name === 'free') || plansResult.data[0];
          }
        } else {
          throw new Error('Plan bilgileri alınamadı');
        }
      }

      // Kullanım bilgilerini al
      const currentUsageData = usageResult.data;
      const pdfUsage = currentUsageData?.pdfs_processed || 0;
      const animationUsage = currentUsageData?.animations_created || 0;
      const totalUsage = pdfUsage + animationUsage; // Birleştirilmiş kredi sistemi
      
      // Limit ve kalan kredi hesapla
      const limit = currentPlan.monthly_pdf_limit || 5;
      const remainingCredits = Math.max(0, limit - totalUsage);
      const canProcess = totalUsage < limit;
      const usagePercentage = limit > 0 ? (totalUsage / limit) * 100 : 0;

      setSubscriptionInfo({
        plan: currentPlan,
        subscription: currentSubscription,
        usage: currentUsageData,
        currentUsage: totalUsage,
        pdfUsage,
        animationUsage,
        limit,
        remainingCredits,
        canProcess,
        usagePercentage: Math.min(usagePercentage, 100),
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Subscription data fetch error:', error);
      setSubscriptionInfo(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      }));
    }
  }, [user?.id]);

  // Kullanım artırma fonksiyonu
  const incrementUsage = useCallback(async (type: 'pdf' | 'animation') => {
    if (!user?.id) return { success: false, error: 'Kullanıcı oturumu gerekli' };

    try {
      const response = await fetch('/api/increment-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, type })
      });

      const result = await response.json();
      
      if (result.success) {
        // Verileri güncelle
        await refreshSubscriptionData();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Kullanım artırılamadı' };
      }
    } catch (error) {
      console.error('Usage increment error:', error);
      return { success: false, error: 'Ağ hatası oluştu' };
    }
  }, [user?.id, refreshSubscriptionData]);

  // Limit kontrolü fonksiyonu
  const checkCanProcess = useCallback((type: 'pdf' | 'animation' = 'pdf') => {
    return {
      canProcess: subscriptionInfo.canProcess,
      currentUsage: subscriptionInfo.currentUsage,
      limit: subscriptionInfo.limit,
      limitType: 'Kredi',
      planName: subscriptionInfo.plan.name,
      remainingCredits: subscriptionInfo.remainingCredits,
      message: !subscriptionInfo.canProcess 
        ? `Bu ay ${subscriptionInfo.currentUsage}/${subscriptionInfo.limit} kredi kullandınız. Limitinizi aştınız, lütfen planınızı yükseltin.`
        : undefined
    };
  }, [subscriptionInfo]);

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    refreshSubscriptionData();
  }, [refreshSubscriptionData]);

  return {
    ...subscriptionInfo,
    refreshSubscriptionData,
    incrementUsage,
    checkCanProcess,
    // Convenience methods
    isPremium: subscriptionInfo.plan.name !== 'free',
    planDisplayName: {
      tr: subscriptionInfo.plan.display_name_tr,
      en: subscriptionInfo.plan.display_name_en
    }
  };
} 