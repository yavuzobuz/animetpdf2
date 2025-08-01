import { createAdminClient, createBrowserClient } from './supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PDFProject {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  pdf_file_url: string;
  pdf_file_name: string;
  pdf_file_size: number | null;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  analysis_result: any;
  qa_pairs: any;
  animation_scenario: any;
  animation_settings: any;
  created_at: string;
  updated_at: string;
}

export interface AnimationFrame {
  id: string;
  project_id: string;
  frame_number: number;
  frame_description: string;
  image_url: string | null;
  audio_url: string | null;
  duration_seconds: number;
  settings: any;
  created_at: string;
  updated_at: string;
}

// Animation pages
export interface AnimationPage {
  id: string;
  user_id: string;
  topic: string;
  script_summary: string | null;
  scenes: any;
  diagram_svg?: string | null;
  images?: any;
  animation_svgs?: any;
  qa_pairs?: any;
  created_at: string;
  updated_at?: string;
}

// İstatistikler
export interface SiteStatistics {
  converted_pdfs: number;
  created_animations: number;
  total_downloads: number;
  storage_used: number;
}

// Kullanıcı profil istatistikleri
export interface UserStats {
  converted_pdfs: number;
  created_animations: number;
  total_downloads: number;
  storage_used: number;
  plan: string;
  joinDate: string;
  nextBilling: string;
  monthly_pdf_count: number;
  monthly_limit: number;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked_at: string;
  }>;
}

// Yeni Subscription Interface'leri
export interface SubscriptionPlan {
  id: string;
  name: 'free' | 'starter' | 'pro';
  display_name_tr: string;
  display_name_en: string;
  description_tr?: string;
  description_en?: string;
  monthly_price_usd: number;
  annual_price_usd?: number;
  monthly_pdf_limit: number;
  features: Array<{tr: string; en: string}>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  billing_cycle: 'monthly' | 'annual';
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  month_year: string; // '2025-01' format
  pdfs_processed: number;
  animations_created: number;
  storage_used_mb: number;
  last_reset_at: string;
  created_at: string;
  updated_at: string;
}

// Profile işlemleri
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Profile fetch error:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Profile update error:', error);
    return false;
  }

  return true;
}

// PDF Proje işlemleri
export async function createPDFProject(
  userId: string, 
  projectData: {
    title: string;
    description?: string;
    pdf_file_url: string;
    pdf_file_name: string;
    pdf_file_size?: number;
  }
): Promise<PDFProject | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('pdf_projects')
    .insert({
      user_id: userId,
      ...projectData
    })
    .select()
    .single();

  if (error) {
    console.error('Project creation error:', error);
    return null;
  }

  return data;
}

// Ana getUserProjects fonksiyonu
export async function getUserProjects(userId: string): Promise<{ success: boolean; data: PDFProject[]; error?: string }> {
  try {
    // Browser'da çalışabilir hale getir
    const supabase = typeof window !== 'undefined' 
      ? createBrowserClient() 
      : createAdminClient();
  const { data, error } = await supabase
    .from('pdf_projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Projects fetch error:', error);
      return { success: false, data: [], error: error.message };
  }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Projects fetch exception:', error);
    return { success: false, data: [], error: 'Bilinmeyen hata oluştu' };
  }
}

// Ana getUserProfile fonksiyonu
export const getUserProfile = async (userId: string) => {
  try {
    const supabase = typeof window !== 'undefined' 
      ? createBrowserClient() 
      : createAdminClient();
    
    // Önce profil bilgisini al
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return { success: false, data: null, error: profileError.message };
    }

    // Eğer current_plan_id varsa, plan adını al
    let planName = 'Free';
    if (profile.current_plan_id) {
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('display_name_tr')
        .eq('id', profile.current_plan_id)
        .single();
      
      if (planData) {
        planName = planData.display_name_tr;
      }
    }

    // Plan adını profile'a ekle
    const profileWithPlan = {
      ...profile,
      plan_name: planName
    };

    return { success: true, data: profileWithPlan };
  } catch (error) {
    console.error('Profile fetch exception:', error);
    return { success: false, data: null, error: 'Bilinmeyen hata oluştu' };
  }
};

export async function getProject(projectId: string): Promise<PDFProject | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('pdf_projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Project fetch error:', error);
    return null;
  }

  return data;
}

export async function updateProject(
  projectId: string, 
  updates: Partial<PDFProject>
): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('pdf_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId);

  if (error) {
    console.error('Project update error:', error);
    return false;
  }

  return true;
}

