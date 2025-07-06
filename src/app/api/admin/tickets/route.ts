import { NextResponse } from 'next/server';
import { getAllSupportTickets, updateSupportTicketStatus } from '@/lib/database';
import { cookies } from 'next/headers';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = (cookieStore as any).get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function GET(request: Request) {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'open' | 'closed' | null;

    const result = await getAllSupportTickets(status || undefined);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Admin tickets API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const { action, ticketId } = await request.json();
    if (action === 'close') {
      const res = await updateSupportTicketStatus(ticketId, 'closed');
      if (!res.success) return NextResponse.json({ error: res.error }, { status: 500 });
      return NextResponse.json({ success: true, message: 'Talep kapatıldı' });
    }
    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Admin tickets action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 