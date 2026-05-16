import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PublicLanding } from './pages/PublicLanding';
import { CareerSkills } from './pages/CareerSkills';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { UploadPage } from './pages/Upload';
import { Explorer } from './pages/Explorer';
import { ChillZone } from './pages/ChillZone';
import { AISensei } from './pages/AISensei';
import { UserProfile } from './pages/UserProfile';
import { PrivacyPage, TermsPage, SupportPage } from './pages/LegalPages';
import { Subscribe } from './pages/Subscribe';
import { BottomNav } from './components/layout/BottomNav';
import { SubscriptionGuard } from './components/SubscriptionGuard';

// ── Auth-only Route (must be logged in) ──────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// ── Auth + Subscription Route (must be logged in AND have active access) ─
const AppRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return <SubscriptionGuard>{children}</SubscriptionGuard>;
};

// ── Root Resolver ─────────────────────────────────────────────────────────
const RootResolver = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/home" replace />;
  return <PublicLanding />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<RootResolver />} />
          <Route path="/auth" element={<Auth />} />

          {/* Subscription wall — must be logged in but NOT subscription-gated */}
          <Route path="/subscribe" element={<ProtectedRoute><Subscribe /></ProtectedRoute>} />

          {/* Main App Routes (login + subscription required) */}
          <Route path="/home"      element={<AppRoute><Landing /></AppRoute>} />
          <Route path="/dashboard" element={<AppRoute><Dashboard /></AppRoute>} />
          <Route path="/upload"    element={<AppRoute><UploadPage /></AppRoute>} />
          <Route path="/explore"   element={<AppRoute><Explorer /></AppRoute>} />
          <Route path="/community" element={<AppRoute><ChillZone /></AppRoute>} />
          <Route path="/skills"    element={<AppRoute><CareerSkills /></AppRoute>} />
          <Route path="/material/:id"  element={<AppRoute><AISensei /></AppRoute>} />
          <Route path="/profile/:userId" element={<AppRoute><UserProfile /></AppRoute>} />

          {/* Public legal pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms"   element={<TermsPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </Router>
    </AuthProvider>
  );
}

export default App;