// Animasyon Frame işlemleri
export async function getProjectFrames(projectId: string): Promise<AnimationFrame[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('animation_frames')
    .select('*')
    .eq('project_id', projectId)
    .order('frame_number', { ascending: true });

  if (error) {
    console.error('Frames fetch error:', error);
    return [];
  }

  return data || [];
}

export async function createFrame(
  projectId: string,
  frameData: {
    frame_number: number;
    frame_description: string;
    image_url?: string;
    audio_url?: string;
    duration_seconds?: number;
    settings?: any;
  }
): Promise<AnimationFrame | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('animation_frames')
    .insert({
      project_id: projectId,
      ...frameData
    })
    .select()
    .single();

  if (error) {
    console.error('Frame creation error:', error);
    return null;
  }

  return data;
}

export async function updateFrame(
  frameId: string,
  updates: Partial<AnimationFrame>
): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('animation_frames')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', frameId);

  if (error) {
    console.error('Frame update error:', error);
    return false;
  }

  return true;
}

export async function deleteFrame(frameId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('animation_frames')
    .delete()
    .eq('id', frameId);

  if (error) {
    console.error('Frame delete error:', error);
    return false;
  }

  return true;
}

export const getProjectDetails = async (projectId: string, userId?: string) => {
  try {
    const supabase = createAdminClient();
    
    // Önce pdf_projects tablosunda ara
    let query = supabase
      .from('pdf_projects')
      .select('*')
      .eq('id', projectId);
    
    // Eğer userId verilmişse, sadece o kullanıcının projelerini getir
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.single();

    if (!error && data) {
      return { success: true, data };
    }

    // pdf_projects'te bulunamadıysa, animation_pages'te ara
    let animQuery = supabase
      .from('animation_pages')
      .select('*')
      .eq('id', projectId);
    
    if (userId) {
      animQuery = animQuery.eq('user_id', userId);
    }
    
    const { data: animData, error: animError } = await animQuery.single();

    if (!animError && animData) {
      // Animation page verisini pdf_project formatına dönüştür
      const convertedData = {
        id: animData.id,
        user_id: animData.user_id,
        title: animData.topic,
        description: animData.script_summary,
        pdf_file_url: null,
        pdf_file_name: animData.topic,
        pdf_file_size: null,
        status: 'completed',
        analysis_result: { summary: animData.script_summary },
        qa_pairs: animData.qa_pairs,
        animation_scenario: animData.scenes,
        animation_settings: { type: 'animation' },
        created_at: animData.created_at,
        updated_at: animData.created_at,
        is_deleted: false,
        deleted_at: null
      };
      return { success: true, data: convertedData };
    }

    console.error('Project details fetch error:', error || animError);
    return { success: false, data: null, error: (error || animError)?.message || 'Proje bulunamadı' };
  } catch (error) {
    console.error('Project details fetch exception:', error);
    return { success: false, data: null, error: 'Bilinmeyen hata oluştu' };
  }
};

// Proje silme
export async function deleteProject(projectId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' ? createBrowserClient() : createAdminClient();
    
    // Önce pdf_projects tablosunda dene
    const { data: pdfProj } = await supabase
      .from('pdf_projects')
      .select('id')
      .eq('id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (pdfProj) {
      const { error: delErr } = await supabase
        .from('pdf_projects')
        .update({ is_deleted: true, deleted_at: new Date().toISOString() })
        .eq('id', projectId)
        .eq('user_id', userId);
      if (delErr) return { success: false, error: delErr.message };
      return { success: true };
    }

    // Sonra animation_pages tablosunda dene (user_id null olabileceği için OR şartı)
    const { data: animPage } = await supabase
      .from('animation_pages')
      .select('id')
      .eq('id', projectId)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .maybeSingle();

    if (!animPage) {
      return { success: false, error: 'Proje bulunamadı veya yetkiniz yok' };
    }

    const { error: delAnimErr } = await supabase
      .from('animation_pages')
      .delete()
      .eq('id', projectId);

    if (delAnimErr) {
      console.error('Animation page delete error:', delAnimErr);
      return { success: false, error: delAnimErr.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Project delete exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// Animation pages
export async function getUserAnimationPages(userId: string): Promise<{ success: boolean; data: AnimationPage[]; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' ? createBrowserClient() : createAdminClient();
    const { data, error } = await supabase
      .from('animation_pages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Animation pages fetch error:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Animation pages fetch exception:', error);
    return { success: false, data: [], error: 'Bilinmeyen hata oluştu' };
  }
}

export async function getSiteStatistics(): Promise<{ success: boolean; data: SiteStatistics; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' ? createBrowserClient() : createAdminClient();
    const { data, error } = await supabase
      .from('statistics')
      .select('converted_pdfs, created_animations, total_downloads, storage_used')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Statistics fetch error:', error);
      return { success: false, data: { converted_pdfs: 0, created_animations: 0, total_downloads: 0, storage_used: 0 }, error: error.message };
    }
    if (!data) {
      // tabloda hiç satır yoksa sıfırlar dön
      return { success: true, data: { converted_pdfs: 0, created_animations: 0, total_downloads: 0, storage_used: 0 } };
    }
    return { success: true, data: data as SiteStatistics };
  } catch (e) {
    console.error('Statistics fetch exception:', e);
    return { success: false, data: { converted_pdfs: 0, created_animations: 0, total_downloads: 0, storage_used: 0 }, error: 'Bilinmeyen hata' };
  }
}

