# 🧵 HK Fabric — Full-Stack E-Commerce & Retail Management System

![HK Fabric Banner](https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&h=400&q=80)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-e0234e?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7.9-2d3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?style=flat-square&logo=postgresql)](https://neon.tech/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat-square&logo=cloudinary)](https://cloudinary.com/)

**Internship Domain:** Full-Stack Web Development  
**Repository:** [MuhammadAhsankhan786/hk-ecom-store](https://github.com/MuhammadAhsankhan786/hk-ecom-store)  
**Project Architect:** Full-Stack Developer  

---

## 📌 Executive Summary

**HK Fabric** is an enterprise-grade luxury e-commerce ecosystem built specifically for Pakistan's high-end bedding, velvet bridal sets, cotton comforters, and home textile market. 

The system consists of three decoupled micro-applications:
1. **`hk-next`**: Customer-Facing E-Commerce Storefront (Next.js 16 App Router).
2. **`hk-backend`**: REST API Microservice Engine (NestJS, Prisma ORM, Neon PostgreSQL).
3. **`hk-admin`**: Enterprise Back-Office Admin Dashboard (Vite, React, TypeScript).

---

## 🔐 Admin Panel Access Credentials (For Evaluation)

For evaluator and instructor testing, the back-office panel is configured with pre-seeded super-admin credentials:

* **Admin Portal URL**: `http://localhost:3001`
* **Admin Email**: `admin@hkfabric.pk`
* **Admin Password**: `admin123`
* **Assigned Role**: `SUPER_ADMIN` (Full System & Financial Controls)

---

## 🧱 Module 1–4 Technical Architecture & Features

### 🛒 Module 1: Storefront Development (`hk-next`)
* **Luxury Pakistani Design System**: Built with modern typography (Inter & Playfair Display font pairings), glassmorphism cards, and gold accents (`#D4AF37`).
* **Dynamic Product Catalog & Filtering**: Instant search, category filters (Bridal Sets, Comforters, Bedcovers, Towels), and collection sorting.
* **COD + PKR 1,000 Advance Deposit Payment Flow**:
  * Displays official Easypaisa & Meezan Bank account details.
  * Direct file upload for payment deposit screenshot.
  * Automatic financial breakdown: **Advance Payable NOW (PKR 1,000)** vs **Remaining COD at Doorstep (Total - 1,000)**.
* **Order Confirmation Page**: Real-time server-side lookup highlighting advance deposit receipt verification status (`⏳ Pending`, `✅ Verified`, `⚠️ Rejected`).

### ⚙️ Module 2: REST API Backend Engine (`hk-backend`)
* **NestJS & Prisma Architecture**: Structured into modular domains (`orders`, `products`, `categories`, `collections`, `media`, `inventory`, `coupons`).
* **Database (Neon PostgreSQL)**: Normalized relational schema managing products, stock variants, inventory transactions, orders, order items, and audit logs.
* **Atomic Concurrency Stock Reservation**: Prevents race conditions during simultaneous customer checkouts using single-statement SQL stock decrements.
* **Idempotency Protection**: Custom `@UseGuards(IdempotencyGuard)` with `x-idempotency-key` header to eliminate accidental double-order submissions.
* **Public Receipt Upload API**: Endpoint `POST /media/upload-receipt` allowing guest checkout receipt uploads to Cloudinary CDN.

### 📊 Module 3: Back-Office Admin Dashboard (`hk-admin`)
* **Catalog Management**: Full CRUD operations for Products, Category Trees (parent & subcategories), and Featured Collections.
* **Order Inspection & Proof Modal**:
  * Visual badge list (`✓ PKR 1,000 Verified`, `⏱ Advance Pending`, `✗ Receipt Rejected`).
  * Click-to-zoom deposit screenshot modal (`📷 Receipt Uploaded`).
* **One-Click Order Confirmation**: **"✓ Confirm & Verify PKR 1,000 Advance"** button instantly marks deposit as verified and moves order status to `Processing`.
* **Inventory Rule Audit Logging**: Tracks stock adjustments (`RESTOCK`, `ORDER_RESERVATION`, `DAMAGE`) with user timestamps and IP tracking.

### 🛡️ Module 4: QA, Security & Performance Verification
* **Authentication**: JWT Bearer tokens with `bcrypt` password hashing and `@Roles()` authorization guard.
* **Real-time Sync**: `BroadcastChannel` browser sync updating storefront products instantly when modified in admin portal.
* **Cloudinary CDN Integration**: Automatic image optimization, resizing, and HTTPS hosting.

---

## 📂 Repository Directory Structure

```
hk_fabric_store/
├── hk-next/                  # Storefront Application (Next.js 16)
│   ├── app/                  # App Router pages (/shop, /checkout, /order-confirmation)
│   ├── src/                  # State store, API clients, UI components
│   └── package.json
│
├── hk-backend/               # REST API Engine (NestJS 10)
│   ├── src/                  # Modules (orders, products, categories, media)
│   ├── prisma/               # Database Schema (schema.prisma, seed.ts)
│   └── package.json
│
├── hk-admin/                 # Back-Office Admin Portal (Vite + React)
│   ├── src/                  # Pages, AdminContext, DataTable, ImageUploader
│   └── package.json
│
├── HK_Fabric_Project_Documentation.md  # Comprehensive Project Documentation
└── README.md                 # Master Project Readme
```

---

## ⚡ Quick Start & Local Setup Guide

### 1️⃣ Clone Repository
```bash
git clone https://github.com/MuhammadAhsankhan786/hk-ecom-store.git
cd hk-ecom-store
```

### 2️⃣ Start Backend REST API (`hk-backend`)
```bash
cd hk-backend
npm install
npx prisma db push
npm run dev
# Running at http://localhost:5000 (Swagger API: http://localhost:5000/api)
```

### 3️⃣ Start Admin Panel (`hk-admin`)
```bash
cd hk-admin
npm install
npm run dev
# Running at http://localhost:3001
```

### 4️⃣ Start Storefront (`hk-next`)
```bash
cd hk-next
npm install
npm run dev
# Running at http://localhost:3000
```

---

## 📄 Documentation & Submissions

* **Full Documentation File**: [HK_Fabric_Project_Documentation.md](./HK_Fabric_Project_Documentation.md)
* **GitHub Repository**: [MuhammadAhsankhan786/hk-ecom-store](https://github.com/MuhammadAhsankhan786/hk-ecom-store)
* **License**: MIT
