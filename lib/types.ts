import { ObjectId } from 'mongodb';

// Product types
export interface Product {
  _id?: ObjectId;
  id: string;
  name: string;
  category: string;
  price: number;
  preparationTime: number; // in minutes
  image: string; // Cloudinary URL
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  preparationTime: number;
  image: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// Auth types
export interface AdminUser {
  username: string;
  passwordHash: string;
}

export interface AuthSession {
  token: string;
  expiresAt: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Order types
export interface Order {
  _id?: ObjectId;
  id: string;
  orderNumber: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;

  // Customer details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;

  // Delivery details
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: 'delivery' | 'pickup';

  // Customization
  cakeMessage?: string;
  flavor?: string;
  weight?: string;
  specialInstructions?: string;

  // Coupon
  couponCode?: string;
  discountPercent?: number;

  // Order metadata
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  productId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryType: 'delivery' | 'pickup';
  cakeMessage?: string;
  flavor?: string;
  weight?: string;
  specialInstructions?: string;
  couponCode?: string;
}

// Coupon types for treasure hunt game
export interface Coupon {
  _id?: ObjectId;
  id: string;
  code: string;
  discountPercent: number;
  validDate: string; // YYYY-MM-DD format - valid only on this day
  usedBy?: string; // customer email who used it
  usedAt?: string;
  createdAt: string;
}

export interface DailyPuzzle {
  _id?: ObjectId;
  id: string;
  date: string; // YYYY-MM-DD format
  puzzle: string;
  answer: string; // 3-digit passcode
  couponsGenerated: number; // max 3 per day
  createdAt: string;
}
