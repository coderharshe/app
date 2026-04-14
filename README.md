# StoreBase - Multi-tenant eCommerce SaaS

Production-ready Next.js App Router + PostgreSQL (Prisma) platform with tenant isolation, JWT auth, Razorpay, and a dedicated super-admin portal.

## Implemented Dashboards

1. Super Admin (SaaS owner): `/super-admin`
2. Shopkeeper (tenant admin): `/dashboard`
3. Customer storefront: `/store/[storeSlug]`

## Core Architecture

- Multi-tenant data isolation via `tenant_id` + scoped queries
- Tenant detection by subdomain and path (`/store/{slug}`)
- JWT auth with session scopes:
  - `scope=platform` for super admins
  - `scope=tenant` for tenant admins/customers
- Role model: `SUPER_ADMIN`, `ADMIN`, `CUSTOMER`

## Super Admin Features (v1 Core Ops)

- Dedicated login: `/super-admin/login`
- Platform metrics (tenants, orders, GMV, user counts)
- Tenant management:
  - list/search tenants
  - suspend/activate store
- Tenant support snapshot:
  - recent orders
  - top products
  - failed payments
- Impersonation workflow:
  - start temporary tenant-admin impersonation (reason required)
  - stop impersonation and return to platform scope
- Audit feed with actor/effective-user metadata

## Key API Routes

### Tenant APIs
- `/api/auth/*`
- `/api/products/*`
- `/api/cart/*`
- `/api/orders/*`
- `/api/payments/*`

### Super Admin APIs
- `/api/super-admin/auth/login`
- `/api/super-admin/auth/logout`
- `/api/super-admin/auth/me`
- `/api/super-admin/tenants`
- `/api/super-admin/tenants/:id/suspend`
- `/api/super-admin/tenants/:id/activate`
- `/api/super-admin/tenants/:id/snapshot`
- `/api/super-admin/audit`
- `/api/super-admin/impersonation/start`
- `/api/super-admin/impersonation/stop`

## Prisma Models

- `Tenant` (with `status`, suspension fields)
- `PlatformAdmin`
- `User`
- `Product`
- `Order`
- `OrderItem`
- `Cart`
- `Payment`
- `AuditLog`
- `ImpersonationSession`

Schema: `prisma/schema.prisma`

## Security Controls

- Zod validation for all APIs
- Rate limiting in middleware
- Scope + role checks per route
- Cross-tenant access prevention
- Suspended tenant blocking (`423`)
- Audit logs for privileged operations
- Login lockout/backoff for super admin auth

## Seeding Super Admin Accounts

Set `SUPER_ADMIN_SEED_JSON` in env as JSON array, then run:

```bash
npm run prisma:seed
```

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Deploy (Vercel)

1. Configure all env vars (including `DATABASE_URL`, `JWT_SECRET`, Razorpay keys)
2. Run migrations in deploy pipeline: `npm run prisma:deploy`
3. Build: `npm run build`
