import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/tr/profil';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
        // Session başarılı - profil sayfasına yönlendir
        return NextResponse.redirect(`${requestUrl.origin}${next}`);
    }
      
      console.error('Auth callback error:', error.message);
    } catch (err) {
      console.error('Auth callback exception:', err);
    }
  }

  // Hata durumunda login sayfasına geri dön
  return NextResponse.redirect(`${requestUrl.origin}/tr/login?error=auth_error`);
}
