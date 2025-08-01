import { NextRequest, NextResponse } from 'next/server';
import { getUserCurrentUsage } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await getUserCurrentUsage(userId);
    
    // Eğer sonuç başarısızsa, fallback değerler döndür
    if (!result.success) {
      console.warn('getUserCurrentUsage failed, returning fallback:', result.error);
      const fallbackUsage = {
        id: `fallback-${userId}-${new Date().toISOString().slice(0, 7)}`,
        user_id: userId,
        month_year: new Date().toISOString().slice(0, 7),
        pdfs_processed: 0,
        animations_created: 0,
        storage_used_mb: 0,
        last_reset_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json({
        success: true,
        data: fallbackUsage
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get user usage API error:', error);
    
    // Hata durumunda da fallback döndür
    const { userId } = await request.json().catch(() => ({ userId: 'unknown' }));
    const fallbackUsage = {
      id: `fallback-${userId}-${new Date().toISOString().slice(0, 7)}`,
      user_id: userId,
      month_year: new Date().toISOString().slice(0, 7),
      pdfs_processed: 0,
      animations_created: 0,
      storage_used_mb: 0,
      last_reset_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: fallbackUsage
    });
  }
}