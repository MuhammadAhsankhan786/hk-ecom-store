'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { products, type Product, type CartItem } from './data/products'

export type { Product, CartItem }
export { products }

interface StoreContextType {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (p: Product, size: string, color: string, qty?: number) => void
  removeFromCart: (id: number, size: string, color: string) => void
  updateQty: (id: number, size: string, color: string, qty: number) => void
  clearCart: () => void
  toggleWishlist: (p: Product) => void
  isInWishlist: (id: number) => boolean
  cartCount: number
  cartTotal: number
}

const StoreContext = createContext<StoreContextType>({} as StoreContextType)

export const useStore = () => useContext(StoreContext)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])

  const addToCart = (p: Product, size: string, color: string, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === p.id && i.selectedSize === size && i.selectedColor === color)
      if (existing) {
        return prev.map(i =>
          i.id === p.id && i.selectedSize === size && i.selectedColor === color
            ? { ...i, qty: i.qty + qty }
            : i
        )
      }
      return [...prev, { ...p, qty, selectedSize: size, selectedColor: color }]
    })
  }

  const removeFromCart = (id: number, size: string, color: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size && i.selectedColor === color)))
  }

  const updateQty = (id: number, size: string, color: string, qty: number) => {
    if (qty < 1) {
      removeFromCart(id, size, color)
      return
    }
    setCart(prev => prev.map(i =>
      i.id === id && i.selectedSize === size && i.selectedColor === color ? { ...i, qty } : i
    ))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (p: Product) => {
    setWishlist(prev =>
      prev.find(i => i.id === p.id) ? prev.filter(i => i.id !== p.id) : [...prev, p]
    )
  }

  const isInWishlist = (id: number) => wishlist.some(p => p.id === id)

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <StoreContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isInWishlist, cartCount, cartTotal }}>
      {children}
    </StoreContext.Provider>
  )
}
