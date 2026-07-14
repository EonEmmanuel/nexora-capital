import { describe, expect, it } from 'vitest';
import { canAllocateToPool, calculateWithdrawalFee, canRequestWithdrawal } from '../src/server/services/rules';
import { hasPermission } from '../src/server/permissions/rbac';

describe('financial allocation rules', () => {
  it('rejects allocations below minimum', () => {
    expect(canAllocateToPool({ amount: '99', minimum: '100', maximum: '1000', capacity: '10000', allocated: '0', status: 'OPEN' }).ok).toBe(false);
  });
  it('rejects allocations above maximum', () => {
    expect(canAllocateToPool({ amount: '1500', minimum: '100', maximum: '1000', capacity: '10000', allocated: '0', status: 'OPEN' }).ok).toBe(false);
  });
  it('rejects allocations above remaining capacity', () => {
    expect(canAllocateToPool({ amount: '600', minimum: '100', maximum: '1000', capacity: '1000', allocated: '500', status: 'OPEN' }).ok).toBe(false);
  });
  it('rejects closed or paused pools', () => {
    expect(canAllocateToPool({ amount: '500', minimum: '100', maximum: '1000', capacity: '1000', allocated: '0', status: 'PAUSED' }).ok).toBe(false);
  });
  it('accepts a valid open-pool allocation', () => {
    expect(canAllocateToPool({ amount: '500', minimum: '100', maximum: '1000', capacity: '1000', allocated: '0', status: 'OPEN' }).ok).toBe(true);
  });
});

describe('withdrawal rules', () => {
  it('calculates withdrawal fees with Decimal', () => {
    expect(calculateWithdrawalFee('1000', '0.5').toString()).toBe('5');
  });
  it('rejects withdrawal requests above eligibility', () => {
    expect(canRequestWithdrawal('1001', '1000', '100')).toBe(false);
  });
  it('rejects withdrawal requests below minimum', () => {
    expect(canRequestWithdrawal('50', '1000', '100')).toBe(false);
  });
});

describe('RBAC', () => {
  it('blocks normal users from admin financial operations', () => {
    expect(hasPermission('USER', 'payments.manage')).toBe(false);
  });
  it('allows finance to review withdrawals but not manage settings', () => {
    expect(hasPermission('FINANCE', 'withdrawals.review')).toBe(true);
    expect(hasPermission('FINANCE', 'settings.manage')).toBe(false);
  });
  it('allows super admin full settings access', () => {
    expect(hasPermission('SUPER_ADMIN', 'settings.manage')).toBe(true);
  });
});
