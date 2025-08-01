import { NextRequest, NextResponse } from 'next/server';
import { incrementUserUsage } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { userId, type } = await request.json();

    if (!userId || !type) {
      return NextResponse.json(
        { success: false, error: 'User ID and type are required' },
        { status: 400 }
      );
    }

    if (type !== 'pdf' && type !== 'animation') {
      return NextResponse.json(
        { success: false, error: 'Type must be either "pdf" or "animation"' },
        { status: 400 }
      );
    }

    const result = await incrementUserUsage(userId, type);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Increment usage API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}