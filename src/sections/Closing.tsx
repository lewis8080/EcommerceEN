import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../hooks/useSmoothScroll'

export default function Closing() {
  const root = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.close-line', {
        yPercent: 110,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
      gsap.from('.close-fade', {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        delay: 0.3,
        scrollTrigger: { trigger: root.current, start: 'top 65%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative bg-umber py-32 text-ivory md:py-44">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="close-fade mb-10 text-[11px] uppercase tracking-[0.4em] text-bronze">
          First pressing · 1,000 bottles
        </p>
        <h2 className="font-serif text-5xl font-light leading-[1.05] md:text-7xl">
          <span className="block overflow-hidden">
            <span className="close-line block">Reserve your</span>
          </span>
          <span className="block overflow-hidden">
            <span className="close-line block italic text-sand">first light.</span>
          </span>
        </h2>
        <p className="close-fade mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-ivory/60">
          The inaugural pressing ships this solstice. Leave your address and we
          will hold a numbered bottle — no charge until it ships.
        </p>

        <form
          className="close-fade mx-auto mt-12 flex max-w-md items-center border-b border-ivory/30 pb-3"
          onSubmit={(e) => {
            e.preventDefault()
            setSent(true)
          }}
        >
          {sent ? (
            <p className="w-full py-2 text-center font-serif text-xl italic text-sand">
              Merci — bottle N°247 is yours.
            </p>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="your@address.com"
                className="w-full bg-transparent text-sm font-light tracking-wider placeholder:text-ivory/35 focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap text-[11px] uppercase tracking-[0.35em] text-bronze transition-colors hover:text-sand"
              >
                Reserve →
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
