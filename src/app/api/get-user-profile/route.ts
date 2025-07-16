import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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
    console.error('Get user profile API error (GET):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check if request has body
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type application/json gereklidir' }, { status: 400 });
    }

    // Get request body text first
    const bodyText = await request.text();
    if (!bodyText || bodyText.trim() === '') {
      return NextResponse.json({ error: 'Request body boş olamaz' }, { status: 400 });
    }

    // Parse JSON safely
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ error: 'Geçersiz JSON formatı' }, { status: 400 });
    }

    const { userId } = body;

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