import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../hooks/useSmoothScroll'

const STEPS = [
  {
    n: 'I',
    title: '温热',
    body: '两滴于掌心之间。让油达到肤温——切勿冷涂。',
  },
  {
    n: 'II',
    title: '按压',
    body: '按压，而非揉搓。在脸颊与额头处停留三次呼吸，让发酵精华吸收。',
  },
  {
    n: 'III',
    title: '封存',
    body: '在肌肤仍湿润时覆盖喷雾或面霜。光需要可以依附之处。',
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
              晚间仪式
            </p>
            <h2 className="font-serif text-5xl font-light leading-tight md:text-7xl">
              三种手势，
              <br />
              <em className="italic text-bronze">九十秒。</em>
            </h2>
          </div>
          <p className="max-w-xs text-sm font-light leading-relaxed text-smoke">
            功效是韵律，而非竞赛。这支精华液只需你晚间的一分半钟——
            回馈你清晨的光采。
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
            alt="温暖石面上的丝滑面霜质地"
            className="h-[115%] w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-umber/35 to-transparent p-8 md:p-14">
            <p className="font-serif text-2xl italic text-ivory md:text-4xl">
              「起初感觉不到什么，
              <br />
              直到感受到一切。」
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
