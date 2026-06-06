import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { FarmProvider } from './context/FarmContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const TaniMarket = lazy(() => import('./pages/TaniMarket'));
const TaniDashboard = lazy(() => import('./pages/TaniDashboard'));
const TaniHub = lazy(() => import('./pages/TaniHub'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0fdf4' }}>
    <p style={{ color: '#16a34a', fontWeight: 'bold' }}>Memuat...</p>
  </div>
);

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Route (Hanya bisa diakses jika belum login) */}
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" replace />} />

          {/* Protected Routes (Menggunakan Layout utama) */}
          <Route element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<LoadingFallback />}>
                  {/* The outlet content will be replaced by the routes below, but since we are not using nested routes correctly for layout here, we wrap Layout around routes directly or use nested routes. */}
                </Suspense>
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><TaniDashboard /></Layout></ProtectedRoute>} />
          <Route path="/market" element={<ProtectedRoute><Layout><TaniMarket /></Layout></ProtectedRoute>} />
          <Route path="/hub" element={<ProtectedRoute><Layout><TaniHub /></Layout></ProtectedRoute>} />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <FarmProvider>
            <AppContent />
          </FarmProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
