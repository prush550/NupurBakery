import { NextResponse } from 'next/server';
import { getDailyPuzzle, getCouponsRemaining } from '@/lib/db';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface PuzzleResponse {
  puzzle: string;
  couponsRemaining: number;
}

export async function GET(): Promise<NextResponse<ApiResponse<PuzzleResponse>>> {
  try {
    const dailyPuzzle = await getDailyPuzzle();
    const couponsRemaining = await getCouponsRemaining();

    return NextResponse.json({
      success: true,
      data: {
        puzzle: dailyPuzzle.puzzle,
        couponsRemaining
      }
    });
  } catch (error) {
    console.error('Failed to get puzzle:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get puzzle' },
      { status: 500 }
    );
  }
}
