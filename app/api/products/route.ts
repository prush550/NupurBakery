import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { Product, ApiResponse, ProductFormData } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET all products (public)
export async function GET(): Promise<NextResponse<ApiResponse<Product[]>>> {
  try {
    const products = await getProducts();
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST new product (requires auth)
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Product>>> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!await isAuthenticated(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: ProductFormData = await request.json();
    const { name, category, price, preparationTime, image } = body;

    // Validation
    if (!name || !category || price === undefined || preparationTime === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const savedProduct = await addProduct({
      name,
      category,
      price: Number(price),
      preparationTime: Number(preparationTime),
      image: image || ''
    });

    return NextResponse.json(
      { success: true, data: savedProduct },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
