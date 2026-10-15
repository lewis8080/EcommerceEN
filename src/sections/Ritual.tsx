import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../hooks/useSmoothScroll'

const STEPS = [
  {
    n: 'I',
    title: 'Warm',
    body: 'Two drops between the palms. Let the oil reach skin temperature — never apply it cold.',
  },
  {
    n: 'II',
    title: 'Press',
    body: 'Press, don\u2019t rub. Hold over the cheeks and brow for three breaths, letting the ferment absorb.',
  },
  {
    n: 'III',
    title: 'Seal',
    body: 'Mist or cream over the top while skin is still damp. Light needs something to hold onto.',
  },
]

export default function Ritual() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ritual-card', {
        autoAlpha: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.ritual-grid', start: 'top 78%' },
      })
      gsap.from('.ritual-img', {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.ritual-img', start: 'top 80%' },
      })
      gsap.to('.ritual-img img', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.ritual-img',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ritual" ref={root} className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
              <span className="h-px w-10 bg-bronze" />
              The evening ritual
            </p>
            <h2 className="font-serif text-5xl font-light leading-tight md:text-7xl">
              Three gestures,
              <br />
              <em className="italic text-bronze">ninety seconds.</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light leading-relaxed text-smoke">
            Efficacy is a rhythm, not a race. The serum asks for a minute and a
            half of your evening — and gives back the morning.
          </p>
        </div>

        <div className="ritual-grid grid grid-cols-1 gap-px bg-umber/10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="ritual-card group bg-ivory p-10 transition-colors duration-700 hover:bg-cream md:p-14"
            >
              <p className="font-serif text-5xl font-light text-linen transition-colors duration-700 group-hover:text-bronze">
                {s.n}
              </p>
              <h3 className="mt-8 font-serif text-2xl">{s.title}</h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-umber/75">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="ritual-img relative mt-24 h-[52vh] overflow-hidden md:h-[70vh]">
          <img
            src="/images/texture-cream.png"
            alt="Silky cream texture on warm stone"
            className="h-[115%] w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-umber/35 to-transparent p-8 md:p-14">
            <p className="font-serif text-2xl italic text-ivory md:text-4xl">
              “It should feel like nothing,
              <br />
              until it feels like everything.”
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
