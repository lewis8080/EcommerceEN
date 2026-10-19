import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import type { Lang } from '../context/LanguageContext'

const anchors: Record<Lang, { label: string; hash: string }[]> = {
  zh: [
    { label: '精华液', hash: '#serum' },
    { label: '成分', hash: '#ingredients' },
    { label: '仪式', hash: '#ritual' },
  ],
  en: [
    { label: 'The Serum', hash: '#serum' },
    { label: 'Ingredients', hash: '#ingredients' },
    { label: 'Ritual', hash: '#ritual' },
  ],
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { count, openCart } = useCart()
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { lang, toggle } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToAnchor = (hash: string) => {
    if (location.pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/' + hash)
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'border-b border-umber/10 bg-ivory/80 py-4 backdrop-blur-md'
          : 'bg-transparent py-7'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="font-serif text-xl uppercase tracking-[0.28em]">
          La&nbsp;Lumière
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {anchors[lang].map((l) => (
            <button
              key={l.hash}
              onClick={() => goToAnchor(l.hash)}
              className="group relative text-[11px] font-light uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-500 group-hover:w-full" />
            </button>
          ))}
          <Link
            to="/maison"
            className="group relative text-[11px] font-light uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
          >
            {lang === 'zh' ? '品牌故事' : 'Maison'}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-500 group-hover:w-full" />
          </Link>
          <Link
            to="/shop"
            className="group relative text-[11px] font-light uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
          >
            {lang === 'zh' ? '购物' : 'Shop'}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-bronze transition-all duration-500 group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggle}
            className="text-[11px] uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
          >
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/orders"
                className="text-[11px] uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
              >
                {lang === 'zh' ? '订单' : 'Orders'}
              </Link>
              <button
                onClick={() => signOut()}
                className="text-[11px] uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
              >
                {lang === 'zh' ? '退出' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-[11px] uppercase tracking-[0.3em] text-umber/70 transition-colors hover:text-umber"
            >
              {lang === 'zh' ? '登录' : 'Sign In'}
            </Link>
          )}
          <button
            onClick={openCart}
            className="relative border border-umber/30 px-5 py-2 text-[11px] uppercase tracking-[0.3em] transition-all duration-500 hover:bg-umber hover:text-ivory"
          >
            {lang === 'zh' ? '购物袋' : 'Bag'}
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-bronze text-[10px] tracking-normal text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
