import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';

import { Loader2 } from 'lucide-react';

/**
 * SubscriptionGuard
 * Wraps any protected route. If the user's trial is expired AND they
 * have no active subscription, they are redirected to /subscribe.
 */
export function SubscriptionGuard({ children }) {
  const { hasAccess, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-primary-500" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Checking access…
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
}
