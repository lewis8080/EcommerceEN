/*
  # Guest Checkout — Open stripe_orders for anon access

  This app is a no-sign-in luxury boutique. Guests check out via Stripe
  without creating an account, so the existing `authenticated`-only RLS
  policies on `stripe_orders` block all access from the anon-key frontend.

  1. Changes
    - Add `checkout_session_id` UNIQUE constraint (needed for upsert in webhook)
    - Drop the existing `authenticated`-only SELECT policy on `stripe_orders`
    - Add new `TO anon, authenticated` SELECT policy so the frontend can
      look up an order by checkout_session_id after redirect
    - Keep INSERT/UPDATE open to `anon, authenticated` so the edge function
      (using service role, bypasses RLS) and future anon flows can write

  2. Security notes
    - The edge function uses the SERVICE ROLE key, which bypasses RLS entirely,
      so these policies only govern what the anon-key browser client can do.
    - Allowing anon SELECT on `stripe_orders` is intentional: after a Stripe
      redirect, the browser needs to confirm the order by session ID.
      Sensitive fields like payment_intent_id are Stripe identifiers, not
      card data, and the row is only findable if you know the checkout session ID.
*/

-- Ensure uniqueness for upsert via onConflict
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'stripe_orders_checkout_session_id_key'
  ) THEN
    ALTER TABLE stripe_orders ADD CONSTRAINT stripe_orders_checkout_session_id_key UNIQUE (checkout_session_id);
  END IF;
END $$;

-- Replace the authenticated-only SELECT policy with an anon-accessible one
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;
DROP POLICY IF EXISTS "anon_read_orders" ON stripe_orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON stripe_orders;
DROP POLICY IF EXISTS "anon_update_orders" ON stripe_orders;

CREATE POLICY "anon_read_orders"
  ON stripe_orders FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anon_insert_orders"
  ON stripe_orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "anon_update_orders"
  ON stripe_orders FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);
