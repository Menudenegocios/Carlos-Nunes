
// Test comment
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { isSupabaseConfigured } from './services/supabaseClient';
import { initUser } from './initUser';
import { Layout } from './components/Layout';
import { DashboardLayout } from './components/DashboardLayout';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Plans } from './pages/Plans';
import { Rewards } from './pages/Rewards';
import { Coupons } from './pages/Coupons';
import { Blog } from './pages/Blog';
import { Marketplace } from './pages/Marketplace';
import { Quotes } from './pages/Quotes';
import { Reviews } from './pages/Reviews';
import { Categories } from './pages/Categories';
import { MyCatalog } from './pages/MyCatalog';
import { StoreView } from './pages/StoreView';
import { Vitrine } from './pages/Vitrine';
import { BioBuilder } from './pages/BioBuilder';
import { BioView } from './pages/BioView';
import { BusinessSuite } from './pages/BusinessSuite';
import { MarketplaceB2B } from './pages/MarketplaceB2B';
import { Academy } from './pages/Academy';
import { AboutUs } from './pages/AboutUs';
import { Partners } from './pages/Partners';
import { Events } from './pages/Events';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { Support } from './pages/Support';
import { ProjectManagement } from './pages/ProjectManagement';
import { AdminCentral } from './pages/AdminCentral';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return isAuthenticated ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout children={<Home />} />} path="/" />
      <Route element={<Layout children={<Categories />} />} path="/categories" />
      <Route element={<Navigate to="/vitrine" replace />} path="/stores" />
      <Route element={<Layout children={<Vitrine />} />} path="/vitrine" />
      <Route element={<Layout children={<StoreView />} />} path="/store/:userId" />
      <Route element={<Layout children={<BioView />} />} path="/bio/:userId" />
      <Route element={<Layout children={<Coupons />} />} path="/coupons" />
      <Route element={<Layout children={<Login />} />} path="/login" />
      <Route element={<Layout children={<Register />} />} path="/register" />
      <Route element={<Layout children={<Blog />} />} path="/blog" />
      <Route element={<Layout children={<Blog />} />} path="/blog/:id" />
      <Route element={<Layout children={<Marketplace />} />} path="/marketplace" />
      <Route element={<Layout children={<Plans />} />} path="/plans" />
      <Route element={<Layout children={<AboutUs />} />} path="/quem-somos" />
      <Route element={<Layout children={<Partners />} />} path="/partners" />
      <Route element={<Layout children={<Events />} />} path="/eventos" />
      <Route element={<Layout children={<PrivacyPolicy />} />} path="/privacy" />
      <Route element={<Layout children={<TermsOfUse />} />} path="/terms" />

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/business-suite" element={<PrivateRoute><BusinessSuite /></PrivateRoute>} />
      <Route path="/project-management" element={<PrivateRoute><ProjectManagement /></PrivateRoute>} />
      <Route path="/marketplace-b2b" element={<PrivateRoute><MarketplaceB2B /></PrivateRoute>} />
      <Route path="/academy" element={<PrivateRoute><Academy /></PrivateRoute>} />
      <Route path="/bio-builder" element={<PrivateRoute><BioBuilder /></PrivateRoute>} />
      <Route path="/catalog" element={<PrivateRoute><MyCatalog /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
      <Route path="/quotes" element={<PrivateRoute><Quotes /></PrivateRoute>} />
      <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
      <Route path="/admin-central" element={<PrivateRoute><AdminCentral /></PrivateRoute>} />
      
      {/* Vanity URL / Slug - Must be last */}
      <Route element={<Layout children={<StoreView />} />} path="/:slug" />
    </Routes>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    initUser();
  }, []);

  return (
    <ThemeProvider>
      {!isSupabaseConfigured && (
        <div className="bg-red-600 text-white p-4 text-center sticky top-0 z-[9999]">
          <p className="font-bold">Supabase não configurado!</p>
          <p className="text-sm">Por favor, configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no menu de Configurações.</p>
        </div>
      )}
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
