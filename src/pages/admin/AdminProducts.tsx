import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { callAdmin, errorText, isSessionExpired } from '../../lib/adminApi'
import { CATEGORY_LABELS, formatPrice, type Product } from '../../data/products'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)
  const [busySlug, setBusySlug] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const body = await callAdmin<{ products?: unknown }>('list')
      if (!Array.isArray(body.products)) throw new Error('商品数据格式异常')
      setProducts(body.products as Product[])
    } catch (err) {
      if (isSessionExpired(err)) {
        navigate('/admin', { replace: true })
        return
      }
      setError(errorText(err))
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const removeProduct = async (slug: string) => {
    setBusySlug(slug)
    setError('')
    try {
      await callAdmin('delete', { slug })
      setConfirmSlug(null)
      await loadProducts()
    } catch (err) {
      if (isSessionExpired(err)) {
        navigate('/admin', { replace: true })
        return
      }
      setError(errorText(err))
    } finally {
      setBusySlug(null)
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] tracking-[0.3em] text-bronze">商品管理</p>
          <h1 className="mt-3 font-serif text-4xl font-light">
            共 {products.length} 件商品
          </h1>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-umber px-7 py-3 text-[12px] tracking-[0.2em] text-ivory transition-colors duration-300 hover:bg-golddeep"
        >
          新增商品
        </Link>
      </div>

      {error && <p className="mt-8 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="mt-16 text-center text-sm text-smoke">加载中…</p>
      ) : (
        <div className="mt-10 divide-y divide-umber/10 border-y border-umber/10 bg-white">
          {products.map((p) => (
            <div
              key={p.slug}
              className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-[72px_1fr_auto] md:items-center md:gap-8"
            >
              <div className="h-18 w-18 overflow-hidden bg-cream">
                {p.img && <img src={p.img} alt="" className="h-full w-full object-cover" />}
              </div>

              <div className="min-w-0">
                <p className="font-serif text-lg">{p.name.zh}</p>
                <p className="text-sm text-umber/70">{p.name.en}</p>
                <p className="mt-1 text-[11px] tracking-[0.1em] text-smoke">
                  {p.slug} · {CATEGORY_LABELS[p.category].zh} · {p.size} · {formatPrice(p.price)} · 排序 {p.sort_order}
                </p>
              </div>

              <div className="flex items-center gap-4 md:justify-end">
                {confirmSlug === p.slug ? (
                  <>
                    <span className="text-xs text-umber/70">确认删除？</span>
                    <button
                      onClick={() => removeProduct(p.slug)}
                      disabled={busySlug === p.slug}
                      className="bg-red-700 px-4 py-2 text-[12px] tracking-[0.1em] text-white transition-colors hover:bg-red-800 disabled:opacity-60"
                    >
                      {busySlug === p.slug ? '删除中…' : '确认删除'}
                    </button>
                    <button
                      onClick={() => setConfirmSlug(null)}
                      disabled={busySlug === p.slug}
                      className="px-4 py-2 text-[12px] tracking-[0.1em] text-umber/70 transition-colors hover:text-umber"
                    >
                      取消
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/admin/products/${p.slug}`}
                      className="border border-umber/30 px-4 py-2 text-[12px] tracking-[0.1em] transition-colors hover:bg-umber hover:text-ivory"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => setConfirmSlug(p.slug)}
                      className="px-4 py-2 text-[12px] tracking-[0.1em] text-umber/70 transition-colors hover:text-red-700"
                    >
                      删除
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-smoke">还没有商品，点击"新增商品"开始添加。</p>
          )}
        </div>
      )}
    </section>
  )
}
