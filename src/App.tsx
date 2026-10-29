import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import Maison from './pages/Maison'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Orders from './pages/Orders'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import Nav from './sections/Nav'
import Footer from './sections/Footer'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'
import { LanguageProvider } from './context/LanguageContext'
import { AuthProvider } from './context/AuthContext'
import { ProductsProvider } from './context/ProductsContext'
import { useSmoothScroll, ScrollTrigger } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  // route change: reset scroll, then land on hash target if present
  useEffect(() => {
    if (location.hash) {
      const t = setTimeout(() => {
        document
          .querySelector(location.hash)
          ?.scrollIntoView({ behavior: 'smooth' })
      }, 250)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 150)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <LanguageProvider>
    <AuthProvider>
    <ProductsProvider>
    <CartProvider>
      <div className="grain relative">
        {!isAdmin && <Nav />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/maison" element={<Maison />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminLogin />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:slug" element={<AdminProductForm />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <CartDrawer />}
      </div>
    </CartProvider>
    </ProductsProvider>
    </AuthProvider>
    </LanguageProvider>
  )
}
