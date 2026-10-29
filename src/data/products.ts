import type { Lang } from '../context/LanguageContext'

export type CategoryKey = 'serums' | 'creams' | 'mists' | 'sets'

export type Bilingual = Record<Lang, string>

export type Product = {
  slug: string
  name: Bilingual
  latin: string
  price: number
  size: string
  category: CategoryKey
  img: string
  badge?: Bilingual | null
  short: Bilingual
  description: Bilingual
  notes: Record<Lang, string[]>
  ritual: Bilingual
  sort_order: number
}

export const CATEGORY_LABELS: Record<CategoryKey, Record<Lang, string>> = {
  serums: { zh: '精华液', en: 'Serums' },
  creams: { zh: '面霜', en: 'Creams' },
  mists: { zh: '喷雾', en: 'Mists' },
  sets: { zh: '套装', en: 'Sets' },
}

export const CATEGORIES = [
  { key: 'all', label: { zh: '全部', en: 'All' } },
  { key: 'serums', label: { zh: '精华液', en: 'Serums' } },
  { key: 'creams', label: { zh: '面霜', en: 'Creams' } },
  { key: 'mists', label: { zh: '喷雾', en: 'Mists' } },
  { key: 'sets', label: { zh: '套装', en: 'Sets' } },
] as const

export const formatPrice = (n: number) => `€${n}`
