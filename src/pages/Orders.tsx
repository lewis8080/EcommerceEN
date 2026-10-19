import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { supabase } from '../lib/supabase'

type Order = {
  id: number
  checkout_session_id: string
  amount_total: number
  currency: string
  payment_status: string
  status: string
  created_at: string
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth()
  const { lang } = useLang()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    (async () => {
      const { data, error } = await supabase
        .from('stripe_orders')
        .select('id, checkout_session_id, amount_total, currency, payment_status, status, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error && data) setOrders(data as Order[])
      setLoading(false)
    })()
  }, [user])

  if (authLoading) return null
  if (!user) return <Navigate to="/auth?redirect=/orders" replace />

  const formatAmount = (amount: number, currency: string) => {
    const value = amount / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(value)
  }

  const statusLabel = (status: string) => {
    const map: Record<string, { zh: string; en: string }> = {
      pending: { zh: '处理中', en: 'Pending' },
      completed: { zh: '已完成', en: 'Completed' },
      canceled: { zh: '已取消', en: 'Canceled' },
    }
    return map[status]?.[lang] ?? status
  }

  return (
    <section className="pb-32 pt-36 md:pt-44">
      <div className="mx-auto max-w-4xl px-6 md:px-10">
        <p className="mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-bronze">
          <span className="h-px w-10 bg-bronze" />
          {lang === 'zh' ? '我的账户' : 'Your account'}
        </p>
        <h1 className="font-serif text-5xl font-light leading-tight md:text-6xl">
          {lang === 'zh' ? '订单记录' : 'Order history'}
        </h1>
        <p className="mt-4 text-sm font-light text-smoke">
          {user.email}
        </p>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-umber/20 border-t-bronze" />
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="font-serif text-2xl italic text-umber/50">
              {lang === 'zh' ? '你还没有任何订单。' : 'No orders yet.'}
            </p>
            <Link
              to="/shop"
              className="mt-8 inline-block border border-umber/30 px-10 py-4 text-[11px] uppercase tracking-[0.35em] transition-all duration-500 hover:bg-umber hover:text-ivory"
            >
              {lang === 'zh' ? '开始购物' : 'Start shopping'}
            </Link>
          </div>
        ) : (
          <div className="mt-16 divide-y divide-umber/10 border-y border-umber/10">
            {orders.map((o) => (
              <div
                key={o.id}
                className="grid grid-cols-1 gap-4 py-8 md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-10"
              >
                <div>
                  <p className="font-serif text-lg">
                    {lang === 'zh' ? '订单' : 'Order'} #{o.id}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-smoke">
                    {new Date(o.created_at).toLocaleDateString(
                      lang === 'zh' ? 'zh-CN' : 'en-US',
                      { year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
                <p className="font-serif text-xl">
                  {formatAmount(o.amount_total, o.currency)}
                </p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-smoke">
                  {o.payment_status}
                </p>
                <span
                  className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] ${
                    o.status === 'completed'
                      ? 'text-bronze'
                      : o.status === 'canceled'
                        ? 'text-red-700'
                        : 'text-smoke'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      o.status === 'completed'
                        ? 'bg-bronze'
                        : o.status === 'canceled'
                          ? 'bg-red-700'
                          : 'bg-smoke'
                    }`}
                  />
                  {statusLabel(o.status)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <Link
            to="/shop"
            className="text-[11px] uppercase tracking-[0.35em] text-smoke underline-offset-8 transition-colors hover:text-umber hover:underline"
          >
            ← {lang === 'zh' ? '返回精品店' : 'Back to the boutique'}
          </Link>
        </div>
      </div>
    </section>
  )
}
