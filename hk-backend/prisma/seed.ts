import { PrismaClient, UserRole, CouponType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

let connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/hk_fabric';
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

async function main() {
  console.log('🌱 Starting HK Fabric Database Seed...');

  // 1. Seed Super Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@hkfabric.pk' },
    update: {},
    create: {
      email: 'admin@hkfabric.pk',
      passwordHash,
      name: 'HK Fabric Admin',
      phone: '+92 300 0000000',
      role: UserRole.SUPER_ADMIN,
    },
  });
  console.log(`✅ Admin User Seeded: ${admin.email}`);

  // 2. Seed Categories
  const catBedsheets = await prisma.category.upsert({
    where: { slug: 'bedsheets' },
    update: {},
    create: {
      name: 'Bedsheets',
      slug: 'bedsheets',
      description: 'Luxury cotton, satin, and bridal bedsheets',
      image: '/images/categories/bedsheets.jpg',
    },
  });

  const catComforters = await prisma.category.upsert({
    where: { slug: 'comforters' },
    update: {},
    create: {
      name: 'Comforters',
      slug: 'comforters',
      description: 'Quilted bridal comforters and duvet sets',
      image: '/images/categories/comforters.jpg',
    },
  });

  const catCushions = await prisma.category.upsert({
    where: { slug: 'cushions' },
    update: {},
    create: {
      name: 'Cushions',
      slug: 'cushions',
      description: 'Embroidered and velvet cushion covers',
      image: '/images/categories/cushions.jpg',
    },
  });

  console.log('✅ Categories Seeded');

  // 3. Seed Collections
  const colBridal = await prisma.collection.upsert({
    where: { slug: 'bridal-collection' },
    update: {},
    create: {
      name: 'Bridal Collection',
      slug: 'bridal-collection',
      description: 'Royal bridal sets with heavy embroidery',
      isFeatured: true,
    },
  });

  console.log('✅ Collections Seeded');

  // 4. Seed Products
  const product1 = await prisma.product.upsert({
    where: { slug: 'royal-velvet-bridal-set' },
    update: {},
    create: {
      name: 'Royal Velvet Bridal Set',
      slug: 'royal-velvet-bridal-set',
      description: 'Handcrafted 8-piece royal velvet embroidered comforter set including King bedsheet, 4 pillowcases, 2 cushion covers, and heavy comforter.',
      sku: 'HK-BED-001',
      price: 12500,
      salePrice: 9999,
      stock: 25,
      isFeatured: true,
      categoryId: catComforters.id,
      collectionId: colBridal.id,
      variants: {
        create: [
          { sku: 'HK-BED-001-KNG-MRN', size: 'King', color: 'Deep Maroon', colorHex: '#800000', stock: 15 },
          { sku: 'HK-BED-001-KNG-GLD', size: 'King', color: 'Royal Gold', colorHex: '#FFD700', stock: 10 },
        ],
      },
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800', isPrimary: true, sortOrder: 0 },
        ],
      },
    },
  });

  console.log(`✅ Sample Product Seeded: ${product1.name}`);

  // 5. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% Discount on First Purchase',
      discountType: CouponType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 3000,
      isActive: true,
    },
  });

  console.log('✅ Promo Coupons Seeded');
  console.log('🚀 Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
