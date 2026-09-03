# HK Fabric — Project Proposal & Specifications

## 1. Project Overview
HK Fabric is a modern, responsive, and scalable e-commerce platform for a Pakistani home-textile retail brand specializing in bedsheets, blankets, comforters, cushions, quilts, and other home-textile products. The platform will provide product browsing, search, filtering, cart management, checkout, online payment, and order tracking.
The system consists of three major components: Customer E-Commerce Website, Admin Management Panel, and Scalable Backend & API System. The architecture will support future growth, high traffic, and potential international expansion.

## 2. Project Objectives
- Build a premium e-commerce storefront.
- Provide a complete online purchasing experience without manual bargaining.
- Support online payment through a suitable approved payment gateway.
- Allow business owners to manage products, prices, categories, inventory, orders, discounts, and content without developer involvement.
- Build a scalable backend for high concurrent traffic.
- Optimize media delivery and implement security, caching, background processing, and database transactions.
- Maintain production-level technical documentation.

## 3. Customer E-Commerce Website
**Technologies:** Next.js, React, TypeScript, Tailwind CSS
- Homepage, product catalog, categories and collections.
- Search, filtering and sorting.
- Product detail pages and image gallery.
- Shopping cart and wishlist.
- Customer account, checkout, online payment and order confirmation.
- Order history and status tracking.
- Reviews, ratings, coupons and discounts.
- Responsive desktop, tablet and mobile experience.

## 4. Admin Management Panel
A separate React-based admin panel will minimize developer dependency for daily store operations.
- **Product management:** create, edit, archive, pricing, sale prices, SKU, attributes and images.
- **Category and collection management.**
- **Inventory:** stock, adjustments, low-stock alerts and history.
- **Orders:** payment status, processing, packing, shipping, delivery and cancellation/refund workflow.
- **Customer profiles and order history.**
- **Marketing:** coupons, discounts, campaigns, featured products and new arrivals.
- **Website content:** homepage banners, hero sections, collections, promotions and announcement bar.
- **Reports:** sales, orders, product performance, inventory and customers.
- **Administration:** users, roles, permissions, audit logs and settings.

## 5. Backend Architecture
**Technologies:** Node.js, NestJS, TypeScript
The backend will provide APIs for authentication, products, categories, inventory, customers, cart, orders, payments, discounts, reviews, admin operations and reports. A modular architecture will keep the system maintainable and scalable.

## 6. Database Architecture
**Database:** PostgreSQL | **ORM:** Prisma
Major entities include Users, Admin Users, Roles, Permissions, Products, Product Images, Categories, Collections, Product Variants, Inventory, Inventory Transactions, Customers, Addresses, Carts, Cart Items, Orders, Order Items, Payments, Coupons, Reviews and Audit Logs. Prisma will handle schema management, type-safe queries, migrations, relationships and transactions.

## 7. Product Image & Media Management
Cloudinary will be used for product image storage, optimization, transformations, responsive delivery and CDN delivery. PostgreSQL will store image metadata and Cloudinary references rather than large binary files.
**Flow:** Admin Panel → Backend → Cloudinary → Image URL / Metadata → PostgreSQL

## 8. Payment Architecture
The store is planned around online payment to keep checkout automated. The final provider depends on merchant onboarding and approval. Potential providers include PayFast, Easypaisa, or another approved Pakistani gateway.
**Payment Flow:** Customer → Cart → Checkout → Payment Gateway → Payment Verification → Order Confirmation
The payment layer will remain provider-independent. COD and manual price bargaining are not part of the planned automated checkout flow.

## 9. Scalability & High-Traffic Architecture
- **Redis** for caching, rate limiting and high-speed temporary data.
- **BullMQ** for background jobs such as emails, notifications, order processing and reports.
- **CDN** for fast static and media delivery.
- **Cloudflare** for DNS, CDN, security, WAF and DDoS protection where applicable.
- Load balancing and horizontal scaling for multiple backend instances.

## 10. Concurrency & Order Safety
- PostgreSQL transactions.
- Atomic inventory updates and inventory reservation.
- Idempotency and payment verification.
- Race-condition prevention.
- Protection against overselling, duplicate orders, duplicate payment processing and incorrect stock quantities.

## 11. Performance
- **Frontend:** Next.js optimization, image optimization, code splitting, lazy loading, efficient rendering, responsive images and caching/revalidation.
- **Backend:** efficient queries, pagination, caching, background processing and rate limiting.
- **Database:** indexing, optimized queries, transactions and connection management.
- **Media:** Cloudinary optimization, CDN delivery and responsive image sizes.

## 12. Security
- Secure authentication and password hashing.
- Authorization and Role-Based Access Control.
- Input validation and API security.
- Rate limiting.
- Secure environment variables.
- Payment verification.
- Secure file uploads.
- Admin access control and audit logging.
- HTTPS.
Sensitive payment and Cloudinary credentials will never be exposed to the frontend.

