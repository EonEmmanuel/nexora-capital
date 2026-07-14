import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/server/db/prisma';
import { hasPermission, type Permission, type Role } from '@/server/permissions/rbac';

const COOKIE_NAME = 'nexora_session';
export const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;
const SESSION_MAX_FUTURE_SKEW_MS = 1000 * 60 * 5;
function secret() { return process.env.AUTH_SECRET ?? 'development-only-change-me'; }
function sign(value: string) { return createHmac('sha256', secret()).update(value).digest('base64url'); }
export function createSessionToken(userId: string, issuedAt = Date.now()) { const payload = `${userId}.${issuedAt}`; return `${payload}.${sign(payload)}`; }
export function verifySessionToken(token?: string, now = Date.now()) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
    const issuedAt = Number(parts[1]);
    if (!Number.isFinite(issuedAt) || !Number.isInteger(issuedAt)) return null;
    if (issuedAt > now + SESSION_MAX_FUTURE_SKEW_MS) return null;
    if (now - issuedAt > SESSION_MAX_AGE_MS) return null;
    const payload = `${parts[0]}.${parts[1]}`;
    const expectedBuffer = Buffer.from(sign(payload));
    const actualBuffer = Buffer.from(parts[2]);
    if (expectedBuffer.length !== actualBuffer.length) return null;
    if (!timingSafeEqual(expectedBuffer, actualBuffer)) return null;
    return parts[0];
  } catch { return null; }
}
export async function setSessionCookie(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, createSessionToken(userId), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: Math.floor(SESSION_MAX_AGE_MS / 1000), expires: new Date(Date.now() + SESSION_MAX_AGE_MS) });
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
