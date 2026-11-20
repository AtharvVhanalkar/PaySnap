import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import PhotographerPublicProfile from './pages/PhotographerPublicProfile';
import BookingFlow from './pages/BookingFlow';
import MyBookings from './pages/MyBookings';
import BookingDetail from './pages/BookingDetail';
import CustomerSupport from './pages/CustomerSupport';
import CustomerProfile from './pages/CustomerProfile';
import PhotographerDashboard from './pages/PhotographerDashboard';
import PhotographerCustomerDetail from './pages/PhotographerCustomerDetail';
import PricingPage from './pages/PricingPage';

function ProtectedRoute({ children, role }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.type !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/dashboard" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/photographer/:id" element={<PhotographerPublicProfile />} />
      <Route path="/book/:photographerId" element={<ProtectedRoute role="customer"><BookingFlow /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>} />
      <Route path="/booking/:bookingId" element={<ProtectedRoute role="customer"><BookingDetail /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute role="customer"><CustomerSupport /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>} />
      <Route path="/customer-profile/:customerId" element={<CustomerProfile />} />
      <Route path="/profile/:customerId" element={<CustomerProfile />} />
      <Route path="/photographer-dashboard" element={<ProtectedRoute role="photographer"><PhotographerDashboard /></ProtectedRoute>} />
      <Route path="/photographer-dashboard/customer/:bookingId" element={<ProtectedRoute role="photographer"><PhotographerCustomerDetail /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
