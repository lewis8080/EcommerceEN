import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../hooks/useSmoothScroll'
import { useLang } from '../context/LanguageContext'

const WORDS: Record<'zh' | 'en', string> = {
  zh: '我们相信每一种成分都应凭实力赢得它的位置。每一种原料都可追溯至一次单一采收，发酵至柔和，并在其巅峰时刻调和。',
  en: 'We believe an ingredient should earn its place. Each of ours is traced to a single harvest, fermented until it softens, and blended at the moment it peaks.',
}

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const { lang } = useLang()
  const text = WORDS[lang]

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
  }, [lang, text])

  const tokens = lang === 'zh'
    ? Array.from(text)
    : text.split(' ')

  return (
    <section id="serum" ref={root} className="relative py-36 md:py-48">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <p className="mb-10 text-center text-[11px] uppercase tracking-[0.4em] text-bronze">
          {lang === 'zh' ? '品牌哲学' : 'The philosophy'}
        </p>
        <p className="text-balance text-center font-serif text-3xl font-light leading-snug md:text-[2.9rem] md:leading-[1.25]">
          {tokens.map((w, i) => (
            <span key={i} className="mword inline-block">
              {w}{lang === 'en' ? '\u00A0' : ''}
            </span>
          ))}
        </p>
        <p className="mt-12 text-center font-serif text-lg italic text-smoke">
          {lang === 'zh' ? '— La Lumière 品牌，格拉斯' : '— Maison La Lumière, Grasse'}
        </p>
      </div>
    </section>
  )
}
