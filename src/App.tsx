import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import Maison from './pages/Maison'
import Nav from './sections/Nav'
import Footer from './sections/Footer'
import CartDrawer from './components/CartDrawer'
import { CartProvider } from './context/CartContext'
import { useSmoothScroll, ScrollTrigger } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()
  const location = useLocation()

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
    <CartProvider>
      <div className="grain relative">
        <Nav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/maison" element={<Maison />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}
