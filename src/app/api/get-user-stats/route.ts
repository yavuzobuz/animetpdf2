import { NextRequest, NextResponse } from 'next/server';
import { getUserStats } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await getUserStats(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get user stats API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}