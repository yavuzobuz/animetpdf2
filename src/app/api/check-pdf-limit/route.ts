import { NextResponse } from 'next/server';
import { checkUserPDFLimit, getUserSubscription, getAllSubscriptionPlans, getUserCurrentUsage } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { userId, type } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID gereklidir' }, { status: 400 });
    }

    if (!type || !['pdf', 'animation'].includes(type)) {
      return NextResponse.json({ error: 'Geçerli tip gereklidir (pdf veya animation)' }, { status: 400 });
    }

    // Get user's current plan
    const userSubscription = await getUserSubscription(userId);
    if (!userSubscription.success) {
      return NextResponse.json({ 
        error: 'Plan bilgisi alınamadı',
        details: userSubscription.error 
      }, { status: 500 });
    }

    // If no subscription, get free plan
    let plan;
    if (!userSubscription.data) {
      const plans = await getAllSubscriptionPlans();
      if (!plans.success) {
        return NextResponse.json({ 
          error: 'Plan bilgileri alınamadı',
          details: plans.error 
        }, { status: 500 });
      }
      const freePlan = plans.data.find(p => p.name === 'free');
      if (!freePlan) {
        return NextResponse.json({ error: 'Free plan bulunamadı' }, { status: 500 });
      }
      plan = freePlan;
    } else {
      plan = userSubscription.data.plan;
    }

    // Get current usage
    const usage = await getUserCurrentUsage(userId);
    if (!usage.success) {
      return NextResponse.json({ 
        error: 'Kullanım bilgisi alınamadı',
        details: usage.error 
      }, { status: 500 });
    }

    const currentPdfUsage = usage.data?.pdfs_processed || 0;
    const currentAnimationUsage = usage.data?.animations_created || 0;
    
    // Birleştirilmiş kredi havuzu (PDF + Animasyon)
    const limit = (typeof plan.monthly_pdf_limit === 'number' && plan.monthly_pdf_limit > 0)
      ? plan.monthly_pdf_limit
      : 5;

    const currentUsage = currentPdfUsage + currentAnimationUsage;
    const canProcess = currentUsage < limit;
    const limitType = 'Kredi';

    return NextResponse.json({
      canProcess,
      currentUsage,
      limit,
      limitType,
      planName: plan.name,
      limitInfo: !canProcess ? {
        message: `Bu ay ${currentUsage}/${limit} ${limitType.toLowerCase()} işlediniz. Limitinizi aştınız, lütfen planınızı yükseltin.`
      } : undefined
    }, { status: 200 });

  } catch (error) {
    console.error('Limit check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 