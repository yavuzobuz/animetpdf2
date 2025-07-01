import { NextResponse } from 'next/server';
import { checkUserPDFLimit } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID gereklidir' }, { status: 400 });
    }

    const limitCheck = await checkUserPDFLimit(userId);

    if (!limitCheck.success) {
      return NextResponse.json({ 
        error: 'Limit kontrolü yapılamadı',
        details: limitCheck.error 
      }, { status: 500 });
    }

    return NextResponse.json({
      canProcess: limitCheck.canProcess,
      currentUsage: limitCheck.currentUsage,
      limit: limitCheck.limit,
      limitInfo: !limitCheck.canProcess ? {
        message: `Bu ay ${limitCheck.currentUsage}/${limitCheck.limit} PDF işlediniz. Limitinizi aştınız, lütfen planınızı yükseltin.`
      } : undefined
    }, { status: 200 });

  } catch (error) {
    console.error('PDF limit check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 