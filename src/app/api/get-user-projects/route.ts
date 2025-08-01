import { NextRequest, NextResponse } from 'next/server';
import { getUserProjects, getUserAnimationPages } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get both PDF projects and animation pages
    const [pdfResult, animResult] = await Promise.all([
      getUserProjects(userId),
      getUserAnimationPages(userId)
    ]);

    if (!pdfResult.success) {
      return NextResponse.json(pdfResult);
    }

    let combined: any[] = [...pdfResult.data];
    
    if (animResult.success) {
      const mapped = animResult.data.map((ap: any) => ({
        id: ap.id,
        title: ap.topic,
        animation_scenario: ap.scenes,
        animation_svgs: ap.animation_svgs,
        qa_pairs: ap.qa_pairs,
        status: 'completed',
        created_at: ap.created_at,
        updated_at: ap.updated_at || ap.created_at,
        analysis_result: { summary: ap.script_summary },
        animation_settings: { type: 'animation' }
      }));
      combined = [...combined, ...mapped];
    }

    return NextResponse.json({
      success: true,
      data: combined
    });
  } catch (error) {
    console.error('Get user projects API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}