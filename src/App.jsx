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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
};

// Root: show public landing if not logged in, else redirect to app
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

          {/* Main App Routes (Protected) */}
          <Route path="/home" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explorer /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><ChillZone /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><CareerSkills /></ProtectedRoute>} />
          <Route path="/material/:id" element={<ProtectedRoute><AISensei /></ProtectedRoute>} />
          <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

          {/* Public legal pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/support" element={<SupportPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
