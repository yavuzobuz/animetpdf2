import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscription } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await getUserSubscription(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get user subscription API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}