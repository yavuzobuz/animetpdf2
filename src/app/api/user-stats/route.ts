import { NextRequest, NextResponse } from 'next/server';
import { getUserStats } from '@/lib/database';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'unauthenticated' }, { status: 401 });
  }
  const result = await getUserStats(user.id);
  return NextResponse.json(result);
} 