// Kullanıcı özel istatistikleri
export async function getUserStats(userId: string): Promise<{ success: boolean; data: UserStats; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' ? createBrowserClient() : createAdminClient();
    
    // Kullanıcı profil bilgisini al - plan bilgisi ile birlikte
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        created_at, 
        current_plan_id, 
        subscription_status,
        subscription_plans(name, display_name_tr, display_name_en)
      `)
      .eq('id', userId)
      .single();

    // PDF projelerini say (toplam)
    const { count: pdfCount } = await supabase
      .from('pdf_projects')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_deleted', false);

    // Bu ayki PDF kullanımını hesapla - önce user_usage tablosundan, sonra fallback
    const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM
    let monthlyPdfCount = 0;
    let monthlyAnimationCount = 0;

    const { data: usageRow, error: usageErr } = await supabase
      .from('user_usage')
      .select('pdfs_processed, animations_created')
      .eq('user_id', userId)
      .eq('month_year', monthYear)
      .maybeSingle();

    if (!usageErr && usageRow) {
      monthlyPdfCount = usageRow.pdfs_processed || 0;
      monthlyAnimationCount = usageRow.animations_created || 0;
    } else {
      // Fallback: Gerçek tablolardan say
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      
      const { count: pdfFallbackCount } = await supabase
        .from('pdf_projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_deleted', false)
        .gte('created_at', firstDayOfMonth.toISOString());

      const { count: animFallbackCount } = await supabase
        .from('animation_pages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', firstDayOfMonth.toISOString());

      monthlyPdfCount = pdfFallbackCount || 0;
      monthlyAnimationCount = animFallbackCount || 0;
    }

    // Animasyon sayfalarını say
    const { count: animationCount } = await supabase
      .from('animation_pages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Kullanıcı başarımlarını al (iki aşamalı, REST join hatalarını önlemek için)
    const { data: userAchRows } = await supabase
      .from('user_achievements')
      .select('id, unlocked_at, achievement_id')
      .eq('user_id', userId);

    let achievements: any[] | null = null;
    if (userAchRows && userAchRows.length) {
      const achIds = userAchRows.map((a: any) => a.achievement_id);
      const { data: achDetails } = await supabase
        .from('achievements')
        .select('id, title, description, icon')
        .in('id', achIds);

      achievements = userAchRows.map((ua: any) => ({
        id: ua.id,
        unlocked_at: ua.unlocked_at,
        ...(achDetails?.find((ad: any) => ad.id === ua.achievement_id) || {})
      }));
    }

    // Storage kullanımını hesapla (PDF dosya boyutları toplamı)
    const { data: storageData } = await supabase
      .from('pdf_projects')
      .select('pdf_file_size')
      .eq('user_id', userId)
      .eq('is_deleted', false);

    const storageUsed = storageData?.reduce((total, project) => {
      return total + (project.pdf_file_size || 0);
    }, 0) || 0;

    // Downloads toplamı (şimdilik 0, ileride tracking eklenebilir)
    const totalDownloads = 0;

    // Plan adını belirle - önce join edilen data'dan, yoksa fallback
    let planDisplayName = 'Free';
    let monthlyLimit = 5; // Varsayılan Free limiti

    if (profile?.subscription_plans) {
      // Plan bilgisi join edilebildi
      const planData = profile.subscription_plans as any;
      planDisplayName = planData.display_name_tr || planData.display_name_en || planData.name || 'Free';
      
      // Plan limitini de al
      try {
        const { data: planRow } = await supabase
          .from('subscription_plans')
          .select('monthly_pdf_limit')
          .eq('id', profile.current_plan_id)
          .single();

        if (planRow && typeof planRow.monthly_pdf_limit === 'number') {
          monthlyLimit = planRow.monthly_pdf_limit;
        }
      } catch (e) {
        console.warn('Plan limit fetch failed, varsayılan limit kullanılacak', e);
      }
    } else {
      // Fallback: subscription_status'dan plan adını al ve limit bul
      const plan = profile?.subscription_status || 'free';
      
      try {
        const { data: planRow } = await supabase
          .from('subscription_plans')
          .select('monthly_pdf_limit, display_name_tr, display_name_en, name')
          .eq('name', plan.toLowerCase())
          .single();

        if (planRow) {
          planDisplayName = planRow.display_name_tr || planRow.display_name_en || planRow.name || 'Free';
          if (typeof planRow.monthly_pdf_limit === 'number') {
            monthlyLimit = planRow.monthly_pdf_limit;
          }
        }
      } catch (e) {
        console.warn('Plan fetch failed, varsayılan değerler kullanılacak', e);
      }
    }

    const userStats: UserStats = {
      converted_pdfs: pdfCount || 0,
      created_animations: animationCount || 0,
      total_downloads: totalDownloads,
      storage_used: Math.round(storageUsed / (1024 * 1024 * 1024) * 100) / 100, // GB cinsinden
      plan: planDisplayName,
      joinDate: profile?.created_at || new Date().toISOString(),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      monthly_pdf_count: monthlyPdfCount + monthlyAnimationCount, // Birleştirilmiş kredi sistemi
      monthly_limit: monthlyLimit,
      achievements: achievements?.map(a => {
        return {
          id: a.id,
          title: a.title || 'Başarım',
          description: a.description || 'Açıklama yok',
          icon: a.icon || '🏆',
          unlocked_at: a.unlocked_at
        };
      }) || []
    };

    return { success: true, data: userStats };
  } catch (error) {
    console.error('User stats fetch exception:', error);
    return { 
      success: false, 
      data: {
        converted_pdfs: 0,
        created_animations: 0,
        total_downloads: 0,
        storage_used: 0,
        plan: 'Free',
        joinDate: new Date().toISOString(),
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        monthly_pdf_count: 0,
        monthly_limit: 5,
        achievements: []
      },
      error: 'Bilinmeyen hata' 
    };
  }
}

// Subscription Plan Functions
export async function getAllSubscriptionPlans(): Promise<{ success: boolean; data: SubscriptionPlan[]; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' 
      ? createBrowserClient() 
      : createAdminClient();
    
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Subscription plans fetch error:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Subscription plans fetch exception:', error);
    return { success: false, data: [], error: 'Bilinmeyen hata oluştu' };
  }
}

export async function getUserSubscription(userId: string): Promise<{ success: boolean; data: (UserSubscription & { plan: SubscriptionPlan }) | null; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' 
      ? createBrowserClient() 
      : createAdminClient();
    
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('User subscription fetch error:', error);
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data || null };
  } catch (error) {
    console.error('User subscription fetch exception:', error);
    return { success: false, data: null, error: 'Bilinmeyen hata oluştu' };
  }
}

export async function getUserCurrentUsage(userId: string): Promise<{ success: boolean; data: UserUsage | null; error?: string }> {
  try {
    const supabase = typeof window !== 'undefined' 
      ? createBrowserClient() 
      : createAdminClient();
    
    const currentMonth = new Date().toISOString().slice(0, 7); // '2025-01' format
    
    const { data, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('User usage fetch error:', error);
      return { success: false, data: null, error: error.message };
    }

    // Eğer user_usage tablosunda kayıt yoksa, profiles tablosundan ve gerçek tablolardan hesapla
    if (!data) {
      // Önce profiles tablosundaki usage_reset_at tarihini kontrol et
      const { data: profile } = await supabase
        .from('profiles')
        .select('monthly_usage_count, usage_reset_at')
        .eq('id', userId)
        .single();

      let pdfCount = 0;
      let animationCount = 0;

      if (profile && profile.usage_reset_at) {
        const resetDate = new Date(profile.usage_reset_at);
        const now = new Date();
        
        // Eğer reset tarihi bu ayın başındaysa, profiles tablosundaki sayıyı kullan
        if (resetDate.getMonth() === now.getMonth() && resetDate.getFullYear() === now.getFullYear()) {
          // Profiles tablosundaki monthly_usage_count'u kullan
          const totalUsage = profile.monthly_usage_count || 0;
          
          // Bu toplam kullanımı PDF ve animasyon olarak böl (gerçek verilerden hesapla)
          const { count: realPdfCount } = await supabase
            .from('pdf_projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_deleted', false)
            .gte('created_at', resetDate.toISOString());

          const { count: realAnimationCount } = await supabase
            .from('animation_pages')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', resetDate.toISOString());

          pdfCount = realPdfCount || 0;
          animationCount = realAnimationCount || 0;
        } else {
          // Reset tarihi eski, bu ayki verileri say
          const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          
          const { count: monthlyPdfCount } = await supabase
            .from('pdf_projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('is_deleted', false)
            .gte('created_at', firstDayOfMonth.toISOString());

          const { count: monthlyAnimationCount } = await supabase
            .from('animation_pages')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', firstDayOfMonth.toISOString());

          pdfCount = monthlyPdfCount || 0;
          animationCount = monthlyAnimationCount || 0;
        }
      } else {
        // Profiles tablosunda veri yok, bu ayki verileri say
        const firstDayOfMonth = new Date().getMonth() === new Date().getMonth() 
          ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          : new Date();

        const { count: monthlyPdfCount } = await supabase
          .from('pdf_projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_deleted', false)
          .gte('created_at', firstDayOfMonth.toISOString());

        const { count: monthlyAnimationCount } = await supabase
          .from('animation_pages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', firstDayOfMonth.toISOString());

        pdfCount = monthlyPdfCount || 0;
        animationCount = monthlyAnimationCount || 0;
      }

      // Fallback UserUsage objesi oluştur
      const fallbackUsage: UserUsage = {
        id: `fallback-${userId}-${currentMonth}`,
        user_id: userId,
        month_year: currentMonth,
        pdfs_processed: pdfCount,
        animations_created: animationCount,
        storage_used_mb: 0,
        last_reset_at: profile?.usage_reset_at || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return { success: true, data: fallbackUsage };
    }

    return { success: true, data: data };
  } catch (error) {
    console.error('User usage fetch exception:', error);
    return { success: false, data: null, error: 'Bilinmeyen hata oluştu' };
  }
}

export async function checkUserPDFLimit(userId: string): Promise<{ success: boolean; canProcess: boolean; currentUsage: number; limit: number; error?: string }> {
  try {
    // Get user's current plan
    const userSubscription = await getUserSubscription(userId);
    if (!userSubscription.success) {
      return { success: false, canProcess: false, currentUsage: 0, limit: 0, error: userSubscription.error };
    }

    // If no subscription, get free plan
    let plan: SubscriptionPlan;
    if (!userSubscription.data) {
      const plans = await getAllSubscriptionPlans();
      if (!plans.success) {
        return { success: false, canProcess: false, currentUsage: 0, limit: 0, error: plans.error };
      }
      const freePlan = plans.data.find(p => p.name === 'free');
      if (!freePlan) {
        return { success: false, canProcess: false, currentUsage: 0, limit: 0, error: 'Free plan bulunamadı' };
      }
      plan = freePlan;
    } else {
      plan = userSubscription.data.plan;
    }

    // Get current usage
    const usage = await getUserCurrentUsage(userId);
    if (!usage.success) {
      return { success: false, canProcess: false, currentUsage: 0, limit: 0, error: usage.error };
    }

    const limitValue = (typeof plan.monthly_pdf_limit === 'number' && plan.monthly_pdf_limit > 0) ? plan.monthly_pdf_limit : 5;
    // Birleştirilmiş kredi sistemi: PDF + Animasyon
    const pdfUsage = usage.data?.pdfs_processed || 0;
    const animationUsage = usage.data?.animations_created || 0;
    const currentUsage = pdfUsage + animationUsage;
    const canProcess = currentUsage < limitValue;

    return {
      success: true,
      canProcess,
      currentUsage,
      limit: limitValue
    };
  } catch (error) {
    console.error('PDF limit check exception:', error);
    return { success: false, canProcess: false, currentUsage: 0, limit: 0, error: 'Bilinmeyen hata oluştu' };
  }
}

export async function incrementUserUsage(userId: string, type: 'pdf' | 'animation'): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

    // 1) Mevcut kayıt var mı kontrol et
    const { data: existing, error: fetchError } = await supabase
      .from('user_usage')
      .select('id, pdfs_processed, animations_created')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .maybeSingle();

    if (fetchError) {
      console.error('Usage fetch error:', fetchError);
      return { success: false, error: fetchError.message };
    }

    // 2) Pdf/animasyon sayaçlarını hesapla
    const newPdfCount = (existing?.pdfs_processed || 0) + (type === 'pdf' ? 1 : 0);
    const newAnimationCount = (existing?.animations_created || 0) + (type === 'animation' ? 1 : 0);

    // 3) Güncelle veya ekle
    let upsertError;
    if (existing && existing.id) {
      const { error } = await supabase
        .from('user_usage')
        .update({ pdfs_processed: newPdfCount, animations_created: newAnimationCount })
        .eq('id', existing.id);
      upsertError = error;
    } else {
      const { error } = await supabase
        .from('user_usage')
        .insert({
          user_id: userId,
          month_year: currentMonth,
          pdfs_processed: newPdfCount,
          animations_created: newAnimationCount,
          storage_used_mb: 0, // varsayılan
          last_reset_at: new Date().toISOString()
        });
      upsertError = error;
    }

    if (upsertError) {
      console.error('Usage upsert error:', upsertError);
      return { success: false, error: upsertError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Usage increment exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

export async function createUserSubscription(
  userId: string, 
  planId: string, 
  billingCycle: 'monthly' | 'annual' = 'monthly'
): Promise<{ success: boolean; data?: UserSubscription; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Calculate period end date
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date();
    if (billingCycle === 'monthly') {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        billing_cycle: billingCycle,
        current_period_start: currentPeriodStart.toISOString(),
        current_period_end: currentPeriodEnd.toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Subscription creation error:', error);
      return { success: false, error: error.message };
    }

    // Update profile with current plan
    await supabase
      .from('profiles')
      .update({
        current_plan_id: planId,
        subscription_status: 'active'
      })
      .eq('id', userId);

    return { success: true, data };
  } catch (error) {
    console.error('Subscription creation exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// ===============================
// ADMIN FUNCTIONS
// ===============================

export interface AdminUserInfo {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: string;
  current_plan_id: string | null;
  plan_name?: string;
  monthly_usage_count: number;
  is_blocked?: boolean;
  created_at: string;
  pdf_count: number;
  animation_count: number;
}

export interface AdminProjectInfo {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  description: string | null;
  pdf_file_name: string;
  pdf_file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  project_type: 'pdf' | 'animation';
}

// Admin: Tüm kullanıcıları listele
export async function getAllUsersForAdmin(): Promise<{ success: boolean; data: AdminUserInfo[]; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        subscription_status,
        current_plan_id,
        monthly_usage_count,
        is_blocked,
        created_at,
        subscription_plans(name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin users fetch error:', error);
      return { success: false, data: [], error: error.message };
    }

    // Her kullanıcı için PDF ve animasyon sayılarını al
    const usersWithCounts = await Promise.all(
      data.map(async (user) => {
        // PDF proje sayısı
        const { count: pdfCount } = await supabase
          .from('pdf_projects')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_deleted', false);

        // Animasyon sayısı
        const { count: animationCount } = await supabase
          .from('animation_pages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        return {
          ...user,
          // @ts-ignore
          plan_name: (user as any).subscription_plans?.name || 'free',
          pdf_count: pdfCount || 0,
          animation_count: animationCount || 0
        } as AdminUserInfo;
      })
    );

    return { success: true, data: usersWithCounts };
  } catch (error) {
    console.error('Admin users fetch exception:', error);
    return { success: false, data: [], error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Tüm projeleri listele
export async function getAllProjectsForAdmin(): Promise<{ success: boolean; data: AdminProjectInfo[]; error?: string }> {
  try {
    const supabase = createAdminClient();

    // fetch profiles once
    const { data: profileData } = await supabase.from('profiles').select('id,email');
    const emailMap: Record<string, string> = {};
    (profileData || []).forEach((p: any) => {
      emailMap[p.id] = p.email;
    });

    // PDF projects
    const { data: pdfs, error: pdfErr } = await supabase
      .from('pdf_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (pdfErr) {
      console.error('Admin pdf projects fetch error:', pdfErr);
      return { success: false, data: [], error: pdfErr.message };
    }

    const pdfMapped: AdminProjectInfo[] = (pdfs || []).map((p: any) => ({
      id: p.id,
      user_id: p.user_id,
      user_email: emailMap[p.user_id] || 'Unknown',
      title: p.title,
      description: null,
      pdf_file_name: p.pdf_file_name,
      pdf_file_size: null,
      status: p.status,
      created_at: p.created_at,
      updated_at: p.updated_at,
      is_deleted: p.is_deleted,
      project_type: 'pdf'
    }));

    // Animation pages
    const { data: anims, error: animErr } = await supabase
      .from('animation_pages')
      .select('id,user_id,topic,created_at')
      .order('created_at', { ascending: false });

    if (animErr) {
      console.error('Admin animation pages fetch error:', animErr);
      return { success: false, data: [], error: animErr.message };
    }

    const animMapped: AdminProjectInfo[] = (anims || []).map((a: any) => ({
      id: a.id,
      user_id: a.user_id,
      user_email: emailMap[a.user_id] || 'Unknown',
      title: a.topic,
      description: null,
      pdf_file_name: '',
      pdf_file_size: null,
      status: 'completed',
      created_at: a.created_at,
      updated_at: a.created_at,
      is_deleted: false,
      project_type: 'animation'
    }));

    const combined = [...pdfMapped, ...animMapped];
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return { success: true, data: combined };
  } catch (error) {
    console.error('Admin projects fetch exception:', error);
    return { success: false, data: [], error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Kullanıcı sil
export async function deleteUserAsAdmin(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Önce kullanıcının tüm projelerini soft delete yap
    await supabase
      .from('pdf_projects')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('user_id', userId);

    // Kullanıcı usage'ını temizle
    await supabase
      .from('user_usage')
      .delete()
      .eq('user_id', userId);

    // Kullanıcı subscription'ını temizle
    await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', userId);

    // Profili sil
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Admin user delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin user delete exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Proje sil
export async function deleteProjectAsAdmin(projectId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    const { error } = await supabase
      .from('pdf_projects')
      .update({ 
        is_deleted: true, 
        deleted_at: new Date().toISOString() 
      })
      .eq('id', projectId);

    if (error) {
      console.error('Admin project delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin project delete exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Kullanıcıya kredi ekle
export async function addCreditsToUser(userId: string, credits: number): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Kullanıcının mevcut kullanımını al
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usage } = await supabase
      .from('user_usage')
      .select('pdfs_processed, animations_created')
      .eq('user_id', userId)
      .eq('month_year', currentMonth)
      .single();

    const currentPdfUsage = usage?.pdfs_processed || 0;
    const currentAnimationUsage = usage?.animations_created || 0;

    // Mevcut kullanımdan kredi kadar düşür (ama negatif olmasın)
    const newPdfUsage = Math.max(0, currentPdfUsage - credits);
    const newAnimationUsage = Math.max(0, currentAnimationUsage - credits);

    // Usage'ı güncelle
    const { error } = await supabase
      .from('user_usage')
      .upsert({
        user_id: userId,
        month_year: currentMonth,
        pdfs_processed: newPdfUsage,
        animations_created: newAnimationUsage,
        last_reset_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,month_year'
      });

    if (error) {
      console.error('Admin credit add error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin credit add exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Kullanıcı planını değiştir
export async function changeUserPlan(userId: string, planName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Plan ID'yi al
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('id')
      .eq('name', planName)
      .single();

    if (planError || !plan) {
      return { success: false, error: 'Plan bulunamadı' };
    }

    // Kullanıcı profilini güncelle
    const { error } = await supabase
      .from('profiles')
      .update({
        current_plan_id: plan.id,
        subscription_status: planName === 'free' ? 'free' : 'active'
      })
      .eq('id', userId);

    if (error) {
      console.error('Admin plan change error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin plan change exception:', error);
    return { success: false, error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Sistem istatistikleri
export async function getAdminStats(): Promise<{ success: boolean; data: any; error?: string }> {
  try {
    const supabase = createAdminClient();
    
    // Toplam kullanıcı sayısı
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Toplam proje sayısı
    const { count: totalProjects } = await supabase
      .from('pdf_projects')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false);

    // Toplam animasyon sayısı
    const { count: totalAnimations } = await supabase
      .from('animation_pages')
      .select('*', { count: 'exact', head: true });

    // Bu ay kayıt olan kullanıcılar
    const thisMonth = new Date().toISOString().slice(0, 7);
    const { count: newUsersThisMonth } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${thisMonth}-01`);

    // Plan dağılımı
    const { data: planDistribution } = await supabase
      .from('profiles')
      .select(`
        subscription_plans(name),
        count()
      `)
      .not('current_plan_id', 'is', null);

    return {
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        totalAnimations: totalAnimations || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        planDistribution: planDistribution || []
      }
    };
  } catch (error) {
    console.error('Admin stats exception:', error);
    return { success: false, data: {}, error: 'Bilinmeyen hata oluştu' };
  }
}

