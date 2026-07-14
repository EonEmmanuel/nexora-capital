# Nexora Capital

Nexora Capital is a premium, PostgreSQL-backed Next.js App Router platform for crypto trading pool participation, mock crypto checkout, user portfolio dashboards, and fintech operations administration.

> Development/demo platform only. Cryptocurrency trading involves substantial risk. Past performance does not guarantee future results.

## Stack
- Next.js App Router + React + TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS v4 styling primitives
- Server Actions for authenticated mutations
- Signed HTTP-only application session cookie
- Mock crypto payment provider for local development
- Vitest for critical business-rule tests

## Main routes
### Public
`/`, `/pools`, `/pools/[slug]`, `/how-it-works`, `/security`, `/about`, `/faq`, `/contact`, `/auth/sign-in`, `/auth/sign-up`

### User
`/dashboard`, `/dashboard/pools`, `/dashboard/pools/[allocationId]`, `/dashboard/transactions`, `/dashboard/withdrawals`, `/dashboard/referrals`, `/dashboard/support`, `/dashboard/settings/profile`, `/dashboard/settings/security`, `/dashboard/settings/notifications`, `/dashboard/settings/preferences`

### Admin
`/admin`, `/admin/users`, `/admin/users/[id]`, `/admin/pools`, `/admin/pools/new`, `/admin/pools/[id]`, `/admin/allocations`, `/admin/payments`, `/admin/transactions`, `/admin/withdrawals`, `/admin/performance`, `/admin/support`, `/admin/referrals`, `/admin/audit-logs`, `/admin/settings`

## Environment variables
Copy `.env.example` to `.env` and update values as needed.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma. |
| `AUTH_SECRET` | Secret used to sign application session cookies. Replace before production. |
| `NEXT_PUBLIC_APP_URL` | Public app URL used for referral and navigation links. |
| `PAYMENT_PROVIDER` | `mock` for local development. Production adapters must be configured separately. |
| `NODE_ENV` | Runtime environment. |

## Local setup
```bash
# 1. Clone and enter the repository
git clone <repo-url>
cd nexora-capital

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Start local PostgreSQL
docker compose up -d

# 5. Format, validate, generate, migrate, and seed Prisma
npm run db:format
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed

# 6. Start development server
npm run dev
```

## Demo accounts
All demo accounts use the development-only password:

```text
DemoPassword123!
```

| Role | Email |
| --- | --- |
| SUPER_ADMIN | `admin@nexora.example` |
| ADMIN | `ops@nexora.example` |
| FINANCE | `finance@nexora.example` |
| SUPPORT | `support@nexora.example` |
| ANALYST | `analyst@nexora.example` |
| USER | `demo@nexora.example` |

Never use demo credentials in production.

## Mock payment flow
1. Sign in as `demo@nexora.example`.
2. Open `/pools` and choose an open pool.
3. Start checkout and submit a valid amount.
4. The server validates account status, pool status, minimum, maximum, and remaining capacity.
5. A pending allocation and mock payment intent are created.
6. Open the payment page and simulate `DETECTED`, `CONFIRMING`, then `COMPLETED`.
7. Completion is idempotent: the payment, allocation, ledger transaction, pool totals, and notification update through the server service.

## Withdrawal flow
1. User requests withdrawal from `/dashboard/withdrawals`.
2. Server calculates eligibility, subtracts pending withdrawals, calculates fee/net amount, and persists the request.
3. FINANCE/ADMIN/SUPER_ADMIN reviews from `/admin/withdrawals`.
4. Valid transitions create audit logs and user notifications.
5. No real blockchain transfer is performed by this demo implementation.

## Admin operations
The admin console is role-sensitive and server-enforced through centralized RBAC permissions. Sensitive operations create audit logs, including user status/role changes, pool changes, performance changes, payment actions, withdrawal review, support replies, and platform settings changes.

## Useful commands
```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run db:format
npm run db:validate
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
npm run db:reset
```

## Docker
`docker-compose.yml` starts a local PostgreSQL 16 instance on port `5432` with database/user/password `nexora`.

The `Dockerfile` builds the Next.js app and runs Prisma generation during the build. Production deployments should provide `DATABASE_URL` and secrets through a secure environment or secrets manager.

## Production checklist
- Replace `AUTH_SECRET` with a strong secret.
- Configure production PostgreSQL, backups, and migrations.
- Replace mock payment mode with a production payment provider adapter and signed webhooks.
- Add provider webhook idempotency processing and monitoring.
- Configure KYC/AML provider and jurisdiction-specific compliance workflows.
- Configure email delivery, rate limiting, error reporting, uptime monitoring, and audit retention.
- Review legal documents and risk disclosures with counsel.
- Disable demo accounts and mock payment controls.
- Run a security audit and penetration test before handling real funds.
