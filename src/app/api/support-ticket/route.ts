import { NextResponse } from 'next/server';
import { createSupportTicket } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const { email, subject, message } = await request.json();
    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'Email, konu ve mesaj gerekli' }, { status: 400 });
    }

    const res = await createSupportTicket({ email, subject, message });
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Talebiniz alındı' });
  } catch (err) {
    console.error('Support ticket error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 