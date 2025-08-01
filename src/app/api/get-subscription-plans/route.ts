import { NextResponse } from 'next/server';
import { getAllSubscriptionPlans } from '@/lib/database';

export async function GET() {
  try {
    const result = await getAllSubscriptionPlans();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Get subscription plans API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}