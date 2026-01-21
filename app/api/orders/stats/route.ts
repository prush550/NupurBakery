import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { getOrderStats, OrderStats } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<OrderStats>>> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!await isAuthenticated(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stats = await getOrderStats();

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Failed to get order stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get order statistics' },
      { status: 500 }
    );
  }
}
