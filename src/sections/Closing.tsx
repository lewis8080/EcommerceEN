import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../hooks/useSmoothScroll'
import { useLang } from '../context/LanguageContext'

export default function Closing() {
  const root = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)
  const { lang } = useLang()

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
  }, [lang])

  return (
    <section ref={root} className="relative bg-umber py-32 text-ivory md:py-44">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="close-fade mb-10 text-[11px] uppercase tracking-[0.4em] text-bronze">
          {lang === 'zh' ? '首次压榨 · 1,000 瓶' : 'First pressing · 1,000 bottles'}
        </p>
        <h2 className="font-serif text-5xl font-light leading-[1.05] md:text-7xl">
          <span className="block overflow-hidden">
            <span className="close-line block">
              {lang === 'zh' ? '预订你的' : 'Reserve your'}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="close-line block italic text-sand">
              {lang === 'zh' ? '第一缕光。' : 'first light.'}
            </span>
          </span>
        </h2>
        <p className="close-fade mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-ivory/60">
          {lang === 'zh'
            ? '首批压榨将于本夏至发货。留下你的地址，我们将为你保留一瓶编号瓶——发货前不收取任何费用。'
            : 'The inaugural pressing ships this solstice. Leave your address and we will hold a numbered bottle — no charge until it ships.'}
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
              {lang === 'zh' ? '谢谢——第247号瓶属于你。' : 'Merci — bottle N°247 is yours.'}
            </p>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder={lang === 'zh' ? '你的邮箱@地址.com' : 'your@address.com'}
                className="w-full bg-transparent text-sm font-light tracking-wider placeholder:text-ivory/35 focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap text-[11px] uppercase tracking-[0.35em] text-bronze transition-colors hover:text-sand"
              >
                {lang === 'zh' ? '预订 →' : 'Reserve →'}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
