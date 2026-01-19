import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import { ApiResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ url: string }>>> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!await isAuthenticated(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const url = await uploadImage(image);

    return NextResponse.json(
      { success: true, data: { url } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
