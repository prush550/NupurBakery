import { getDatabase } from './mongodb';
import { Product, AdminUser, AuthSession, Order, OrderFormData } from './types';
import { v4 as uuidv4 } from 'uuid';

// Products Collection
export async function getProducts(): Promise<Product[]> {
  const db = await getDatabase();
  const products = await db.collection<Product>('products').find({}).toArray();
  return products.map(p => ({ ...p, id: p.id || p._id?.toString() || '' }));
}

export async function addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | '_id'>): Promise<Product> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  const product: Product = {
    ...productData,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now
  };
  await db.collection<Product>('products').insertOne(product);
  return product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const db = await getDatabase();
  const result = await db.collection<Product>('products').findOneAndUpdate(
    { id },
    { $set: { ...updates, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );
  return result || null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = await getDatabase();
  const result = await db.collection<Product>('products').deleteOne({ id });
  return result.deletedCount > 0;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await getDatabase();
  const product = await db.collection<Product>('products').findOne({ id });
  return product || null;
}

// Auth Collection
export async function getAdminUser(): Promise<AdminUser | null> {
  const db = await getDatabase();
  const admin = await db.collection<AdminUser>('admin').findOne({});
  return admin || null;
}

export async function saveAdminUser(user: AdminUser): Promise<void> {
  const db = await getDatabase();
  await db.collection<AdminUser>('admin').updateOne(
    {},
    { $set: user },
    { upsert: true }
  );
}

// Sessions Collection
export async function createSession(token: string): Promise<AuthSession> {
  const db = await getDatabase();
  const session: AuthSession = {
    token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000
  };
  await db.collection<AuthSession>('sessions').insertOne(session);
  return session;
}

export async function validateSession(token: string): Promise<boolean> {
  const db = await getDatabase();
  const session = await db.collection<AuthSession>('sessions').findOne({ token });

  if (!session) return false;

  if (session.expiresAt < Date.now()) {
    await db.collection<AuthSession>('sessions').deleteOne({ token });
    return false;
  }

  return true;
}

export async function deleteSession(token: string): Promise<void> {
  const db = await getDatabase();
  await db.collection<AuthSession>('sessions').deleteOne({ token });
}

export async function cleanupSessions(): Promise<void> {
  const db = await getDatabase();
  await db.collection<AuthSession>('sessions').deleteMany({
    expiresAt: { $lt: Date.now() }
  });
}

// Orders Collection
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `NB${year}${month}${day}${random}`;
}

export async function createOrder(
  orderData: OrderFormData,
  product: Product | null
): Promise<Order> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const order: Order = {
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    productId: product?.id,
    productName: product?.name,
    productImage: product?.image,
    productPrice: product?.price,
    customerName: orderData.customerName,
    customerEmail: orderData.customerEmail,
    customerPhone: orderData.customerPhone,
    customerAddress: orderData.customerAddress,
    deliveryDate: orderData.deliveryDate,
    deliveryTime: orderData.deliveryTime,
    deliveryType: orderData.deliveryType,
    cakeMessage: orderData.cakeMessage,
    flavor: orderData.flavor,
    weight: orderData.weight,
    specialInstructions: orderData.specialInstructions,
    status: 'pending',
    totalPrice: product?.price || 1000,
    createdAt: now,
    updatedAt: now
  };

  await db.collection<Order>('orders').insertOne(order);
  return order;
}

export async function getOrders(): Promise<Order[]> {
  const db = await getDatabase();
  const orders = await db.collection<Order>('orders')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return orders;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const db = await getDatabase();
  const order = await db.collection<Order>('orders').findOne({ id });
  return order || null;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
  const db = await getDatabase();
  const order = await db.collection<Order>('orders').findOne({ orderNumber });
  return order || null;
}

export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<Order | null> {
  const db = await getDatabase();
  const result = await db.collection<Order>('orders').findOneAndUpdate(
    { id },
    { $set: { status, updatedAt: new Date().toISOString() } },
    { returnDocument: 'after' }
  );
  return result || null;
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const db = await getDatabase();
  // Search with flexible phone matching (last 10 digits)
  const phoneRegex = new RegExp(phone.slice(-10) + '$');
  const orders = await db.collection<Order>('orders')
    .find({ customerPhone: { $regex: phoneRegex } })
    .sort({ createdAt: -1 })
    .toArray();
  return orders;
}

export async function getOrdersByEmail(email: string): Promise<Order[]> {
  const db = await getDatabase();
  const orders = await db.collection<Order>('orders')
    .find({ customerEmail: { $regex: new RegExp(`^${email}$`, 'i') } })
    .sort({ createdAt: -1 })
    .toArray();
  return orders;
}

// Order Statistics for Admin Dashboard
export interface OrderStats {
  today: { count: number; revenue: number };
  thisWeek: { count: number; revenue: number };
  thisMonth: { count: number; revenue: number };
  allTime: { count: number; revenue: number };
  pending: number;
  confirmed: number;
  preparing: number;
  ready: number;
  delivered: number;
  cancelled: number;
}

export async function getOrderStats(): Promise<OrderStats> {
  const db = await getDatabase();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  // Start of this week (Sunday)
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).toISOString();

  // Start of this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const allOrders = await db.collection<Order>('orders').find({}).toArray();

  const stats: OrderStats = {
    today: { count: 0, revenue: 0 },
    thisWeek: { count: 0, revenue: 0 },
    thisMonth: { count: 0, revenue: 0 },
    allTime: { count: allOrders.length, revenue: 0 },
    pending: 0,
    confirmed: 0,
    preparing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0
  };

  for (const order of allOrders) {
    const orderDate = order.createdAt;
    const price = order.totalPrice || 0;

    // All time revenue (exclude cancelled)
    if (order.status !== 'cancelled') {
      stats.allTime.revenue += price;
    }

    // Today
    if (orderDate >= startOfToday) {
      stats.today.count++;
      if (order.status !== 'cancelled') {
        stats.today.revenue += price;
      }
    }

    // This week
    if (orderDate >= startOfWeek) {
      stats.thisWeek.count++;
      if (order.status !== 'cancelled') {
        stats.thisWeek.revenue += price;
      }
    }

    // This month
    if (orderDate >= startOfMonth) {
      stats.thisMonth.count++;
      if (order.status !== 'cancelled') {
        stats.thisMonth.revenue += price;
      }
    }

    // Status counts
    switch (order.status) {
      case 'pending': stats.pending++; break;
      case 'confirmed': stats.confirmed++; break;
      case 'preparing': stats.preparing++; break;
      case 'ready': stats.ready++; break;
      case 'delivered': stats.delivered++; break;
      case 'cancelled': stats.cancelled++; break;
    }
  }

  return stats;
}
