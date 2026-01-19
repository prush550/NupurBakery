import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ token: string }>>> {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const token = await login(username, password);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, data: { token } },
      { status: 200 }
    );

    // Set HTTP-only cookie for security
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
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