// Admin: Kullanıcı blokla / aç
export async function setUserBlocked(userId: string, blocked: boolean): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: blocked })
      .eq('id', userId);
    if (error) return { success:false, error: error.message };
    return { success:true };
  } catch(err:any) { return { success:false, error:'Bilinmeyen hata'}; }
}

export interface SupportTicket {
  id: string;
  user_id: string | null;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  created_at: string;
}

// Admin: Get tickets
export async function getAllSupportTickets(status?: 'open' | 'closed'): Promise<{ success: boolean; data: SupportTicket[]; error?: string }> {
  try {
    const supabase = createAdminClient();
    let query = supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) return { success:false, data:[], error:error.message };
    return { success:true, data: data as SupportTicket[] };
  } catch (err:any) {
    return { success:false, data:[], error:'Bilinmeyen hata' };
  }
}

// Admin: update ticket status
export async function updateSupportTicketStatus(ticketId: string, status: 'open' | 'closed'): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('support_tickets').update({ status }).eq('id', ticketId);
    if (error) return { success:false, error:error.message };
    return { success:true };
  } catch (err:any) {
    return { success:false, error:'Bilinmeyen hata' };
  }
}

// Kullanıcı talebi oluştur
export async function createSupportTicket(data: { user_id?: string | null; email: string; subject: string; message: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('support_tickets').insert({
      user_id: data.user_id || null,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'open'
    });
    if (error) return { success:false, error:error.message };
    return { success:true };
  } catch(err:any) {
    return { success:false, error:'Bilinmeyen hata' };
  }
}

