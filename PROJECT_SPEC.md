You are a senior staff-level software engineer, fintech product architect, UI/UX designer, security-minded backend engineer, and technical lead.

Your task is to DESIGN AND BUILD a COMPLETE, PREMIUM, PRODUCTION-QUALITY full-stack web platform for a cryptocurrency trading pool business.

This is not a landing-page-only project.

This must be a genuinely functional full-stack application with:

* A premium public marketing website
* Authentication
* User onboarding
* User dashboard
* Crypto trading pool marketplace
* Pool detail pages
* Pool participation / subscription flow
* Payment and checkout system
* User investments / allocations
* Performance tracking
* Profit and loss reporting
* Transaction history
* Deposit records
* Withdrawal requests
* Notifications
* KYC-ready account architecture
* Support/ticket system
* Referral system architecture
* Complete admin dashboard
* User management
* Pool management
* Payment management
* Transaction management
* Withdrawal approval workflow
* CMS-style content controls where appropriate
* Audit logs
* Role-based access control
* Real database persistence
* Real frontend-to-backend integration
* Seed/demo data
* Clear instructions for running the complete project locally

The design quality should feel comparable to premium modern fintech and proprietary trading platforms such as FTMO, FundedNext, and FundingPips in terms of:

* Professional visual hierarchy
* Premium typography
* Strong conversion-oriented landing pages
* Sophisticated dashboards
* Financial data visualization
* Clean account management
* Excellent responsive behavior
* Trust-building design
* High-end motion and micro-interactions
* Polished checkout experience
* Beautiful dark-mode fintech aesthetic

HOWEVER:

DO NOT copy any existing platform.

Do not copy:

* Their logos
* Their exact layouts
* Their exact text
* Their brand colors
* Their proprietary illustrations
* Their component designs pixel-for-pixel
* Their trade names
* Their intellectual property

The result must have its own original identity.

The goal is:

"Build an original crypto trading pool platform with the product quality, polish, usability, credibility, and sophistication expected from a world-class fintech/trading platform."

---

# 1. PROJECT WORKING NAME

Use the temporary working brand:

NEXORA CAPITAL

The branding architecture must make it easy to rename the product globally later.

Centralize brand information in one configuration file.

Example:

src/config/brand.ts

The following values should be configurable:

* Company name
* Short company name
* Logo
* Favicon
* Support email
* Company email
* Social media links
* Primary domain
* Legal company name
* Address
* Primary colors
* Currency display settings
* Platform fee settings
* Minimum investment
* Withdrawal limits
* Maintenance mode

Do not hardcode "Nexora Capital" throughout dozens of files.

---

# 2. PRODUCT CONCEPT

Nexora Capital is a premium cryptocurrency trading pool platform.

Users create an account and participate in professionally managed cryptocurrency trading pools.

Conceptually:

1. The platform creates different trading pools.
2. Each trading pool has its own:

   * Name
   * Strategy
   * Risk level
   * Target or historical performance presentation
   * Minimum allocation
   * Maximum allocation
   * Pool capacity
   * Current amount allocated
   * Supported settlement currency
   * Duration or flexible term
   * Profit-sharing structure
   * Management fee
   * Status
3. Users select a pool.
4. Users choose the amount they want to allocate.
5. Users complete checkout/payment.
6. The allocation becomes:

   * Pending payment
   * Payment detected
   * Under review if necessary
   * Active
   * Matured
   * Withdrawn
   * Cancelled
7. Users monitor:

   * Allocated capital
   * Current value
   * Realized P&L
   * Unrealized P&L
   * Historical performance
   * Pool performance
   * Profit distributions
   * Transactions
8. Users can request eligible withdrawals.
9. Administrators control and manage pools, payments, users, withdrawals, performance data, platform content, and operational settings.

IMPORTANT PRODUCT AND LEGAL DESIGN PRINCIPLE:

Do not build the UI around guaranteed profits.

Never present returns as guaranteed.

The interface must support configurable risk disclosures such as:

"Cryptocurrency trading involves substantial risk. Past performance does not guarantee future results."

Performance metrics must distinguish between:

* Historical performance
* Simulated performance, when applicable
* Current performance
* Target metrics, when applicable

Never intentionally create deceptive fake trading activity or misleading profit claims.

Build a legitimate platform architecture.

---

# 3. FIRST ACTION: INSPECT THE EXISTING PROJECT

Before writing code:

1. Inspect the complete repository.
2. Determine whether this is:

   * An empty project
   * An existing Next.js project
   * A partially implemented application
3. Inspect:

   * package.json
   * Existing routes
   * Existing components
   * Database configuration
   * Environment files
   * Authentication
   * Styling
   * Existing dependencies
4. Preserve useful existing work.
5. Do not unnecessarily rewrite functional code.
6. Create a clear implementation strategy based on the repository.

Then begin implementation.

Do not stop after giving me a plan.

Actually implement the application.

Continue working through the application systematically.

---

# 4. TECHNOLOGY STACK

Use a modern, production-oriented stack.

## Core

* Next.js using the App Router
* TypeScript
* Strict TypeScript configuration
* React
* PostgreSQL
* Prisma ORM
* Tailwind CSS
* shadcn/ui as a component foundation

Use the latest stable mutually compatible versions available in the project environment.

Do not blindly install conflicting packages.

Check compatibility first.

---

# 5. SUPPORTING LIBRARIES

Use appropriate high-quality libraries where they genuinely improve the application.

Recommended architecture:

## UI

* shadcn/ui
* Radix UI primitives where necessary
* Lucide React for icons
* Framer Motion / Motion for selective animation

## Forms

* React Hook Form
* Zod

## Data tables

* TanStack Table

## Charts

Use a professional charting solution such as:

* Recharts

or another mature React-compatible chart library if there is a strong technical reason.

Charts must be responsive and visually integrated into the design system.

## Dates

* date-fns

## Authentication

Use a secure modern authentication implementation suitable for Next.js.

Preferred options:

* Auth.js

or another mature authentication library already present in the repository.

Authentication must support:

* Email/password
* Secure password hashing
* Session management
* Optional OAuth-ready architecture
* Role-based authorization

## Password hashing

Use a secure password-hashing algorithm/library.

Never store plaintext passwords.

## Validation

Use Zod for validation at system boundaries.

Validate:

* Form input
* API input
* Query parameters
* Environment variables where appropriate

