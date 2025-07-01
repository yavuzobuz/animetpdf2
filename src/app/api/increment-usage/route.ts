import { NextResponse } from 'next/server';
import { incrementUserUsage } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { userId, type } = await request.json();

    if (!userId || !type || !['pdf', 'animation'].includes(type)) {
      return NextResponse.json({ error: 'Geçersiz parametreler' }, { status: 400 });
    }

    const result = await incrementUserUsage(userId, type);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Kullanım artışı başarısız' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('increment-usage API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 