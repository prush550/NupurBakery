import { getDatabase } from './mongodb';
import { Product, AdminUser, AuthSession } from './types';
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
