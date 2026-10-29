import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { supabase } from '../lib/supabase'
import type { Product } from '../data/products'

type ProductsContextValue = {
  products: Product[]
  loading: boolean
  error: string
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const inAdmin = useLocation().pathname.startsWith('/admin')

  useEffect(() => {
    if (inAdmin) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true })
      if (cancelled) return
      if (fetchError || !Array.isArray(data)) {
        setError('商品加载失败，请刷新页面重试')
      } else {
        setProducts(data as Product[])
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [inAdmin])

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
