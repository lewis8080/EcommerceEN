import { useLayoutEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { gsap } from '../hooks/useSmoothScroll'
import { PRODUCTS, formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

export default function ProductPage() {
  const { slug } = useParams()
  const product = PRODUCTS.find((p) => p.slug === slug)
  const root = useRef<HTMLElement>(null)
  const [qty, setQty] = useState(1)
  const { add } = useCart()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pd-fade', {
        autoAlpha: 0,
        y: 28,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.09,
        delay: 0.2,
      })
      gsap.from('.pd-img', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.5,
        ease: 'power4.inOut',
        delay: 0.1,
      })
    }, root)
    return () => ctx.revert()
  }, [slug])

  if (!product) return <Navigate to="/shop" replace />

  const others = PRODUCTS.filter((p) => p.slug !== product.slug).slice(0, 3)

  return (
    <section ref={root} className="pb-32 pt-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Link
          to="/shop"
          className="pd-fade mb-12 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-smoke transition-colors hover:text-umber"
        >
          ← The boutique
        </Link>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {/* image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="pd-img relative overflow-hidden rounded-t-[8rem] bg-cream">
              <img
                src={product.img}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover"
              />
              {product.badge && (
                <span className="absolute left-6 top-6 border border-umber/20 bg-ivory/85 px-3 py-1 text-[9px] uppercase tracking-[0.3em] backdrop-blur-sm">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* details */}
          <div>
            <p className="pd-fade text-[11px] uppercase tracking-[0.4em] text-bronze">
              {product.category}
            </p>
            <h1 className="pd-fade mt-4 font-serif text-4xl font-light leading-tight md:text-6xl">
              {product.name}
            </h1>
            <p className="pd-fade mt-3 font-serif text-lg italic text-smoke">
              {product.latin}
            </p>

            <p className="pd-fade mt-8 max-w-lg text-sm font-light leading-relaxed tracking-wide text-umber/80">
              {product.description}
            </p>

            <ul className="pd-fade mt-8 space-y-2 border-y border-umber/10 py-6">
              {product.notes.map((n) => (
                <li
                  key={n}
                  className="flex items-center gap-3 text-xs font-light tracking-wide text-umber/75"
                >
                  <span className="h-px w-6 bg-bronze" />
                  {n}
                </li>
              ))}
            </ul>

            <div className="pd-fade mt-8 flex items-center justify-between">
              <p className="font-serif text-3xl">{formatPrice(product.price)}</p>
              <p className="text-[11px] uppercase tracking-[0.3em] text-smoke">
                {product.size}
              </p>
            </div>

            <div className="pd-fade mt-8 flex gap-4">
              <div className="flex items-center border border-umber/25">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 transition-colors hover:bg-cream"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 transition-colors hover:bg-cream"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => add(product.slug, qty)}
                className="flex-1 bg-umber py-3 text-[11px] uppercase tracking-[0.35em] text-ivory transition-colors duration-500 hover:bg-golddeep"
              >
                Add to bag — {formatPrice(product.price * qty)}
              </button>
            </div>

            <div className="pd-fade mt-10 divide-y divide-umber/10 border-y border-umber/10">
              {[
                ['The ritual', product.ritual],
                [
                  'Shipping & returns',
                  'Pressed to order and shipped within three days, worldwide. Unopened pressings may be returned within thirty days — though few come back.',
                ],
              ].map(([t, b]) => (
                <details key={t} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-[0.3em] text-umber/80">
                    {t}
                    <span className="font-serif text-xl transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 max-w-lg text-xs font-light leading-relaxed text-smoke">
                    {b}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* pairs with */}
        <div className="mt-32">
          <p className="mb-10 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
            <span className="h-px w-10 bg-bronze" />
            Complete the ritual
          </p>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} to={`/product/${p.slug}`} className="group">
                <div className="aspect-square overflow-hidden bg-cream">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <p className="font-serif text-lg transition-colors group-hover:text-golddeep">
                    {p.name}
                  </p>
                  <p className="font-serif">{formatPrice(p.price)}</p>
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-smoke">
                  {p.size}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
