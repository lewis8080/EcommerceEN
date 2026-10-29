import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { callAdmin, errorText, isSessionExpired } from '../../lib/adminApi'
import { CATEGORY_LABELS, type CategoryKey, type Product } from '../../data/products'

type Form = {
  slug: string
  nameZh: string
  nameEn: string
  latin: string
  category: CategoryKey
  size: string
  price: string
  sortOrder: string
  img: string
  badgeZh: string
  badgeEn: string
  shortZh: string
  shortEn: string
  descriptionZh: string
  descriptionEn: string
  ritualZh: string
  ritualEn: string
  notesZh: string
  notesEn: string
}

const EMPTY_FORM: Form = {
  slug: '',
  nameZh: '',
  nameEn: '',
  latin: '',
  category: 'serums',
  size: '',
  price: '',
  sortOrder: '0',
  img: '',
  badgeZh: '',
  badgeEn: '',
  shortZh: '',
  shortEn: '',
  descriptionZh: '',
  descriptionEn: '',
  ritualZh: '',
  ritualEn: '',
  notesZh: '',
  notesEn: '',
}

function toForm(p: Product): Form {
  return {
    slug: p.slug,
    nameZh: p.name.zh,
    nameEn: p.name.en,
    latin: p.latin,
    category: p.category,
    size: p.size,
    price: String(p.price),
    sortOrder: String(p.sort_order),
    img: p.img,
    badgeZh: p.badge?.zh ?? '',
    badgeEn: p.badge?.en ?? '',
    shortZh: p.short.zh,
    shortEn: p.short.en,
    descriptionZh: p.description.zh,
    descriptionEn: p.description.en,
    ritualZh: p.ritual.zh,
    ritualEn: p.ritual.en,
    notesZh: p.notes.zh.join('\n'),
    notesEn: p.notes.en.join('\n'),
  }
}

function toPayload(f: Form) {
  const lines = (text: string) =>
    text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
  const badgeZh = f.badgeZh.trim()
  const badgeEn = f.badgeEn.trim()
  return {
    slug: f.slug.trim(),
    name: { zh: f.nameZh.trim(), en: f.nameEn.trim() },
    latin: f.latin.trim(),
    price: Number(f.price),
    size: f.size.trim(),
    category: f.category,
    img: f.img.trim(),
    badge: badgeZh || badgeEn ? { zh: badgeZh, en: badgeEn } : null,
    short: { zh: f.shortZh.trim(), en: f.shortEn.trim() },
    description: { zh: f.descriptionZh.trim(), en: f.descriptionEn.trim() },
    ritual: { zh: f.ritualZh.trim(), en: f.ritualEn.trim() },
    notes: { zh: lines(f.notesZh), en: lines(f.notesEn) },
    sort_order: Number(f.sortOrder),
  }
}

const inputClass =
  'w-full border border-umber/20 bg-white px-4 py-2.5 text-sm text-umber focus:border-bronze focus:outline-none disabled:bg-cream disabled:text-smoke'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] tracking-[0.12em] text-umber/70">{label}</span>
      {children}
    </label>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-6 border-t border-umber/10 pt-8">
      <legend className="mb-6 font-serif text-xl">{title}</legend>
      {children}
    </fieldset>
  )
}

