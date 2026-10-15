import type { Lang } from '../context/LanguageContext'

export type CategoryKey = 'serums' | 'creams' | 'mists' | 'sets'

export type Product = {
  slug: string
  name: Record<Lang, string>
  latin: string
  price: number
  size: string
  category: CategoryKey
  img: string
  badge?: Record<Lang, string>
  short: Record<Lang, string>
  description: Record<Lang, string>
  notes: Record<Lang, string[]>
  ritual: Record<Lang, string>
}

export const PRODUCTS: Product[] = [
  {
    slug: 'illuminating-serum',
    name: { zh: '焕亮精华液 N°01', en: 'Illuminating Serum N°01' },
    latin: 'Camellia · Riz · Fenouil de mer',
    price: 118,
    size: '30 ml',
    category: 'serums',
    img: '/images/hero-serum.png',
    badge: { zh: '首次压榨', en: 'First pressing' },
    short: {
      zh: '三幕发酵。光影，凝入肌肤。',
      en: 'The three-act ferment. Light, distilled into skin.',
    },
    description: {
      zh: '我们的奠基之作：一支丝滑轻盈的精华液，由冷压山茶、九十日稻米发酵与岩生海茴香调和而成。以千瓶编号压榨，静置四十日后上市。',
      en: 'Our founding formula: a silk-light serum of cold-pressed tsubaki, ninety-day rice ferment and cliff-grown sea fennel. Blended in numbered pressings of one thousand bottles, rested forty days before release.',
    },
    notes: {
      zh: ['山茶花——脂质屏障', '稻米发酵——肤色', '海茴香——焕新'],
      en: ['Camellia japonica — lipid veil', 'Oryza sativa ferment — tone', 'Crithmum maritimum — renewal'],
    },
    ritual: {
      zh: '两滴，掌心温热后按压——而非揉搓——于湿润肌肤之上，早晚各一次。',
      en: 'Two drops, warmed between the palms and pressed — never rubbed — over damp skin, morning and evening.',
    },
  },
  {
    slug: 'velvet-renewal-cream',
    name: { zh: '丝绒焕新面霜', en: 'Velvet Renewal Cream' },
    latin: 'Butyrospermum · Céramides',
    price: 96,
    size: '50 ml',
    category: 'creams',
    img: '/images/product-cream.png',
    short: {
      zh: '乳木果与神经酰胺的轻盈封存，作为最终一步。',
      en: 'A whipped seal of shea and ceramides for the final gesture.',
    },
    description: {
      zh: '搅打乳木果、植物神经酰胺与一丝同样的稻米发酵，低温搅打以保乳化不破。它将精华液封存于一层透气的丝绒之下。',
      en: 'Whipped shea, phytoceramides and a whisper of the same rice ferment, churned at low temperature so the emulsion never breaks. It seals the serum beneath a breathable, velvet finish.',
    },
    notes: {
      zh: ['搅打乳木果——舒适', '植物神经酰胺——屏障', '稻米发酵——延续'],
      en: ['Whipped shea — comfort', 'Phytoceramides — barrier', 'Rice ferment — continuity'],
    },
    ritual: {
      zh: '精华液后、肌肤仍湿润时，取珍珠大小按压于面部，作为晚间最后一步。',
      en: 'A pearl-sized amount pressed over the serum while skin is still damp, as the evening\u2019s final gesture.',
    },
  },
  {
    slug: 'botanical-essence-mist',
    name: { zh: '植物精萃喷雾', en: 'Botanical Essence Mist' },
    latin: 'Aloe · Rose de Grasse',
    price: 54,
    size: '100 ml',
    category: 'mists',
    img: '/images/product-mist.png',
    short: {
      zh: '轻盈无重面纱，唤醒肌肤，定调仪式。',
      en: 'A weightless veil to wake the skin and set the ritual.',
    },
    description: {
      zh: '采自我们格拉斯自有花田的蒸馏玫瑰，融入芦荟水与一丝甘油。一次喷雾唤醒肌肤，为精华液做准备，并贯穿整日刷新仪式。',
      en: 'Distilled rose from our own Grasse fields, folded into aloe water and a trace of glycerin. A single pass wakes the skin, prepares it for the serum, and refreshes the ritual through the day.',
    },
    notes: {
      zh: ['格拉斯玫瑰——肤色', '芦荟水——舒缓', '植物甘油——润泽'],
      en: ['Rose de Grasse — tone', 'Aloe water — calm', 'Vegetable glycerin — dew'],
    },
    ritual: {
      zh: '精华液前喷洒于洁净肌肤之上，日间感觉干燥时再次使用。',
      en: 'Mist over clean skin before the serum, and again through the day whenever the light feels dry.',
    },
  },
  {
    slug: 'discovery-ritual',
    name: { zh: '探索仪式套装', en: 'The Discovery Ritual' },
    latin: 'Trio · 3 × 10 ml',
    price: 148,
    size: '3 × 10 ml',
    category: 'sets',
    img: '/images/product-trio.png',
    badge: { zh: '编号', en: 'Numbered' },
    short: {
      zh: '完整晚间仪式的旅行装，手工编号。',
      en: 'The full evening ritual in travel size, numbered by hand.',
    },
    description: {
      zh: '精华液、面霜与喷雾的编号旅行装——两周完整仪式，装于亚麻包裹的礼盒中。这是在承诺正装之前认识品牌的唯一方式。',
      en: 'The serum, the cream and the mist in numbered travel pressings — a fortnight of the full ritual, housed in a linen-wrapped coffret. The only way to meet the maison before committing to a full bottle.',
    },
    notes: {
      zh: ['精华液 N°01——10 ml', '焕新面霜——10 ml', '精萃喷雾——10 ml'],
      en: ['Serum N°01 — 10 ml', 'Renewal Cream — 10 ml', 'Essence Mist — 10 ml'],
    },
    ritual: {
      zh: '先喷喷雾，按压精华液，再封以面霜。每晚重复，持续十四夜。',
      en: 'Begin with the mist, press in the serum, seal with the cream. Repeat each evening for fourteen nights.',
    },
  },
]

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
