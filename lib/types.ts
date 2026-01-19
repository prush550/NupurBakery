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
