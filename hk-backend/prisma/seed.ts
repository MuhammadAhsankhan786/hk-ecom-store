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

  // 2. Seed Parent & Sub-Categories
  const parentCategoriesData = [
    { name: 'Comforter Set Bridal 9 Pieces', slug: 'comforter-set-bridal-9-pieces', description: 'Royal 9-piece embroidered bridal comforter sets with zari work', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800' },
    { name: 'Bridal Bedcover 8 Pieces Set', slug: 'bridal-bedcover-8-pieces-set', description: 'Luxury 8-piece embroidered bridal bedcover sets', image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800' },
    { name: 'Towel & Towel Sets', slug: 'towel-towel-sets', description: 'Ultra-soft combed cotton bath towel & hand towel sets', image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=800' },
    { name: 'Fleece Summer Blankets', slug: 'fleece-summer-blankets', description: 'Lightweight breathable fleece blankets for summer & AC comfort', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800' },
    { name: 'Cotton Comforter & Comforter Sets', slug: 'cotton-comforter-comforter-sets', description: '100% Cotton quilted comforters and microgel duvet sets', image: 'https://images.unsplash.com/photo-1614226114676-8e02ac5f4763?auto=format&fit=crop&w=800' },
    { name: 'Cotton Bedsheets', slug: 'cotton-bedsheets', description: 'Pure Egyptian cotton & satin smooth bedsheet sets', image: 'https://images.unsplash.com/photo-1685122121697-f4515ea401b0?auto=format&fit=crop&w=800' },
    { name: 'Imported Bedspreads', slug: 'imported-bedspreads', description: 'Premium imported quilted & woven bedspreads', image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800' },
    { name: 'Medicated Pillows', slug: 'medicated-pillows', description: 'Orthopedic & ergonomic neck-support medicated pillows', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800' },
    { name: 'Embroidery Bedsheets', slug: 'embroidery-bedsheets', description: 'Intricate machine & hand-embroidered luxury bedsheets', image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800' },
    { name: 'Velvet Bedsheets', slug: 'velvet-bedsheets', description: 'Plush Dutch velvet luxury bedsheet sets for winter', image: 'https://images.unsplash.com/photo-1623944436679-5412c658a358?auto=format&fit=crop&w=800' },
    { name: 'Jacquard Bedsheets', slug: 'jacquard-bedsheets', description: 'Woven champagne & gold royal Jacquard bedsheet sets', image: 'https://images.unsplash.com/photo-1606796913825-2b02883605e9?auto=format&fit=crop&w=800' },
  ];

  const seededCategories: Record<string, any> = {};
  for (const cat of parentCategoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, image: cat.image },
      create: cat,
    });
    seededCategories[cat.slug] = created;
  }

  // Seed Subcategories (Nested Variety Categories)
  const subCategoriesData = [
    // Cotton Bedsheets Subcategories
    { name: 'Single Bedsheets', slug: 'single-bedsheets', parentSlug: 'cotton-bedsheets', description: 'Single size Egyptian cotton bedsheets' },
    { name: 'Double Bedsheets', slug: 'double-bedsheets', parentSlug: 'cotton-bedsheets', description: 'Double king size cotton bedsheets' },
    { name: 'Export Quality Bedsheets', slug: 'export-quality-bedsheets', parentSlug: 'cotton-bedsheets', description: 'High thread count export quality cotton satin sheets' },

    // Bridal Set Subcategories
    { name: 'Cotton Bridal Set', slug: 'cotton-bridal-set', parentSlug: 'comforter-set-bridal-9-pieces', description: 'Pure cotton breathable bridal sets' },
    { name: 'Fancy Zari Bridal Set', slug: 'fancy-zari-bridal-set', parentSlug: 'comforter-set-bridal-9-pieces', description: 'Heavy gold zari embroidered royal bridal sets' },
    { name: 'Velvet Bridal Set', slug: 'velvet-bridal-set', parentSlug: 'comforter-set-bridal-9-pieces', description: 'Royal velvet embroidered wedding sets' },
    { name: 'Silk & Chenille Bridal Set', slug: 'silk-chenille-bridal-set', parentSlug: 'comforter-set-bridal-9-pieces', description: 'Luxury satin silk & chenille bridal sets' },

    // Blankets Subcategories
    { name: 'Single Fleece Blanket', slug: 'single-fleece-blanket', parentSlug: 'fleece-summer-blankets', description: 'Single size lightweight summer fleece blanket' },
    { name: 'Double Fleece Blanket', slug: 'double-fleece-blanket', parentSlug: 'fleece-summer-blankets', description: 'Double size cozy summer blanket' },
    { name: 'Heavy Mink Blanket', slug: 'heavy-mink-blanket', parentSlug: 'fleece-summer-blankets', description: 'Double-ply heavyweight Korean mink blanket' },

    // Comforter Subcategories
    { name: '6-Piece Comforter Set', slug: '6-piece-comforter-set', parentSlug: 'cotton-comforter-comforter-sets', description: 'Complete 6-piece comforter set with sheet & pillowcases' },
    { name: '4-Piece Comforter Set', slug: '4-piece-comforter-set', parentSlug: 'cotton-comforter-comforter-sets', description: '4-piece duvet & pillowcase set' },
    { name: 'King Size Duvet Set', slug: 'king-size-duvet-set', parentSlug: 'cotton-comforter-comforter-sets', description: 'High loft microgel king size duvet set' },
  ];

  for (const sub of subCategoriesData) {
    const parentCat = seededCategories[sub.parentSlug];
    if (parentCat) {
      const createdSub = await prisma.category.upsert({
        where: { slug: sub.slug },
        update: { name: sub.name, description: sub.description, parentId: parentCat.id },
        create: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          parentId: parentCat.id,
          image: parentCat.image,
        },
      });
      seededCategories[sub.slug] = createdSub;
    }
  }

  console.log(`✅ ${parentCategoriesData.length} Root Categories & ${subCategoriesData.length} Subcategories Seeded`);

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
      categoryId: seededCategories['comforter-set-bridal-9-pieces'].id,
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