---

# 6. APPLICATION ARCHITECTURE

Build this as a modular monolith.

Do NOT begin with unnecessary microservices.

The architecture should be scalable enough that certain domains could later be extracted into independent services.

Recommended high-level structure:

src/
app/
(marketing)/
(auth)/
(dashboard)/
admin/
api/

components/
ui/
marketing/
dashboard/
admin/
charts/
forms/
shared/

features/
auth/
users/
pools/
allocations/
payments/
transactions/
withdrawals/
notifications/
referrals/
support/
admin/
audit/

server/
db/
auth/
services/
repositories/
permissions/
payments/
notifications/
jobs/

lib/
hooks/
types/
config/
constants/
styles/

Do not create meaningless abstractions.

Use clear domain separation.

Business logic should not live randomly inside React components.

React components should not directly contain complex database operations.

Create service-layer boundaries for important operations.

For example:

PoolService

AllocationService

PaymentService

WithdrawalService

TransactionService

AdminService

NotificationService

AuditService

---

# 7. FRONTEND/BACKEND COMMUNICATION

The frontend must be connected to the real backend.

Do not build a dashboard consisting entirely of hardcoded arrays.

Use real database-backed data.

Use the most appropriate Next.js patterns for each operation.

Possible approaches include:

* Server Components for server-rendered data
* Server Actions for appropriate mutations
* Route Handlers for API endpoints
* Client Components only when browser interactivity requires them

Do not unnecessarily convert the entire application into Client Components.

Keep `"use client"` scoped.

Implement loading states.

Implement empty states.

Implement error states.

Implement proper mutation feedback.

Implement toast notifications where appropriate.

---

# 8. DATABASE

Use PostgreSQL.

Use Prisma ORM.

Create a complete schema.

At minimum, model the following domains.

---

## USER

Fields should include approximately:

* id
* firstName
* lastName
* email
* emailVerified
* passwordHash
* avatarUrl
* phone
* country
* timezone
* preferredCurrency
* status
* role
* kycStatus
* twoFactorEnabled
* referralCode
* referredById
* createdAt
* updatedAt
* lastLoginAt

Possible statuses:

* ACTIVE
* SUSPENDED
* PENDING
* RESTRICTED

Roles:

* USER
* SUPPORT
* ANALYST
* FINANCE
* ADMIN
* SUPER_ADMIN

Do not rely only on hiding buttons in the frontend.

Authorization must also be enforced on the backend.

---

## TRADING_POOL

Possible fields:

* id
* slug
* name
* shortDescription
* fullDescription
* strategyDescription
* riskLevel
* status
* featured
* baseCurrency
* minimumAllocation
* maximumAllocation
* totalCapacity
* currentlyAllocated
* managementFeePercent
* performanceFeePercent
* durationDays
* flexibleDuration
* startDate
* endDate
* heroImage
* icon
* displayOrder
* createdAt
* updatedAt

Pool statuses:

* DRAFT
* UPCOMING
* OPEN
* FULL
* PAUSED
* CLOSED
* ARCHIVED

Risk levels:

* CONSERVATIVE
* MODERATE
* BALANCED
* AGGRESSIVE
* HIGH_RISK

---

## POOL_PERFORMANCE

Store time-series performance data.

Possible fields:

* id
* poolId
* date
* nav
* dailyReturnPercent
* cumulativeReturnPercent
* benchmarkReturnPercent
* drawdownPercent
* assetsUnderManagement
* createdAt

The dashboard should use these records to generate charts.

---

## ALLOCATION

This represents a user's participation in a pool.

Fields:

* id
* userId
* poolId
* reference
* amount
* currency
* status
* initialValue
* currentValue
* realizedProfit
* unrealizedProfit
* totalDistributed
* activatedAt
* maturedAt
* cancelledAt
* createdAt
* updatedAt

Statuses:

* CREATED
* PAYMENT_PENDING
* PAYMENT_DETECTED
* UNDER_REVIEW
* ACTIVE
* PAUSED
* MATURED
* WITHDRAWAL_PENDING
* CLOSED
* CANCELLED

---

## PAYMENT

Fields:

* id
* userId
* allocationId
* paymentReference
* provider
* method
* requestedAmount
* receivedAmount
* currency
* network
* walletAddress
* transactionHash
* status
* confirmations
* metadata
* expiresAt
* paidAt
* createdAt
* updatedAt

Possible statuses:

* PENDING
* DETECTED
* CONFIRMING
* COMPLETED
* UNDER_REVIEW
* FAILED
* EXPIRED
* REFUNDED

---

## TRANSACTION

Create a ledger-style transaction model.

Types:

* DEPOSIT
* ALLOCATION
* PROFIT
* LOSS
* FEE
* PROFIT_DISTRIBUTION
* WITHDRAWAL
* REFUND
* ADJUSTMENT

Fields:

* id
* userId
* allocationId
* type
* amount
* currency
* status
* reference
* description
* metadata
* createdAt

Never rely solely on a single "wallet balance" number without a transaction trail.

---

## WITHDRAWAL

Fields:

* id
* userId
* allocationId
* reference
* amount
* fee
* netAmount
* currency
* network
* destinationAddress
* transactionHash
* status
* rejectionReason
* reviewedById
* requestedAt
* reviewedAt
* completedAt
* createdAt
* updatedAt

Statuses:

* REQUESTED
* UNDER_REVIEW
* APPROVED
* PROCESSING
* COMPLETED
* REJECTED
* CANCELLED

---

## NOTIFICATION

Fields:

* id
* userId
* title
* message
* type
* read
* actionUrl
* createdAt

Notification types:

* INFO
* SUCCESS
* WARNING
* ERROR
* PAYMENT
* WITHDRAWAL
* SECURITY
* POOL
* SYSTEM

---

## SUPPORT_TICKET

Fields:

* id
* userId
* subject
* category
* priority
* status
* assignedToId
* createdAt
* updatedAt
* closedAt

Create SUPPORT_MESSAGE as a separate model.

---

## REFERRAL

Design referral tracking cleanly.

Track:

* Referrer
* Referred user
* Conversion status
* Reward amount
* Reward status
* Created date

---

## AUDIT_LOG

Critical administrative operations must create audit logs.

Fields:

* id
* actorId
* action
* entityType
* entityId
* description
* ipAddress where available
* userAgent where available
* metadata
* createdAt

Audit actions should include:

