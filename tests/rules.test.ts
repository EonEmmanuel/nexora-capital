import { describe, expect, it } from 'vitest';
import { canAllocateToPool, calculateWithdrawalFee, canRequestWithdrawal } from '../src/server/services/rules';
import { canSearchResource, hasAnyAdminPermission, hasPermission } from '../src/server/permissions/rbac';
import { userOwnedActiveAllocationWhere, userOwnedTicketWhere } from '../src/server/permissions/ownership';

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

describe('RBAC and admin shell access', () => {
  it('allows analyst into the admin shell through legitimate admin permissions', () => {
    expect(hasAnyAdminPermission('ANALYST')).toBe(true);
  });
  it('blocks normal users from the admin shell and financial operations', () => {
    expect(hasAnyAdminPermission('USER')).toBe(false);
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

describe('admin search authorization', () => {
  it('prevents support from searching financial resources', () => {
    expect(canSearchResource('SUPPORT', 'users')).toBe(true);
    expect(canSearchResource('SUPPORT', 'allocations')).toBe(false);
    expect(canSearchResource('SUPPORT', 'payments')).toBe(false);
    expect(canSearchResource('SUPPORT', 'withdrawals')).toBe(false);
  });
  it('limits finance search to financial resources in its RBAC configuration', () => {
    expect(canSearchResource('FINANCE', 'allocations')).toBe(true);
    expect(canSearchResource('FINANCE', 'payments')).toBe(true);
    expect(canSearchResource('FINANCE', 'withdrawals')).toBe(true);
    expect(canSearchResource('FINANCE', 'users')).toBe(false);
  });
  it('allows super admin to search all supported resources', () => {
    expect(['users', 'allocations', 'payments', 'withdrawals', 'pools'].every((resource) => canSearchResource('SUPER_ADMIN', resource as never))).toBe(true);
  });
});

describe('object ownership query boundaries', () => {
  it('constrains user support replies to the owning user and ticket', () => {
    expect(userOwnedTicketWhere('user_a', 'ticket_1')).toEqual({ id: 'ticket_1', userId: 'user_a' });
  });
  it('constrains withdrawal allocations to active allocations owned by the user', () => {
    expect(userOwnedActiveAllocationWhere('user_a', 'allocation_1')).toEqual({ id: 'allocation_1', userId: 'user_a', status: 'ACTIVE' });
  });
});
