export type Product = {
  slug: string
  name: string
  latin: string
  price: number
  size: string
  category: 'Serums' | 'Creams' | 'Mists' | 'Sets'
  img: string
  badge?: string
  short: string
  description: string
  notes: string[]
  ritual: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'illuminating-serum',
    name: 'Illuminating Serum N°01',
    latin: 'Camellia · Riz · Fenouil de mer',
    price: 118,
    size: '30 ml',
    category: 'Serums',
    img: '/images/hero-serum.png',
    badge: 'First pressing',
    short: 'The three-act ferment. Light, distilled into skin.',
    description:
      'Our founding formula: a silk-light serum of cold-pressed tsubaki, ninety-day rice ferment and cliff-grown sea fennel. Blended in numbered pressings of one thousand bottles, rested forty days before release.',
    notes: ['Camellia japonica — lipid veil', 'Oryza sativa ferment — tone', 'Crithmum maritimum — renewal'],
    ritual:
      'Two drops, warmed between the palms and pressed — never rubbed — over damp skin, morning and evening.',
  },
  {
    slug: 'velvet-renewal-cream',
    name: 'Velvet Renewal Cream',
    latin: 'Butyrospermum · Céramides',
    price: 96,
    size: '50 ml',
    category: 'Creams',
    img: '/images/product-cream.png',
    short: 'A whipped seal of shea and ceramides for the final gesture.',
    description:
      'Whipped shea, phytoceramides and a whisper of the same rice ferment, churned at low temperature so the emulsion never breaks. It seals the serum beneath a breathable, velvet finish.',
    notes: ['Whipped shea — comfort', 'Phytoceramides — barrier', 'Rice ferment — continuity'],
    ritual:
      'A pearl-sized amount pressed over the serum while skin is still damp, as the evening\u2019s final gesture.',
  },
  {
    slug: 'botanical-essence-mist',
    name: 'Botanical Essence Mist',
    latin: 'Aloe · Rose de Grasse',
    price: 54,
    size: '100 ml',
    category: 'Mists',
    img: '/images/product-mist.png',
    short: 'A weightless veil to wake the skin and set the ritual.',
    description:
      'Distilled rose from our own Grasse fields, folded into aloe water and a trace of glycerin. A single pass wakes the skin, prepares it for the serum, and refreshes the ritual through the day.',
    notes: ['Rose de Grasse — tone', 'Aloe water — calm', 'Vegetable glycerin — dew'],
    ritual:
      'Mist over clean skin before the serum, and again through the day whenever the light feels dry.',
  },
  {
    slug: 'discovery-ritual',
    name: 'The Discovery Ritual',
    latin: 'Trio · 3 × 10 ml',
    price: 148,
    size: '3 × 10 ml',
    category: 'Sets',
    img: '/images/product-trio.png',
    badge: 'Numbered',
    short: 'The full evening ritual in travel size, numbered by hand.',
    description:
      'The serum, the cream and the mist in numbered travel pressings — a fortnight of the full ritual, housed in a linen-wrapped coffret. The only way to meet the maison before committing to a full bottle.',
    notes: ['Serum N°01 — 10 ml', 'Renewal Cream — 10 ml', 'Essence Mist — 10 ml'],
    ritual:
      'Begin with the mist, press in the serum, seal with the cream. Repeat each evening for fourteen nights.',
  },
]

export const CATEGORIES = ['All', 'Serums', 'Creams', 'Mists', 'Sets'] as const

export const formatPrice = (n: number) => `€${n}`
