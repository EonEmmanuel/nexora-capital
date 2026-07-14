import { Prisma, TransactionType } from '@prisma/client';
import { prisma } from '@/server/db/prisma';

export async function getDashboardOverview(userId: string) {
  const [allocations, transactions, notifications] = await Promise.all([
    prisma.allocation.findMany({ where: { userId }, include: { pool: true }, orderBy: { createdAt: 'desc' } }),
    prisma.transaction.findMany({ where: { userId }, include: { allocation: { include: { pool: true } } }, orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);
  const active = allocations.filter((allocation) => allocation.status === 'ACTIVE');
  const totalAllocated = active.reduce((sum, allocation) => sum.plus(allocation.initialValue), new Prisma.Decimal(0));
  const currentValue = active.reduce((sum, allocation) => sum.plus(allocation.currentValue), new Prisma.Decimal(0));
  const totalReturn = currentValue.minus(totalAllocated);
  const distribution = active.map((allocation) => ({ name: allocation.pool.name, value: allocation.currentValue }));
  const deposits = transactions.filter((transaction) => transaction.type === TransactionType.ALLOCATION);
  return { allocations, active, transactions, notifications, totalAllocated, currentValue, totalReturn, distribution, deposits };
}
