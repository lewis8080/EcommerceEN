/*
# Product catalog in the database + admin sessions

Moves the boutique's product list out of the website code and into the
database so it can be managed from an admin area. The four existing
products are seeded so the storefront looks the same as before.

1. New tables
  - `products`: one row per product.
    - `slug` (text, primary key): URL identifier, e.g. "illuminating-serum".
    - `name`, `short`, `description`, `ritual` (jsonb): bilingual text as {"zh": "...", "en": "..."}.
    - `badge` (jsonb, optional): bilingual short label such as "First pressing".
    - `notes` (jsonb): bilingual list of three scent notes.
    - `latin` (text), `size` (text), `img` (text): not translated.
    - `price` (integer): price in euros.
    - `category` (text): one of serums, creams, mists, sets.
    - `sort_order` (integer): controls display order.
  - `admin_sessions`: login tokens for the admin area. Only the server can read or write it.

2. Security
  - `products`: row level security is on. Anyone (signed in or not) may read products.
    Nobody can change products directly from the browser; all changes go through the
    admin edge function, which uses the server key.
  - `admin_sessions`: row level security is on with no policies and no grants to the
    browser roles, so it is invisible to the website.

3. Notes
  - The seed uses ON CONFLICT DO NOTHING, so re-running this migration never overwrites
    products that were edited later in the admin area.
*/

CREATE TABLE IF NOT EXISTS products (
  slug text PRIMARY KEY,
  name jsonb NOT NULL,
  latin text NOT NULL DEFAULT '',
  price integer NOT NULL CHECK (price >= 0),
  size text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('serums', 'creams', 'mists', 'sets')),
  img text NOT NULL DEFAULT '',
  badge jsonb,
  short jsonb NOT NULL,
  description jsonb NOT NULL,
  notes jsonb NOT NULL,
  ritual jsonb NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON products TO anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON products FROM anon, authenticated;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON admin_sessions FROM anon, authenticated;

INSERT INTO products (slug, name, latin, price, size, category, img, badge, short, description, notes, ritual, sort_order)
VALUES
(
  'illuminating-serum',
  $j${"zh": "焕亮精华液 N°01", "en": "Illuminating Serum N°01"}$j$,
  'Camellia · Riz · Fenouil de mer',
  118,
  '30 ml',
  'serums',
  '/images/hero-serum.png',
  $j${"zh": "首次压榨", "en": "First pressing"}$j$,
  $j${"zh": "三幕发酵。光影，凝入肌肤。", "en": "The three-act ferment. Light, distilled into skin."}$j$,
  $j${"zh": "我们的奠基之作：一支丝滑轻盈的精华液，由冷压山茶、九十日稻米发酵与岩生海茴香调和而成。以千瓶编号压榨，静置四十日后上市。", "en": "Our founding formula: a silk-light serum of cold-pressed tsubaki, ninety-day rice ferment and cliff-grown sea fennel. Blended in numbered pressings of one thousand bottles, rested forty days before release."}$j$,
  $j${"zh": ["山茶花——脂质屏障", "稻米发酵——肤色", "海茴香——焕新"], "en": ["Camellia japonica — lipid veil", "Oryza sativa ferment — tone", "Crithmum maritimum — renewal"]}$j$,
  $j${"zh": "两滴，掌心温热后按压——而非揉搓——于湿润肌肤之上，早晚各一次。", "en": "Two drops, warmed between the palms and pressed — never rubbed — over damp skin, morning and evening."}$j$,
  1
),
(
  'velvet-renewal-cream',
  $j${"zh": "丝绒焕新面霜", "en": "Velvet Renewal Cream"}$j$,
  'Butyrospermum · Céramides',
  96,
  '50 ml',
  'creams',
  '/images/product-cream.png',
  NULL,
  $j${"zh": "乳木果与神经酰胺的轻盈封存，作为最终一步。", "en": "A whipped seal of shea and ceramides for the final gesture."}$j$,
  $j${"zh": "搅打乳木果、植物神经酰胺与一丝同样的稻米发酵，低温搅打以保乳化不破。它将精华液封存于一层透气的丝绒之下。", "en": "Whipped shea, phytoceramides and a whisper of the same rice ferment, churned at low temperature so the emulsion never breaks. It seals the serum beneath a breathable, velvet finish."}$j$,
  $j${"zh": ["搅打乳木果——舒适", "植物神经酰胺——屏障", "稻米发酵——延续"], "en": ["Whipped shea — comfort", "Phytoceramides — barrier", "Rice ferment — continuity"]}$j$,
  $j${"zh": "精华液后、肌肤仍湿润时，取珍珠大小按压于面部，作为晚间最后一步。", "en": "A pearl-sized amount pressed over the serum while skin is still damp, as the evening’s final gesture."}$j$,
  2
),
(
  'botanical-essence-mist',
  $j${"zh": "植物精萃喷雾", "en": "Botanical Essence Mist"}$j$,
  'Aloe · Rose de Grasse',
  54,
  '100 ml',
  'mists',
  '/images/product-mist.png',
  NULL,
  $j${"zh": "轻盈无重面纱，唤醒肌肤，定调仪式。", "en": "A weightless veil to wake the skin and set the ritual."}$j$,
  $j${"zh": "采自我们格拉斯自有花田的蒸馏玫瑰，融入芦荟水与一丝甘油。一次喷雾唤醒肌肤，为精华液做准备，并贯穿整日刷新仪式。", "en": "Distilled rose from our own Grasse fields, folded into aloe water and a trace of glycerin. A single pass wakes the skin, prepares it for the serum, and refreshes the ritual through the day."}$j$,
  $j${"zh": ["格拉斯玫瑰——肤色", "芦荟水——舒缓", "植物甘油——润泽"], "en": ["Rose de Grasse — tone", "Aloe water — calm", "Vegetable glycerin — dew"]}$j$,
  $j${"zh": "精华液前喷洒于洁净肌肤之上，日间感觉干燥时再次使用。", "en": "Mist over clean skin before the serum, and again through the day whenever the light feels dry."}$j$,
  3
),
(
  'discovery-ritual',
  $j${"zh": "探索仪式套装", "en": "The Discovery Ritual"}$j$,
  'Trio · 3 × 10 ml',
  148,
  '3 × 10 ml',
  'sets',
  '/images/product-trio.png',
  $j${"zh": "编号", "en": "Numbered"}$j$,
  $j${"zh": "完整晚间仪式的旅行装，手工编号。", "en": "The full evening ritual in travel size, numbered by hand."}$j$,
  $j${"zh": "精华液、面霜与喷雾的编号旅行装——两周完整仪式，装于亚麻包裹的礼盒中。这是在承诺正装之前认识品牌的唯一方式。", "en": "The serum, the cream and the mist in numbered travel pressings — a fortnight of the full ritual, housed in a linen-wrapped coffret. The only way to meet the maison before committing to a full bottle."}$j$,
  $j${"zh": ["精华液 N°01——10 ml", "焕新面霜——10 ml", "精萃喷雾——10 ml"], "en": ["Serum N°01 — 10 ml", "Renewal Cream — 10 ml", "Essence Mist — 10 ml"]}$j$,
  $j${"zh": "先喷喷雾，按压精华液，再封以面霜。每晚重复，持续十四夜。", "en": "Begin with the mist, press in the serum, seal with the cream. Repeat each evening for fourteen nights."}$j$,
  4
)
ON CONFLICT (slug) DO NOTHING;
