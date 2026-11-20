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

  // Check if a phase has passed its payment due date without payment or proof
  const isPhaseOverdue = (phase) => {
    if (!phase || !phase.due_date) return false;
    const today = new Date().toISOString().slice(0, 10);
    // If due date has passed AND phase is neither approved nor submitted with proof
    return phase.due_date < today && phase.status !== 'approved' && phase.status !== 'submitted';
  };

  // Check if a booking has any overdue unpaid phase (Action Required)
  const hasOverduePhase = (bookingId) => {
    const bookingPhases = getPhasesForBooking(bookingId);
    return bookingPhases.some(p => isPhaseOverdue(p));
  };

  const getOverduePhasesForBooking = (bookingId) => {
    const bookingPhases = getPhasesForBooking(bookingId);
    return bookingPhases.filter(p => isPhaseOverdue(p));
  };

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
      return {
        ...p,
        ...updates,
        edit_history: [...(p.edit_history || []), { timestamp: now, changes: Object.keys(updates).join(', ') }]
      };
    }));
  };

  // Add a new custom phase to an existing booking
  const addPhase = (bookingId, phaseData) => {
    const existing = phases.filter(p => p.booking_id === bookingId);
    const newPhase = {
      id: 'pp_' + Date.now(),
      booking_id: bookingId,
      phase_number: existing.length + 1,
      name: phaseData.name || `Phase ${existing.length + 1}`,
      amount: Number(phaseData.amount) || 0,
      due_date: phaseData.due_date || new Date().toISOString().slice(0, 10),
      paid_date: null,
      status: 'pending',
      proof_screenshot_url: null,
      edit_history: [{ timestamp: new Date().toISOString(), changes: 'Created new milestone phase' }],
    };
    setPhases(prev => [...prev, newPhase]);
    return newPhase;
  };

  // Delete an unapproved phase and re-number
  const deletePhase = (phaseId) => {
    const target = phases.find(p => p.id === phaseId);
    if (!target) return;
    const bookingId = target.booking_id;
    setPhases(prev => {
      const filtered = prev.filter(p => p.id !== phaseId);
      // Re-number remaining phases for this booking
      let count = 1;
      return filtered.map(p => {
        if (p.booking_id === bookingId) {
          return { ...p, phase_number: count++ };
        }
        return p;
      });
    });
  };

  // Update whole list of phases for a booking
  const setBookingPhases = (bookingId, newPhasesList) => {
    setPhases(prev => {
      const others = prev.filter(p => p.booking_id !== bookingId);
      const formatted = newPhasesList.map((p, idx) => ({
        ...p,
        booking_id: bookingId,
        phase_number: idx + 1,
        id: p.id || 'pp_' + Date.now() + '_' + idx,
        status: p.status || 'pending',
        edit_history: p.edit_history || [{ timestamp: new Date().toISOString(), changes: 'Customized schedule' }],
      }));
      return [...others, ...formatted];
    });
  };

  const submitPaymentProof = (phaseId) => {
    setPhases(prev => prev.map(p => p.id === phaseId
      ? { ...p, status: 'submitted', proof_screenshot_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400', paid_date: new Date().toISOString().slice(0, 10) }
      : p
    ));
  };

  const addBooking = (booking, newPhases) => {
    setBookings(prev => [booking, ...prev]);
    setPhases(prev => [...prev, ...newPhases]);
  };

  const approveBooking = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'active' } : b));
    setPhases(prev => {
      const targetPhases = prev.filter(p => p.booking_id === bookingId);
      let updated = prev.map(p => {
        if (p.booking_id === bookingId && p.phase_number === 1) {
          return { ...p, status: 'approved', paid_date: new Date().toISOString().slice(0, 10) };
        }
        return p;
      });

      // If there's only 1 phase (just the booking fee), auto-generate milestone phases 2 & 3 for the remaining balance
      const currentBooking = bookings.find(b => b.id === bookingId);
      if (currentBooking && targetPhases.length === 1) {
        const remaining = Math.max(0, currentBooking.deal_price - (targetPhases[0]?.amount || 5000));
        const p2Amount = Math.round(remaining * 0.6);
        const p3Amount = remaining - p2Amount;
        const now = new Date();
        const p2Date = new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
        const p3Date = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

        const phase2 = {
          id: 'pp_' + Date.now() + '_2',
          booking_id: bookingId,
          phase_number: 2,
          name: 'Pre-Event Shoot Payment',
          amount: p2Amount,
          due_date: p2Date,
          paid_date: null,
          status: 'pending',
          proof_screenshot_url: null,
          edit_history: [],
        };
        const phase3 = {
          id: 'pp_' + Date.now() + '_3',
          booking_id: bookingId,
          phase_number: 3,
          name: 'Final Delivery & Album Release',
          amount: p3Amount,
          due_date: p3Date,
          paid_date: null,
          status: 'pending',
          proof_screenshot_url: null,
          edit_history: [],
        };
        updated = [...updated, phase2, phase3];
      }
      return updated;
    });
  };

  const rejectBooking = (bookingId, reason) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected', reject_reason: reason } : b));
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
      isPhaseOverdue, hasOverduePhase, getOverduePhasesForBooking,
      addPhase, deletePhase, setBookingPhases,
      approvePhase, rejectPhase, updatePhase, submitPaymentProof, addBooking, approveBooking, rejectBooking, cancelBooking,
      formatINR,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
