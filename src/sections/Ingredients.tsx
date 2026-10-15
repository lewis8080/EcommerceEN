import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../hooks/useSmoothScroll'

type Chapter = {
  index: string
  latin: string
  name: string
  origin: string
  story: string
  note: string
  img: string
}

const CHAPTERS: Chapter[] = [
  {
    index: '01',
    latin: 'Camellia japonica',
    name: 'Tsubaki, cold-pressed',
    origin: 'Jeju Island, South Korea',
    story:
      'Hand-gathered after the first frost, when the blossom holds the most oil. The seeds are pressed once, cold, within six hours — yielding a silk-light lipid that mirrors skin\u2019s own sebum and vanishes on contact.',
    note: 'Restores the lipid veil · omega-9',
    img: '/images/ingredient-camellia.png',
  },
  {
    index: '02',
    latin: 'Oryza sativa',
    name: 'Rice, ninety days fermented',
    origin: 'Niigata Prefecture, Japan',
    story:
      'Polished rice is inoculated with koji and left in cedar vats through a full season. Fermentation shatters its starches into peptides, amino acids and natural kojic acid — the quiet chemistry of luminosity.',
    note: 'Refines tone · fermented peptides',
    img: '/images/ingredient-rice.png',
  },
  {
    index: '03',
    latin: 'Crithmum maritimum',
    name: 'Sea fennel, rock-grown',
    origin: 'Cliffs of Brittany, France',
    story:
      'It roots in granite where salt spray forbids almost everything else. To survive, the plant builds an arsenal of antioxidants and vitamin C — harvested by rope, one cliff at a time, never more than a third of any colony.',
    note: 'Defends & renews · marine retinol alternative',
    img: '/images/ingredient-seafennel.png',
  },
]

export default function Ingredients() {
  const root = useRef<HTMLElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          onUpdate: (self) => {
            // thresholds match the scrub timeline (transitions at t=1.4 and t=2.9, total ≈3.85)
            const p = self.progress
            const idx = p >= 0.75 ? 2 : p >= 0.36 ? 1 : 0
            if (numRef.current) {
              numRef.current.textContent = CHAPTERS[idx].index
            }
          },
        },
      })

      CHAPTERS.forEach((_, i) => {
        if (i === 0) return
        const at = [1.4, 2.9][i - 1]
        // outgoing
        tl.to(`.ing-text-${i - 1}`, { autoAlpha: 0, y: -44, duration: 0.5, ease: 'power2.in' }, at)
        tl.to(`.ing-img-${i - 1}`, { autoAlpha: 0, scale: 1.06, duration: 0.6, ease: 'power2.in' }, at)
        // incoming
        tl.fromTo(
          `.ing-img-${i}`,
          { autoAlpha: 0, scale: 1.12 },
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
          at + 0.25
        )
        tl.fromTo(
          `.ing-text-${i}`,
          { autoAlpha: 0, y: 44 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          at + 0.35
        )
      })

      // gentle drift on the active images throughout
      gsap.utils.toArray<HTMLElement>('.ing-img-inner').forEach((el) => {
        gsap.to(el, {
          yPercent: -6,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        })
      })

      ScrollTrigger.refresh()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ingredients" ref={root} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-cream">
        {/* header row */}
        <div className="mx-auto flex w-full max-w-7xl items-end justify-between px-6 pt-28 md:px-10">
          <p className="text-[11px] uppercase tracking-[0.4em] text-bronze">
            The formula — three acts
          </p>
          <p className="font-serif text-2xl text-umber/60">
            <span ref={numRef}>01</span>
            <span className="text-smoke"> / 03</span>
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-6 pb-20 md:grid-cols-2 md:px-10">
          {/* text column */}
          <div className="relative order-2 h-full min-h-[24rem] md:order-1">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.index}
                className={`ing-text-${i} absolute inset-0 flex flex-col justify-center ${
                  i > 0 ? 'invisible opacity-0' : ''
                }`}
              >
                <p className="mb-4 font-serif text-lg italic text-bronze">
                  N°{c.index} — {c.latin}
                </p>
                <h2 className="font-serif text-4xl font-light leading-tight md:text-6xl">
                  {c.name}
                </h2>
                <p className="mt-3 text-[11px] uppercase tracking-[0.35em] text-smoke">
                  {c.origin}
                </p>
                <p className="mt-8 max-w-md text-sm font-light leading-relaxed tracking-wide text-umber/80">
                  {c.story}
                </p>
                <p className="mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-golddeep">
                  <span className="h-px w-8 bg-bronze" />
                  {c.note}
                </p>
              </div>
            ))}
          </div>

          {/* image column */}
          <div className="relative order-1 h-[38vh] md:order-2 md:h-[68vh]">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.index}
                className={`ing-img-${i} absolute inset-0 overflow-hidden ${
                  i > 0 ? 'invisible opacity-0' : ''
                }`}
              >
                <div className="ing-img-inner h-[115%] w-full">
                  <img
                    src={c.img}
                    alt={c.latin}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* progress hairline */}
        <div className="mx-auto w-full max-w-7xl px-6 pb-10 md:px-10">
          <div className="h-px w-full bg-umber/15">
            <ProgressBar rootRef={root} />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProgressBar({
  rootRef,
}: {
  rootRef: React.RefObject<HTMLElement | null>
}) {
  const barRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.4,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [rootRef])

  return (
    <div
      ref={barRef}
      className="h-px w-full origin-left scale-x-0 bg-bronze"
    />
  )
}
