import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

/**
 * Karma-based pricing:
 *  - Karma >= 100 → ₹29/month (Loyal Scholar)
 *  - Karma <  100 → ₹39/month (Standard)
 *
 * Karma = totalDownloads * 15  (derived from materials table)
 */
export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [karma, setKarma] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    try {
      // 1. Fetch or create the subscription row
      const { data: sub } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // 2. Fetch karma (downloads * 15)
      const { data: mats } = await supabase
        .from('materials')
        .select('downloads')
        .eq('uploaded_by', user.id);

      const totalDownloads = (mats || []).reduce((a, m) => a + (m.downloads || 0), 0);
      const karmaScore = totalDownloads * 15;
      setKarma(karmaScore);

      setSubscription(sub || null);
    } catch (e) {
      console.error('useSubscription error:', e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchSubscription(); }, [fetchSubscription]);

  // ── Derived state ─────────────────────────────────────────────────────────
  const now = new Date();

  const trialEndsAt = subscription?.trial_ends_at
    ? new Date(subscription.trial_ends_at)
    : null;
  const subEndsAt = subscription?.subscription_ends_at
    ? new Date(subscription.subscription_ends_at)
    : null;

  const isTrialActive = trialEndsAt && now < trialEndsAt;
  const isSubscribed =
    subscription?.subscription_status === 'active' && subEndsAt && now < subEndsAt;
  const isPendingVerification = subscription?.subscription_status === 'pending_verification';
  const hasAccess = isTrialActive || isSubscribed;

  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((trialEndsAt - now) / (1000 * 60 * 60 * 24)))
    : 0;

  // Karma-based price
  const price = karma >= 100 ? 29 : 39;
  const planName = karma >= 100 ? 'Scholar Plan' : 'Standard Plan';

  return {
    subscription,
    karma,
    loading,
    isTrialActive,
    isSubscribed,
    isPendingVerification,
    hasAccess,
    trialDaysLeft,
    price,
    planName,
    refetch: fetchSubscription,
  };
}
