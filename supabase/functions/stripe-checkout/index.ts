import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: { name: 'La Lumiere', version: '1.0.0' },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

// Product catalog — prices in EUR cents, matched by slug
const CATALOG: Record<string, { name: string; price: number; image?: string }> = {
  'illuminating-serum': { name: 'Illuminating Serum N°01', price: 11800, image: '/images/hero-serum.png' },
  'velvet-renewal-cream': { name: 'Velvet Renewal Cream', price: 9600 },
  'botanical-essence-mist': { name: 'Botanical Essence Mist', price: 5400 },
  'discovery-ritual': { name: 'The Discovery Ritual', price: 14800 },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { items, success_url, cancel_url } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build Stripe line items from the cart
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    for (const item of items) {
      const product = CATALOG[item.slug];
      if (!product) {
        return new Response(
          JSON.stringify({ error: `Unknown product: ${item.slug}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const qty = Math.max(1, Math.min(99, Math.floor(item.qty)));
      lineItems.push({
        quantity: qty,
        price_data: {
          currency: 'eur',
          unit_amount: product.price,
          product_data: {
            name: product.name,
          },
        },
      });
    }

    // Create a placeholder customer record for guest checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url,
      cancel_url,
      shipping_address_collection: { allowed_countries: ['FR', 'DE', 'GB', 'US', 'JP', 'CN', 'IT', 'ES', 'NL', 'BE'] },
    });

    // Pre-create an order record with pending status
    const { error: orderError } = await supabase.from('stripe_orders').insert({
      checkout_session_id: session.id,
      payment_intent_id: session.payment_intent as string ?? '',
      customer_id: session.customer as string ?? '',
      amount_subtotal: session.amount_subtotal ?? 0,
      amount_total: session.amount_total ?? 0,
      currency: session.currency ?? 'eur',
      payment_status: session.payment_status ?? 'unpaid',
      status: 'pending',
    });

    if (orderError) {
      console.error('Failed to create order record:', orderError);
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
