# 🎓 ZYNVEX INTERNSHIP FINAL PROJECT SUBMISSION REPORT

---

## 📌 Submission Metadata & Quick Links

| Metadata Field | Submitted Details |
| :--- | :--- |
| **Internship ID** | `ZYNVEX-CERT-1373` |
| **Domain Group** | Full-Stack Web Development |
| **Project Title** | HK Fabric Luxury E-Commerce & Retail Management Platform |
| **GitHub Repository** | [https://github.com/MuhammadAhsankhan786/hk-ecom-store](https://github.com/MuhammadAhsankhan786/hk-ecom-store) |
| **Storefront Live URL** | [https://hk-ecom-store.vercel.app/](https://hk-ecom-store.vercel.app/) |
| **Admin Panel Live URL** | [https://hk-admin-psi.vercel.app/](https://hk-admin-psi.vercel.app/) |
| **Backend REST API Live URL** | [https://hk-backend-bice.vercel.app/](https://hk-backend-bice.vercel.app/) |
| **Admin Test Email** | `admin@hkfabric.pk` |
| **Admin Test Password** | `admin123` |
| **Admin Role** | `SUPER_ADMIN` |

---

## 1. Executive Summary & Project Objectives

The **HK Fabric E-Commerce Platform** is a 3-tier enterprise retail solution engineered for Pakistan's luxury home textile and bedding market (velvet bridal sets, cotton quilted comforters, luxury duvets, and towels). 

### 🎯 Key Engineering Highlights
1. **COD + PKR 1,000 Advance Deposit System**: Prevents fake orders by requiring a mandatory **PKR 1,000 Advance Payment** (via Easypaisa or Bank Transfer) with receipt screenshot proof uploaded at checkout.
2. **Atomic Concurrency Control**: Prevents overselling during flash sales via single-statement SQL stock decrements.
3. **Idempotency Header Protection**: Protects against accidental duplicate checkouts via `x-idempotency-key`.
4. **Cloudinary CDN Integration**: Real-time customer receipt upload and product gallery CDN hosting.

---

## 2. 3-Tier System Architecture

```
[ Customer Storefront (hk-next) ] ──> [ REST API Backend (hk-backend) ] ──> [ Neon PostgreSQL Database ]
   (https://hk-ecom-store.vercel.app)     (https://hk-backend-bice.vercel.app)
                                                  ▲
[ Admin Panel Portal (hk-admin) ] ────────────────┘
   (https://hk-admin-psi.vercel.app)
```

---

## 3. Detailed Module Breakdown (Modules 1–4)

### 🛒 Module 1: Storefront (`hk-next`) — Next.js 16 App Router
* **Live Deployment**: [https://hk-ecom-store.vercel.app/](https://hk-ecom-store.vercel.app/)
* **UI/UX**: Luxury Pakistani aesthetic with HSL color system, gold accents (`#D4AF37`), responsive grid layouts, and Playfair Display typography.
* **Product Catalog**: Live search, category filtering (Bridal Sets, Bedsheets, Blankets, Towels), and collection sorting.
* **Step-by-Step Checkout**:
  * Contact information & shipping address entry.
  * Direct deposit details (Easypaisa: `0300 1234567` | Meezan Bank: `PK36MEZN00012345678901`).
  * Direct file upload for deposit receipt screenshot (`POST /media/upload-receipt`).
  * Financial breakdown: **Advance Payable NOW (PKR 1,000)** vs **Remaining COD at Doorstep**.
* **Order Confirmation Tracker**: Real-time order lookup page showing advance deposit verification status (`⏳ Pending`, `✅ Verified`, `⚠️ Rejected`).

---

### ⚙️ Module 2: REST API Engine (`hk-backend`) — NestJS & Prisma
* **Live API**: [https://hk-backend-bice.vercel.app/](https://hk-backend-bice.vercel.app/)
* **Database**: Neon PostgreSQL cloud database with Prisma ORM 7.9.
* **Atomic Concurrency**: Single-statement SQL stock decrementing to guarantee zero negative stock counts.
* **Public Receipt Uploader**: `POST /media/upload-receipt` allows guest customers to upload receipt screenshots directly to Cloudinary CDN without authentication blocks.
* **Swagger OpenAPI Docs**: Configured at `/api` endpoint.

---

### 📊 Module 3: Admin Back-Office (`hk-admin`) — Vite + React
* **Live Portal**: [https://hk-admin-psi.vercel.app/](https://hk-admin-psi.vercel.app/)
* **Access Credentials**: Email: `admin@hkfabric.pk` | Password: `admin123`.
* **Catalog Management**: Full CRUD for products, parent/child categories, and featured collections.
* **Deposit Receipt Inspection & Verification**:
  * Order status badges (`✓ PKR 1,000 Verified`, `⏱ Advance Pending`, `✗ Receipt Rejected`).
  * Interactive click-to-zoom screenshot modal (`📷 Receipt Uploaded`).
  * One-click **"✓ Confirm & Verify PKR 1,000 Advance"** button that automatically marks deposit as verified and moves order status to `Processing`.
* **Inventory Audit Log**: Detailed transaction logging with timestamps, user IDs, and IP tracking.

---

### 🛡️ Module 4: QA, Security & Performance Verification
* **Authentication**: JWT Bearer tokens with `bcrypt` password hashing and `@Roles()` guards.
* **Database Resilience**: Product UUID resolution fallback matching slugs/SKUs if non-UUID mock IDs are passed.
* **Storefront-Admin Sync**: `BroadcastChannel` browser sync updating storefront products instantly when modified in admin portal.

---

## 4. Database Schema Structure (Prisma ORM)

```prisma
model Order {
  id                   String        @id @default(uuid())
  orderNumber          String        @unique
  customerName         String
  customerEmail        String
  customerPhone        String
  shippingAddress      String
  city                 String
  subtotal             Float
  discount             Float         @default(0)
  shippingFee          Float         @default(0)
  totalAmount          Float
  advancePaymentAmount Float         @default(1000)
  remainingCodAmount   Float         @default(0)
  paymentScreenshot    String?
  advancePaymentStatus String        @default("PENDING") // PENDING | VERIFIED | REJECTED
  orderStatus          OrderStatus   @default(PENDING)
  paymentStatus        PaymentStatus @default(PENDING)
  items                OrderItem[]
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt
}
```

---

## 5. Verification & Submission Confirmation

I certify that the **HK Fabric E-Commerce Platform** under Internship ID **`ZYNVEX-CERT-1373`** is fully implemented, verified, and deployed live across all three domains.

* **GitHub Repository**: `https://github.com/MuhammadAhsankhan786/hk-ecom-store`
* **Storefront Live**: `https://hk-ecom-store.vercel.app/`
* **Admin Portal Live**: `https://hk-admin-psi.vercel.app/`
* **Backend REST API Live**: `https://hk-backend-bice.vercel.app/`

---
*Report generated for ZYNVEX Internship Certificate Evaluation — ID: ZYNVEX-CERT-1373*