export default function AdminProductForm() {
  const { slug } = useParams()
  const isNew = !slug
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew) return
    let cancelled = false
    ;(async () => {
      try {
        const body = await callAdmin<{ products?: unknown }>('list')
        if (!Array.isArray(body.products)) throw new Error('商品数据格式异常')
        const found = (body.products as Product[]).find((p) => p.slug === slug)
        if (cancelled) return
        if (found) setForm(toForm(found))
        else setNotFound(true)
      } catch (err) {
        if (cancelled) return
        if (isSessionExpired(err)) navigate('/admin', { replace: true })
        else setError(errorText(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isNew, slug, navigate])

  const update = (key: Exclude<keyof Form, 'category'>, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await callAdmin(isNew ? 'create' : 'update', { product: toPayload(form) })
      navigate('/admin/products')
    } catch (err) {
      if (isSessionExpired(err)) {
        navigate('/admin', { replace: true })
        return
      }
      setError(errorText(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-center text-sm text-smoke">加载中…</p>

  if (notFound) {
    return (
      <div className="text-center">
        <p className="font-serif text-2xl">找不到这件商品</p>
        <Link to="/admin/products" className="mt-6 inline-block text-sm text-bronze underline">
          返回商品列表
        </Link>
      </div>
    )
  }

  return (
    <section className="max-w-3xl">
      <Link to="/admin/products" className="text-[12px] tracking-[0.15em] text-smoke hover:text-umber">
        ← 返回商品列表
      </Link>
      <h1 className="mt-4 font-serif text-4xl font-light">
        {isNew ? '新增商品' : `编辑：${form.nameZh}`}
      </h1>

      <form onSubmit={save} className="mt-10 space-y-10">
        <Section title="基本信息">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="网址标识（英文小写，用连字符）">
              <input
                required
                disabled={!isNew}
                value={form.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="例如 night-balm"
                className={inputClass}
              />
            </Field>
            <Field label="分类">
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as CategoryKey }))}
                className={inputClass}
              >
                {(Object.keys(CATEGORY_LABELS) as CategoryKey[]).map((key) => (
                  <option key={key} value={key}>
                    {CATEGORY_LABELS[key].zh} / {CATEGORY_LABELS[key].en}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="商品名称（中文）">
              <input required value={form.nameZh} onChange={(e) => update('nameZh', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Product name (English)">
              <input required value={form.nameEn} onChange={(e) => update('nameEn', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="拉丁名 / 成分名">
              <input value={form.latin} onChange={(e) => update('latin', e.target.value)} className={inputClass} />
            </Field>
            <Field label="规格（如 30 ml）">
              <input required value={form.size} onChange={(e) => update('size', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="价格（欧元，整数）">
              <input
                type="number"
                required
                min={0}
                step={1}
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="排序（数字越小越靠前）">
              <input
                type="number"
                required
                min={0}
                step={1}
                value={form.sortOrder}
                onChange={(e) => update('sortOrder', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="图片地址">
            <input required value={form.img} onChange={(e) => update('img', e.target.value)} placeholder="/images/product-cream.png" className={inputClass} />
          </Field>
          {form.img && (
            <div className="h-40 w-32 overflow-hidden bg-cream">
              <img src={form.img} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="角标（中文，可留空）">
              <input value={form.badgeZh} onChange={(e) => update('badgeZh', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Badge (English, optional)">
              <input value={form.badgeEn} onChange={(e) => update('badgeEn', e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Section>

        <Section title="简介与详情">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="简短介绍（中文）">
              <input required value={form.shortZh} onChange={(e) => update('shortZh', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Short introduction (English)">
              <input required value={form.shortEn} onChange={(e) => update('shortEn', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="详细介绍（中文）">
              <textarea required rows={5} value={form.descriptionZh} onChange={(e) => update('descriptionZh', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Description (English)">
              <textarea required rows={5} value={form.descriptionEn} onChange={(e) => update('descriptionEn', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="香调说明（中文，每行一条，1 至 6 行）">
              <textarea required rows={4} value={form.notesZh} onChange={(e) => update('notesZh', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Scent notes (English, one per line, 1 to 6)">
              <textarea required rows={4} value={form.notesEn} onChange={(e) => update('notesEn', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field label="使用仪式（中文）">
              <textarea required rows={3} value={form.ritualZh} onChange={(e) => update('ritualZh', e.target.value)} className={inputClass} />
            </Field>
            <Field label="The ritual (English)">
              <textarea required rows={3} value={form.ritualEn} onChange={(e) => update('ritualEn', e.target.value)} className={inputClass} />
            </Field>
          </div>
        </Section>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="flex items-center justify-end gap-4 border-t border-umber/10 pt-8">
          <Link to="/admin/products" className="px-6 py-3 text-[12px] tracking-[0.15em] text-umber/70 hover:text-umber">
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="bg-umber px-8 py-3 text-[12px] tracking-[0.2em] text-ivory transition-colors duration-300 hover:bg-golddeep disabled:opacity-60"
          >
            {saving ? '保存中…' : '保存商品'}
          </button>
        </div>
      </form>
    </section>
  )
}
