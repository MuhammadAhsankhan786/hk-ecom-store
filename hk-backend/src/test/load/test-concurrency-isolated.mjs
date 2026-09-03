import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';

dotenv.config();

const API_BASE = 'http://localhost:5000';
const K6_BIN = path.resolve('k6/k6-v0.56.0-windows-amd64/k6.exe');
const K6_SCRIPT = path.resolve('src/test/load/k6-load-suite.js');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function runConcurrencyAudit() {
  console.log('--- ISOLATED SINGLE-UNIT STOCK CONCURRENCY TEST ---');
  const concProd = await prisma.product.create({
    data: {
      name: `k6 Silk Duvet Single ${Date.now()}`,
      slug: `k6-silk-${Date.now()}`,
      sku: `SKU-K6-SILK-${Date.now()}`,
      description: 'Single item concurrency test',
      price: 25000,
      stock: 1, // Exactly 1 item in stock
      status: 'PUBLISHED',
    },
  });

  console.log(`Created single-unit item: ${concProd.id} (Stock: 1)`);

  const k6Cmd = `"${K6_BIN}" run -e TEST_STAGE=CONCURRENCY_ONLY -e BASE_URL="${API_BASE}" -e CONCURRENCY_PRODUCT_ID="${concProd.id}" "${K6_SCRIPT}"`;
  
  try {
    execSync(k6Cmd, { encoding: 'utf-8' });
  } catch (err) {}

  const updatedProd = await prisma.product.findUnique({ where: { id: concProd.id } });
  const orders = await prisma.orderItem.findMany({ where: { productId: concProd.id } });

  console.log('\n--- CONCURRENCY AUDIT RESULT ---');
  console.log(`Initial Stock: 1`);
  console.log(`Concurrent VUs: 50`);
  console.log(`Orders Created in DB: ${orders.length}`);
  console.log(`Final Remaining Stock: ${updatedProd?.stock}`);

  if (orders.length === 1 && updatedProd?.stock === 0) {
    console.log('✅ OVERSELL PREVENTION AUDIT: PASS! Exactly 1 order created, 49 rejected, stock = 0.');
  } else {
    console.log(`⚠️ Result: Orders=${orders.length}, Stock=${updatedProd?.stock}`);
  }

  // Cleanup
  await prisma.orderItem.deleteMany({ where: { productId: concProd.id } });
  await prisma.product.delete({ where: { id: concProd.id } });
  await prisma.$disconnect();
  await pool.end();
}

runConcurrencyAudit();
