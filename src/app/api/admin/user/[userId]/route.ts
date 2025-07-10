import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getUserProfile,
  getUserProjects,
  getAllSupportTickets,
} from '@/lib/database';

// Admin auth kontrolü
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminSession = (cookieStore as any).get('admin-session');
  return adminSession?.value === 'authenticated';
}

//  /api/admin/user/[userId]  -> kullanıcıya özel detaylar
export async function GET(
  _request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params; // await işlemlerinden önce alınmalı

    // yetki kontrolü
    if (!(await checkAdminAuth())) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId parametresi gerekli' }, { status: 400 });
    }

    // kullanıcı profili
    const profileRes = await getUserProfile(userId);
    if (!profileRes.success) {
      return NextResponse.json({ error: profileRes.error }, { status: 500 });
    }

    // kullanıcı projeleri
    const projectsRes = await getUserProjects(userId);
    if (!projectsRes.success) {
      return NextResponse.json({ error: projectsRes.error }, { status: 500 });
    }

    // Destek talepleri (filtrele)
    const ticketsRes = await getAllSupportTickets();
    const userTickets = ticketsRes.success
      ? ticketsRes.data.filter((t) => t.user_id === userId || t.email === profileRes.data?.email)
      : [];

    return NextResponse.json({
      data: {
        user: profileRes.data,
        projects: projectsRes.data,
        tickets: userTickets,
      },
    });
  } catch (err) {
    console.error('Admin user details error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
