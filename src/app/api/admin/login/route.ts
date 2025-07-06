import { NextResponse } from 'next/server';
import { validateAdminLogin } from '@/lib/admin-auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ve şifre gereklidir' }, { status: 400 });
    }

    const isValid = validateAdminLogin(email, password);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Geçersiz admin kimlik bilgileri' }, { status: 401 });
    }

    // Admin session cookie'si set et
    const response = NextResponse.json({ success: true, message: 'Admin giriş başarılı' });
    response.cookies.set({
      name: 'admin-session',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 gün
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 