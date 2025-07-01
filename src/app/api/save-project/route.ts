import { createAdminClient } from '@/lib/supabase';
import { PDFProject, checkUserPDFLimit, incrementUserUsage } from '@/lib/database';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createAdminClient();
  const { projectData } = await request.json();

  try {
    // Get user ID from project data
    const userId = projectData.user_id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID gereklidir' }, { status: 400 });
    }

    // Check if user can process more PDFs this month
    const limitCheck = await checkUserPDFLimit(userId);
    if (!limitCheck.success) {
      console.error('Limit check error:', limitCheck.error);
      return NextResponse.json({ 
        error: 'Limit kontrolü yapılamadı',
        details: limitCheck.error 
      }, { status: 500 });
    }

    if (!limitCheck.canProcess) {
      return NextResponse.json({ 
        error: 'Aylık PDF limiti aşıldı',
        limitInfo: {
          currentUsage: limitCheck.currentUsage,
          limit: limitCheck.limit,
          message: `Bu ay ${limitCheck.currentUsage}/${limitCheck.limit} PDF işlediniz. Limitinizi aştınız, lütfen planınızı yükseltin.`
        }
      }, { status: 403 });
    }

    // Save project to database
    const { data, error } = await supabase
      .from('pdf_projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('Error saving project to database:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment user's PDF usage count
    const usageResult = await incrementUserUsage(userId, 'pdf');
    if (!usageResult.success) {
      console.error('Usage increment error:', usageResult.error);
      // Don't fail the request if usage tracking fails, just log it
    }

    return NextResponse.json({ 
      data,
      limitInfo: {
        currentUsage: limitCheck.currentUsage + 1, // +1 because we just processed one
        limit: limitCheck.limit,
        remainingPDFs: limitCheck.limit - limitCheck.currentUsage - 1
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error saving project to database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
