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
  product: Product | null,
  discountPercent: number = 0
): Promise<Order> {
  const db = await getDatabase();
  const now = new Date().toISOString();

  const basePrice = product?.price || 1000;
  const discountAmount = Math.round(basePrice * discountPercent / 100);
  const finalPrice = basePrice - discountAmount;

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
    couponCode: orderData.couponCode,
    discountPercent: discountPercent > 0 ? discountPercent : undefined,
    status: 'pending',
    totalPrice: finalPrice,
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

// ============ Coupon / Treasure Hunt Functions ============

import { Coupon, DailyPuzzle } from './types';

// Collection of puzzles with 3-digit answers
const puzzleBank = [
  { puzzle: "I am thinking of a number. If you multiply it by 3 and add 12, you get 375. What is the original number?", answer: "121" },
  { puzzle: "How many seconds are there in 4 minutes and 27 seconds?", answer: "267" },
  { puzzle: "What is 15 × 15 + 64?", answer: "289" },
  { puzzle: "A baker has 500 cookies. He gives away 137 and bakes 92 more. How many does he have now?", answer: "455" },
  { puzzle: "What is the sum of all numbers from 1 to 18?", answer: "171" },
  { puzzle: "If a cake costs ₹89 and you buy 3, what is the total cost in rupees?", answer: "267" },
  { puzzle: "What is 729 ÷ 3?", answer: "243" },
  { puzzle: "A recipe needs 45 minutes to bake. If you start at 2:15 PM, at what time will it be done? (Enter as 3-digit: hour minute minute)", answer: "300" },
  { puzzle: "What is 17 × 17?", answer: "289" },
  { puzzle: "How many hours are in 2 weeks minus 1 day?", answer: "312" },
  { puzzle: "If you have ₹1000 and spend ₹467, how much do you have left?", answer: "533" },
  { puzzle: "What is 625 - 182?", answer: "443" },
  { puzzle: "A box has 12 rows of 24 cupcakes each. How many cupcakes in total?", answer: "288" },
  { puzzle: "What is 9 × 9 × 3?", answer: "243" },
  { puzzle: "If today is the 156th day of the year, how many days are left? (Assume 365 days)", answer: "209" },
];

function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'NB30-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function getDailyPuzzle(): Promise<DailyPuzzle> {
  const db = await getDatabase();
  const today = getTodayDate();

  // Check if puzzle exists for today
  const existingPuzzle = await db.collection<DailyPuzzle>('puzzles').findOne({ date: today });

  if (existingPuzzle) {
    return existingPuzzle;
  }

  // Create new puzzle for today
  const randomPuzzle = puzzleBank[Math.floor(Math.random() * puzzleBank.length)];
  const newPuzzle: DailyPuzzle = {
    id: crypto.randomUUID(),
    date: today,
    puzzle: randomPuzzle.puzzle,
    answer: randomPuzzle.answer,
    couponsGenerated: 0,
    createdAt: new Date().toISOString()
  };
  await db.collection<DailyPuzzle>('puzzles').insertOne(newPuzzle);

  return newPuzzle;
}

export async function verifyPuzzleAnswer(answer: string): Promise<{ correct: boolean; coupon?: Coupon; message: string }> {
  const db = await getDatabase();
  const today = getTodayDate();

  const puzzle = await getDailyPuzzle();

  // Check if answer is correct
  if (answer !== puzzle.answer) {
    return { correct: false, message: "Incorrect passcode. Try again!" };
  }

  // Check if 3 coupons already generated today
  if (puzzle.couponsGenerated >= 3) {
    return { correct: false, message: "Sorry! All 3 coupons for today have been claimed. Try again tomorrow!" };
  }

  // Generate new coupon
  const coupon: Coupon = {
    id: crypto.randomUUID(),
    code: generateCouponCode(),
    discountPercent: 30,
    validDate: today,
    createdAt: new Date().toISOString()
  };

  await db.collection<Coupon>('coupons').insertOne(coupon);

  // Update puzzle coupons count
  await db.collection<DailyPuzzle>('puzzles').updateOne(
    { date: today },
    { $inc: { couponsGenerated: 1 } }
  );

  return {
    correct: true,
    coupon,
    message: "Congratulations! You've unlocked a 30% discount coupon!"
  };
}

export async function validateCoupon(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
  const db = await getDatabase();
  const today = getTodayDate();

  const coupon = await db.collection<Coupon>('coupons').findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  }

  if (coupon.validDate !== today) {
    return { valid: false, discount: 0, message: "This coupon has expired. Coupons are valid only on the day they are generated." };
  }

  if (coupon.usedBy) {
    return { valid: false, discount: 0, message: "This coupon has already been used" };
  }

  return { valid: true, discount: coupon.discountPercent, message: "Coupon applied successfully! 30% discount" };
}

export async function useCoupon(code: string, customerEmail: string): Promise<boolean> {
  const db = await getDatabase();

  const result = await db.collection<Coupon>('coupons').updateOne(
    { code: code.toUpperCase(), usedBy: { $exists: false } },
    { $set: { usedBy: customerEmail, usedAt: new Date().toISOString() } }
  );

  return result.modifiedCount > 0;
}

export async function getCouponsRemaining(): Promise<number> {
  const puzzle = await getDailyPuzzle();
  return Math.max(0, 3 - puzzle.couponsGenerated);
}
