# StoreBase - Multi-tenant eCommerce SaaS

StoreBase is a production-grade, multi-tenant eCommerce SaaS platform built with Next.js 16 (App Router), Prisma, and PostgreSQL. It features robust tenant isolation, a modern "Indigo Ethereal" design system, and multi-layered authentication.

## 🚀 Key Features

### 💎 Super Admin (Platform Owner)
- **Centralized Dashboard**: Monitor platform-wide metrics including total tenants, orders, GMV, and user growth.
- **Tenant Management**: Full lifecycle control—search, activate, suspend, or decommission stores.
- **Support Snapshot**: Quick access to recent orders, top products, and failed payments for any tenant.
- **Impersonation Workflow**: Securely impersonate tenant admins for debugging (requires justification, audited).
- **Audit Logging**: Comprehensive platform-wide logs capturing actor and effective-user metadata.

### 🏪 Shopkeeper (Tenant Admin)
- **Store Management**: Configure store details, slugs, and custom domains.
- **Product Catalog**: Full CRUD for products with Google Drive-backed image storage.
- **Order Processing**: Real-time order tracking and management.
- **Inventory Control**: Automated stock level tracking.

### 🛒 Customer Storefront
- **Dynamic Routing**: Automatic store detection via subdomains or route slugs (`/store/[slug]`).
- **Product Discovery**: Premium storefront UI with responsive search and filtering.
- **Seamless Cart**: Client-side cart persistence with server-side synchronization.
- **Secure Payments**: Integrated Razorpay checkout with webhook verification.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (SQLite for local development)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: JWT-based session management with scoped payloads.
- **Storage**: [Google Drive API](https://developers.google.com/drive) (Service Account integration for product images).
- **Payments**: [Razorpay](https://razorpay.com/)
- **Email**: [Nodemailer](https://nodemailer.com/)

---

## 📁 Project Structure

```text
/app
  /prisma               # Database schema and migrations
  /public               # Static assets
  /src
    /app                # Next.js App Router routes
      /api              # Scoped API routes (Super Admin, Frontend, Uploads)
      /super-admin      # Platform owner portal
      /dashboard        # Shopkeeper admin portal
      /store            # Dynamic customer storefronts
    /components
      /ui               # Reusable atomic UI components (Indigo Ethereal)
      /cart             # Cart logic and UI
      /layout           # Common layout wrappers
    /lib
      /auth             # JWT, Session, and Lockout logic
      /tenant           # Tenant detection and isolation logic
      /payments         # Razorpay integration
      /gdrive           # Google Drive storage service
      /api              # API response helpers and shared validators
    /types              # Shared TypeScript definitions
    /middleware.ts      # Multi-tenant routing and security middleware
```

---

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js 20+
- A Google Cloud Project (for Google Drive storage)
- A Razorpay Account (for testing payments)

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Seeding Super Admins
Define your initial super admin users in `SUPER_ADMIN_SEED_JSON` (env) as a JSON array, then run:
```bash
npm run prisma:seed
```

### 6. Start Development
```bash
npm run dev
```

---

## 🔒 Security & Architecture

- **Tenant Isolation**: Every query is scoped via a `tenant_id` check enforced at the data layer and middleware.
- **Scoped JWTs**:
  - `scope: platform` - Access to super-admin functionality.
  - `scope: tenant` - Access to specific store resources.
- **Sensitive Operations**: Impersonation and platform-level changes are captured in `AuditLog` with IP and User Agent tracking.
- **Input Validation**: Strict schema enforcement using [Zod](https://zod.dev/) for all API interactions.

---

## 🔌 Core Functions

### Image Uploads (`src/lib/gdrive.ts`)
The system uses a Google Service Account to upload files directly to a designated Drive folder, returning a publicly accessible proxy URL.

### Tenant Tracking (`src/lib/tenant/`)
Middleware detects tenants based on:
1. Custom Domain (e.g., `shop.customer.com`)
2. Subdomain (e.g., `nike.storebase.dev`)
3. Path Prefix (e.g., `localhost:3000/store/nike`)

### Payment Verification (`src/app/api/webhooks/razorpay/route.ts`)
Securely handles Razorpay payment signatures to update order statuses asynchronously.

---

## 🚀 Deployment

1. **GCP Cloud Run**: Recommended for high scalability. Use the provided `Dockerfile` and `deploy.ps1`.
2. **Vercel**: Optimized for Next.js features. Ensure `DATABASE_URL` is set to a production PostgreSQL instance.
3. **Database Migrations**: Always run `npx prisma migrate deploy` in your CI/CD pipeline.

