'use server';
import { redirect } from 'next/navigation';
import { requireUser } from '@/server/auth/session';
import { createAllocationIntent, completeUserMockPayment } from '@/server/services/allocation';
import { isValidMockPaymentTransition } from '@/server/payments/mock-controls';

export async function createAllocationAction(poolSlug: string, formData: FormData) {
  const user = await requireUser();
  const amount = String(formData.get('amount') ?? '');
  const currency = String(formData.get('currency') ?? 'USDT');
  const network = String(formData.get('network') ?? 'TRON');
  const { payment } = await createAllocationIntent({ userId: user.id, poolSlug, amount, currency, network });
  redirect(`/payment/${payment.paymentReference}`);
}

export async function simulatePaymentAction(paymentReference: string, formData: FormData) {
  const user = await requireUser();
  const status = String(formData.get('status'));
  if (!isValidMockPaymentTransition(status)) throw new Error('Invalid mock payment transition.');
  await completeUserMockPayment(user.id, paymentReference, status);
  redirect(`/payment/${paymentReference}`);
}
