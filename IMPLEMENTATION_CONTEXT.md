# 🛠️ HK Fabric — Full Technical Implementation Context

This document provides a comprehensive technical overview of the **HK Fabric E-Commerce Platform**, detailing the implementation context, architecture decisions, database schema, payment engine, security controls, and operational workflows across all three core applications (`hk-backend`, `hk-next`, `hk-admin`).

---

## 📑 TABLE OF CONTENTS
1. [Project Structure & Architecture](#1-project-structure--architecture)
2. [Database Schema & Prisma ORM](#2-database-schema--prisma-orm)
3. [Provider-Independent Payment Engine](#3-provider-independent-payment-engine)
4. [Atomic Stock Concurrency & Reservation](#4-atomic-stock-concurrency--reservation)
5. [Cloud Media & Image Streaming (Multer → Cloudinary)](#5-cloud-media--image-streaming-multer--cloudinary)
6. [Customer Storefront (`hk-next`) Implementation](#6-customer-storefront-hk-next-implementation)
7. [Admin Operations Panel (`hk-admin`) Implementation](#7-admin-operations-panel-hk-admin-implementation)
8. [Automated QA Verification & Test Suites](#8-automated-qa-verification--test-suites)
9. [Deployment Pipeline & Environment Variables](#9-deployment-pipeline--environment-variables)

---

## 1. PROJECT STRUCTURE & ARCHITECTURE

The platform follows a **3-tier decoupled architecture** sharing a centralized PostgreSQL database and REST API ecosystem.

```text
                                  ┌───────────────────────────────┐
                                  │   Neon Cloud PostgreSQL DB    │
                                  └───────────────┬───────────────┘
                                                  │
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │       hk-backend (NestJS)     │
                                  │   Port: 5000 | OpenAPI Swagger│
                                  └───────────────┬───────────────┘
                                                  │
                       ┌──────────────────────────┴──────────────────────────┐
                       ▼                                                     ▼
        ┌───────────────────────────────┐                     ┌───────────────────────────────┐
        │       hk-next (Next.js)       │                     │       hk-admin (React)        │
        │   Customer Storefront (3000)  │                     │     Admin Management (5173)   │
        └───────────────────────────────┘                     └───────────────────────────────┘
```

---

## 2. DATABASE SCHEMA & PRISMA ORM

**Database:** PostgreSQL (Neon Cloud Serverless) | **ORM:** Prisma v7.9

### Key Data Entities & Enums
- **User & Customer Profile:** `User`, `UserRole` (`SUPER_ADMIN`, `STORE_MANAGER`, `INVENTORY_MANAGER`, `CUSTOMER`), `CustomerProfile`, `Address`.
- **Catalog Management:** `Category` (tree hierarchy, Google snippet meta), `Collection`, `Product`, `ProductImage`, `ProductVariant`.
- **Inventory Audit:** `InventoryTransaction`, `AdjustmentType` (`RESTOCK`, `CORRECTION`, `DAMAGE`, `ORDER_RESERVATION`, `ORDER_FULFILLMENT`, `RETURN`).
- **Orders & Payments:** 
  - `Order`, `OrderItem`, `OrderStatus` (`PENDING`, `PROCESSING`, `PACKED`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`).
  - `Payment`, `PaymentStatus` (`INITIATED`, `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`, `REFUNDED`), `OrderStatusHistory`.
- **Marketing & Content:** `Coupon`, `Review`, `AuditLog`, `HomepageCMS`.

---

## 3. PROVIDER-INDEPENDENT PAYMENT ENGINE

The payment engine uses a **Strategy Pattern** to decouple business logic from specific payment gateways.

### Active Provider Resolution (`provider.factory.ts`)
* `PAYMENT_PROVIDER` env variable controls the active adapter (`PAYFAST`, `EASYPAISA`, `GENERIC_GATEWAY`).
* Adapter implements `PaymentProvider` interface:
  ```typescript
  export interface PaymentProvider {
    readonly name: string;
    getStatusInfo(): ProviderStatusInfo;
    initiatePayment(input: PaymentInitiationInput): Promise<PaymentInitiationResult>;
    verifyWebhook(body: any, headers?: any, query?: any): Promise<WebhookVerificationResult>;
    queryTransactionStatus(transactionRef: string, orderId: string): Promise<TransactionQueryResult>;
    processRefund(input: RefundInput): Promise<RefundResult>;
  }
  ```

### Cryptographic Security & Server-Side Verification
1. **PayFast:** MD5 parameter hashing across sorted key-value pairs.
2. **Easypaisa:** SHA-256 HMAC checksum across `amount`, `orderRefNum`, and `storeId`.
3. **Generic Gateway:** HMAC SHA256 signature (`orderId:transactionRef:status`).
4. **Zero Client Trust:** Frontend success redirect URL NEVER marks an order as `PAID`. Server-side webhook/IPN verification or direct status query is required.
5. **Idempotency & Retry:** Request idempotency via `@unique idempotencyKey`, transaction uniqueness via `@unique transactionRef`, and payment retry via `POST /payments/retry/:orderId`.

---

## 4. ATOMIC STOCK CONCURRENCY & RESERVATION

* **Race-Condition Protection:** Stock deductions execute atomically inside database transactions:
  ```typescript
  const updateResult = await tx.product.updateMany({
    where: { id: item.productId, isArchived: false, stock: { gte: item.quantity } },
    data: { stock: { decrement: item.quantity } },
  });
  if (updateResult.count === 0) throw new ConflictException('Insufficient stock.');
  ```
* **Inventory Reservation:** Stock is reserved at order placement (`AdjustmentType.ORDER_RESERVATION`). If payment fails/cancels, stock is restored cleanly.

---

## 5. CLOUDINARY MEDIA & IMAGE STREAMING

* Product and category images stream directly from RAM buffer to Cloudinary CDN using Multer (`FileInterceptor`).
* Zero temporary bytes are written to server hard disk.
* Cloudinary URLs and metadata are stored in PostgreSQL.

---

## 6. CUSTOMER STOREFRONT (`hk-next`) IMPLEMENTATION

* **Framework:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS.
* **Online-Payment Checkout:** Cash on Delivery (COD) disabled. Customer selects active online payment gateway (PayFast / Easypaisa), clicks `PAY NOW`, and is redirected to secure gateway session.
* **Infinite Scrolling & Debouncing:** Catalog pagination using `IntersectionObserver`, 300ms search debouncing.
* **Server Verification Badge:** `OrderConfirmation` page queries `GET /payments/verify/:orderId` server-side and provides `🔄 Retry Online Payment` button for pending/failed orders.

---

## 7. ADMIN OPERATIONS PANEL (`hk-admin`) IMPLEMENTATION

* **Framework:** React, TypeScript, Vite, Tailwind CSS.
* **0ms Optimistic UI Engine:** Products, Categories, and Stock Adjustments update React state instantly (`0ms`) with background REST synchronization.
* **SEO Google Snippet Preview:** Real-time preview of meta titles and descriptions during category editing.
* **Role-Based Security:** Super Admin (100% full access) vs Store Manager (Catalog, Inventory, Orders operational access).

---

## 8. AUTOMATED QA VERIFICATION & TEST SUITES

Automated QA scripts verify system integrity:
1. `src/test-qa-suite.mjs` — Tests Auth, Categories, Product lifecycle, DRAFT/PUBLISHED visibility, and Inventory concurrency.
2. `src/test-payments-suite.mjs` — Tests Provider initialization, payment session initiation, invalid signature rejection, valid HMAC/MD5 webhooks, idempotency, server verification, payment retries, and refund execution.

```text
====================================================
📊 PAYMENT ENGINE VERIFICATION SUMMARY
====================================================
• Provider Initialization:              PASS
• Credential Readiness Audit:           BLOCKED — MERCHANT CREDENTIALS REQUIRED
• Order Placement & Stock Reservation:  PASS
• Payment Session Initiation:           PASS
• Invalid Signature Rejection:          PASS
• Successful Payment Transition:        PASS
• Duplicate Webhook Idempotency:        PASS
• Server-Side Verification API:         PASS
• Payment Retry Engine:                 PASS
• Refund Engine & Stock Restore:        PASS
```

---

## 9. DEPLOYMENT PIPELINE & ENVIRONMENT VARIABLES

### Required Environment Variables (`hk-backend/.env`)

```env
# SERVER
PORT=5000
NODE_ENV=development

# DATABASE
DATABASE_URL="postgresql://neondb_owner:...@ep-muddy-lake-ay1a64tt-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# JWT
JWT_SECRET="hk_fabric_jwt_secret_key_2026_production"
JWT_EXPIRES_IN="7d"

# CLOUDINARY
CLOUDINARY_CLOUD_NAME="dhpqigvzj"
CLOUDINARY_API_KEY="896479657425435"
CLOUDINARY_API_SECRET="loy9PoDasQGKUBHjOvIujfgT0MY"

# PAYMENT ENGINE
PAYMENT_PROVIDER="PAYFAST"
PAYMENT_MODE="SANDBOX"
PAYMENT_WEBHOOK_SECRET="hk_fabric_ipn_secret_hash"
PAYFAST_MERCHANT_ID="sandbox_merchant_123"
PAYFAST_SECURE_KEY="sandbox_key_456"
EASYPAISA_STORE_ID="12345"
EASYPAISA_HASH_KEY="easypaisa_sandbox_hash_key"

---

## 10. REDIS & BULLMQ BACKGROUND QUEUE ENGINE

The platform decouples non-critical asynchronous tasks (customer emails, low-stock manager alerts) from synchronous HTTP request threads using a **Redis-backed BullMQ Queue Architecture**.

```text
PostgreSQL Commit (100% Sync & Transaction-Safe)
          │
          ├──► Enqueue JOB_ORDER_CONFIRMATION ──► BullMQ NotificationWorker ──► Nodemailer Email
          ├──► Enqueue JOB_PAYMENT_CONFIRMATION ──► BullMQ NotificationWorker ──► Nodemailer Email
          └──► Enqueue JOB_LOW_STOCK_ALERT ──────► BullMQ InventoryWorker ─────► Manager Alert Email
```

### Key Queue Architectural Guarantees
1. **Strict Transaction Safety:** Payment verification, stock reservation, and PostgreSQL database commits remain **100% synchronous and transaction-safe**. If Redis or Nodemailer is offline, order creation and payment processing NEVER roll back or crash.
2. **Job Deduplication:** Deterministic job IDs (`order-confirmation-${orderId}`, `payment-confirmation-${paymentId}`, `low-stock-${productId}-${stockState}`) prevent duplicate email notifications when events are reprocessed.
3. **Exponential Backoff Retries:** Failed jobs retry up to 3 times with exponential backoff (`delay: 1000ms`).
4. **Health Check Endpoint (`GET /health`):** Reports operational status of API, PostgreSQL Database, Redis Cache, and BullMQ Queues. If Redis is unavailable, `/health` reports `status: "degraded"` while keeping database operations healthy (`"ok"`).

### Local Redis Server Startup & Verification
* **Startup Command (Windows Native):** `.\redis-server.exe --port 6379` (located in `hk-backend/redis`)
* **Startup Command (Docker):** `docker run -d --name hk-redis -p 6379:6379 redis:alpine`
* **Connectivity Verification Command:** `.\redis-cli.exe ping` ➔ Output: `PONG`
* **Verification Test Suite:** `node src/test-queues-suite.mjs`

### Queue Environment Variables (`hk-backend/.env`)

```env
# REDIS QUEUE ENGINE
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# SMTP EMAIL NOTIFICATIONS
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="orders@hkfabric.pk"
SMTP_PASS="smtp_password_here"
SMTP_FROM='"HK Fabric Orders" <orders@hkfabric.pk>'
MANAGER_EMAIL="manager@hkfabric.pk"
```

---

## 11. K6 LOAD-TESTING SUITE & CONCURRENCY AUDIT

The platform incorporates an automated **Grafana k6 Load Testing Engine** (`hk-backend/src/test/load/`) to audit throughput, latency percentiles, rate-limiting guards, and single-unit stock concurrency under high traffic spikes.

```text
k6 Load Test Runner (v0.56.0)
     ├──► Stage 100 VUs   ──► Measures RPS, Avg, p95, p99, Errors
     ├──► Stage 500 VUs   ──► Tests Rate Limiter (HTTP 429) Guard
     ├──► Stage 1000 VUs  ──► Audits Node.js Socket Backlog Limits
     └──► Concurrency Audit (50 VUs vs 1 Stock) ──► Verifies Zero Overselling (1 Order, 49 Rejections)
```

### Staged Load Test Results

| Stage | VUs | RPS (req/s) | Avg Latency | p90 Latency | p95 Latency | Error Rate | Primary Status Code |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Stage 1** | 100 | 4.07 | 17,663 ms | 25,053 ms | 25,496 ms | 11.11% | `200 OK` / `201 Created` |
| **Stage 2** | 500 | 560.53 | 376.19 ms | 155.75 ms | 181.29 ms | 98.70% | `429 Too Many Requests` |
| **Stage 3** | 1,000 | 1,831.71 | 357.70 ms | 506.96 ms | 692.33 ms | 100.00% | `429 Too Many Requests` |

### Oversell Prevention Concurrency Verification
- **Initial Stock:** 1 Unit
- **Concurrent Checkout Requests:** 50 VUs
- **Successful Orders Created:** 1 (`201 Created`)
- **Rejected Requests:** 49 (`409 Conflict` / `400 Bad Request` / `429 Too Many Requests`)
- **Final Stock Remaining:** 0 Items
- **Result:** **✅ PASS** (Zero negative inventory, zero overselling, zero duplicate orders).



