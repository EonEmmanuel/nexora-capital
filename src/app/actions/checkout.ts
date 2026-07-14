'use server';
import { redirect } from 'next/navigation';
import { requireUser } from '@/server/auth/session';
import { createAllocationIntent, completeMockPayment } from '@/server/services/allocation';

export async function createAllocationAction(poolSlug: string, formData: FormData) {
  const user = await requireUser();
  const amount = String(formData.get('amount') ?? '');
  const currency = String(formData.get('currency') ?? 'USDT');
  const network = String(formData.get('network') ?? 'TRON');
  const { payment } = await createAllocationIntent({ userId: user.id, poolSlug, amount, currency, network });
  redirect(`/payment/${payment.paymentReference}`);
}

export async function simulatePaymentAction(paymentReference: string, formData: FormData) {
  const status = String(formData.get('status')) as 'DETECTED' | 'CONFIRMING' | 'COMPLETED';
  await completeMockPayment(paymentReference, status);
  redirect(`/payment/${paymentReference}`);
}
