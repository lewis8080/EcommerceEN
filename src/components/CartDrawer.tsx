import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'
import { useLang } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

export default function CartDrawer() {
  const { lines, isOpen, closeCart, setQty, remove, productOf, subtotal, count } =
    useCart()
  const [ordered, setOrdered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { lang } = useLang()

  useEffect(() => {
    if (!isOpen) {
      setOrdered(false)
      setErrorMsg('')
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCart])

  const handleCheckout = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const origin = window.location.origin
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          items: lines.map((l) => ({ slug: l.slug, qty: l.qty })),
          success_url: `${origin}/checkout?status=success`,
          cancel_url: `${origin}/checkout?status=cancel`,
        },
      })

      if (error) throw error
      if (!data || !data.url) throw new Error('No checkout URL returned')

      window.location.href = data.url
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <div
      className={`fixed inset-0 z-[70] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-umber/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-umber/10 px-8 py-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-umber/70">
            {lang === 'zh' ? '你的购物袋' : 'Your bag'} {count > 0 && `· ${count}`}
          </p>
          <button
            onClick={closeCart}
            className="font-serif text-2xl leading-none text-umber/60 transition-colors hover:text-umber"
            aria-label={lang === 'zh' ? '关闭购物袋' : 'Close bag'}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-2xl italic text-umber/60">
                {lang === 'zh' ? '你的购物袋是空的。' : 'Your bag is empty.'}
              </p>
              <p className="mt-3 max-w-[16rem] text-xs font-light leading-relaxed text-smoke">
                {lang === 'zh'
                  ? '从精华液开始——或让探索仪式套装带你认识。'
                  : 'Begin with the serum — or let the Discovery Ritual introduce you.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-umber/10">
              {lines.map((l) => {
                const p = productOf(l.slug)
                if (!p) return null
                return (
                  <li key={l.slug} className="flex gap-5 py-6">
                    <div className="h-24 w-20 shrink-0 overflow-hidden bg-cream">
                      <img
                        src={p.img}
                        alt={p.name[lang]}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-serif text-lg leading-tight">
                            {p.name[lang]}
                          </p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-smoke">
                            {p.size}
                          </p>
                        </div>
                        <p className="font-serif text-lg">
                          {formatPrice(p.price * l.qty)}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-umber/20">
                          <button
                            onClick={() => setQty(l.slug, l.qty - 1)}
                            className="px-3 py-1 text-sm transition-colors hover:bg-cream"
                            aria-label={lang === 'zh' ? '减少' : 'Decrease'}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs">{l.qty}</span>
                          <button
                            onClick={() => setQty(l.slug, l.qty + 1)}
                            className="px-3 py-1 text-sm transition-colors hover:bg-cream"
                            aria-label={lang === 'zh' ? '增加' : 'Increase'}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => remove(l.slug)}
                          className="text-[10px] uppercase tracking-[0.25em] text-smoke underline-offset-4 transition-colors hover:text-umber hover:underline"
                        >
                          {lang === 'zh' ? '移除' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-umber/10 px-8 py-6">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.3em] text-umber/70">
                {lang === 'zh' ? '小计' : 'Subtotal'}
              </p>
              <p className="font-serif text-2xl">{formatPrice(subtotal)}</p>
            </div>
            <p className="mb-5 text-[10px] font-light tracking-wide text-smoke">
              {lang === 'zh'
                ? '订单满€150免邮 · 每笔订单随赠两份小样'
                : 'Complimentary shipping over €150 · two samples with every order'}
            </p>

            {errorMsg && (
              <p className="mb-3 text-center text-xs text-red-700">{errorMsg}</p>
            )}

            {ordered ? (
              <p className="w-full border border-bronze/50 bg-cream py-4 text-center font-serif text-lg italic text-golddeep">
                {lang === 'zh'
                  ? '感谢您的购买——已跳转至 Stripe 完成付款。'
                  : 'Redirecting to Stripe to complete your purchase…'}
              </p>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-umber py-4 text-[11px] uppercase tracking-[0.35em] text-ivory transition-colors duration-500 hover:bg-golddeep disabled:opacity-60"
              >
                {loading
                  ? lang === 'zh'
                    ? '正在准备付款…'
                    : 'Preparing payment…'
                  : lang === 'zh'
                    ? '前往结账'
                    : 'Proceed to checkout'}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
