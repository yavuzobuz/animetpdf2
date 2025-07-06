import { NextResponse } from 'next/server';
import { getAdminStats } from '@/lib/database';
import { cookies } from 'next/headers';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = (cookieStore as any).get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function GET() {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const result = await getAdminStats();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Admin stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 