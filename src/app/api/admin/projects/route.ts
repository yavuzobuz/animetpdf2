import { NextResponse } from 'next/server';
import { getAllProjectsForAdmin, deleteProjectAsAdmin } from '@/lib/database';
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

    const result = await getAllProjectsForAdmin();
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data });
  } catch (error) {
    console.error('Admin projects API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!await checkAdminAuth()) {
      return NextResponse.json({ error: 'Admin yetkisi gereklidir' }, { status: 401 });
    }

    const { action, projectId } = await request.json();

    switch (action) {
      case 'delete':
        if (!projectId) {
          return NextResponse.json({ error: 'Project ID gereklidir' }, { status: 400 });
        }
        const deleteResult = await deleteProjectAsAdmin(projectId);
        if (!deleteResult.success) {
          return NextResponse.json({ error: deleteResult.error }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: 'Proje başarıyla silindi' });

      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin projects action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 