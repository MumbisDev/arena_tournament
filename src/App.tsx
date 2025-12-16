import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import {
  DiscoverPage,
  DashboardPage,
  CreateTournamentPage,
  TournamentDetailsPage,
  ProfilePage,
  ManageTournamentPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
} from './pages';

export default function App() {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-brutal-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brutal-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<DiscoverPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/tournament/:id" element={<TournamentDetailsPage />} />

      {/* Protected routes - Any authenticated user */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/settings"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected routes - Any authenticated user can create tournaments */}
      <Route
        path="/create-tournament"
        element={
          <ProtectedRoute>
            <CreateTournamentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournament/:id/manage"
        element={
          <ProtectedRoute>
            <ManageTournamentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tournament/:id/matches"
        element={<TournamentDetailsPage />}
      />

      {/* Fallback route */}
      <Route path="*" element={<DiscoverPage />} />
    </Routes>
  );
}
