import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables in DB:', res.rows.map(r => r.table_name));

  // Check if tables are "products" and "categories" or "Product" and "Category"
  const tables = res.rows.map(r => r.table_name);
  const prodTable = tables.includes('products') ? 'products' : (tables.includes('Product') ? '"Product"' : null);
  const catTable = tables.includes('categories') ? 'categories' : (tables.includes('Category') ? '"Category"' : null);

  console.log(`Product Table: ${prodTable}, Category Table: ${catTable}`);

  if (prodTable && catTable) {
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
      DO $$ BEGIN
        CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `);

    await pool.query(`
      ALTER TABLE ${catTable} 
      ADD COLUMN IF NOT EXISTS "status" "CategoryStatus" NOT NULL DEFAULT 'PUBLISHED',
      ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
    `);

    await pool.query(`
      ALTER TABLE ${prodTable} 
      ADD COLUMN IF NOT EXISTS "status" "ProductStatus" NOT NULL DEFAULT 'PUBLISHED',
      ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
    `);

    console.log('✓ Migration applied successfully to tables:', prodTable, catTable);
  }

  await pool.end();
}

run();
