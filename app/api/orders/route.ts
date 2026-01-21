import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getProductById } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { sendOrderConfirmationEmail, sendOwnerNotificationEmail } from '@/lib/email';
import { Order, ApiResponse, OrderFormData } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET all orders (admin only)
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Order[]>>> {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (!await isAuthenticated(token)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orders = await getOrders();
    return NextResponse.json(
      { success: true, data: orders },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST new order (public)
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Order>>> {
  try {
    const body: OrderFormData = await request.json();

    // Validation
    if (!body.customerName || !body.customerEmail || !body.customerPhone || !body.deliveryDate || !body.deliveryTime) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (body.deliveryType === 'delivery' && !body.customerAddress) {
      return NextResponse.json(
        { success: false, error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    // Get product if productId is provided
    let product = null;
    if (body.productId) {
      product = await getProductById(body.productId);
    }

    // Create order
    const order = await createOrder(body, product);

    // Send emails (don't block on email sending)
    try {
      await Promise.all([
        sendOrderConfirmationEmail(order),
        sendOwnerNotificationEmail(order)
      ]);
    } catch (emailError) {
      console.error('Failed to send emails:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
