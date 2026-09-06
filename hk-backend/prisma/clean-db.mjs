/**
 * HK Fabric — Database Cleanup & Reset Script
 * Cleans all dummy products, categories, collections, orders, reviews, coupons & transactions.
 * Retains the Super Admin account (admin@hkfabric.pk / admin123) for fresh catalog entry.
 * Run: node prisma/clean-db.mjs
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function main() {
  console.log('🧹 Clearing dummy database records...');

  let connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing in .env');
  }

  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  if (isLocal) {
    connectionString = connectionString.replace('?sslmode=require', '').replace('&sslmode=require', '');
  }
  const isSsl = !isLocal && (connectionString.includes('sslmode=require') || connectionString.includes('neon.tech'));

  const pool = new Pool({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Delete in reverse dependency order
    await prisma.orderItem.deleteMany({});
    await prisma.orderStatusHistory.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.order.deleteMany({});

    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});

    await prisma.inventoryTransaction.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.product.deleteMany({});

    await prisma.category.deleteMany({});
    await prisma.collection.deleteMany({});
    await prisma.coupon.deleteMany({});
    await prisma.auditLog.deleteMany({});

    // Keep non-admin users deleted too, only ensure admin user exists
    await prisma.customerProfile.deleteMany({});
    await prisma.address.deleteMany({});
    await prisma.user.deleteMany({
      where: {
        role: {
          not: 'SUPER_ADMIN',
        },
      },
    });

    // Ensure Super Admin user exists
    const email = 'admin@hkfabric.pk';
    const password = 'admin123';
    const existingAdmin = await prisma.user.findUnique({ where: { email } });

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: 'HK Fabric Super Admin',
          role: 'SUPER_ADMIN',
        },
      });
      console.log(`✅ Super Admin created: ${email} / ${password}`);
    } else {
      console.log(`✅ Super Admin preserved: ${email}`);
    }

    console.log('✨ Database successfully cleaned! Clean state ready for fresh catalog entry.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('❌ Clean DB failed:', e.message);
  process.exit(1);
});
