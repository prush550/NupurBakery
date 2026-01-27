import { NextRequest, NextResponse } from 'next/server';
import { verifyPuzzleAnswer } from '@/lib/db';
import { ApiResponse, Coupon } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface VerifyResponse {
  correct: boolean;
  coupon?: Coupon;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<VerifyResponse>>> {
  try {
    const body = await request.json();
    const { answer } = body;

    if (!answer || typeof answer !== 'string' || answer.length !== 3) {
      return NextResponse.json(
        { success: false, error: 'Please enter a 3-digit passcode' },
        { status: 400 }
      );
    }

    const result = await verifyPuzzleAnswer(answer);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to verify answer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify answer' },
      { status: 500 }
    );
  }
}
