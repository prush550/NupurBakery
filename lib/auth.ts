import crypto from 'crypto';
import { getAdminUser, saveAdminUser, createSession, validateSession, deleteSession } from './db';

// Hash password using SHA-256
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate a random token
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initialize admin user if not exists
export async function initializeAdmin(username: string, password: string): Promise<boolean> {
  const existing = await getAdminUser();
  if (existing) {
    return false;
  }
  await saveAdminUser({
    username,
    passwordHash: hashPassword(password)
  });
  return true;
}

// Login
export async function login(username: string, password: string): Promise<string | null> {
  const admin = await getAdminUser();
  if (!admin) {
    // First time setup - create admin account
    await initializeAdmin(username, password);
    const token = generateToken();
    await createSession(token);
    return token;
  }

  if (admin.username !== username) {
    return null;
  }

  if (admin.passwordHash !== hashPassword(password)) {
    return null;
  }

  const token = generateToken();
  await createSession(token);
  return token;
}

// Validate token
export async function isAuthenticated(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  return await validateSession(token);
}

// Logout
export async function logout(token: string): Promise<void> {
  await deleteSession(token);
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
  const admin = await getAdminUser();
  if (!admin) return false;

  if (admin.passwordHash !== hashPassword(currentPassword)) {
    return false;
  }

  await saveAdminUser({
    ...admin,
    passwordHash: hashPassword(newPassword)
  });
  return true;
}
