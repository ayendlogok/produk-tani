import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import TaniMarket from './pages/TaniMarket';
import TaniDashboard from './pages/TaniDashboard';
import TaniHub from './pages/TaniHub';
import { ThemeProvider } from './context/ThemeContext';
import { FarmProvider } from './context/FarmContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import SplashScreen from './components/SplashScreen';
import AuthPage from './pages/AuthPage';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) return <SplashScreen />;
  if (!user) return <AuthPage />;

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<TaniDashboard />} />
          <Route path="/market" element={<TaniMarket />} />
          <Route path="/hub" element={<TaniHub />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <FarmProvider>
            <AppContent />
          </FarmProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
