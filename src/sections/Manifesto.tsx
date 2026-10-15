import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../hooks/useSmoothScroll'

const WORDS =
  'We believe an ingredient should earn its place. Each of ours is traced to a single harvest, fermented until it softens, and blended at the moment it peaks.'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mword',
        { autoAlpha: 0.12 },
        {
          autoAlpha: 1,
          ease: 'none',
          stagger: 0.06,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.6,
          },
        }
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="serum" ref={root} className="relative py-36 md:py-48">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <p className="mb-10 text-center text-[11px] uppercase tracking-[0.4em] text-bronze">
          The philosophy
        </p>
        <p className="text-balance text-center font-serif text-3xl font-light leading-snug md:text-[2.9rem] md:leading-[1.25]">
          {WORDS.split(' ').map((w, i) => (
            <span key={i} className="mword inline-block">
              {w}&nbsp;
            </span>
          ))}
        </p>
        <p className="mt-12 text-center font-serif text-lg italic text-smoke">
          — Maison La Lumière, Grasse
        </p>
      </div>
    </section>
  )
}
