/**
 * Safe DB Migration Script for Neon PostgreSQL
 * Safely adds ProductStatus, CategoryStatus enums, status, publishedAt columns, and indexes.
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './hk-backend/.env' });

const { Pool } = pg;

async function migrate() {
  console.log('🔄 Safely applying schema migration to Neon PostgreSQL...');

  const connectionString = process.env.DATABASE_URL;
  const isLocal = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');
  const isSsl = !isLocal && (connectionString?.includes('sslmode=require') || connectionString?.includes('neon.tech'));

  const pool = new Pool({
    connectionString,
    ssl: isSsl ? { rejectUnauthorized: false } : false,
  });

  try {
    // 1. Create Enums if not exist
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    console.log('✓ Enums ProductStatus & CategoryStatus created/verified.');

    // 2. Add columns to Category
    await pool.query(`
      ALTER TABLE "Category" 
      ADD COLUMN IF NOT EXISTS "status" "CategoryStatus" NOT NULL DEFAULT 'PUBLISHED',
      ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
    `);
    console.log('✓ Category table columns status & publishedAt added.');

    // 3. Add columns to Product
    await pool.query(`
      ALTER TABLE "Product" 
      ADD COLUMN IF NOT EXISTS "status" "ProductStatus" NOT NULL DEFAULT 'PUBLISHED',
      ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
    `);
    console.log('✓ Product table columns status & publishedAt added.');

    // 4. Create Indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "Category_status_publishedAt_idx" ON "Category"("status", "publishedAt");
      CREATE INDEX IF NOT EXISTS "Product_status_publishedAt_idx" ON "Product"("status", "publishedAt");
      CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
    `);
    console.log('✓ Database performance indexes created.');

    console.log('🎉 DB Migration completed successfully!');
  } catch (err) {
    console.error('✗ DB Migration error:', err);
  } finally {
    await pool.end();
  }
}

migrate();
