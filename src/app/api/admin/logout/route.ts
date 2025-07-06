import { NextResponse } from 'next/server';

export async function POST() {
  // Clear admin-session cookie
  const response = NextResponse.json({ success: true, message: 'Çıkış yapıldı' });
  response.cookies.set({
    name: 'admin-session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0)
  });
  return response;
} 