* User status changes
* Role changes
* Pool creation
* Pool updates
* Performance edits
* Payment status changes
* Manual payment approvals
* Withdrawal approvals
* Withdrawal rejections
* Administrative balance adjustments
* Platform setting changes

Audit records should not be casually editable.

---

## PLATFORM_SETTING

Create a database-backed configuration system for operational settings.

Examples:

* Minimum withdrawal
* Withdrawal fee
* Platform maintenance mode
* Registration enabled
* KYC required before withdrawal
* Support email
* Referral reward rules
* Default currency
* Crypto payment configuration metadata
* Legal disclosure version

Do not store secrets in this table.

Secrets remain in environment variables.

---

# 9. PUBLIC WEBSITE

The public site must feel exceptional.

Do not make a generic SaaS template.

The design should immediately communicate:

* Finance
* Technology
* Crypto
* Security
* Performance
* Professional asset management
* Trust
* Exclusivity

The design must be premium without becoming visually noisy.

---

# 10. VISUAL DIRECTION

Create a sophisticated visual identity.

Suggested direction:

Primary background:

* Near-black
* Deep charcoal
* Subtle midnight blue undertones

Primary brand accent:

* Electric emerald
  OR
* Sophisticated teal-green

Secondary accents:

* Cool cyan
* Muted blue
* Very subtle violet where appropriate

Text:

* Warm off-white
* High-contrast primary text
* Muted gray secondary text

Use gradients carefully.

Avoid:

* Cheap rainbow gradients
* Excessive glowing
* Excessive glassmorphism
* Cartoonish crypto imagery
* Generic Bitcoin clipart everywhere
* Too many colors
* Giant neon borders around every component

The result should feel:

"Bloomberg-terminal precision meets premium modern fintech."

---

# 11. DESIGN SYSTEM

Create reusable design tokens.

Define:

* Colors
* Background layers
* Surface colors
* Border colors
* Text colors
* Accent colors
* Success
* Warning
* Error
* Info
* Chart colors
* Radius scale
* Shadow scale
* Spacing conventions

Create visual hierarchy such as:

Background level 0:
Main application background

Background level 1:
Cards

Background level 2:
Elevated cards / dropdowns

Background level 3:
Modals / command surfaces

Use subtle borders rather than excessive shadows.

Use intentional whitespace.

---

# 12. TYPOGRAPHY

Choose a professional modern font combination.

For example:

* Geist
* Inter
* Manrope

Use one primary UI font unless a second display font creates genuine value.

Financial numbers should align cleanly.

Where useful, use tabular numeric styling.

Large financial metrics should be easy to scan.

---

# 13. ANIMATION

Use animation selectively.

Good animations:

* Hero background movement
* Soft reveal animations
* Counter transitions
* Chart transitions
* Button feedback
* Card hover transitions
* Drawer transitions
* Sidebar transitions
* Modal transitions
* Progress indicators
* Success states

Avoid:

* Animating every element
* Long animations
* Motion that delays interaction
* Excessive parallax
* Performance-heavy effects

Respect:

prefers-reduced-motion

---

# 14. MARKETING WEBSITE ROUTES

Create:

/
Homepage

/how-it-works

/pools

/pools/[slug]

/about

/security

/faq

/contact

/blog architecture or placeholder-ready structure

/legal/terms

/legal/privacy

/legal/risk-disclosure

/auth/sign-in

/auth/sign-up

/auth/forgot-password

/auth/reset-password

/checkout/[poolSlug]

---

# 15. HOMEPAGE

The homepage must be a serious conversion-focused premium landing page.

Suggested structure:

## Announcement bar

Optional configurable banner.

Examples:

* New pool launch
* Platform update
* Limited pool capacity

---

## Premium navigation

Desktop navigation:

* Logo
* Trading Pools
* How It Works
* Performance
* Security
* Company
* Sign In
* Primary CTA: Explore Pools

Sticky on scroll.

Use subtle background blur after scroll.

Mobile:
Beautiful slide-over menu.

---

## Hero

Strong original headline.

Example direction:

"Capital moves differently when strategy meets discipline."

Supporting text explaining the trading pool concept.

Primary CTA:

Explore Trading Pools

Secondary CTA:

How It Works

Include an original animated financial visualization.

Ideas:

* Abstract trading terminal
* Portfolio growth visualization
* Floating market metrics
* Dynamic line graph
* Pool capacity metrics

Do not use random stock photos.

---

## Trust / platform metrics

Example data:

* Assets allocated
* Active participants
* Trading pools
* Countries represented

These values must come from configurable content or real database aggregations.

For a new deployment, use clearly marked demo content where necessary.

---

## How it works

Beautiful 3-4 step flow:

1. Create your account
2. Choose a trading pool
3. Allocate capital
4. Track performance

---

## Featured pools

Show premium pool cards.

Each card should display:

* Pool name
* Risk badge
* Short strategy
* Minimum allocation
* Capacity utilization
* Historical performance metric
* Duration
* Status
* CTA

Clearly label performance types.

---

## Performance visualization

Use sophisticated charts.

Show:

* Historical platform or pool performance
* Monthly performance
* Drawdown
* AUM where appropriate

Include disclaimers.

---

## Why Nexora

Possible pillars:

* Transparent performance reporting
* Structured risk management
* Secure transaction tracking
* Professional portfolio oversight

---

## Security section

Highlight:

* Account protection
* Secure password handling
* Session controls
* Withdrawal verification
* Audit trails
* Platform monitoring

Do not claim certifications that do not exist.

---

## Testimonials

Create a component architecture for testimonials.

Demo content must be clearly identifiable as seed/demo content in development.

Do not create fake regulatory endorsements.

---

## FAQ

Accordion.

---

## Final CTA

Premium high-impact section.

---

## Footer

Include:

* Product
* Company
* Support
* Legal
* Social links
* Risk disclosure
* Copyright

---

# 16. TRADING POOLS MARKETPLACE

Route:

/pools

Create a premium browsing experience.

Features:

* Search
* Status filters
* Risk filters
* Duration filters
* Minimum allocation filters
* Sort by:

  * Featured
  * Newest
  * Capacity
  * Performance where appropriate
  * Minimum allocation

Pool cards should feel comparable to premium investment products.

Provide:

* Risk level
* Strategy
* Duration
* Minimum
* Capacity
* Performance
* Fee information
* Status

