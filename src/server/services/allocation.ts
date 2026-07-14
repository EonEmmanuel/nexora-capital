import { AllocationStatus, PaymentStatus, Prisma, TransactionType } from '@prisma/client';
import { prisma } from '@/server/db/prisma';
import { canAllocateToPool } from '@/server/services/rules';
import { paymentProvider } from '@/server/payments/provider';
import { assertMockPaymentControlsEnabled, canUserAdvanceMockPayment, type MockPaymentTransition } from '@/server/payments/mock-controls';
import { userOwnedPaymentWhere } from '@/server/permissions/ownership';

export async function createAllocationIntent(input: { userId: string; poolSlug: string; amount: string; currency: string; network: string }) {
  const amount = new Prisma.Decimal(input.amount);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({ where: { id: input.userId } });
    if (user.status !== 'ACTIVE') throw new Error('Account is not eligible for allocations.');
    const pool = await tx.tradingPool.findUniqueOrThrow({ where: { slug: input.poolSlug } });
    const check = canAllocateToPool({ amount, minimum: pool.minimumAllocation, maximum: pool.maximumAllocation, capacity: pool.totalCapacity, allocated: pool.currentlyAllocated, status: pool.status });
    if (!check.ok) throw new Error(check.reason);
    const reference = `ALC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const allocation = await tx.allocation.create({ data: { userId: input.userId, poolId: pool.id, reference, amount, currency: input.currency, status: AllocationStatus.PAYMENT_PENDING, initialValue: amount, currentValue: amount } });
    const intent = await paymentProvider.createPaymentIntent({ amount: amount.toString(), currency: input.currency, network: input.network, allocationReference: reference });
    const payment = await tx.payment.create({ data: { userId: input.userId, allocationId: allocation.id, paymentReference: intent.reference, provider: intent.provider, method: input.currency, requestedAmount: amount, currency: input.currency, network: input.network, walletAddress: intent.walletAddress, status: PaymentStatus.PENDING, expiresAt: intent.expiresAt } });
    await tx.notification.create({ data: { userId: input.userId, title: 'Allocation created', message: `Payment instructions are ready for ${pool.name}.`, type: 'PAYMENT', actionUrl: `/payment/${payment.paymentReference}` } });
    return { allocation, payment };
  });
}

export async function completeMockPayment(paymentReference: string, nextStatus: MockPaymentTransition) {
  assertMockPaymentControlsEnabled();
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUniqueOrThrow({ where: { paymentReference }, include: { allocation: { include: { pool: true } } } });
    if (!payment.allocation) throw new Error('Payment is not attached to an allocation.');
    if (payment.status === PaymentStatus.COMPLETED) return payment;
    if (nextStatus !== 'COMPLETED') {
      return tx.payment.update({ where: { id: payment.id }, data: { status: nextStatus, confirmations: nextStatus === 'CONFIRMING' ? 1 : 0, receivedAmount: payment.requestedAmount } });
    }
    const ledgerReference = `TX-${payment.paymentReference}`;
    const paymentClaim = await tx.payment.updateMany({ where: { id: payment.id, status: { not: PaymentStatus.COMPLETED } }, data: { status: PaymentStatus.COMPLETED, confirmations: 3, receivedAmount: payment.requestedAmount, paidAt: new Date() } });
    if (paymentClaim.count !== 1) return tx.payment.findUniqueOrThrow({ where: { id: payment.id } });
    const capacityUpdateCount = await tx.$executeRaw`
      UPDATE "TradingPool"
      SET "currentlyAllocated" = "currentlyAllocated" + ${payment.requestedAmount},
          "updatedAt" = NOW()
      WHERE "id" = ${payment.allocation.poolId}
        AND "currentlyAllocated" + ${payment.requestedAmount} <= "totalCapacity"
    `;
    if (capacityUpdateCount !== 1) throw new Error('Payment would exceed remaining pool capacity.');
    await tx.allocation.update({ where: { id: payment.allocationId! }, data: { status: AllocationStatus.ACTIVE, activatedAt: new Date(), currentValue: payment.requestedAmount } });
    await tx.transaction.upsert({ where: { reference: ledgerReference }, update: {}, create: { userId: payment.userId, allocationId: payment.allocationId, type: TransactionType.ALLOCATION, amount: payment.requestedAmount, currency: payment.currency, status: 'COMPLETED', reference: ledgerReference, description: `Activated allocation ${payment.allocation.reference}` } });
    await tx.notification.create({ data: { userId: payment.userId, title: 'Allocation activated', message: `${payment.allocation.pool.name} is now active.`, type: 'SUCCESS', actionUrl: `/dashboard/pools/${payment.allocationId}` } });
    return tx.payment.findUniqueOrThrow({ where: { id: payment.id } });
  });
}


export async function completeUserMockPayment(userId: string, paymentReference: string, nextStatus: MockPaymentTransition) {
  assertMockPaymentControlsEnabled();
  const payment = await prisma.payment.findFirst({ where: userOwnedPaymentWhere(userId, paymentReference), include: { allocation: true } });
  if (!payment || payment.provider !== 'mock' || payment.allocation?.userId !== userId) throw new Error('Payment not found.');
  if (!canUserAdvanceMockPayment(payment.status, nextStatus)) throw new Error('Payment cannot be advanced from its current status by the user flow.');
  return completeMockPayment(paymentReference, nextStatus);
}
