import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    
    // Test login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        errorCode: error.status,
        details: error
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        emailConfirmed: data.user?.email_confirmed_at
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test login başarısız', details: error },
      { status: 500 }
    );
  }
}