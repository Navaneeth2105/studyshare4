-- ============================================================
-- StudyShare — Subscription System
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. Create the user_subscriptions table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  trial_starts_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_ends_at          TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 days'),
  subscription_status    TEXT NOT NULL DEFAULT 'trial',
  -- Possible values:
  --   'trial'                 → within free trial period
  --   'pending_verification'  → user paid, awaiting admin check
  --   'active'                → subscription is live
  --   'expired'               → subscription period ended
  subscription_plan      TEXT DEFAULT NULL,  -- 'Scholar Plan' | 'Standard Plan'
  subscription_starts_at TIMESTAMPTZ DEFAULT NULL,
  subscription_ends_at   TIMESTAMPTZ DEFAULT NULL,
  payment_ref            TEXT DEFAULT NULL,  -- UTR / transaction ID submitted by user
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can only read their own subscription
DROP POLICY IF EXISTS "Users read own subscription" ON public.user_subscriptions;
CREATE POLICY "Users read own subscription"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own row (to submit UTR / payment_ref)
DROP POLICY IF EXISTS "Users update own subscription" ON public.user_subscriptions;
CREATE POLICY "Users update own subscription"
  ON public.user_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own row (upsert from frontend as fallback)
DROP POLICY IF EXISTS "Users insert own subscription" ON public.user_subscriptions;
CREATE POLICY "Users insert own subscription"
  ON public.user_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Auto-create a subscription row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_subscription();

-- ============================================================
-- HOW TO ACTIVATE A USER MANUALLY (Admin Steps)
-- ============================================================
-- 1. Go to Table Editor → user_subscriptions
-- 2. Find the row where subscription_status = 'pending_verification'
-- 3. Verify the payment_ref (UTR) in your UPI app's history
-- 4. Run the query below replacing USER_EMAIL:
--
-- UPDATE public.user_subscriptions
-- SET
--   subscription_status    = 'active',
--   subscription_starts_at = now(),
--   subscription_ends_at   = now() + interval '30 days',
--   updated_at             = now()
-- WHERE user_id = (
--   SELECT id FROM auth.users WHERE email = 'USER_EMAIL'
-- );
-- ============================================================
