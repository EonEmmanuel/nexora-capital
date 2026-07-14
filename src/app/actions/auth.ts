'use server';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from '@/server/db/prisma';
import { clearSessionCookie, setSessionCookie } from '@/server/auth/session';
import { defaultAdminPathForRole, type Role } from '@/server/permissions/rbac';

export async function signInAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').toLowerCase().trim();
  const password = String(formData.get('password') ?? '');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) throw new Error('Invalid email or password.');
  if (user.status === 'SUSPENDED' || user.status === 'RESTRICTED') throw new Error('Account access is restricted.');
  await setSessionCookie(user.id);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  redirect(user.role === 'USER' ? '/dashboard' : defaultAdminPathForRole(user.role as Role));
}
export async function signUpAction(formData: FormData) {
  const firstName = String(formData.get('firstName') ?? '').trim();
  const lastName = String(formData.get('lastName') ?? '').trim();
  const email = String(formData.get('email') ?? '').toLowerCase().trim();
  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirmPassword') ?? '');
  if (!firstName || !lastName || !email || password.length < 12 || password !== confirm || formData.get('terms') !== 'on') throw new Error('Invalid registration details.');
  const passwordHash = await bcrypt.hash(password, 12);
  const referralCode = `NX${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
  const user = await prisma.user.create({ data: { firstName, lastName, email, passwordHash, status: 'ACTIVE', referralCode } });
  await prisma.notification.create({ data: { userId: user.id, title: 'Welcome to Nexora', message: 'Your account is ready. Please review risk disclosures before allocating capital.', type: 'SUCCESS', actionUrl: '/dashboard' } });
  await setSessionCookie(user.id);
  redirect('/dashboard');
}
export async function signOutAction() { await clearSessionCookie(); redirect('/'); }
