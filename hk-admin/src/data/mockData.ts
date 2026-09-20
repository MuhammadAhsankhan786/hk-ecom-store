import type {
  Product, Category, Collection, InventoryAdjustment, Order,
  Transaction, Customer, Coupon, Review, HomepageCMS, AdminUser,
  RolePermission, AuditLog, StoreSettings, NotificationItem
} from '../types/admin';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-18',
    name: 'Ruby Red & Gold Heavy Bridal Bedding Set (10 Pcs)',
    slug: 'ruby-red-bridal-set',
    sku: 'HKF-BR-018',
    category: 'Bedsheets',
    subcategory: 'Bridal Collection',
    collection: 'Wedding Collection',
    price: 15999,
    salePrice: 15999,
    costPrice: 10000,
    stock: 6,
    reservedStock: 1,
    lowStockThreshold: 5,
    status: 'Active',
    isFeatured: true,
    size: ['King (10 Pcs Set)', 'Super King (10 Pcs Set)'],
    color: ['Ruby Red & Gold', 'Crimson Red', 'Maroon & Gold'],
    material: 'Royal Velvet & 400TC Pure Satin Silk with Metallic Gold Zari',
    pattern: 'Gold Dabka & Zari Embroidery',
    fabric: 'Heavy Velvet & Silk',
    shortDescription: 'Our iconic Ruby Red & Gold Heavy Pakistani Bridal Set with gold zari work.',
    description: 'Crafted for grand Pakistani weddings, this 10-piece masterpiece includes 1 heavy gold-embroidered red velvet duvet cover, 1 satin silk fitted sheet, 2 quilted embroidered velvet pillow covers, 2 satin silk pillowcases, 2 round bolster cushions, and 2 accent square cushions with gold dabka work.',
    images: [
      {
        id: 'img-18a',
        url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop&auto=format',
        filename: 'ruby-red-bridal.jpg',
        altText: 'Ruby Red Bridal Set',
        sortOrder: 1,
        isPrimary: true
      },
      {
        id: 'img-18b',
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop&auto=format',
        filename: 'ruby-red-detail.jpg',
        altText: 'Gold Embroidery Detail',
        sortOrder: 2,
        isPrimary: false
      }
    ],
    createdAt: '2026-08-01',
    updatedAt: '2026-08-19'
  },
  {
    id: 'prod-17',
    name: 'Maroon Velvet Heavy Bridal Bedding Set (10 Pcs)',
    slug: 'maroon-velvet-bridal-set',
    sku: 'HKF-BR-017',
    category: 'Bedsheets',
    subcategory: 'Bridal Collection',
    collection: 'Wedding Collection',
    price: 14999,
    salePrice: 14999,
    costPrice: 9000,
    stock: 4,
    reservedStock: 0,
    lowStockThreshold: 5,
    status: 'Active',
    isFeatured: true,
    size: ['King (10 Pcs Set)', 'Super King (10 Pcs Set)'],
    color: ['Deep Royal Maroon', 'Maroon & Gold'],
    material: 'Heavy Dutch Velvet & 400TC Pure Satin Silk',
    pattern: 'Metallic Zari Motif',
    fabric: 'Dutch Velvet',
    shortDescription: '10-piece royal velvet Pakistani bridal bed set for grand weddings.',
    description: 'Premier Maroon Velvet Heavy Pakistani Bridal Set. Features 1 heavy embroidered velvet comforter duvet, 1 satin silk fitted sheet, 2 quilted embroidered velvet pillow covers, 2 satin silk pillowcases, 2 neck roll cushions, and 2 accent square cushions.',
    images: [
      {
        id: 'img-17a',
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=800&fit=crop&auto=format',
        filename: 'maroon-velvet-bridal.jpg',
        altText: 'Maroon Velvet Bridal Set',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-07-28',
    updatedAt: '2026-08-18'
  },
  {
    id: 'prod-1',
    name: 'Premium Digital Printed Bedsheet Set',
    slug: 'premium-digital-printed-bedsheet-set',
    sku: 'HKF-BS-001',
    category: 'Bedsheets',
    price: 4499,
    salePrice: 4499,
    costPrice: 2500,
    stock: 25,
    reservedStock: 2,
    lowStockThreshold: 8,
    status: 'Active',
    isFeatured: true,
    size: ['Single', 'Double', 'King', 'Super King'],
    color: ['White', 'Ivory', 'Blush', 'Navy'],
    material: '100% Cotton Satin',
    pattern: 'Vibrant Digital Print',
    fabric: 'Cotton Satin',
    shortDescription: '100% cotton satin digital printed sheet set with flat sheet, fitted sheet & pillowcases.',
    description: 'Elevate your bedroom with our Premium Digital Printed Bedsheet Set. Crafted from 100% cotton satin, this set features vibrant digital prints that retain their color wash after wash.',
    images: [
      {
        id: 'img-1a',
        url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=800&fit=crop&auto=format',
        filename: 'digital-printed-sheet.jpg',
        altText: 'Digital Printed Bedsheet',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-06-15',
    updatedAt: '2026-08-10'
  },
  {
    id: 'prod-2',
    name: 'Luxury Jacquard Bedsheet Set',
    slug: 'luxury-jacquard-bedsheet-set',
    sku: 'HKF-BS-002',
    category: 'Bedsheets',
    price: 6999,
    costPrice: 4000,
    stock: 14,
    reservedStock: 1,
    lowStockThreshold: 5,
    status: 'Active',
    isFeatured: true,
    size: ['Double', 'King', 'Super King'],
    color: ['Champagne', 'Silver', 'Charcoal'],
    material: 'Jacquard Weave Cotton',
    pattern: 'Woven Jacquard Damask',
    fabric: 'Jacquard Cotton',
    shortDescription: 'Intricate woven Jacquard damask pattern bedsheets for elegant bedrooms.',
    description: 'A masterpiece in weave craftsmanship. Our Luxury Jacquard Bedsheet Set features intricate patterns woven directly into the fabric.',
    images: [
      {
        id: 'img-2a',
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&h=800&fit=crop&auto=format',
        filename: 'jacquard-bedsheet.jpg',
        altText: 'Luxury Jacquard Bedsheet',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-06-20',
    updatedAt: '2026-08-12'
  },
  {
    id: 'prod-3',
    name: 'Emerald Royal Printed Bedsheet Set',
    slug: 'emerald-royal-printed-bedsheet-set',
    sku: 'HKF-BS-005',
    category: 'Bedsheets',
    price: 4999,
    salePrice: 4999,
    costPrice: 2800,
    stock: 18,
    reservedStock: 3,
    lowStockThreshold: 5,
    status: 'Active',
    isFeatured: false,
    size: ['Single', 'Double', 'King', 'Super King'],
    color: ['Emerald Green', 'Royal Gold', 'Deep Olive'],
    material: '100% Egyptian Cotton Satin',
    pattern: 'Golden Filigree Accents',
    fabric: 'Egyptian Cotton',
    shortDescription: 'Regal emerald green hues with golden filigree printed cotton satin sheets.',
    description: 'Immerse yourself in regal luxury with our Emerald Royal Printed Bedsheet Set. Featuring rich emerald hues paired with golden filigree accents.',
    images: [
      {
        id: 'img-3a',
        url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&h=800&fit=crop&auto=format',
        filename: 'emerald-royal.jpg',
        altText: 'Emerald Royal Bedsheet',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-07-01',
    updatedAt: '2026-08-14'
  },
  {
    id: 'prod-7',
    name: 'Royal Indigo Heavy Winter Duvet',
    slug: 'royal-indigo-heavy-winter-duvet',
    sku: 'HKF-CM-003',
    category: 'Comforters',
    price: 11499,
    salePrice: 11499,
    costPrice: 7000,
    stock: 8,
    reservedStock: 1,
    lowStockThreshold: 4,
    status: 'Active',
    isFeatured: true,
    size: ['Double', 'King', 'Super King'],
    color: ['Royal Indigo', 'Gold Trim', 'Midnight Navy'],
    material: 'Microgel Down Alternative Fill, 400TC Cotton',
    pattern: 'Quilted Box Stitch',
    fabric: '400TC Cotton Shell',
    shortDescription: 'Flagship indigo winter duvet with microgel down-alternative insulation.',
    description: 'Our flagship winter duvet set. Featuring deep royal indigo velvet trim with high-loft down-alternative microgel filling that keeps you cozy down to freezing temperatures.',
    images: [
      {
        id: 'img-7a',
        url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&h=800&fit=crop&auto=format',
        filename: 'indigo-duvet.jpg',
        altText: 'Royal Indigo Duvet',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-05-10',
    updatedAt: '2026-08-05'
  },
  {
    id: 'prod-11',
    name: 'Emerald Sage Heavy Mink Blanket',
    slug: 'emerald-sage-heavy-mink-blanket',
    sku: 'HKF-BL-002',
    category: 'Blankets',
    price: 6299,
    salePrice: 6299,
    costPrice: 3500,
    stock: 12,
    reservedStock: 0,
    lowStockThreshold: 5,
    status: 'Active',
    isFeatured: false,
    size: ['Single', 'Double', 'King'],
    color: ['Emerald Sage', 'Forest Green', 'Silver Grey'],
    material: 'Double-Ply Heavyweight Korean Mink',
    pattern: 'Plush Embossed',
    fabric: 'Korean Mink Fleece',
    shortDescription: 'Heavyweight double-ply Korean mink blanket for harsh winters.',
    description: 'Heavyweight double-ply Korean mink blanket featuring rich emerald sage tones. Exceptionally soft, ultra-warm, and built for winter comfort.',
    images: [
      {
        id: 'img-11a',
        url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&h=800&fit=crop&auto=format',
        filename: 'mink-blanket.jpg',
        altText: 'Emerald Sage Mink Blanket',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-06-12',
    updatedAt: '2026-08-02'
  },
  {
    id: 'prod-14',
    name: 'Royal Velvet Accent Cushions (Set of 2)',
    slug: 'royal-velvet-accent-cushions-set-of-2',
    sku: 'HKF-CU-002',
    category: 'Cushions',
    price: 2499,
    costPrice: 1200,
    stock: 30,
    reservedStock: 2,
    lowStockThreshold: 10,
    status: 'Active',
    isFeatured: true,
    size: ['18x18"', '20x20"'],
    color: ['Royal Sapphire', 'Emerald Green', 'Crimson Red'],
    material: 'Dutch Velvet Cover, Microfiber Fill',
    pattern: 'Solid Velvet',
    fabric: 'Dutch Velvet',
    shortDescription: 'Set of 2 plush Dutch velvet accent cushions with concealed zipper.',
    description: 'Add striking pop of color and plush texture to your sofa or bed with our Royal Velvet Accent Cushions. Features concealed zipper closures and dense fiber filling.',
    images: [
      {
        id: 'img-14a',
        url: 'https://images.unsplash.com/photo-1660407761025-539c2dbc1dc6?w=800&h=800&fit=crop&auto=format',
        filename: 'velvet-cushions.jpg',
        altText: 'Royal Velvet Cushions',
        sortOrder: 1,
        isPrimary: true
      }
    ],
    createdAt: '2026-07-15',
    updatedAt: '2026-08-16'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Comforter Set Bridal 9 Pieces',
    slug: 'comforter-set-bridal-9-pieces',
    description: 'Royal 9-piece embroidered bridal comforter sets with zari work',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop&auto=format',
    productsCount: 4,
    status: 'Active',
    sortOrder: 1,
    seoTitle: 'Comforter Set Bridal 9 Pieces | HK Fabric',
    seoDescription: 'Royal 9-piece embroidered bridal comforter sets with zari work'
  },
  {
    id: 'cat-2',
    name: 'Bridal Bedcover 8 Pieces Set',
    slug: 'bridal-bedcover-8-pieces-set',
    description: 'Luxury 8-piece embroidered bridal bedcover sets',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format',
    productsCount: 3,
    status: 'Active',
    sortOrder: 2,
    seoTitle: 'Bridal Bedcover 8 Pieces Set | HK Fabric',
    seoDescription: 'Luxury 8-piece embroidered bridal bedcover sets'
  },
  {
    id: 'cat-3',
    name: 'Towel & Towel Sets',
    slug: 'towel-towel-sets',
    description: 'Ultra-soft combed cotton bath towel & hand towel sets',
    image: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&h=600&fit=crop&auto=format',
    productsCount: 5,
    status: 'Active',
    sortOrder: 3,
    seoTitle: 'Towel & Towel Sets | HK Fabric',
    seoDescription: 'Ultra-soft combed cotton bath towel & hand towel sets'
  },
  {
    id: 'cat-4',
    name: 'Fleece Summer Blankets',
    slug: 'fleece-summer-blankets',
    description: 'Lightweight breathable fleece blankets for summer & AC comfort',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=600&fit=crop&auto=format',
    productsCount: 6,
    status: 'Active',
    sortOrder: 4,
    seoTitle: 'Fleece Summer Blankets | HK Fabric',
    seoDescription: 'Lightweight breathable fleece blankets for summer & AC comfort'
  },
  {
    id: 'cat-5',
    name: 'Cotton Comforter & Comforter Sets',
    slug: 'cotton-comforter-comforter-sets',
    description: '100% Cotton quilted comforters and microgel duvet sets',
    image: 'https://images.unsplash.com/photo-1614226114676-8e02ac5f4763?w=600&h=600&fit=crop&auto=format',
    productsCount: 5,
    status: 'Active',
    sortOrder: 5,
    seoTitle: 'Cotton Comforter & Comforter Sets | HK Fabric',
    seoDescription: '100% Cotton quilted comforters and microgel duvet sets'
  },
  {
    id: 'cat-6',
    name: 'Cotton Bedsheets',
    slug: 'cotton-bedsheets',
    description: 'Pure Egyptian cotton & satin smooth bedsheet sets',
    image: 'https://images.unsplash.com/photo-1685122121697-f4515ea401b0?w=600&h=600&fit=crop&auto=format',
    productsCount: 8,
    status: 'Active',
    sortOrder: 6,
    seoTitle: 'Cotton Bedsheets | HK Fabric',
    seoDescription: 'Pure Egyptian cotton & satin smooth bedsheet sets'
  },
  {
    id: 'cat-7',
    name: 'Imported Bedspreads',
    slug: 'imported-bedspreads',
    description: 'Premium imported quilted & woven bedspreads',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=600&fit=crop&auto=format',
    productsCount: 4,
    status: 'Active',
    sortOrder: 7,
    seoTitle: 'Imported Bedspreads | HK Fabric',
    seoDescription: 'Premium imported quilted & woven bedspreads'
  },
  {
    id: 'cat-8',
    name: 'Medicated Pillows',
    slug: 'medicated-pillows',
    description: 'Orthopedic & ergonomic neck-support medicated pillows',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
    productsCount: 3,
    status: 'Active',
    sortOrder: 8,
    seoTitle: 'Medicated Pillows | HK Fabric',
    seoDescription: 'Orthopedic & ergonomic neck-support medicated pillows'
  },
  {
    id: 'cat-9',
    name: 'Embroidery Bedsheets',
    slug: 'embroidery-bedsheets',
    description: 'Intricate machine & hand-embroidered luxury bedsheets',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=600&fit=crop&auto=format',
    productsCount: 4,
    status: 'Active',
    sortOrder: 9,
    seoTitle: 'Embroidery Bedsheets | HK Fabric',
    seoDescription: 'Intricate machine & hand-embroidered luxury bedsheets'
  },
  {
    id: 'cat-10',
    name: 'Velvet Bedsheets',
    slug: 'velvet-bedsheets',
    description: 'Plush Dutch velvet luxury bedsheet sets for winter',
    image: 'https://images.unsplash.com/photo-1623944436679-5412c658a358?w=600&h=600&fit=crop&auto=format',
    productsCount: 5,
    status: 'Active',
    sortOrder: 10,
    seoTitle: 'Velvet Bedsheets | HK Fabric',
    seoDescription: 'Plush Dutch velvet luxury bedsheet sets for winter'
  },
  {
    id: 'cat-11',
    name: 'Jacquard Bedsheets',
    slug: 'jacquard-bedsheets',
    description: 'Woven champagne & gold royal Jacquard bedsheet sets',
    image: 'https://images.unsplash.com/photo-1606796913825-2b02883605e9?w=600&h=600&fit=crop&auto=format',
    productsCount: 4,
    status: 'Active',
    sortOrder: 11,
    seoTitle: 'Jacquard Bedsheets | HK Fabric',
    seoDescription: 'Woven champagne & gold royal Jacquard bedsheet sets'
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Wedding Collection',
    description: 'Heavy gold zari embroidered 10-piece bridal velvet bed sets for grand Pakistani weddings.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop&auto=format',
    productsCount: 4,
    sortOrder: 1,
    status: 'Active',
    seoTitle: 'Pakistani Bridal Bedding Collection | HK Fabric',
    seoDescription: 'Royal velvet 10-piece wedding bed sets.'
  },
  {
    id: 'col-2',
    name: 'Summer Breeze 2026',
    description: 'Breathable 100% Egyptian cotton satin digital printed sheets for summer.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format',
    productsCount: 6,
    sortOrder: 2,
    status: 'Active',
    seoTitle: 'Summer Bedding Collection | HK Fabric',
    seoDescription: 'Cool cotton summer sheet sets.'
  },
  {
    id: 'col-3',
    name: 'Winter Warmth',
    description: 'Heavy double-ply mink blankets and royal indigo microgel duvets.',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&h=600&fit=crop&auto=format',
    productsCount: 5,
    sortOrder: 3,
    status: 'Active',
    seoTitle: 'Winter Blanket & Duvet Collection | HK Fabric',
    seoDescription: 'Thermal winter blankets and comforters.'
  },
  {
    id: 'col-4',
    name: 'Best Sellers',
    description: 'Top customer-rated home textile items across Pakistan.',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=600&fit=crop&auto=format',
    productsCount: 8,
    sortOrder: 4,
    status: 'Active',
    seoTitle: 'Best Selling Bedding in Pakistan | HK Fabric',
    seoDescription: 'Most loved HK Fabric home textiles.'
  }
];

export const INITIAL_INVENTORY_LOGS: InventoryAdjustment[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_CUSTOMERS: Customer[] = [];

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_CMS: HomepageCMS = {
  heroBanners: [
    {
      id: 'hb-1',
      image: '/images/hero/hero-slide-1.jpg',
      heading: 'Classic Cream & Gold Hand-Embroidered Bedding',
      description: 'Comfort in Every Thread — Indulge in premium Egyptian cotton featuring intricate floral embroidery and luxury matching pillowcases.',
      ctaText: 'Shop Embroidered Set',
      ctaLink: '/shop?category=Embroidery%20Bedsheets',
      isActive: true
    },
    {
      id: 'hb-2',
      image: '/images/hero/hero-slide-2.jpg',
      heading: 'Elegance for a Lifetime — Heavy Velvet Bridal Trousseau',
      description: 'Make your wedding trousseau royal with our embroidered cream & maroon velvet 10-piece bridal set crafted with gold zari embroidery.',
      ctaText: 'Shop Royal Bridal Set',
      ctaLink: '/shop?category=Comforter%20Set%20Bridal%209%20Pieces',
      isActive: true
    },
    {
      id: 'hb-3',
      image: '/images/hero/hero-slide-3.jpg',
      heading: 'For Your Most Beautiful Beginning — Gold & Crimson Set',
      description: 'Experience unmatched grandeur with rich crimson velvet trim, intricate gold floral motifs, and royal satin pillow shams.',
      ctaText: 'Shop Crimson Bridal',
      ctaLink: '/shop?category=Bridal%20Bedcover%208%20Pieces%20Set',
      isActive: true
    },
    {
      id: 'hb-4',
      image: '/images/hero/hero-slide-4.jpg',
      heading: 'Light. Breathable. Beautiful. For Brighter, Cooler Days.',
      description: 'Stay cool through warm summer nights with 100% pure combed cotton bedsheets adorned with soft sage green botanical prints.',
      ctaText: 'Shop Summer Cotton',
      ctaLink: '/shop?category=Cotton%20Bedsheets',
      isActive: true
    },
    {
      id: 'hb-5',
      image: '/images/hero/hero-slide-5.jpg',
      heading: 'Warmer. Cozier. Happier Together — Charcoal Plush Mink',
      description: 'Wrap yourself in ultimate winter warmth with our heavy double-ply plush mink blanket set featuring embossed botanical leaves.',
      ctaText: 'Shop Winter Mink',
      ctaLink: '/shop?category=Fleece%20Summer%20Blankets',
      isActive: true
    }
  ],
  featuredProductIds: [],
  featuredCollectionIds: [],
  promotionalBanner: {
    id: 'pb-1',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&h=800&fit=crop&auto=format',
    heading: 'Azadi Sale — Flat 15% OFF',
    discountTag: 'AZADI2026',
    ctaText: 'Claim Discount',
    ctaLink: '/shop',
    isActive: true
  },
  announcementBarText: '✨ FREE SHIPPING across Pakistan on all orders above PKR 5,000 | Pay safely via Easypaisa or Cash on Delivery ✨',
  isAnnouncementActive: true
};

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Muhammad Ahsan',
    email: 'admin@hkfabric.pk',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format'
  },
  {
    id: 'user-2',
    name: 'Store Manager',
    email: 'manager@hkfabric.pk',
    role: 'Store Manager',
    status: 'Active',
    lastLogin: '2026-08-25'
  }
];

export const INITIAL_ROLES_MATRIX: RolePermission[] = [
  {
    role: 'Super Admin',
    description: 'Full unrestricted access to all store modules, settings, and team management.',
    permissions: { products: true, orders: true, inventory: true, customers: true, content: true, reports: true, settings: true }
  },
  {
    role: 'Store Manager',
    description: 'Manages products, catalog, orders, stock adjustments, and customer records.',
    permissions: { products: true, orders: true, inventory: true, customers: true, content: true, reports: true, settings: false }
  },
  {
    role: 'Inventory Manager',
    description: 'Access restricted to product catalog, stock adjustments, and inventory reports.',
    permissions: { products: true, orders: false, inventory: true, customers: false, content: false, reports: true, settings: false }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'HK Fabric',
  logoUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=120&h=120&fit=crop&auto=format',
  contactEmail: 'support@hkfabric.pk',
  contactPhone: '+92 42 35789000',
  storeAddress: 'HK Textile Tower, Main Boulevard, Gulberg III, Lahore, Pakistan',
  easypaisaMerchantId: 'HK_FABRIC_882',
  easypaisaStoreId: 'STORE_LHR_01',
  easypaisaSecretMasked: '••••••••••••••••984A',
  isEasypaisaLive: true,
  defaultShippingFee: 250,
  freeShippingThreshold: 5000,
  taxRatePercent: 0,
  orderNotificationEmails: 'orders@hkfabric.pk, admin@hkfabric.pk',
  seoTitle: 'HK Fabric — Luxury Home Textiles & Bedding Pakistan',
  seoDescription: 'Buy 100% Egyptian cotton sheets, bridal bed sets, goose down duvets, and cushions online in Pakistan.'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
