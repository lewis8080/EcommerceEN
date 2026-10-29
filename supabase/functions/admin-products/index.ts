import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const ADMIN_USERNAME = 'super';
const ADMIN_PASSWORD = '900102';
const SESSION_HOURS = 12;
const CATEGORIES = ['serums', 'creams', 'mists', 'sets'];
const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isBilingual(value: unknown): value is { zh: string; en: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    isNonEmptyString((value as any).zh) &&
    isNonEmptyString((value as any).en)
  );
}

function isBilingualList(value: unknown): value is { zh: string[]; en: string[] } {
  const ok = (list: unknown) =>
    Array.isArray(list) &&
    list.length >= 1 &&
    list.length <= 6 &&
    list.every(isNonEmptyString);
  return typeof value === 'object' && value !== null && ok((value as any).zh) && ok((value as any).en);
}

function validateProduct(raw: any, isNew: boolean): { product?: Record<string, unknown>; error?: string } {
  if (typeof raw !== 'object' || raw === null) return { error: '商品信息无效' };

  const slug = typeof raw.slug === 'string' ? raw.slug.trim() : '';
  if (!SLUG_PATTERN.test(slug) || slug.length > 80) {
    return { error: '网址标识只能包含小写字母、数字和连字符' };
  }
  if (!isBilingual(raw.name)) return { error: '请填写商品名称（中文和英文）' };
  if (!isBilingual(raw.short)) return { error: '请填写简短介绍（中文和英文）' };
  if (!isBilingual(raw.description)) return { error: '请填写详细介绍（中文和英文）' };
  if (!isBilingual(raw.ritual)) return { error: '请填写使用仪式（中文和英文）' };
  if (!isBilingualList(raw.notes)) return { error: '请填写 1 至 6 条香调说明（中文和英文）' };
  if (raw.badge !== null && raw.badge !== undefined && !isBilingual(raw.badge)) {
    return { error: '标签需同时填写中文和英文，或留空' };
  }
  if (!CATEGORIES.includes(raw.category)) return { error: '商品分类无效' };
  if (!Number.isInteger(raw.price) || raw.price < 0 || raw.price > 100000) {
    return { error: '价格必须是 0 到 100000 之间的整数（欧元）' };
  }
  if (!Number.isInteger(raw.sort_order) || raw.sort_order < 0 || raw.sort_order > 10000) {
    return { error: '排序数字无效' };
  }
  const latin = typeof raw.latin === 'string' ? raw.latin.trim() : '';
  const size = typeof raw.size === 'string' ? raw.size.trim() : '';
  const img = typeof raw.img === 'string' ? raw.img.trim() : '';
  if (latin.length > 200 || size.length > 60 || img.length > 500) {
    return { error: '拉丁名、规格或图片地址过长' };
  }
  if (!isNew && !img) return { error: '请填写商品图片地址' };

  return {
    product: {
      slug,
      name: raw.name,
      latin,
      price: raw.price,
      size,
      category: raw.category,
      img,
      badge: raw.badge ?? null,
      short: raw.short,
      description: raw.description,
      notes: raw.notes,
      ritual: raw.ritual,
      sort_order: raw.sort_order,
      updated_at: new Date().toISOString(),
    },
  };
}

async function hasValidSession(token: unknown): Promise<boolean> {
  if (!isNonEmptyString(token)) return false;
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('token')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const body = await req.json();
    const action = body?.action;

    if (action === 'login') {
      if (body.username !== ADMIN_USERNAME || body.password !== ADMIN_PASSWORD) {
        return json({ error: '账号或密码不正确' }, 401);
      }
      await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString());
      const token = newToken();
      const expiresAt = new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString();
      const { error } = await supabase.from('admin_sessions').insert({ token, expires_at: expiresAt });
      if (error) throw error;
      return json({ token });
    }

    if (!(await hasValidSession(body?.token))) {
      return json({ error: 'unauthorized' }, 401);
    }

    if (action === 'logout') {
      await supabase.from('admin_sessions').delete().eq('token', body.token);
      return json({ ok: true });
    }

    if (action === 'list') {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return json({ products: data });
    }

    if (action === 'create' || action === 'update') {
      const { product, error: validationError } = validateProduct(body.product, action === 'create');
      if (validationError || !product) return json({ error: validationError }, 400);

      if (action === 'create') {
        const { error } = await supabase.from('products').insert(product);
        if (error?.code === '23505') return json({ error: '该网址标识已被使用' }, 409);
        if (error) throw error;
      } else {
        const { slug, ...fields } = product;
        const { data, error } = await supabase
          .from('products')
          .update(fields)
          .eq('slug', slug)
          .select('slug');
        if (error) throw error;
        if (!data || data.length === 0) return json({ error: '商品不存在' }, 404);
      }
      return json({ ok: true });
    }

    if (action === 'delete') {
      if (!isNonEmptyString(body.slug)) return json({ error: '商品标识无效' }, 400);
      const { error } = await supabase.from('products').delete().eq('slug', body.slug);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: '未知操作' }, 400);
  } catch (error: any) {
    console.error('admin-products error:', error?.message ?? error);
    return json({ error: '服务器错误，请稍后重试' }, 500);
  }
});
