/**
 * HK Fabric — Admin User Seed Script
 * Creates the admin user in PostgreSQL (Neon) so the JWT login works.
 * Run: node prisma/seed-admin.mjs
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function main() {
  console.log('🌱 Seeding admin user...');

  const connectionString = process.env.DATABASE_URL;
  const isLocal = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');
  const isSsl = !isLocal && (connectionString?.includes('sslmode=require') || connectionString?.includes('neon.tech'));

  const pool = new Pool({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const email = 'admin@hkfabric.pk';
    const password = 'admin123';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log(`✓ Admin user already exists: ${email}`);
      console.log(`  Role: ${existing.role}`);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: 'HK Fabric Super Admin',
        role: 'SUPER_ADMIN',
      },
    });

    console.log(`✓ Admin user created:`);
    console.log(`  Email:    ${admin.email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     ${admin.role}`);
    console.log(`  ID:       ${admin.id}`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error('✗ Seed failed:', e.message);
  process.exit(1);
});
