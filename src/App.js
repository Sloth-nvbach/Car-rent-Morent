import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout, AuthLayout, AdminLayout, ProviderLayout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { CarDetailPage } from './pages/CarDetailPage';
import { BookingPage } from './pages/BookingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AccountPage } from './pages/AccountPage';
import { ProviderDashboard } from './pages/ProviderDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(module => ({ default: module.HowItWorksPage })));
const OffersPage = lazy(() => import('./pages/OffersPage').then(module => ({ default: module.OffersPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(module => ({ default: module.SupportPage })));
const ProviderRegisterPage = lazy(() => import('./pages/ProviderRegisterPage').then(module => ({ default: module.ProviderRegisterPage })));
const ProviderDetailPage = lazy(() => import('./pages/ProviderDetailPage').then(module => ({ default: module.ProviderDetailPage })));
const BookingDetailPage = lazy(() => import('./pages/BookingDetailPage').then(module => ({ default: module.BookingDetailPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));

function LoadingFallback() {
  return (
    <div className="container py-16">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-secondary">Đang tải trang...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles = ['customer', 'provider', 'admin'] }) {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: window.location }} replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AdminRoute({ children }) {
  return <ProtectedRoute allowedRoles={['admin']}>{children}</ProtectedRoute>;
}

function ProviderRoute({ children }) {
  return <ProtectedRoute allowedRoles={['provider', 'admin']}>{children}</ProtectedRoute>;
}

function CustomerRoute({ children }) {
  return <ProtectedRoute allowedRoles={['customer']}>{children}</ProtectedRoute>;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/providers/:id" element={<ProviderDetailPage />} />
        </Route>
        
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>
        </Route>
        
        <Route element={<AuthLayout />}>
          <Route element={<CustomerRoute />}>
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/account/*" element={<AccountPage />} />
            <Route path="/booking/:id" element={<BookingDetailPage />} />
          </Route>
        </Route>
        
        <Route element={<ProviderLayout />}>
          <Route element={<ProviderRoute />}>
            <Route path="/provider/*" element={<ProviderDashboard />} />
            <Route path="/provider/register" element={<ProviderRegisterPage />} />
          </Route>
        </Route>
        
        <Route element={<AdminLayout />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}