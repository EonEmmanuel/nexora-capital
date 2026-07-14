export type Role = 'USER' | 'SUPPORT' | 'ANALYST' | 'FINANCE' | 'ADMIN' | 'SUPER_ADMIN';
export type Permission =
  | 'users.read' | 'users.manage' | 'users.roles.manage'
  | 'pools.read' | 'pools.create' | 'pools.update' | 'pools.publish'
  | 'performance.read' | 'performance.manage' | 'allocations.read'
  | 'payments.read' | 'payments.manage' | 'withdrawals.read' | 'withdrawals.review'
  | 'support.read' | 'support.manage' | 'referrals.read' | 'settings.manage' | 'audit.read';
export type AdminSearchResource = 'users' | 'allocations' | 'payments' | 'withdrawals' | 'pools';
const all: Permission[] = ['users.read','users.manage','users.roles.manage','pools.read','pools.create','pools.update','pools.publish','performance.read','performance.manage','allocations.read','payments.read','payments.manage','withdrawals.read','withdrawals.review','support.read','support.manage','referrals.read','settings.manage','audit.read'];
export const ADMIN_AREA_PERMISSIONS: Permission[] = all;
export const adminSearchPermissions: Record<AdminSearchResource, Permission> = { users: 'users.read', allocations: 'allocations.read', payments: 'payments.read', withdrawals: 'withdrawals.read', pools: 'pools.read' };
export const rolePermissions: Record<Role, Permission[]> = {
  USER: ['pools.read'],
  SUPPORT: ['users.read','support.read','support.manage'],
  ANALYST: ['pools.read','pools.update','performance.read','performance.manage','allocations.read'],
  FINANCE: ['allocations.read','payments.read','payments.manage','withdrawals.read','withdrawals.review','audit.read'],
  ADMIN: all.filter((p) => !['users.roles.manage','settings.manage'].includes(p)),
  SUPER_ADMIN: all,
};
export function hasPermission(role: Role, permission: Permission) { return rolePermissions[role]?.includes(permission) ?? false; }
export function hasAnyPermission(role: Role, permissions: readonly Permission[]) { return permissions.some((permission) => hasPermission(role, permission)); }
export function hasAnyAdminPermission(role: Role) { return role !== 'USER' && hasAnyPermission(role, ADMIN_AREA_PERMISSIONS); }
export function canSearchResource(role: Role, resource: AdminSearchResource) { return hasPermission(role, adminSearchPermissions[resource]); }
export function requirePermission(role: Role, permission: Permission) { if (!hasPermission(role, permission)) throw new Error(`Forbidden: missing ${permission}`); }
export function visibleAdminNav(role: Role) { return [
  ['/admin','Overview','audit.read'],['/admin/users','Users','users.read'],['/admin/pools','Trading Pools','pools.read'],['/admin/allocations','Allocations','allocations.read'],['/admin/payments','Payments','payments.read'],['/admin/transactions','Transactions','allocations.read'],['/admin/withdrawals','Withdrawals','withdrawals.read'],['/admin/performance','Performance','performance.read'],['/admin/support','Support','support.read'],['/admin/referrals','Referrals','referrals.read'],['/admin/audit-logs','Audit Logs','audit.read'],['/admin/settings','Platform Settings','settings.manage'],
].filter(([, , permission]) => hasPermission(role, permission as Permission)); }