## 13. Testing
Testing will cover authentication, products, cart, checkout, orders, inventory, payment flow, admin operations, API validation, error handling and responsive UI.
Load testing: k6 may simulate 100, 500, and 1,000+ concurrent users, high product traffic, checkout spikes and API request spikes.

## 14. AI-Assisted Development Tools
- **NTGPT:** primary AI development assistance for implementation, code generation, refactoring, debugging and documentation.
- **ChatGPT:** supporting assistant for architecture, research, debugging, code review, system design and documentation.
- Human review and architectural control will remain part of the development process.

## 15. Development & Documentation
Documentation will cover architecture, technology/version matrix, installation, environment variables, database, Prisma, Redis, BullMQ, Cloudinary, payment integration, APIs, authentication, caching, queues, load balancing, scalability, security, testing, deployment and troubleshooting.
Each major technology will document: what it is, why it was selected, how it is installed, how it works, and where it is used.

## 16. Major Technology Stack
| Layer | Technology |
| --- | --- |
| Customer Frontend | Next.js + React + TypeScript + Tailwind CSS |
| Admin Panel | React + TypeScript + Tailwind CSS |
| Backend | Node.js + NestJS + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache | Redis |
| Background Jobs | BullMQ |
| Media Storage | Cloudinary |
| CDN / Security | Cloudflare |
| Payment | PayFast / Easypaisa / Approved Gateway |
| Load Testing | k6 |
| Version Control | Git + GitHub |
| AI Development | NTGPT + ChatGPT |

## 17. Final Project Architecture
- **Customer:** Next.js Store → Backend API → NestJS / Node.js → PostgreSQL / Prisma → Redis / BullMQ → Payment Gateway / Cloudinary → CDN / Cloudflare
- **Admin:** React Admin Panel → Secure Backend APIs → PostgreSQL / Redis / Cloudinary
The customer store and admin system remain separate applications while sharing centralized backend services and business logic.

## 18. Final Project Goal
Premium Customer Store + Powerful Admin Panel + Secure Backend + Online Payments + Inventory Management + Cloud Media + Caching + Background Jobs + High-Traffic Architecture + Production Documentation.

---

## 19. Current Deliverables & Project Completion Status Matrix

```text
===================================================================================================================
📊 PROJECT DELIVERABLES & COMPLETION MATRIX
===================================================================================================================
Feature / Module                    Tech Stack                       Completion Status       Notes / Verification
-------------------------------------------------------------------------------------------------------------------
1. Customer E-Commerce Storefront    Next.js 16 + React + TypeScript  ✅ 100% COMPLETED       Responsive UI, Cart, Checkout, Wishlist
2. Admin Management Portal          React + Vite + TypeScript        ✅ 100% COMPLETED       CMS, Products, Orders, Inventory, Roles
3. Scalable Backend REST API        Node.js + NestJS + TypeScript    ✅ 100% COMPLETED       Stateless Node Architecture, RBAC Guards
4. Database ORM & Schema            Neon PostgreSQL + Prisma v7      ✅ 100% COMPLETED       Migrations, Indexing, Foreign Keys
5. Provider-Independent Payment     Strategy Pattern (PayFast/EP)    ✅ 100% COMPLETED       MD5/HMAC verification, Retry, Refunds
6. Payment Idempotency Engine       x-idempotency-key Guard          ✅ 100% COMPLETED       Double payment & duplicate order protection
7. Media Streaming & Optimization   Multer Buffer + Cloudinary       ✅ 100% COMPLETED       0-disk-write memory buffer stream to CDN
8. Concurrency & Oversell Protection PostgreSQL Atomic Transactions  ✅ 100% COMPLETED       50 VUs vs 1 item: 1 order, 49 rejected (PASS)
9. Non-Blocking Async Queues        Redis + BullMQ                   ✅ 100% COMPLETED       Email templates, background workers, /health
10. High-Traffic Performance Tuning Grafana k6 + Pool/Timeout Tuning ✅ 100% COMPLETED       367.69 RPS peak throughput (Pool 25, 3s)
11. Automated Regression Suite      QA, Payments, Queues, Load       ✅ 100% COMPLETED       4/4 Test Suites 100% PASS
-------------------------------------------------------------------------------------------------------------------
12. Live Merchant Onboarding Credentials Production Gateway API Keys   ⏳ PENDING ONBOARDING   Inject Live PayFast Keys into Prod .env
13. Production VPS & Load Balancer Ubuntu VPS + PM2 + Nginx SSL      ⏳ PENDING DEPLOYMENT  Final hosting server provisioning
===================================================================================================================
```

### 📌 Summary of Current Project Standing:
- **Core Architecture & Technical Engineering:** **100% FINISHED & VERIFIED.** All storefront features, admin workflows, NestJS APIs, payment engines, concurrency safety, queues, and performance optimizations are fully operational and verified with automated test suites.
- **Remaining Operational Steps:** Merchant onboarding credential injection (`PAYFAST_MERCHANT_ID`, `PAYFAST_SECURE_KEY`) and final hosting server deployment.