Use skeleton loading.

Use empty states.

---

# 17. POOL DETAIL PAGE

Route:

/pools/[slug]

This should be one of the best pages in the application.

Include:

## Hero

* Pool name
* Status
* Risk
* Strategy
* Minimum allocation
* Duration
* Capacity
* Primary CTA

## Performance summary

* Current period
* Since inception
* Best month
* Maximum drawdown
* AUM

## Interactive performance chart

Time ranges:

* 7D
* 1M
* 3M
* 6M
* 1Y
* ALL

## Strategy explanation

## Risk framework

## Fee structure

## Pool statistics

## Capacity visualization

## Historical monthly performance table

## FAQ specific to the pool

## Risk disclosure

## Sticky investment CTA on suitable screen sizes

---

# 18. AUTHENTICATION

Create premium auth pages.

Sign up:

* First name
* Last name
* Email
* Password
* Confirm password
* Terms acceptance

Sign in:

* Email
* Password
* Remember me if supported correctly
* Forgot password
* OAuth-ready design

Implement secure authentication.

Create protected route handling.

Redirect authenticated users appropriately.

Redirect unauthorized users.

Implement role checks.

Do not rely on client-side authorization only.

---

# 19. USER ONBOARDING

After registration, create a short onboarding experience.

Possible steps:

1. Welcome
2. Basic profile
3. Country and preferences
4. Risk acknowledgement
5. Optional KYC preparation
6. Explore first pool

Show progress.

Allow users to leave and resume.

---

# 20. USER DASHBOARD

Protected route:

/dashboard

Create a premium financial command center.

Desktop:

Collapsible sidebar.

Top bar:

* Search or command functionality
* Notifications
* User menu

Sidebar:

* Overview
* My Pools
* Explore Pools
* Transactions
* Withdrawals
* Referrals
* Support
* Settings

---

# 21. DASHBOARD OVERVIEW

Top metrics:

* Total allocated capital
* Current portfolio value
* Total return
* Available distributions / balance
* Active pools

Show percentage changes where appropriate.

Main portfolio performance chart.

Time filters.

Asset / pool allocation visualization.

Active pool cards.

Recent transactions.

Recent notifications.

Quick actions:

* Explore Pools
* Add Allocation
* Request Withdrawal
* Contact Support

Do not overload the page.

Prioritize hierarchy.

---

# 22. MY POOLS

Route:

/dashboard/pools

Show all user allocations.

Tabs:

* All
* Active
* Pending
* Matured
* Closed

Each allocation shows:

* Pool
* Allocation reference
* Initial allocation
* Current value
* Profit/loss
* Start date
* Status
* CTA

Create detailed allocation page:

/dashboard/pools/[allocationId]

Include:

* Overview
* Performance chart
* Transaction activity
* Distribution history
* Pool information
* Important dates
* Withdrawal eligibility

---

# 23. CHECKOUT EXPERIENCE

Route:

/checkout/[poolSlug]

This is critical.

Create a world-class fintech checkout.

Steps:

1. Select amount
2. Review pool terms
3. Select payment method
4. Generate payment instructions
5. Detect / confirm payment
6. Success

Use a visual stepper.

---

## Amount selection

Display:

* Minimum
* Maximum
* Available pool capacity
* Selected allocation
* Fees
* Total payment

Use properly formatted decimals.

Never perform financial calculations using unsafe floating-point assumptions.

Use decimal-safe handling.

---

## Payment methods

Create an extensible provider architecture.

Initial payment methods may include:

* USDT
* USDC
* BTC
* ETH

Networks should be configurable.

Examples:

* Ethereum
* Tron
* BNB Smart Chain
* Polygon
* Solana

Do not hardcode network assumptions into business logic.

The admin should eventually be able to enable/disable payment assets and networks.

---

# 24. CRYPTO PAYMENT ARCHITECTURE

Create a PaymentProvider abstraction.

Example conceptual interface:

createPaymentIntent()
getPaymentStatus()
verifyWebhook()
expirePayment()
refundPayment() where provider supports it

Create a development/demo payment provider.

The local project must work without requiring a real payment provider.

In development:

* Generate a mock payment intent
* Show a demo wallet address
* Allow an admin/dev simulation of payment detection
* Update payment status
* Activate allocation after completion

Clearly label development payment simulation.

Never expose secret keys to the browser.

Design production provider adapters so a real crypto payment gateway can later be integrated.

Potential future providers should be pluggable.

---

# 25. PAYMENT PAGE

The payment screen should include:

* Amount
* Currency
* Network
* Wallet address
* QR code
* Copy address button
* Copy amount button
* Expiration timer
* Payment status
* Confirmation progress
* Transaction hash when detected
* Important network warning

Example warning:

"Only send USDT using the selected network. Funds sent using an unsupported asset or network may be unrecoverable."

Payment state should update without a full page reload.

Use polling or an appropriate real-time mechanism.

Architecture should later support webhooks.

---

# 26. TRANSACTIONS

Route:

/dashboard/transactions

Professional financial table.

Columns:

* Date
* Reference
* Type
* Pool
* Amount
* Currency
* Status

Features:

* Search
* Filters
* Date range
* Pagination
* Mobile responsive cards
* Transaction details drawer/modal

---

# 27. WITHDRAWALS

Route:

/dashboard/withdrawals

Show:

* Available eligible amount
* Pending withdrawals
* Completed withdrawals
* Withdrawal history

Withdrawal request form:

* Amount
* Asset
* Network
* Address
* Confirmation

Require deliberate confirmation.

Architecture should support:

* KYC requirement
* 2FA requirement
* Manual review
* Risk flags
* Withdrawal limits

For development:

Implement an approval workflow.

Do NOT automatically send real blockchain transactions.

The initial version should model and manage withdrawal requests.

Actual blockchain execution should be a future provider/module.

---

# 28. SETTINGS

Routes:

/dashboard/settings/profile

/dashboard/settings/security

/dashboard/settings/notifications

/dashboard/settings/preferences

Profile:

* Name
* Avatar
* Phone
* Country
* Timezone

Security:

* Password change
* Session information
* 2FA-ready architecture
* Security activity

Notifications:

* Email preferences
* Product notifications
* Security notifications

---

# 29. REFERRAL SYSTEM

Route:

/dashboard/referrals

Show:

* Referral code
* Referral URL
* Total referrals
* Qualified referrals
* Pending rewards
* Paid rewards

