import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../hooks/useSmoothScroll'

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-line-inner', {
        yPercent: 110,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.2,
      })
      gsap.from('.hero-fade', {
        autoAlpha: 0,
        y: 24,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.9,
      })
      gsap.from('.hero-img', {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.6,
        ease: 'power4.inOut',
        delay: 0.4,
      })
      gsap.to('.hero-img img', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.hero-head', {
        yPercent: -18,
        autoAlpha: 0.25,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* soft radial glow */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-sand/70 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-linen/50 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-36 md:grid-cols-12 md:px-10 lg:gap-8">
        <div className="hero-head relative z-10 md:col-span-7">
          <p className="hero-fade mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
            <span className="h-px w-10 bg-bronze" />
            高端护肤 · N°01
          </p>

          <h1 className="font-serif text-[13vw] font-light leading-[0.95] tracking-tight md:text-[6.5rem]">
            <span className="block overflow-hidden">
              <span className="hero-line-inner block">光影，凝萃</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line-inner block">
                凝入<em className="font-normal not-italic text-bronze italic">肌肤。</em>
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-10 max-w-md text-sm font-light leading-relaxed tracking-wide text-smoke">
            一支焕亮精华液，由三种植物慢发酵九十日而成。
            不多不少——因为肌肤记得你让它承载的一切。
          </p>

          <div className="hero-fade mt-12 flex items-center gap-8">
            <a
              href="#ingredients"
              className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.35em]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-umber/30 transition-all duration-500 group-hover:bg-umber group-hover:text-ivory">
                ↓
              </span>
              认识成分
            </a>
          </div>
        </div>

        <div className="relative md:col-span-5">
          <div className="hero-img relative overflow-hidden rounded-t-[10rem]">
            <img
              src="/images/hero-serum.png"
              alt="La Lumière 焕亮精华液置于石灰华石上"
              className="h-[62vh] w-full scale-110 object-cover md:h-[74vh]"
            />
          </div>
          <p className="hero-fade vertical-text absolute -right-7 top-10 hidden text-[10px] uppercase tracking-[0.5em] text-smoke md:block">
            山茶 · 稻米 · 海茴香
          </p>
        </div>
      </div>

      {/* marquee */}
      <div className="hero-fade absolute bottom-0 left-0 w-full overflow-hidden border-t border-umber/10 py-4">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {[0, 1].map((n) => (
            <span
              key={n}
              className="pr-8 font-serif text-lg italic tracking-wider text-umber/50"
            >
              慢发酵 · 冷压 · 无香精 · 九十日的耐心 · 一方配方 ·
              慢发酵 · 冷压 · 无香精 · 九十日的耐心 · 一方配方 ·&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
