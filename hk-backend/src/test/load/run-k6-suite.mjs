/**
 * HK Fabric Grafana k6 Load Testing Suite Orchestrator
 * Executes Stage 1 (100 VUs), Stage 2 (500 VUs), Stage 3 (1000 VUs),
 * and Same-Product Single-Unit Concurrency Audit.
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

dotenv.config();

const API_BASE = 'http://localhost:5000';
const K6_BIN = path.resolve('k6/k6-v0.56.0-windows-amd64/k6.exe');
const K6_SCRIPT = path.resolve('src/test/load/k6-load-suite.js');
const LOAD_TEST_SECRET = process.env.LOAD_TEST_SECRET || 'hk_fabric_k6_loadtest_secret_2026';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function runStage(stageName, targetProdId, concProdId) {
  const summaryFile = path.resolve(`k6-summary-${stageName}.json`);
  if (fs.existsSync(summaryFile)) fs.unlinkSync(summaryFile);

  const k6Cmd = `"${K6_BIN}" run -e TEST_STAGE=${stageName} -e BASE_URL="${API_BASE}" -e TARGET_PRODUCT_ID="${targetProdId}" -e CONCURRENCY_PRODUCT_ID="${concProdId}" -e LOAD_TEST_SECRET="${LOAD_TEST_SECRET}" --summary-export="${summaryFile}" "${K6_SCRIPT}"`;
  
  console.log(`\n--- RUNNING STAGE: ${stageName} ---`);
  console.log(`Target API: ${API_BASE}`);

  const startMs = Date.now();
  let k6Output = '';
  try {
    k6Output = execSync(k6Cmd, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
  } catch (cmdErr) {
    k6Output = cmdErr.stdout || cmdErr.stderr || String(cmdErr);
  }
  const durationSec = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`✓ Stage ${stageName} completed in ${durationSec}s.`);

  let metrics = {
    stage: stageName,
    reqs: 0,
    rps: '0.00',
    avg: '0.00',
    p95: '0.00',
    p99: '0.00',
    rate429: '0.00%',
    rate5xx: '0.00%',
    rate2xx: '0.00%',
  };

  if (fs.existsSync(summaryFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(summaryFile, 'utf-8'));
      const m = data.metrics || {};
      const httpReqs = m.http_reqs || {};
      const httpDur = m.http_req_duration || {};
      
      const totalCount = httpReqs.count || (httpReqs.values ? httpReqs.values.count : 0) || 0;
      metrics.reqs = totalCount;
      metrics.rps = (httpReqs.rate || (httpReqs.values ? httpReqs.values.rate : 0) || 0).toFixed(2);
      
      const durVals = httpDur.values || httpDur;
      metrics.avg = (durVals.avg || 0).toFixed(2);
      metrics.p95 = (durVals['p(95)'] || 0).toFixed(2);
      metrics.p99 = (durVals['p(99)'] || 0).toFixed(2);

      const count2xxVal = m.http_2xx_success?.count || (m.http_2xx_success?.values ? m.http_2xx_success.values.count : 0) || 0;
      const count429Val = m.http_429_throttled?.count || (m.http_429_throttled?.values ? m.http_429_throttled.values.count : 0) || 0;
      const count5xxVal = m.http_5xx_server_error?.count || (m.http_5xx_server_error?.values ? m.http_5xx_server_error.values.count : 0) || 0;

      if (totalCount > 0) {
        metrics.rate2xx = ((count2xxVal / totalCount) * 100).toFixed(2) + '%';
        metrics.rate429 = ((count429Val / totalCount) * 100).toFixed(2) + '%';
        metrics.rate5xx = ((count5xxVal / totalCount) * 100).toFixed(2) + '%';
      }
    } catch (e) {
      console.warn(`Warning parsing ${summaryFile}:`, e.message);
    }
  }

  return { metrics, k6Output };
}

async function runLoadTestSuite() {
  console.log('====================================================');
  console.log('⚡ RUNNING HK FABRIC STAGED LOAD & SCALABILITY SUITE');
  console.log('====================================================\n');

  let stressProduct;
  let concurrencyProduct;
  const stageResults = {};

  try {
    // 1. SEED TEST DATA
    console.log('--- 1. SEEDING ISOLATED STAGING TEST DATA ---');
    stressProduct = await prisma.product.create({
      data: {
        name: `k6 Scalability Item ${Date.now()}`,
        slug: `k6-scale-${Date.now()}`,
        sku: `SKU-K6-SCALE-${Date.now()}`,
        description: 'k6 load test item',
        price: 5000,
        stock: 50000,
        status: 'PUBLISHED',
      },
    });

    concurrencyProduct = await prisma.product.create({
      data: {
        name: `k6 Single-Unit Item ${Date.now()}`,
        slug: `k6-single-${Date.now()}`,
        sku: `SKU-K6-C-${Date.now()}`,
        description: 'Single stock concurrency test item',
        price: 15000,
        stock: 1, // Exactly 1 item!
        status: 'PUBLISHED',
      },
    });

    console.log(`✓ Stress Product Created: ${stressProduct.id} (Stock: 50,000)`);
    console.log(`✓ Single-Unit Product Created: ${concurrencyProduct.id} (Stock: 1)`);

    // 2. RUN STAGE 1: 100 VUs
    const res100 = await runStage('100VU', stressProduct.id, concurrencyProduct.id);
    stageResults['100VU'] = res100.metrics;

    // 3. RUN STAGE 2: 500 VUs
    const res500 = await runStage('500VU', stressProduct.id, concurrencyProduct.id);
    stageResults['500VU'] = res500.metrics;

    // 4. RUN STAGE 3: 1000 VUs
    const res1000 = await runStage('1000VU', stressProduct.id, concurrencyProduct.id);
    stageResults['1000VU'] = res1000.metrics;

    // 5. RUN SCENARIO F: SAME-PRODUCT CONCURRENCY AUDIT
    await runStage('CONCURRENCY_ONLY', stressProduct.id, concurrencyProduct.id);
    
    // Check DB state for single-unit product
    const finalStockProd = await prisma.product.findUnique({
      where: { id: concurrencyProduct.id },
    });
    const orderItemsCreated = await prisma.orderItem.findMany({
      where: { productId: concurrencyProduct.id },
    });

    console.log('\n====================================================');
    console.log('🎯 SAME-PRODUCT SINGLE-UNIT CONCURRENCY AUDIT (50 VUs vs 1 Stock)');
    console.log('====================================================');
    console.log(`• Initial Stock: 1`);
    console.log(`• Concurrent Checkout Requests Sent: 50`);
    console.log(`• Successful Orders Created in DB: ${orderItemsCreated.length}`);
    console.log(`• Remaining Stock in DB: ${finalStockProd?.stock}`);

    let concurrencyPass = false;
    if (orderItemsCreated.length === 1 && finalStockProd?.stock === 0) {
      console.log('✓ OVERSELL PREVENTION AUDIT: PASS! Exactly 1 order created, 49 rejected, stock = 0.');
      concurrencyPass = true;
    } else {
      console.error(`✗ OVERSELL PREVENTION AUDIT: FAIL! Orders=${orderItemsCreated.length}, Stock=${finalStockProd?.stock}`);
    }

    // 6. OUTPUT STAGED METRIC REPORT TABLE
    console.log('\n====================================================');
    console.log('📊 COMPREHENSIVE STAGED LOAD TEST RESULTS');
    console.log('====================================================');
    console.table(stageResults);

  } catch (err) {
    console.error('✗ Exception during k6 execution:', err.message);
  } finally {
    console.log('\n--- CLEANING UP TEST DATA ---');
    if (stressProduct?.id) {
      await prisma.orderItem.deleteMany({ where: { productId: stressProduct.id } });
      await prisma.product.delete({ where: { id: stressProduct.id } });
    }
    if (concurrencyProduct?.id) {
      await prisma.orderItem.deleteMany({ where: { productId: concurrencyProduct.id } });
      await prisma.product.delete({ where: { id: concurrencyProduct.id } });
    }
    await prisma.$disconnect();
    await pool.end();
  }
}

runLoadTestSuite();