Create referral history table.

Make reward rules configurable.

Do not hardcode misleading commission promises.

---

# 30. SUPPORT

Route:

/dashboard/support

Features:

* Create ticket
* View tickets
* Ticket status
* Priority
* Category
* Conversation thread

Admin/support team can reply.

User can see responses.

Possible categories:

* Account
* Payment
* Withdrawal
* Pool
* Technical
* Other

---

# 31. ADMIN DASHBOARD

Protected route:

/admin

Only authorized roles.

Create an entirely professional operations dashboard.

It should feel like a real fintech operations console, not a basic CRUD admin template.

Admin navigation:

* Overview
* Users
* Trading Pools
* Allocations
* Payments
* Transactions
* Withdrawals
* Performance
* Support
* Referrals
* Notifications
* Audit Logs
* Platform Settings

Role-sensitive navigation.

---

# 32. ADMIN OVERVIEW

Show operational KPIs:

* Total registered users
* Active users
* New users
* Total allocations
* Active capital
* Pool utilization
* Pending payments
* Pending withdrawals
* Payment volume
* Withdrawal volume
* Open support tickets

Charts:

* Allocation growth
* User growth
* Payment volume
* Pool distribution

Operational alerts:

* Pending withdrawals
* Failed payments
* Pools nearing capacity
* Suspicious activity placeholders
* Open urgent tickets

Recent admin activity.

---

# 33. USER MANAGEMENT

Route:

/admin/users

Professional data table.

Columns:

* User
* Email
* Country
* Role
* Status
* KYC
* Allocated capital
* Joined
* Last active

Filters:

* Status
* Role
* Country
* KYC
* Registration date

Search.

User detail:

/admin/users/[id]

Tabs:

* Overview
* Allocations
* Transactions
* Payments
* Withdrawals
* Support
* Security
* Audit activity

Admin actions depending on role:

* Suspend
* Reactivate
* Restrict
* Change role
* Update KYC status
* Add internal note

Sensitive actions require confirmation.

Important actions create audit logs.

---

# 34. POOL MANAGEMENT

Route:

/admin/pools

Admin can:

* Create pool
* Edit pool
* Save draft
* Publish pool
* Pause pool
* Close pool
* Archive pool
* Feature pool
* Change capacity
* Configure fees
* Configure limits
* Change display order

Create a premium multi-section pool editor.

Sections:

* Basic information
* Strategy
* Financial configuration
* Capacity
* Risk
* Duration
* Fees
* Marketing content
* Status
* SEO

Validation required.

---

# 35. PERFORMANCE MANAGEMENT

Route:

/admin/performance

Admins with appropriate permission can:

* Select pool
* Add daily/monthly performance entries
* Update performance
* Import historical values through a safe structured process
* View chart preview

All material performance modifications should be auditable.

Do not allow random performance values to be silently changed without a record.

---

# 36. PAYMENT ADMINISTRATION

Route:

/admin/payments

Filters:

* Status
* Asset
* Network
* Date
* User

Payment details:

* Reference
* User
* Amount
* Currency
* Network
* Address
* Transaction hash
* Confirmations
* Related allocation
* Timeline

Admin development actions:

* Simulate payment detected
* Simulate confirmation
* Mark under review

Production manual status changes must:

* Require permission
* Require confirmation
* Create audit log

---

# 37. WITHDRAWAL ADMINISTRATION

Route:

/admin/withdrawals

This is a high-risk operational screen.

Show:

* User
* Amount
* Asset
* Network
* Address
* Request date
* KYC status
* Status

Withdrawal detail should display:

* Complete request
* User information
* Allocation information
* Transaction history
* Previous withdrawals
* Risk flags placeholder
* Internal notes

Actions:

* Approve
* Reject
* Mark processing
* Complete

Require confirmation.

Require rejection reason.

Audit everything.

Never perform an actual blockchain transfer automatically in the initial implementation.

---

# 38. ADMIN SUPPORT SYSTEM

Route:

/admin/support

Queue-style interface.

Filters:

* Open
* Pending
* Resolved
* Closed
* Priority
* Assigned team member

Support agent can:

* Open ticket
* Reply
* Assign
* Change status
* Add internal notes if implemented safely

---

# 39. AUDIT LOG VIEWER

Route:

/admin/audit-logs

Columns:

* Timestamp
* Actor
* Action
* Entity
* Description

Filters:

* Actor
* Action
* Entity type
* Date

Audit records must be read-only from normal admin UI.

---

# 40. PLATFORM SETTINGS

Route:

/admin/settings

Sections:

* General
* Branding
* Registration
* Investment/allocation rules
* Withdrawal rules
* Payment configuration
* Notifications
* Maintenance

Be careful:

Do not put API secret keys directly into normal client-rendered forms unless there is a secure server-only encrypted architecture.

For local development, provider secrets belong in .env.

---

# 41. ROLE-BASED ACCESS CONTROL

Implement a clean permissions system.

Do not scatter checks like:

if (user.role === "ADMIN")

through hundreds of files.

Create centralized permission helpers.

Example conceptual permissions:

users.read
users.manage
pools.read
pools.create
pools.update
payments.read
payments.manage
withdrawals.read
withdrawals.review
support.read
support.manage
settings.manage
audit.read

Map roles to permissions.

SUPER_ADMIN:
All permissions

ADMIN:
Most operational permissions

FINANCE:
Payments and withdrawals

SUPPORT:
Users and support with limited sensitive access

ANALYST:
Pool performance and analytics

USER:
User-side access only

Backend authorization is mandatory.

---

# 42. SECURITY REQUIREMENTS

Treat this as a financial application.

Implement or prepare architecture for:

* Secure authentication
* Secure password hashing
* Server-side authorization
* Zod validation
* Rate limiting architecture
* Secure environment variables
* HTTP security headers
* CSRF protection where architecture requires it
* XSS-conscious output handling
* No secrets in client bundles
* Database access only from server code
* Secure cookies
* Production HTTPS assumptions
* Sensitive admin action confirmation
* Audit logs
* Withdrawal workflow controls
* Payment webhook signature verification architecture
* Idempotency for payment webhooks
* Idempotency for financial mutations

Financial operations must be transactional where appropriate.

Avoid race conditions.

Example:

A payment confirmation must not activate the same allocation twice.

A webhook received twice must not create duplicate transactions.

