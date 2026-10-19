import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useLang } from '../context/LanguageContext'

export default function Checkout() {
  const [params] = useSearchParams()
  const status = params.get('status')
  const { lang } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(t)
  }, [])

  const success = status === 'success'

  return (
    <section className="flex min-h-screen items-center justify-center px-6 pt-20">
      <div
        className={`max-w-lg text-center transition-all duration-700 ${
          show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        {success ? (
          <>
            <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-bronze">
              {lang === 'zh' ? '订单已确认' : 'Order confirmed'}
            </p>
            <h1 className="font-serif text-5xl font-light leading-tight md:text-6xl">
              {lang === 'zh' ? (
                <>
                  谢谢你，
                  <br />
                  <em className="italic text-bronze">让光到家。</em>
                </>
              ) : (
                <>
                  Thank you for
                  <br />
                  <em className="italic text-bronze">bringing light home.</em>
                </>
              )}
            </h1>
            <p className="mt-8 text-sm font-light leading-relaxed text-smoke">
              {lang === 'zh'
                ? '你的付款已收到。一封含订单详情与发货信息的确认邮件即将到达你的邮箱。编号压榨正在静置——准备好属于你的那瓶。'
                : 'Your payment has been received. A confirmation with order details and shipping information is on its way to your inbox. The numbered pressing is resting — yours is being prepared.'}
            </p>
          </>
        ) : (
          <>
            <p className="mb-8 text-[11px] uppercase tracking-[0.4em] text-bronze">
              {lang === 'zh' ? '付款已取消' : 'Payment canceled'}
            </p>
            <h1 className="font-serif text-5xl font-light leading-tight md:text-6xl">
              {lang === 'zh' ? (
                <>
                  没关系，
                  <br />
                  <em className="italic text-bronze">光会等你。</em>
                </>
              ) : (
                <>
                  No hurry —
                  <br />
                  <em className="italic text-bronze">the light will wait.</em>
                </>
              )}
            </h1>
            <p className="mt-8 text-sm font-light leading-relaxed text-smoke">
              {lang === 'zh'
                ? '订单未完成，未收取任何费用。当你准备好时，精品店随时为你敞开。'
                : 'The order was not completed and no charge was made. The boutique is here whenever you are ready.'}
            </p>
          </>
        )}

        <Link
          to="/shop"
          className="mt-12 inline-block border border-umber/30 px-10 py-4 text-[11px] uppercase tracking-[0.35em] transition-all duration-500 hover:bg-umber hover:text-ivory"
        >
          {lang === 'zh' ? '返回精品店' : 'Back to the boutique'}
        </Link>
      </div>
    </section>
  )
}
