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
    name: 'Bedsheets',
    slug: 'bedsheets',
    description: 'Bridal bedding sets, 600TC cotton satin sheets, and fitted sheet collections.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format',
    productsCount: 8,
    status: 'Active',
    sortOrder: 1,
    seoTitle: 'Bedsheets & Bridal Bedding | HK Fabric Pakistan',
    seoDescription: 'Buy luxury bridal velvet bed sets and cotton bedsheets online in Pakistan.'
  },
  {
    id: 'cat-2',
    name: 'Comforters',
    slug: 'comforters',
    description: 'Heavy winter duvets, microgel down-alternative comforters, and summer quilts.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=600&h=600&fit=crop&auto=format',
    productsCount: 5,
    status: 'Active',
    sortOrder: 2,
    seoTitle: 'Winter Comforters & Duvets | HK Fabric',
    seoDescription: 'High loft winter duvets and microgel quilts.'
  },
  {
    id: 'cat-3',
    name: 'Blankets',
    slug: 'blankets',
    description: 'Double-ply Korean mink blankets, fleece throws, and cashmere blend wool blankets.',
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=600&h=600&fit=crop&auto=format',
    productsCount: 3,
    status: 'Active',
    sortOrder: 3,
    seoTitle: 'Mink Blankets & Fleece Throws | HK Fabric',
    seoDescription: 'Heavy double-ply mink blankets for winter.'
  },
  {
    id: 'cat-4',
    name: 'Cushions',
    slug: 'cushions',
    description: 'Jacquard embroidered cushion covers, velvet accent cushions, and neck rolls.',
    image: 'https://images.unsplash.com/photo-1660407761025-539c2dbc1dc6?w=600&h=600&fit=crop&auto=format',
    productsCount: 3,
    status: 'Active',
    sortOrder: 4,
    seoTitle: 'Decorative Cushion Sets | HK Fabric',
    seoDescription: 'Shop 18x18 gold embroidered and velvet cushions.'
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

export const INITIAL_INVENTORY_LOGS: InventoryAdjustment[] = [
  {
    id: 'inv-log-101',
    productId: 'prod-18',
    productName: 'Ruby Red & Gold Heavy Bridal Bedding Set (10 Pcs)',
    sku: 'HKF-BR-018',
    previousQuantity: 10,
    adjustment: -4,
    newQuantity: 6,
    type: 'Customer Return',
    reason: 'Dispatched 4 sets for Lahore showroom order fulfillment',
    user: 'Tariq Mehmood (Inventory Manager)',
    createdAt: '2026-08-19 14:30'
  },
  {
    id: 'inv-log-102',
    productId: 'prod-17',
    productName: 'Maroon Velvet Heavy Bridal Bedding Set (10 Pcs)',
    sku: 'HKF-BR-017',
    previousQuantity: 8,
    adjustment: -4,
    newQuantity: 4,
    type: 'Audit Correction',
    reason: 'Physical count verified after Gulberg warehouse audit',
    user: 'Ahsan Khan (Super Admin)',
    createdAt: '2026-08-18 11:15'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'HK-9842',
    customerName: 'Fatima Zalmai',
    customerEmail: 'fatima.zalmai@gmail.com',
    customerPhone: '+92 300 8472911',
    shippingAddress: {
      address: 'House #45-B, Block C, Gulberg III',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54000'
    },
    items: [
      {
        productId: 'prod-18',
        productName: 'Ruby Red & Gold Heavy Bridal Bedding Set (10 Pcs)',
        sku: 'HKF-BR-018',
        variant: 'Ruby Red & Gold / King (10 Pcs Set)',
        quantity: 1,
        price: 15999,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop&auto=format'
      }
    ],
    subtotal: 15999,
    shippingFee: 0,
    discount: 1000,
    tax: 0,
    total: 14999,
    paymentMethod: 'Easypaisa',
    paymentStatus: 'Successful',
    paymentReference: 'EP-983719482012',
    easypaisaTxnId: 'EP-983719482012',
    orderStatus: 'Processing',
    timeline: [
      { status: 'Pending Payment', timestamp: '2026-08-19 10:12', note: 'Order placed by customer', by: 'System' },
      { status: 'Paid', timestamp: '2026-08-19 10:15', note: 'Easypaisa instant payment confirmation', by: 'Easypaisa Gateway' },
      { status: 'Processing', timestamp: '2026-08-19 11:30', note: 'Assigned to warehouse packing team', by: 'Zubair Ahmed' }
    ],
    createdAt: '2026-08-19 10:12'
  },
  {
    id: 'ord-1002',
    orderNumber: 'HK-9841',
    customerName: 'Muhammad Usman',
    customerEmail: 'usman.khi@hotmail.com',
    customerPhone: '+92 321 9845112',
    shippingAddress: {
      address: 'Apartment 402, Royal Residency, Clifton Block 4',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75600'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Premium Digital Printed Bedsheet Set',
        sku: 'HKF-BS-001',
        variant: 'White / King',
        quantity: 2,
        price: 4499,
        image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=400&fit=crop&auto=format'
      }
    ],
    subtotal: 8998,
    shippingFee: 250,
    discount: 0,
    tax: 0,
    total: 9248,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Packed',
    timeline: [
      { status: 'Pending Payment', timestamp: '2026-08-18 16:40', note: 'COD order confirmed via phone call', by: 'Zubair Ahmed' },
      { status: 'Processing', timestamp: '2026-08-18 17:00', note: 'Dispatched to fulfillment', by: 'Zubair Ahmed' },
      { status: 'Packed', timestamp: '2026-08-19 09:00', note: 'Dispatched label printed for Leopard Courier', by: 'Warehouse' }
    ],
    createdAt: '2026-08-18 16:40'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn-1',
    transactionId: 'EP-983719482012',
    orderId: 'HK-9842',
    customerName: 'Fatima Zalmai',
    amount: 14999,
    provider: 'Easypaisa',
    status: 'Successful',
    reference: 'REF-EP-20260819-9842',
    createdAt: '2026-08-19 10:15',
    rawPayload: '{"response_code":"0000","response_message":"TRANSACTION SUCCESSFUL","merchant_id":"HK_FABRIC_882","account_number":"0300****911"}'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Fatima Zalmai',
    email: 'fatima.zalmai@gmail.com',
    phone: '+92 300 8472911',
    city: 'Lahore',
    ordersCount: 4,
    totalSpent: 68500,
    lastOrderDate: '2026-08-19',
    status: 'Active',
    addresses: [
      {
        title: 'Home Address',
        address: 'House #45-B, Block C, Gulberg III',
        city: 'Lahore',
        province: 'Punjab',
        isDefault: true
      }
    ],
    createdAt: '2025-11-10'
  },
  {
    id: 'cust-2',
    name: 'Muhammad Usman',
    email: 'usman.khi@hotmail.com',
    phone: '+92 321 9845112',
    city: 'Karachi',
    ordersCount: 2,
    totalSpent: 28500,
    lastOrderDate: '2026-08-18',
    status: 'Active',
    addresses: [
      {
        title: 'Apartment',
        address: 'Apartment 402, Royal Residency, Clifton Block 4',
        city: 'Karachi',
        province: 'Sindh',
        isDefault: true
      }
    ],
    createdAt: '2026-02-14'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderValue: 5000,
    maxDiscount: 2000,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 142,
    perCustomerLimit: 1,
    status: 'Active'
  },
  {
    id: 'coup-2',
    code: 'AZADI2026',
    type: 'fixed',
    value: 1400,
    minOrderValue: 10000,
    startDate: '2026-08-10',
    expiryDate: '2026-08-25',
    usageLimit: 200,
    usedCount: 88,
    perCustomerLimit: 1,
    status: 'Active'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-18',
    productName: 'Ruby Red & Gold Heavy Bridal Bedding Set (10 Pcs)',
    customerName: 'Fatima Zalmai',
    customerEmail: 'fatima.zalmai@gmail.com',
    rating: 5,
    comment: 'SubhanAllah! The metallic zari gold work is unbelievably refined and beautiful. Exactly as shown in photos. Fits our King bed perfectly.',
    verifiedPurchase: true,
    status: 'Approved',
    createdAt: '2026-08-19 18:20'
  }
];