A withdrawal must not be approved twice.

Use unique constraints and database transactions.

---

# 43. MONEY HANDLING

Do not use JavaScript floating-point numbers carelessly for financial values.

Use:

* PostgreSQL Decimal/Numeric
* Prisma Decimal where appropriate

Create money utilities.

Always track:

* Amount
* Currency

Format money consistently.

Do not assume all cryptocurrencies have exactly two decimal places.

---

# 44. PAYMENT WEBHOOK ARCHITECTURE

Prepare secure webhook endpoints.

Example:

/api/webhooks/payments/[provider]

Requirements:

* Validate provider
* Verify signature
* Parse payload
* Enforce idempotency
* Store useful event data where appropriate
* Update payment
* Create transaction
* Activate allocation when conditions are satisfied
* Log errors safely

Never trust client-side claims that payment was completed.

---

# 45. DEMO PAYMENT MODE

The application must run completely locally.

Create:

PAYMENT_PROVIDER=mock

In mock mode:

1. User creates allocation.
2. Mock payment intent is generated.
3. Checkout displays test payment instructions.
4. Admin or development simulation can mark payment:

   * Detected
   * Confirmed
5. Backend updates payment.
6. Allocation becomes active.
7. Transaction ledger is updated.
8. User dashboard reflects the new allocation.

This must work end-to-end.

---

# 46. MOCK PERFORMANCE ENGINE

For development only, create seeded performance history.

Do not randomly change balances every page refresh.

Seed deterministic historical data.

Make it realistic enough to showcase charts.

Clearly separate:

* Seed data
* Production data

Optionally create a development-only script to generate additional performance records.

---

# 47. NOTIFICATION SYSTEM

Create in-app notifications.

Triggers may include:

* Registration completed
* Payment detected
* Payment confirmed
* Allocation activated
* Pool update
* Withdrawal requested
* Withdrawal approved
* Withdrawal rejected
* Support reply
* Security alert

Create:

* Notification dropdown
* Notification page or panel
* Mark as read
* Mark all as read

Prepare architecture for future email delivery.

Do not require external email credentials for the local app to work.

---

# 48. RESPONSIVE DESIGN

The entire application must work on:

* Large desktop
* Laptop
* Tablet
* Mobile

Do not merely shrink desktop tables.

For mobile:

* Convert complex tables into cards when appropriate
* Use drawers/sheets
* Make charts responsive
* Ensure navigation is usable
* Maintain touch target sizes
* Prevent horizontal overflow

Test important viewport widths.

---

# 49. ACCESSIBILITY

Implement:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Proper labels
* Accessible form errors
* Accessible dialogs
* Adequate contrast
* Reduced-motion support
* ARIA only where necessary

Do not sacrifice accessibility for visual effects.

---

# 50. PERFORMANCE

The application must feel fast.

Use:

* Server Components where appropriate
* Streaming/loading boundaries where useful
* Dynamic imports for heavy client-only modules where appropriate
* Image optimization
* Font optimization
* Route-level loading states
* Efficient database queries
* Pagination
* Selective data fetching

Avoid:

* Massive client bundles
* Making the entire dashboard `"use client"`
* Loading every transaction at once
* Fetching unnecessary fields
* Repeated identical database queries

---

# 51. SEO

Marketing pages should include:

* Metadata
* Title templates
* Descriptions
* Open Graph configuration
* Twitter metadata where appropriate
* Sitemap
* Robots configuration
* Canonical architecture where appropriate

Dashboard/admin pages should not be treated as public SEO pages.

---

# 52. ERROR HANDLING

Create professional error experiences.

Include:

* 404
* Unauthorized
* Forbidden
* Generic application error
* Empty state
* Network failure
* Failed mutation
* Payment failure
* Expired payment

Do not expose server stack traces to end users.

Log useful information server-side.

---

# 53. COMPONENT QUALITY

Build reusable components such as:

* PageHeader
* StatCard
* MetricCard
* DataTable
* StatusBadge
* RiskBadge
* CurrencyAmount
* PercentageChange
* EmptyState
* LoadingSkeleton
* ConfirmationDialog
* SearchInput
* FilterBar
* DateRangeFilter
* ChartCard
* ActivityTimeline
* TransactionTable
* NotificationMenu
* PoolCard
* AllocationCard
* PaymentStatus
* AdminActionMenu

Do not create one 2,000-line component.

---

# 54. USER EXPERIENCE DETAILS

Add premium touches:

* Copy-to-clipboard feedback
* Skeleton loading
* Helpful empty states
* Contextual tooltips
* Confirmation dialogs
* Optimistic UI only where safe
* Smooth route transitions where useful
* Proper hover/focus states
* Currency formatting
* Relative timestamps where appropriate
* Full timestamps in detailed views
* Human-readable status labels

---

# 55. COMMAND PALETTE

Create an optional premium command/search experience.

For authenticated dashboards:

* Search navigation
* Jump to pages
* Admin quick search where appropriate

Keyboard shortcut:

Cmd/Ctrl + K

Keep this lightweight.

---

# 56. GLOBAL SEARCH

Admin search should eventually support:

* User email
* User name
* Allocation reference
* Payment reference
* Withdrawal reference

Create the architecture thoughtfully.

---

# 57. SEED DATA

Create a database seed script.

Seed:

## Users

At minimum:

1. Super admin
2. Admin
3. Finance operator
4. Support operator
5. Normal demo user

Use development-only demo passwords documented in README.

Never use demo credentials in production.

---

## Pools

Create approximately 4 original demo pools.

Example conceptual ideas:

### Atlas Quant Pool

Risk: Moderate
Strategy: Systematic multi-asset crypto approach

### Helix Market Neutral

Risk: Conservative/Moderate
Strategy: Market-neutral opportunities

### Momentum Alpha

Risk: Aggressive
Strategy: Momentum-based crypto strategy

### Sentinel Digital Assets

Risk: Balanced
Strategy: Diversified digital asset approach

These are demo names.

Create original descriptions.

Do not guarantee returns.

---

## Additional seed data

* Pool performance history
* User allocations
* Payments
* Transactions
* Notifications
* Withdrawal requests
* Support tickets
* Audit log entries

The seed data should make the application look alive immediately after setup.

---

# 58. LOCAL DEVELOPMENT EXPERIENCE

The project must be extremely easy to run locally.

Use a complete README.

Required prerequisites:

