import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/server/db/prisma';
import { hasPermission, type Permission, type Role } from '@/server/permissions/rbac';

const COOKIE_NAME = 'nexora_session';
function secret() { return process.env.AUTH_SECRET ?? 'development-only-change-me'; }
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }
export function createSessionToken(userId: string) { const payload = `${userId}.${Date.now()}`; return `${payload}.${sign(payload)}`; }
function verifySessionToken(token?: string) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = sign(payload);
  const actual = parts[2];
  if (expected.length !== actual.length) return null;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(actual))) return null;
  return parts[0];
}
export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(userId), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30 });
}
export async function clearSessionCookie() { const jar = await cookies(); jar.delete(COOKIE_NAME); }
export async function getCurrentUser() {
  const jar = await cookies();
  const userId = verifySessionToken(jar.get(COOKIE_NAME)?.value);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');
  if (user.status === 'SUSPENDED' || user.status === 'RESTRICTED') redirect('/forbidden');
  return user;
}
export async function requireAuthorized(permission: Permission) {
  const user = await requireUser();
  if (!hasPermission(user.role as Role, permission)) redirect('/forbidden');
  return user;
}
