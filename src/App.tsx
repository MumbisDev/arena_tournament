import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useTournamentStore } from './store/tournamentStore';
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
  const { initialize } = useAuthStore();
  const { fetchTournaments } = useTournamentStore();

  useEffect(() => {
    initialize();
    // Start fetching tournaments immediately on app load
    fetchTournaments();
  }, [initialize, fetchTournaments]);

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
