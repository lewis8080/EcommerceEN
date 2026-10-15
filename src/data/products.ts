export type Product = {
  slug: string
  name: string
  latin: string
  price: number
  size: string
  category: '精华液' | '面霜' | '喷雾' | '套装'
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
    name: '焕亮精华液 N°01',
    latin: 'Camellia · Riz · Fenouil de mer',
    price: 118,
    size: '30 ml',
    category: '精华液',
    img: '/images/hero-serum.png',
    badge: '首次压榨',
    short: '三幕发酵。光影，凝入肌肤。',
    description:
      '我们的奠基之作：一支丝滑轻盈的精华液，由冷压山茶、九十日稻米发酵与岩生海茴香调和而成。以千瓶编号压榨，静置四十日后上市。',
    notes: ['山茶花——脂质屏障', '稻米发酵——肤色', '海茴香——焕新'],
    ritual:
      '两滴，掌心温热后按压——而非揉搓——于湿润肌肤之上，早晚各一次。',
  },
  {
    slug: 'velvet-renewal-cream',
    name: '丝绒焕新面霜',
    latin: 'Butyrospermum · Céramides',
    price: 96,
    size: '50 ml',
    category: '面霜',
    img: '/images/product-cream.png',
    short: '乳木果与神经酰胺的轻盈封存，作为最终一步。',
    description:
      '搅打乳木果、植物神经酰胺与一丝同样的稻米发酵，低温搅打以保乳化不破。它将精华液封存于一层透气的丝绒之下。',
    notes: ['搅打乳木果——舒适', '植物神经酰胺——屏障', '稻米发酵——延续'],
    ritual:
      '精华液后、肌肤仍湿润时，取珍珠大小按压于面部，作为晚间最后一步。',
  },
  {
    slug: 'botanical-essence-mist',
    name: '植物精萃喷雾',
    latin: 'Aloe · Rose de Grasse',
    price: 54,
    size: '100 ml',
    category: '喷雾',
    img: '/images/product-mist.png',
    short: '轻盈无重面纱，唤醒肌肤，定调仪式。',
    description:
      '采自我们格拉斯自有花田的蒸馏玫瑰，融入芦荟水与一丝甘油。一次喷雾唤醒肌肤，为精华液做准备，并贯穿整日刷新仪式。',
    notes: ['格拉斯玫瑰——肤色', '芦荟水——舒缓', '植物甘油——润泽'],
    ritual:
      '精华液前喷洒于洁净肌肤之上，日间感觉干燥时再次使用。',
  },
  {
    slug: 'discovery-ritual',
    name: '探索仪式套装',
    latin: 'Trio · 3 × 10 ml',
    price: 148,
    size: '3 × 10 ml',
    category: '套装',
    img: '/images/product-trio.png',
    badge: '编号',
    short: '完整晚间仪式的旅行装，手工编号。',
    description:
      '精华液、面霜与喷雾的编号旅行装——两周完整仪式，装于亚麻包裹的礼盒中。这是在承诺正装之前认识品牌的唯一方式。',
    notes: ['精华液 N°01——10 ml', '焕新面霜——10 ml', '精萃喷雾——10 ml'],
    ritual:
      '先喷喷雾，按压精华液，再封以面霜。每晚重复，持续十四夜。',
  },
]

export const CATEGORIES = ['全部', '精华液', '面霜', '喷雾', '套装'] as const

export const formatPrice = (n: number) => `€${n}`
