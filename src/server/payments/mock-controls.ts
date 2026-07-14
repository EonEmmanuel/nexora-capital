export type MockPaymentTransition = 'DETECTED' | 'CONFIRMING' | 'COMPLETED';
export function mockPaymentControlsEnabled(env = process.env.NODE_ENV, provider = process.env.PAYMENT_PROVIDER) { return env !== 'production' && provider === 'mock'; }
export function assertMockPaymentControlsEnabled() { if (!mockPaymentControlsEnabled()) throw new Error('Mock payment controls are disabled.'); }
export function isValidMockPaymentTransition(status: string): status is MockPaymentTransition { return status === 'DETECTED' || status === 'CONFIRMING' || status === 'COMPLETED'; }
const userTransitions: Record<MockPaymentTransition | 'PENDING' | 'UNDER_REVIEW' | 'FAILED' | 'EXPIRED' | 'REFUNDED', readonly MockPaymentTransition[]> = {
  PENDING: ['DETECTED'],
  DETECTED: ['CONFIRMING'],
  CONFIRMING: ['COMPLETED'],
  COMPLETED: [],
  UNDER_REVIEW: [],
  FAILED: [],
  EXPIRED: [],
  REFUNDED: [],
};
export function canUserAdvanceMockPayment(currentStatus: string, nextStatus: MockPaymentTransition) {
  return (userTransitions[currentStatus as keyof typeof userTransitions] ?? []).includes(nextStatus);
}
