import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getUserProfile,
  getUserProjects,
  getUserAnimationPages,
  getAllSupportTickets,
  getUserStats,
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
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params; // await işlemlerinden önce alınmalı

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

    // kullanıcı animasyon sayfaları
    const animationsRes = await getUserAnimationPages(userId);
    if (!animationsRes.success) {
      return NextResponse.json({ error: animationsRes.error }, { status: 500 });
    }

    // kullanıcı istatistikleri
    const statsRes = await getUserStats(userId);
    if (!statsRes.success) {
      return NextResponse.json({ error: statsRes.error }, { status: 500 });
    }

    // Tüm projeleri birleştir (PDF + Animasyon)
    const allProjects = [
      ...projectsRes.data.map(p => ({ ...p, project_type: 'pdf' })),
      ...animationsRes.data.map(a => ({ ...a, project_type: 'animation', title: a.topic }))
    ];

    // Destek talepleri (filtrele)
    const ticketsRes = await getAllSupportTickets();
    const userTickets = ticketsRes.success
      ? ticketsRes.data.filter((t) => t.user_id === userId || t.email === profileRes.data?.email)
      : [];

    return NextResponse.json({
      data: {
        user: profileRes.data,
        projects: allProjects,
        tickets: userTickets,
        stats: statsRes.data,
      },
    });
  } catch (err) {
    console.error('Admin user details error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