* Node.js or Bun, depending on chosen package manager
* PostgreSQL

Prefer one package manager consistently.

Do not mix npm, Yarn, pnpm, and Bun lockfiles unnecessarily.

If the existing project already clearly uses one package manager, preserve it unless there is a strong reason not to.

---

# 59. ENVIRONMENT VARIABLES

Create:

.env.example

Include variables such as:

DATABASE_URL=

AUTH_SECRET=

NEXT_PUBLIC_APP_URL=http://localhost:3000

PAYMENT_PROVIDER=mock

NODE_ENV=development

Do not put real secrets in the repository.

Document every variable.

---

# 60. LOCAL DATABASE OPTION

Provide a Docker Compose configuration for local PostgreSQL.

Example developer flow should be approximately:

1. Clone project
2. Copy `.env.example` to `.env`
3. Start PostgreSQL
4. Install dependencies
5. Run Prisma migration
6. Seed database
7. Start development server

Commands should actually match the selected package manager.

Example:

docker compose up -d

npm install

npx prisma migrate dev

npm run db:seed

npm run dev

Or equivalent if Bun/pnpm is chosen.

Do not put commands in README that do not actually exist.

---

# 61. PACKAGE SCRIPTS

Create useful scripts.

Example:

dev

build

start

lint

typecheck

db:generate

db:migrate

db:seed

db:studio

db:reset

test

Make sure the commands work.

---

# 62. DOCKER

Create:

Dockerfile

docker-compose.yml

The Docker configuration should support local development PostgreSQL at minimum.

Production app containerization is desirable.

Do not overcomplicate it.

---

# 63. README

Create an excellent README.

Include:

# Project overview

# Features

# Technology stack

# Architecture

# Prerequisites

# Installation

# Environment configuration

# Database setup

# Running locally

# Seeding demo data

# Demo accounts

# Building for production

# Running production build

# Docker usage

# Payment provider architecture

# Mock payment workflow

# Admin access

# Security notes

# Important production checklist

---

# 64. PRODUCTION CHECKLIST

Document what must be changed before real deployment.

Examples:

* Replace AUTH_SECRET
* Configure production database
* Configure real email service
* Configure real payment provider
* Configure payment webhooks
* Add production rate limiting
* Configure monitoring
* Configure error reporting
* Configure backups
* Configure secure secrets manager
* Configure domain and HTTPS
* Review legal documents
* Review jurisdiction-specific compliance
* Implement required KYC/AML provider
* Perform security audit
* Perform penetration testing
* Disable mock payment controls
* Remove development demo accounts

---

# 65. TESTING

Add meaningful testing architecture.

At minimum test critical business logic.

Examples:

* Allocation cannot be created below minimum
* Allocation cannot exceed maximum
* Allocation cannot exceed pool capacity
* Duplicate payment event does not duplicate transaction
* Unauthorized user cannot access admin routes
* Normal admin cannot perform SUPER_ADMIN-only action
* Withdrawal cannot exceed eligible amount
* Rejected withdrawal stores rejection reason

Use an appropriate testing framework compatible with the project.

Do not spend all development effort creating hundreds of trivial UI tests while core functionality remains unfinished.

Prioritize financial and permission logic.

---

# 66. CODE QUALITY

Requirements:

* TypeScript strict mode
* No unnecessary `any`
* No placeholder TODOs for core functionality
* No dead code
* No massive duplicated components
* No secrets committed
* Clear naming
* Proper error boundaries
* Proper loading states
* Clean imports
* Consistent formatting

Run:

* Lint
* Typecheck
* Production build

Fix issues before declaring the project complete.

Do not simply ignore TypeScript errors.

Do not disable ESLint rules globally to hide problems.

---

# 67. FINANCIAL DOMAIN RULES

Create a centralized business-rule layer.

Examples:

canAllocateToPool()

calculatePoolRemainingCapacity()

calculateAllocationValue()

canRequestWithdrawal()

calculateWithdrawalFee()

activateAllocation()

processCompletedPayment()

approveWithdrawal()

Do not duplicate financial logic between pages.

The server remains the authority.

Never trust values calculated only in the browser.

---

# 68. TRANSACTION SAFETY

Critical operations should use database transactions.

Example payment completion transaction:

1. Verify payment is not already completed.
2. Mark payment completed.
3. Activate allocation.
4. Create ledger transaction.
5. Update appropriate pool allocation totals.
6. Create notification.
7. Create audit/event record if applicable.
8. Commit.

If any critical step fails, avoid leaving partially inconsistent financial data.

---

# 69. POOL CAPACITY SAFETY

Prevent race conditions.

Example:

Two users should not be able to simultaneously allocate the final available capacity beyond the configured pool limit.

Use correct database-level logic and transactional checks.

---

# 70. ADMIN SECURITY UX

Sensitive admin actions must have:

* Permission check
* Confirmation modal
* Clear description
* Reason field where applicable
* Audit log

Examples:

"Approve $15,000 USDT withdrawal?"

"Suspending this user will prevent account access."

"Changing this payment to completed may activate an allocation."

Do not create one-click dangerous actions.

---

# 71. STATUS DESIGN

Create consistent status colors.

Example conceptual system:

Success:

* Active
* Completed
* Approved

Warning:

* Pending
* Under review
* Confirming

Error:

* Failed
* Rejected
* Suspended

Neutral:

* Draft
* Closed
* Archived

Do not rely on color alone.

Always include text or icons.

---

# 72. DARK/LIGHT MODE

The primary visual experience should be premium dark mode.

Architecture may support light mode.

If implementing both modes, ensure both are fully polished.

Do not create a broken or unfinished light theme merely to say it exists.

Quality over checkbox features.

---

# 73. VISUAL DETAILS

Use sophisticated visual elements such as:

* Subtle grid patterns
* Noise texture where tasteful
* Low-opacity radial gradients
* Fine card borders
* Soft depth
* Animated chart strokes
* Elegant progress bars
* Sophisticated risk indicators
* Capacity rings
* Financial sparklines

Everything must remain readable.

---

# 74. HERO VISUAL

Create an original hero visualization in code.

For example:

A floating portfolio terminal showing:

* Portfolio value
* Monthly performance
* Allocation distribution
* Market status
* Animated line chart

Add subtle depth and motion.

Do not use screenshots from FTMO, FundedNext, FundingPips, Binance, or other platforms.

