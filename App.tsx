
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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
import { Stores } from './pages/Stores';
import { StoreView } from './pages/StoreView';
import { BioBuilder } from './pages/BioBuilder';
import { BusinessSuite } from './pages/BusinessSuite';
import { MarketplaceB2B } from './pages/MarketplaceB2B';
import { Academy } from './pages/Academy';
import { AboutUs } from './pages/AboutUs';
import { Partners } from './pages/Partners';
import { Events } from './pages/Events';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { Support } from './pages/Support';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? <DashboardLayout>{children}</DashboardLayout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout children={<Home />} />} path="/" />
      <Route element={<Layout children={<Categories />} />} path="/categories" />
      <Route element={<Layout children={<Stores />} />} path="/stores" />
      <Route element={<Layout children={<StoreView />} />} path="/store/:userId" />
      <Route element={<Layout children={<Coupons />} />} path="/coupons" />
      <Route element={<Layout children={<Login />} />} path="/login" />
      <Route element={<Layout children={<Register />} />} path="/register" />
      <Route element={<Layout children={<Blog />} />} path="/blog" />
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
      <Route path="/marketplace-b2b" element={<PrivateRoute><MarketplaceB2B /></PrivateRoute>} />
      <Route path="/academy" element={<PrivateRoute><Academy /></PrivateRoute>} />
      <Route path="/bio-builder" element={<PrivateRoute><BioBuilder /></PrivateRoute>} />
      <Route path="/catalog" element={<PrivateRoute><MyCatalog /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/rewards" element={<PrivateRoute><Rewards /></PrivateRoute>} />
      <Route path="/quotes" element={<PrivateRoute><Quotes /></PrivateRoute>} />
      <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
      <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