export const INITIAL_CMS: HomepageCMS = {
  heroBanners: [
    {
      id: 'hb-1',
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1600&h=800&fit=crop&auto=format',
      heading: 'Royal Pakistani Bridal Bedding 2026',
      description: 'Handcrafted embroidered velvet & satin silk 10-piece bridal bed sets for grand weddings.',
      ctaText: 'Explore Wedding Collection',
      ctaLink: '/shop?category=bedsheets',
      isActive: true
    }
  ],
  featuredProductIds: ['prod-18', 'prod-17', 'prod-1'],
  featuredCollectionIds: ['col-1', 'col-2', 'col-4'],
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
    name: 'Ahsan Khan',
    email: 'ahsan@hkfabric.pk',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: '2026-08-20 02:20',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format'
  },
  {
    id: 'user-2',
    name: 'Tariq Mehmood',
    email: 'tariq.inventory@hkfabric.pk',
    role: 'Inventory Manager',
    status: 'Active',
    lastLogin: '2026-08-19 16:30'
  },
  {
    id: 'user-3',
    name: 'Zubair Ahmed',
    email: 'zubair.orders@hkfabric.pk',
    role: 'Order Manager',
    status: 'Active',
    lastLogin: '2026-08-19 18:10'
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
  },
  {
    role: 'Order Manager',
    description: 'Access restricted to order processing, fulfillment, and customer customer profiles.',
    permissions: { products: false, orders: true, inventory: false, customers: true, content: false, reports: false, settings: false }
  },
  {
    role: 'Content Manager',
    description: 'Access restricted to homepage CMS, promo banners, collections, and product reviews.',
    permissions: { products: true, orders: false, inventory: false, customers: false, content: true, reports: false, settings: false }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    user: 'Ahsan Khan (Super Admin)',
    action: 'Changed product sale price',
    entity: 'Product',
    entityId: 'HKF-BR-018',
    previousValue: 'PKR 19,999',
    newValue: 'PKR 15,999',
    timestamp: '2026-08-19 22:15',
    ipAddress: '111.68.102.14 (Lahore, PK)'
  }
];

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
  orderNotificationEmails: 'orders@hkfabric.pk, ahsan@hkfabric.pk',
  seoTitle: 'HK Fabric — Luxury Home Textiles & Bedding Pakistan',
  seoDescription: 'Buy 100% Egyptian cotton sheets, bridal bed sets, goose down duvets, and cushions online in Pakistan.'
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Warning',
    message: 'Maroon Velvet Heavy Bridal Bedding Set (HKF-BR-017) has reached 4 remaining units.',
    type: 'stock',
    isRead: false,
    createdAt: '2026-08-19 23:00'
  },
  {
    id: 'notif-2',
    title: 'Easypaisa Payment Verified',
    message: 'Order #HK-9842 (PKR 14,999) payment confirmed automatically by Easypaisa.',
    type: 'payment',
    isRead: false,
    createdAt: '2026-08-19 10:15'
  }
];
