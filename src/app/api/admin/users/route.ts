import { NextResponse } from 'next/server';
import { getAllUsersForAdmin, deleteUserAsAdmin, addCreditsToUser, changeUserPlan, setUserBlocked } from '@/lib/database';
import { cookies } from 'next/headers';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = (cookieStore as any).get('admin-session');
  return adminSession?.value === 'authenticated';
}

export async function GET() {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const result = await getAllUsersForAdmin();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const { action, userId, credits, planName } = await request.json();

    switch (action) {
      case 'delete':
        if (!userId) {
          return NextResponse.json({ error: 'User ID gereklidir' }, { status: 400 });
        }
        const deleteResult = await deleteUserAsAdmin(userId);
        if (!deleteResult.success) {
          return NextResponse.json({ error: deleteResult.error }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: 'Kullanıcı başarıyla silindi' });

      case 'addCredits':
        if (!userId || credits === undefined) {
          return NextResponse.json({ error: 'User ID ve kredi miktarı gereklidir' }, { status: 400 });
        }
        const creditResult = await addCreditsToUser(userId, credits);
        if (!creditResult.success) {
          return NextResponse.json({ error: creditResult.error }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: 'Kredi başarıyla eklendi' });

      case 'changePlan':
        if (!userId || !planName) {
          return NextResponse.json({ error: 'User ID ve plan adı gereklidir' }, { status: 400 });
        }
        const planResult = await changeUserPlan(userId, planName);
        if (!planResult.success) {
          return NextResponse.json({ error: planResult.error }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: 'Plan başarıyla değiştirildi' });

      case 'block':
        if (!userId) return NextResponse.json({ error: 'User ID gereklidir' }, { status:400});
        {
          const res= await setUserBlocked(userId, true);
          if(!res.success) return NextResponse.json({ error: res.error }, {status:500});
          return NextResponse.json({ success:true, message:'Kullanıcı bloklandı' });
        }
      case 'unblock':
        if (!userId) return NextResponse.json({ error: 'User ID gereklidir' }, { status:400});
        {
          const res= await setUserBlocked(userId, false);
          if(!res.success) return NextResponse.json({ error: res.error }, {status:500});
          return NextResponse.json({ success:true, message:'Kullanıcı blok kaldırıldı' });
        }

      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin users action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 