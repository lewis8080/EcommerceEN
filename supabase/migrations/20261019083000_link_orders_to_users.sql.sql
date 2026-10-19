/*
  # Link orders to authenticated users

  This migration transitions the boutique from guest checkout to
  authenticated-user-only checkout. Orders are now owned by the
  signed-in user who placed them.

  1. Changes to `stripe_orders`
    - Add `user_id` column (uuid, nullable for backwards compatibility
      with any pre-existing guest orders, defaults to auth.uid() for
      new authenticated inserts)
    - Add foreign key constraint to auth.users ON DELETE SET NULL
    - Create index on user_id for order history queries

  2. RLS policy changes on `stripe_orders`
    - Drop the previous anon-open SELECT/INSERT/UPDATE policies
    - Add authenticated-only SELECT scoped to the user's own orders
      via EXISTS check against stripe_customers
    - The edge function uses the service role key (bypasses RLS)
      for inserts/updates, so only a SELECT policy is needed for
      the frontend to read its own order history

  3. Important notes
    - The stripe-checkout edge function now requires an Authorization
      header and will create/look up a stripe_customers row for the
      authenticated user before creating the checkout session
    - The webhook edge function uses the service role key and bypasses
      RLS, so it can still upsert order rows
*/

-- Add user_id column to stripe_orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stripe_orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE stripe_orders
      ADD COLUMN user_id uuid DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index for order history lookups
CREATE INDEX IF NOT EXISTS idx_stripe_orders_user_id ON stripe_orders(user_id);

-- Replace anon-open policies with authenticated-only SELECT for own orders
DROP POLICY IF EXISTS "Users can view their own order data" ON stripe_orders;
DROP POLICY IF EXISTS "anon_read_orders" ON stripe_orders;
DROP POLICY IF EXISTS "anon_insert_orders" ON stripe_orders;
DROP POLICY IF EXISTS "anon_update_orders" ON stripe_orders;

CREATE POLICY "select_own_orders"
  ON stripe_orders FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR (
      customer_id IN (
        SELECT customer_id FROM stripe_customers
        WHERE user_id = auth.uid() AND deleted_at IS NULL
      )
    )
  );

-- Allow authenticated users to insert their own order rows (pre-checkout pending record)
CREATE POLICY "insert_own_orders"
  ON stripe_orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow authenticated users to update their own order rows
CREATE POLICY "update_own_orders"
  ON stripe_orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