// Chat History Interface
export interface ChatMessage {
  id: string;
  project_id: string | null;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Sohbet mesajını kaydet
export async function saveChatMessage(
  projectId: string | undefined,
  role: 'user' | 'assistant',
  content: string
): Promise<boolean> {
  try {
    const supabase = createBrowserClient();
    
    // Get current user ID for security
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Save chat message auth error:', authError.message || authError);
      return true; // Return true to not break the chat flow
    }
    
    if (!user) {
      console.error('Save chat message error: No authenticated user');
      return true; // Return true to not break the chat flow
    }
    
    // If projectId is provided, verify that the project belongs to the current user
    if (projectId) {
      let { data: projects, error: projectError } = await supabase
        .from('pdf_projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id);
      
      if (!projects || projects.length === 0) {
        ({ data: projects, error: projectError } = await supabase
          .from('animation_pages')
          .select('id')
          .eq('id', projectId)
          .eq('user_id', user.id));
      }
      
      if (projectError || !projects || projects.length === 0) {
        console.warn('Save chat message: Project not found or access denied, saving without project_id');
        projectId = undefined; // Reset projectId if project not found
      }
    }
    
    console.log('Saving chat message for project:', projectId || 'none', 'user:', user.id, 'role:', role);
    
    const { error } = await supabase
      .from('chat_history')
      .insert({
        project_id: projectId || null,
        user_id: user.id,
        role,
        content,
        created_at: new Date().toISOString()
      });
    
    if (error) {
      console.error('Save chat message error:', error.message || error);
      return true; // Return true to not break the chat flow even if save fails
    }
    
    console.log('Chat message saved successfully');
    return true;
  } catch (err: any) {
    console.error('Save chat message exception:', err.message || err);
    return true; // Return true to not break the chat flow
  }
}

// Proje sohbet geçmişini getir
export async function getChatHistory(projectId: string | undefined): Promise<ChatMessage[]> {
  try {
    // If projectId is undefined or null, return empty array
    if (!projectId) {
      console.log('Get chat history: No projectId provided, returning empty array');
      return [];
    }

    const supabase = createBrowserClient();
    
    // Get current user ID for security
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Chat history auth error:', authError.message || authError);
      return [];
    }
    
    if (!user) {
      console.error('Chat history fetch error: No authenticated user');
      return [];
    }
    
    console.log('Fetching chat history for project:', projectId, 'user:', user.id);
    
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Chat history fetch error:', error.message || error);
      return [];
    }
    
    console.log('Chat history data:', data);
     
     // Convert to the format expected by PdfChat component
     return (data || []).map(msg => ({
       role: msg.role as 'user' | 'assistant',
       content: msg.content,
       // Include required ChatMessage fields
       id: msg.id,
       project_id: msg.project_id,
       user_id: msg.user_id,
       created_at: msg.created_at
     }));
  } catch (err: any) {
    console.error('Chat history exception:', err.message || err);
    return [];
  }
}

// Sohbet geçmişini temizle
// ... existing code ...
export async function clearChatHistory(projectId: string | undefined): Promise<{ success: boolean; error?: string }> {
  try {
    // If projectId is undefined or null, return success without doing anything
    if (!projectId) {
      console.log('Clear chat history: No projectId provided, skipping database operation');
      return { success: true };
    }
    
    const supabase = typeof window !== 'undefined' ? createBrowserClient() : createAdminClient();
    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('project_id', projectId);
    
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: 'Bilinmeyen hata' };
  }
}
