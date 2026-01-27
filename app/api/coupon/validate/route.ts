import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface ValidateResponse {
  valid: boolean;
  discount: number;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<ValidateResponse>>> {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Failed to validate coupon:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
