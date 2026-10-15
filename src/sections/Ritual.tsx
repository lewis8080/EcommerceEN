import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../hooks/useSmoothScroll'
import { useLang } from '../context/LanguageContext'
import type { Lang } from '../context/LanguageContext'

type Step = {
  n: string
  title: Record<Lang, string>
  body: Record<Lang, string>
}

const STEPS: Step[] = [
  {
    n: 'I',
    title: { zh: '温热', en: 'Warm' },
    body: {
      zh: '两滴于掌心之间。让油达到肤温——切勿冷涂。',
      en: 'Two drops between the palms. Let the oil reach skin temperature — never apply it cold.',
    },
  },
  {
    n: 'II',
    title: { zh: '按压', en: 'Press' },
    body: {
      zh: '按压，而非揉搓。在脸颊与额头处停留三次呼吸，让发酵精华吸收。',
      en: 'Press, don\u2019t rub. Hold over the cheeks and brow for three breaths, letting the ferment absorb.',
    },
  },
  {
    n: 'III',
    title: { zh: '封存', en: 'Seal' },
    body: {
      zh: '在肌肤仍湿润时覆盖喷雾或面霜。光需要可以依附之处。',
      en: 'Mist or cream over the top while skin is still damp. Light needs something to hold onto.',
    },
  },
]

export default function Ritual() {
  const root = useRef<HTMLElement>(null)
  const { lang } = useLang()

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
              {lang === 'zh' ? '晚间仪式' : 'The evening ritual'}
            </p>
            <h2 className="font-serif text-5xl font-light leading-tight md:text-7xl">
              {lang === 'zh' ? (
                <>
                  三种手势，
                  <br />
                  <em className="italic text-bronze">九十秒。</em>
                </>
              ) : (
                <>
                  Three gestures,
                  <br />
                  <em className="italic text-bronze">ninety seconds.</em>
                </>
              )}
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light leading-relaxed text-smoke">
            {lang === 'zh'
              ? '功效是韵律，而非竞赛。这支精华液只需你晚间的一分半钟——回馈你清晨的光采。'
              : 'Efficacy is a rhythm, not a race. The serum asks for a minute and a half of your evening — and gives back the morning.'}
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
              <h3 className="mt-8 font-serif text-2xl">{s.title[lang]}</h3>
              <p className="mt-4 text-sm font-light leading-relaxed text-umber/75">
                {s.body[lang]}
              </p>
            </div>
          ))}
        </div>

        <div className="ritual-img relative mt-24 h-[52vh] overflow-hidden md:h-[70vh]">
          <img
            src="/images/texture-cream.png"
            alt={lang === 'zh' ? '温暖石面上的丝滑面霜质地' : 'Silky cream texture on warm stone'}
            className="h-[115%] w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-umber/35 to-transparent p-8 md:p-14">
            <p className="font-serif text-2xl italic text-ivory md:text-4xl">
              {lang === 'zh' ? (
                <>
                  「起初感觉不到什么，
                  <br />
                  直到感受到一切。」
                </>
              ) : (
                <>
                  "It should feel like nothing,
                  <br />
                  until it feels like everything."
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
