import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { addSupportTicketReply, getSupportTicketDetails } from '@/lib/database-support';
import { sendSupportReply } from '@/lib/email';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = (cookieStore as any).get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function POST(request: Request) {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const { ticketId, subject, message, adminId } = await request.json();
    
    if (!ticketId || !message) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 });
    }

    // Destek talebi detaylarını al
    const ticketResult = await getSupportTicketDetails(ticketId);
    if (!ticketResult.success || !ticketResult.data) {
      return NextResponse.json({ error: ticketResult.error || 'Talep bulunamadı' }, { status: 404 });
    }

    const ticket = ticketResult.data.ticket;

    // Yanıtı veritabanına ekle
    const replyResult = await addSupportTicketReply({
      ticketId,
      reply: message,
      adminId: adminId || 'system'
    });

    if (!replyResult.success) {
      return NextResponse.json({ error: replyResult.error }, { status: 500 });
    }

    // E-posta gönder
    const emailResult = await sendSupportReply({
      to: ticket.email,
      subject: subject || 'Destek Talebinize Yanıt',
      message,
      ticketSubject: ticket.subject
    });

    if (!emailResult.success) {
      return NextResponse.json({ 
        warning: 'Yanıt kaydedildi ancak e-posta gönderilemedi',
        error: emailResult.error 
      }, { status: 207 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Yanıt gönderildi' 
    });
  } catch (error) {
    console.error('Admin tickets reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}