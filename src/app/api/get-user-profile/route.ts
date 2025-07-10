import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID gereklidir' }, { status: 400 });
    }

    const result = await getUserProfile(userId);
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Profil bilgisi alınamadı',
        details: result.error 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      profile: result.data,
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error('Get user profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 