---

# 75. DASHBOARD VISUALIZATION

Charts should include:

* Portfolio growth
* Pool performance
* Allocation distribution
* Monthly returns
* Capital deployment

Use tooltips.

Use accessible labels.

Format values properly.

Do not display meaningless fake axes.

---

# 76. ROUTE ORGANIZATION

Use route groups to separate:

Marketing

Authentication

User application

Administration

Example:

app/
(marketing)/
page.tsx
pools/
how-it-works/
security/
about/

(auth)/
sign-in/
sign-up/

(dashboard)/
dashboard/
layout.tsx
page.tsx
pools/
transactions/
withdrawals/
referrals/
support/
settings/

admin/
layout.tsx
page.tsx
users/
pools/
payments/
withdrawals/
support/
audit-logs/
settings/

The exact structure may be improved where technically justified.

---

# 77. DEMO MODE

Create a clearly identifiable development demo mode.

It should make it possible to demonstrate:

* Registration
* Login
* Selecting a pool
* Creating allocation
* Mock checkout
* Payment confirmation
* Activated investment
* Dashboard updates
* Withdrawal request
* Admin approval workflow

The entire core business journey must be testable locally.

This is essential.

---

# 78. CORE USER JOURNEY THAT MUST WORK

The following must work from start to finish:

USER FLOW:

1. User visits homepage.
2. User browses trading pools.
3. User opens a pool.
4. User creates an account.
5. User signs in.
6. User chooses allocation amount.
7. Backend validates amount.
8. Backend allocation amount.
9. Backend validates amount.
10. Backend creates pending allocation.
11. Backend creates mock payment intent.
12. User sees checkout.
13. Mock payment is confirmed.
14. Backend completes payment.
15. Allocation becomes active.
16. Transaction appears.
17. Dashboard metrics update.
18. User can inspect allocation.
19. User requests eligible withdrawal.
20. Admin sees withdrawal request.
21. Admin approves/rejects it.
22. User receives notification.
23. Withdrawal status updates.

Do not finish the project without this flow working.

---

# 79. ADMIN JOURNEY THAT MUST WORK

1. Admin signs in.
2. Admin sees operations dashboard.
3. Admin creates or edits pool.
4. Admin publishes pool.
5. Public marketplace reflects change.
6. User allocates to pool.
7. Admin sees payment.
8. Admin can process mock payment in development.
9. Allocation activates.
10. Admin sees allocation.
11. User requests withdrawal.
12. Admin reviews request.
13. Admin approves or rejects.
14. Audit log is created.
15. User sees updated status.

---

# 80. DO NOT DO THESE THINGS

DO NOT:

* Build only the homepage
* Create a fake dashboard disconnected from the database
* Hardcode all financial data
* Copy another company's website
* Use lorem ipsum everywhere
* Create fake guarantees
* Put backend secrets in frontend code
* Store plaintext passwords
* Trust payment confirmation from the browser
* Use floating-point arithmetic carelessly for money
* Give every admin unlimited access
* Make the whole Next.js application a Client Component
* Use giant unmaintainable files
* Create random API routes without domain organization
* Skip loading/error/empty states
* Ignore mobile design
* Disable security to simplify development
* Automatically execute real crypto withdrawals in the initial implementation
* Claim the application is production-ready without running build/typecheck/lint

---

# 81. IMPLEMENTATION PRIORITY

Build in this order:

PHASE 1
Foundation

* Project architecture
* Dependencies
* Design system
* Database
* Authentication
* RBAC
* Shared layouts

PHASE 2
Public website

* Homepage
* Pool marketplace
* Pool details
* Auth pages

PHASE 3
Core backend

* Pools
* Allocations
* Payments
* Transactions
* Performance

PHASE 4
User dashboard

* Overview
* My Pools
* Transactions
* Withdrawals
* Notifications
* Settings

PHASE 5
Checkout

* Allocation flow
* Mock payment provider
* Payment state machine
* Activation

PHASE 6
Admin

* Dashboard
* Users
* Pools
* Payments
* Withdrawals
* Performance
* Audit logs

PHASE 7
Additional modules

* Support
* Referrals
* Platform settings

PHASE 8
Quality

* Responsive polish
* Accessibility
* Error states
* Security review
* Testing
* Lint
* Typecheck
* Production build
* README

Do not stop after an early phase and call the entire project complete.

---

# 82. WHEN MAKING TECHNICAL DECISIONS

Prefer:

* Simplicity with scalability
* Explicit code over magical abstractions
* Secure defaults
* Strong typing
* Server authority for business rules
* Reusable components
* Good developer experience
* Real functionality

Do not overengineer.

A high-quality modular monolith is preferred to premature microservices.

---

# 83. FINAL VALIDATION

Before considering the implementation complete:

Run the appropriate commands for:

1. Dependency installation
2. Prisma generation
3. Database migrations
4. Database seed
5. TypeScript typecheck
6. ESLint
7. Production build

Fix all critical failures.

Test:

* Public homepage
* Sign up
* Sign in
* Protected dashboard
* Pool browsing
* Allocation creation
* Mock payment
* Allocation activation
* Transaction creation
* Withdrawal request
* Admin withdrawal management
* Admin pool management
* Authorization

---

# 84. FINAL DELIVERY REPORT

After implementation, provide a concise report containing:

## What was built

## Architecture used

## Main routes

## Database models

## Authentication approach

## Payment architecture

## Mock payment workflow

## Admin roles

## How to run locally

## Demo account credentials

## Environment variables required

## Production build result

## Any remaining production integrations

Do not merely describe planned functionality.

Clearly distinguish:

* Implemented
* Development simulation
* Production integration still required

---

# 85. IMPORTANT FINAL INSTRUCTION

This project must look and feel like a serious venture-backed fintech product.

Every screen should appear intentionally designed.

Prioritize:

* Credibility
* Clarity
* Premium visual execution
* Financial transparency
* Security-conscious architecture
* Responsive UX
* Real backend functionality

The application should be impressive enough that someone opening:

* The homepage
* The pool marketplace
* The checkout
* The user dashboard
* The admin dashboard

immediately feels they are using one coherent, premium financial technology platform.

Do not settle for a generic template.

Do not stop at wireframes.

Do not stop at static UI.

Build the actual application.

Start by inspecting the repository, establish the architecture, and then implement the project systematically until the primary end-to-end flows are functional.
