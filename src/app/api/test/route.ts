import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Bağlantıyı test et
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { error: 'Database bağlantı hatası', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase bağlantısı başarılı!',
      profileCount: count || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Beklenmedik hata', details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email gerekli' },
        { status: 400 }
      );
    }

    // Test verisi oluştur
    const supabase = createServerClient();
    
    return NextResponse.json({
      success: true,
      message: 'Test API çalışıyor',
      receivedData: { email, name },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'POST işlemi başarısız', details: error },
      { status: 500 }
    );
  }
}