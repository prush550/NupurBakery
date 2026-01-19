import { NextRequest, NextResponse } from 'next/server';
import { logout } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      await logout(token);
    }

    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Clear the cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
