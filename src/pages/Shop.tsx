import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { gsap } from '../hooks/useSmoothScroll'
import { CATEGORIES, PRODUCTS, formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Shop() {
  const root = useRef<HTMLElement>(null)
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>('All')
  const { add } = useCart()

  const products = useMemo(
    () =>
      category === 'All'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category]
  )

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.shop-line', {
        yPercent: 110,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
        delay: 0.15,
      })
      gsap.from('.shop-fade', {
        autoAlpha: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.6,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-card',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }
      )
    }, root)
    return () => ctx.revert()
  }, [category])

  return (
    <section ref={root} className="pb-32 pt-36 md:pt-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* header */}
        <p className="shop-fade mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
          <span className="h-px w-10 bg-bronze" />
          The boutique
        </p>
        <h1 className="font-serif text-5xl font-light leading-[1.05] md:text-7xl">
          <span className="block overflow-hidden">
            <span className="shop-line block">Every formula</span>
          </span>
          <span className="block overflow-hidden">
            <span className="shop-line block">
              earns its <em className="italic text-bronze">shelf.</em>
            </span>
          </span>
        </h1>
        <p className="shop-fade mt-8 max-w-md text-sm font-light leading-relaxed tracking-wide text-smoke">
          Four formulas, nothing seasonal, nothing limited for the sake of it.
          Numbered pressings, rested before release.
        </p>

        {/* filters */}
        <div className="shop-fade mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-umber/10 py-5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-[11px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                category === c
                  ? 'text-umber underline decoration-bronze underline-offset-8'
                  : 'text-smoke hover:text-umber'
              }`}
            >
              {c}
            </button>
          ))}
          <p className="ml-auto hidden text-[10px] uppercase tracking-[0.3em] text-smoke md:block">
            {products.length} {products.length === 1 ? 'formula' : 'formulas'}
          </p>
        </div>

        {/* grid */}
        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2">
          {products.map((p) => (
            <article key={p.slug} className="product-card group">
              <Link
                to={`/product/${p.slug}`}
                className="relative block overflow-hidden bg-cream"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                </div>
                {p.badge && (
                  <span className="absolute left-5 top-5 border border-umber/20 bg-ivory/85 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-umber backdrop-blur-sm">
                    {p.badge}
                  </span>
                )}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-ivory/90 py-3 text-center text-[10px] uppercase tracking-[0.35em] text-umber backdrop-blur-sm transition-transform duration-500 ease-out group-hover:translate-y-0">
                  View the formula
                </span>
              </Link>

              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <Link to={`/product/${p.slug}`}>
                    <h2 className="font-serif text-2xl leading-tight transition-colors duration-300 hover:text-golddeep">
                      {p.name}
                    </h2>
                  </Link>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-smoke">
                    {p.latin} — {p.size}
                  </p>
                  <p className="mt-3 max-w-sm text-xs font-light leading-relaxed text-umber/70">
                    {p.short}
                  </p>
                </div>
                <p className="whitespace-nowrap font-serif text-xl">
                  {formatPrice(p.price)}
                </p>
              </div>

              <button
                onClick={() => add(p.slug)}
                className="mt-5 w-full border border-umber/30 py-3 text-[10px] uppercase tracking-[0.35em] transition-all duration-500 hover:bg-umber hover:text-ivory"
              >
                Add to bag — {formatPrice(p.price)}
              </button>
            </article>
          ))}
        </div>

        {/* service notes */}
        <div className="mt-28 grid grid-cols-1 gap-px bg-umber/10 md:grid-cols-3">
          {[
            ['Numbered pressings', 'Every bottle is pressed, rested and numbered by hand.'],
            ['Complimentary shipping', 'On all orders over €150, worldwide, carbon-neutral.'],
            ['Two samples, always', 'Each order travels with two 2 ml pressings to gift or keep.'],
          ].map(([t, b]) => (
            <div key={t} className="bg-ivory p-8">
              <p className="font-serif text-lg italic text-golddeep">{t}</p>
              <p className="mt-2 text-xs font-light leading-relaxed text-smoke">
                {b}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
