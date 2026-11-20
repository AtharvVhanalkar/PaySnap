import React, { createContext, useContext, useState } from 'react';
import { photographers, customers, bookings as initialBookings, paymentPhases as initialPhases } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [bookings, setBookings] = useState(initialBookings);
  const [phases, setPhases] = useState(initialPhases);

  const login = (type, id) => setCurrentUser({ type, id });
  const logout = () => setCurrentUser(null);

  const getPhotographer = (id) => photographers.find(p => p.id === id);
  const getCustomer = (id) => customers.find(c => c.id === id);
  const getBooking = (id) => bookings.find(b => b.id === id);
  const getBookingsForCustomer = (customerId) => bookings.filter(b => b.customer_id === customerId);
  const getBookingsForPhotographer = (photographerId) => bookings.filter(b => b.photographer_id === photographerId);
  const getPhasesForBooking = (bookingId) => phases.filter(p => p.booking_id === bookingId).sort((a, b) => a.phase_number - b.phase_number);

  const approvePhase = (phaseId) => {
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, status: 'approved', paid_date: new Date().toISOString().slice(0, 10) } : p));
  };

  const rejectPhase = (phaseId, reason) => {
    setPhases(prev => prev.map(p => p.id === phaseId ? { ...p, status: 'rejected', reject_reason: reason } : p));
  };

  const updatePhase = (phaseId, updates) => {
    const now = new Date().toISOString();
    setPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return { ...p, ...updates, edit_history: [...p.edit_history, { timestamp: now, changes: Object.keys(updates).join(', ') }] };
    }));
  };

  const submitPaymentProof = (phaseId) => {
    setPhases(prev => prev.map(p => p.id === phaseId
      ? { ...p, status: 'submitted', proof_screenshot_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', paid_date: new Date().toISOString().slice(0, 10) }
      : p
    ));
  };

  const addBooking = (booking, newPhases) => {
    setBookings(prev => [...prev, booking]);
    setPhases(prev => [...prev, ...newPhases]);
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      const totalPaid = phases.filter(p => p.booking_id === bookingId && p.status === 'approved').reduce((sum, p) => sum + p.amount, 0);
      const refund = Math.max(0, totalPaid - b.booking_fee);
      return { ...b, status: 'cancelled', cancellation_status: 'cancelled', refund_amount: refund };
    }));
  };

  const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      photographers, customers, bookings, phases,
      getPhotographer, getCustomer, getBooking,
      getBookingsForCustomer, getBookingsForPhotographer, getPhasesForBooking,
      approvePhase, rejectPhase, updatePhase, submitPaymentProof, addBooking, cancelBooking,
      formatINR,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
