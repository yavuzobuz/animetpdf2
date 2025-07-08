import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { ticketId, reply, userEmail, subject } = await request.json();

    if (!ticketId || !reply || !userEmail || !subject) {
      return NextResponse.json(
        { error: 'Eksik parametreler' },
        { status: 400 }
      );
    }

    const supabase = createRouteClient();

    // Admin yetkisi kontrolü
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email || !user.email.endsWith('@admin.com')) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    // Ticket'i veritabanında güncelle (replied olarak işaretle)
    const { error: updateError } = await supabase
      .from('support_tickets')
      .update({ 
        status: 'replied',
        admin_reply: reply,
        replied_at: new Date().toISOString()
      })
      .eq('id', ticketId);

    if (updateError) {
      console.error('Ticket güncelleme hatası:', updateError);
      return NextResponse.json(
        { error: 'Ticket güncellenemedi' },
        { status: 500 }
      );
    }

    // Email gönder
    try {
      await sendEmail({
        to: userEmail,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">Destek Talebinize Yanıt</h2>
            <p>Merhaba,</p>
            <p>Destek talebinize yanıtımız:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${reply.replace(/\n/g, '<br>')}
            </div>
            <p>İyi günler dileriz,<br>
            <strong>AnimePDF Destek Ekibi</strong></p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #666;">
              Bu bir otomatik mesajdır. Lütfen bu mesaja yanıt vermeyin.
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError);
      // Email hatası olsa bile işlemi başarılı sayıyoruz
    }

    return NextResponse.json({ 
      message: 'Yanıt başarıyla gönderildi',
      success: true 
    });

  } catch (error) {
    console.error('Ticket reply hatası:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
} 