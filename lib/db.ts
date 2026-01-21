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
