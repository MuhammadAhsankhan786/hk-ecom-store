export interface Product {
  id: number | string
  name: string
  slug: string
  category: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  badge?: 'sale' | 'new' | 'limited'
  publishedAt?: string
  status?: string
  inStock: boolean
  lowStock?: boolean
  material: string
  sizes: string[]
  colors: string[]
  description: string
  sku: string
}

export interface CartItem extends Product {
  qty: number
  selectedSize: string
  selectedColor: string
}

export const products: Product[] = []
