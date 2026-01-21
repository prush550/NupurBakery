import { NextRequest, NextResponse } from 'next/server';
import { getOrdersByPhone, getOrdersByEmail, getOrderByOrderNumber } from '@/lib/db';
import { ApiResponse, Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Order[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const value = searchParams.get('value');

    if (!type || !value) {
      return NextResponse.json(
        { success: false, error: 'Missing search parameters' },
        { status: 400 }
      );
    }

    let orders: Order[] = [];

    switch (type) {
      case 'orderNumber':
        const order = await getOrderByOrderNumber(value.trim().toUpperCase());
        if (order) {
          orders = [order];
        }
        break;

      case 'phone':
        // Clean phone number - remove spaces, dashes, and country code variations
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '').replace(/^\+91/, '').replace(/^91/, '');
        orders = await getOrdersByPhone(cleanPhone);
        break;

      case 'email':
        orders = await getOrdersByEmail(value.trim().toLowerCase());
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid search type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Order tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search orders' },
      { status: 500 }
    );
  }
}
