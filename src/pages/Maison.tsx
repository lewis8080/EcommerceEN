import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router'
import { gsap } from '../hooks/useSmoothScroll'

const PROCESS = [
  {
    n: 'I',
    title: '采收',
    body: '每种植物取自单一命名的田地，一年中仅一周采收，在其活性巅峰之时。',
  },
  {
    n: 'II',
    title: '发酵',
    body: '九十日杉木与陶瓮。时间做到了热力与溶剂做不到的事——将分子柔化为与肌肤亲和的形态。',
  },
  {
    n: 'III',
    title: '压榨',
    body: '一次冷压。这是第一次也是唯一的萃取；余下的回归它来时的田野。',
  },
  {
    n: 'IV',
    title: '调和',
    body: '各活性成分在其巅峰之刻相遇——从不取自库存，从不取自上一季的瓦瓮。',
  },
  {
    n: 'V',
    title: '静置',
    body: '在第一瓶发出之前，静置四十日。配方如人，需要时间成为自己。',
  },
]

const VALUES = [
  {
    title: '可追溯采收',
    body: '每次压榨均列明田地：济州、新潟、Plougrescant 海崖。你可以站在你的精华液曾经生长的地方。',
  },
  {
    title: '小批量压榨',
    body: '每次压榨一千瓶，手工编号。一季过去，便不再有。',
  },
  {
    title: '无多余',
    body: '无香精遮掩，无染料美饰，无填料充数。若一种成分不能证明自己的价值，便不再留存。',
  },
]

export default function Maison() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.maison-line', {
        yPercent: 110,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.15,
      })
      gsap.from('.maison-fade', {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.7,
      })
      gsap.from('.atelier-img', {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.6,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.atelier-img', start: 'top 80%' },
      })
      gsap.to('.atelier-img img', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.atelier-img',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.from('.process-row', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.process-list', start: 'top 75%' },
      })
      gsap.from('.value-card', {
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.values-grid', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="pb-32 pt-36 md:pt-48">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* hero */}
        <p className="maison-fade mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
          <span className="h-px w-10 bg-bronze" />
          品牌故事
        </p>
        <h1 className="max-w-4xl font-serif text-5xl font-light leading-[1.05] md:text-7xl">
          <span className="block overflow-hidden">
            <span className="maison-line block">耐心是</span>
          </span>
          <span className="block overflow-hidden">
            <span className="maison-line block">
              <em className="italic text-bronze">活性成分。</em>
            </span>
          </span>
        </h1>
        <p className="maison-fade mt-10 max-w-lg text-sm font-light leading-relaxed tracking-wide text-smoke">
          La Lumière 始于格拉斯的一间工坊，带着一个问题：如果给一方配方一个季节，而非一个期限，会发生什么？
          十二次采收后，答案装进了四只瓶中。
        </p>

        {/* atelier image */}
        <div className="atelier-img relative mt-24 h-[50vh] overflow-hidden md:h-[72vh]">
          <img
            src="/images/maison-atelier.png"
            alt="La Lumière 格拉斯工坊"
            className="h-[115%] w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-umber/35 to-transparent p-8 md:p-14">
            <p className="font-serif text-xl italic text-ivory md:text-3xl">
              工坊，格拉斯——此处不急不躁。
            </p>
          </div>
        </div>

        {/* process */}
        <div className="process-list mt-32">
          <p className="mb-14 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
            <span className="h-px w-10 bg-bronze" />
            五幕缓慢
          </p>
          <div className="divide-y divide-umber/10 border-y border-umber/10">
            {PROCESS.map((s) => (
              <div
                key={s.n}
                className="process-row group grid grid-cols-[auto_1fr] items-baseline gap-8 py-8 transition-colors duration-500 hover:bg-cream/60 md:grid-cols-[6rem_16rem_1fr] md:px-6"
              >
                <p className="font-serif text-3xl font-light text-linen transition-colors duration-500 group-hover:text-bronze">
                  {s.n}
                </p>
                <h2 className="font-serif text-2xl">{s.title}</h2>
                <p className="col-span-2 max-w-2xl text-sm font-light leading-relaxed text-umber/75 md:col-span-1">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* values */}
        <div className="values-grid mt-32 grid grid-cols-1 gap-px bg-umber/10 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="value-card bg-ivory p-10 md:p-12">
              <p className="font-serif text-xl italic text-golddeep">{v.title}</p>
              <p className="mt-4 text-sm font-light leading-relaxed text-umber/75">
                {v.body}
              </p>
            </div>
          ))}
        </div>

        {/* cta */}
        <div className="mt-32 text-center">
          <p className="font-serif text-3xl font-light italic text-umber/80 md:text-4xl">
            「我们做得更少，方能成就更多。」
          </p>
          <Link
            to="/shop"
            className="mt-10 inline-block border border-umber/30 px-10 py-4 text-[11px] uppercase tracking-[0.35em] transition-all duration-500 hover:bg-umber hover:text-ivory"
          >
            访问精品店
          </Link>
        </div>
      </div>
    </section>
  )
}
