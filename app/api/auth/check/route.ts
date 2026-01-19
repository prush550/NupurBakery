import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<{ authenticated: boolean }>>> {
  try {
    const token = request.cookies.get('admin_token')?.value;
    const authenticated = await isAuthenticated(token);

    return NextResponse.json(
      { success: true, data: { authenticated } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
