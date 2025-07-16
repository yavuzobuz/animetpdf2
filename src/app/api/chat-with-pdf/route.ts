import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { message, summary, projectTitle } = await request.json();

    if (!message || !summary) {
      return NextResponse.json(
        { error: 'Mesaj ve özet gerekli' },
        { status: 400 }
      );
    }

    // Supabase client oluştur
    const supabase = createRouteHandlerClient({ cookies });
    
    // Kullanıcı doğrulama
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Kimlik doğrulama hatası' },
        { status: 401 }
      );
    }

    // Gerçek AI entegrasyonu ile yanıt oluşturma
    const { chatWithPdf } = await import('@/ai/flows/chat-with-pdf-flow');
    const result = await chatWithPdf({
      pdfSummary: summary,
      userQuery: message
    });
    const response = result.botResponse;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}