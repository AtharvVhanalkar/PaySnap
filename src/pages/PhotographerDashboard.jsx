import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { Eye, Star, Check, Lock, AlertCircle, Clock, Sparkles } from 'lucide-react';

export default function PhotographerDashboard() {
  const {
    currentUser,
    getPhotographer,
    getBookingsForPhotographer,
    getCustomer,
    getPhasesForBooking,
    isPhaseOverdue,
    formatINR,
  } = useApp();

  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'action_required' | 'active'

  const photographerId = currentUser?.id || 'p1';
  const photographer = getPhotographer(photographerId);
  const bookings = getBookingsForPhotographer(photographerId);

  // Financial calculations
  let totalReceivedAcrossAll = 0;
  let remainingBalanceTotal = 0;
  let activeBookingsCount = 0;
  let pendingProofCount = 0;
  let overdueCount = 0;

  bookings.forEach((b) => {
    const phases = getPhasesForBooking(b.id);
    const paid = phases
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    totalReceivedAcrossAll += paid;

    if (b.status === 'active') {
      activeBookingsCount++;
      remainingBalanceTotal += Math.max(0, b.deal_price - paid);
    }

    if (phases.some((p) => p.status === 'submitted')) {
      pendingProofCount++;
    }

    if (phases.some((p) => isPhaseOverdue(p))) {
      overdueCount++;
    }
  });

  // Filter bookings
  const displayedBookings = bookings.filter((b) => {
    const phases = getPhasesForBooking(b.id);
    const isOverdue = phases.some((p) => isPhaseOverdue(p));
    if (filterMode === 'action_required') return isOverdue || phases.some((p) => p.status === 'submitted');
    if (filterMode === 'active') return b.status === 'active';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={photographer?.profile_photo}
              alt={photographer?.owner_name}
              className="w-16 h-16 rounded-full border-2 border-rose-200 object-cover shadow-sm bg-rose-50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {photographer?.shop_name || 'Captured Moments Studio'}
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Active Studio
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Studio Owner: <strong className="text-gray-800">{photographer?.owner_name}</strong> · {photographer?.location.area}, Pune
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/photographer/${photographerId}`}
              className="px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> View Public Profile
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" /> Plans (₹99/mo · ₹999/yr)
            </Link>
          </div>
        </div>

        {/* Photographers Join for 99 Membership Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Studio Membership</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Photographers: Join for ₹99/month or ₹999/year
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Zero commission on bookings. Payments settle directly into your bank account via secure gateway. Retain 100% of your wedding shoot revenues with locked agreements and milestone tracking.
            </p>
          </div>
          <Link
            to="/pricing"
            className="px-6 py-3 bg-white text-amber-900 hover:bg-amber-50 font-black text-xs sm:text-sm rounded-xl shadow-md transition whitespace-nowrap self-stretch md:self-auto text-center"
          >
            Explore Plans (₹99/mo · ₹999/yr) →
          </Link>
        </div>

        {/* Top Financial & Action Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Received */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                Total Received
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {formatINR(totalReceivedAcrossAll)}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Cleared via gateway
            </p>
          </div>

          {/* Card 2: Remaining Amount */}
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block">
                Remaining Active Balance
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {formatINR(remainingBalanceTotal)}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex items-center gap-1">
              <Lock className="w-3 h-3 text-rose-600" /> Locked in active deals
            </p>
          </div>

          {/* Card 3: Active Shoots */}
          <div className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider block">
                Active Shoots
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
                {activeBookingsCount}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
              Total Shoots: {bookings.length}
            </p>
          </div>

          {/* Card 4: Action Required (Overdue & Pending Proofs) */}
          <div className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col justify-between ${
            overdueCount > 0 ? 'border-red-300 ring-2 ring-red-100' : 'border-amber-100'
          }`}>
            <div>
              <span className="text-[10px] font-extrabold text-red-700 uppercase tracking-wider block flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Action Required
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl sm:text-3xl font-black text-red-600">
                  {overdueCount}
                </p>
                <span className="text-xs font-semibold text-gray-500">overdue unpaid</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>{pendingProofCount} proofs to verify</span>
              {overdueCount > 0 && (
                <span className="text-red-600 font-extrabold text-[10px] bg-red-50 px-2 py-0.5 rounded-md">
                  Action Needed
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Section 8.2: Customer List with Action Required Flagging */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Booked Wedding Clients ({bookings.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Customize number of phases, due dates & amounts. Identify unpaid clients at a glance.
              </p>
            </div>

            {/* Quick Filter Controls */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  filterMode === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('action_required')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  filterMode === 'action_required'
                    ? 'bg-red-600 text-white shadow-xs'
                    : overdueCount > 0
                    ? 'text-red-700 bg-red-50 hover:bg-red-100'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Action Required ({overdueCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('active')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  filterMode === 'active' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Active ({activeBookingsCount})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayedBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">
                No clients in this filter view.
              </div>
            ) : (
              displayedBookings.map((booking) => {
                const customer = getCustomer(booking.customer_id);
                const phases = getPhasesForBooking(booking.id);
                const paidAmount = phases
                  .filter((p) => p.status === 'approved')
                  .reduce((sum, p) => sum + p.amount, 0);

                const hasSubmittedProof = phases.some((p) => p.status === 'submitted');
                const overduePhases = phases.filter((p) => isPhaseOverdue(p));
                const isOverdue = overduePhases.length > 0;
                const approvedCount = phases.filter((p) => p.status === 'approved').length;

                let currentPhaseLabel = `Phase 1 Pending (${phases.length} phases total)`;
                let badgeStatus = 'pending';

                if (booking.status === 'cancelled') {
                  currentPhaseLabel = 'Cancelled';
                  badgeStatus = 'cancelled';
                } else if (isOverdue) {
                  const firstOverdue = overduePhases[0];
                  currentPhaseLabel = `ACTION REQUIRED: ${firstOverdue.name} overdue (${formatINR(firstOverdue.amount)}, due ${firstOverdue.due_date})`;
                  badgeStatus = 'action_required';
                } else if (hasSubmittedProof) {
                  currentPhaseLabel = 'Proof Submitted (Verification Needed)';
                  badgeStatus = 'submitted';
                } else if (approvedCount === phases.length && phases.length > 0) {
                  currentPhaseLabel = 'All Milestones Completed';
                  badgeStatus = 'completed';
                } else {
                  const nextPending = phases.find((p) => p.status === 'pending');
                  if (nextPending) {
                    currentPhaseLabel = `${nextPending.name} due ${nextPending.due_date} (${formatINR(nextPending.amount)})`;
                  }
                  badgeStatus = approvedCount > 0 ? 'active' : 'pending';
                }

                return (
                  <Link
                    key={booking.id}
                    to={`/photographer-dashboard/customer/${booking.id}`}
                    className={`block p-5 rounded-2xl border transition group shadow-2xs ${
                      isOverdue
                        ? 'border-red-300 bg-red-50/20 hover:bg-red-50/40 hover:border-red-400'
                        : 'border-gray-200 hover:border-rose-400 hover:bg-rose-50/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl font-extrabold flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform ${
                          isOverdue ? 'bg-red-100 text-red-700 ring-2 ring-red-200' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {customer?.name ? customer.name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base text-gray-900 group-hover:text-rose-600 transition">
                              {customer?.name || 'Priya Mehta'}
                            </h3>
                            <StatusBadge status={badgeStatus} />
                            {isOverdue && (
                              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                                <AlertCircle className="w-3 h-3" /> Action Required (Unpaid)
                              </span>
                            )}
                            {hasSubmittedProof && !isOverdue && (
                              <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                                Verify Proof
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Date: <strong className="text-gray-800">{booking.event_date}</strong> · Venue: {booking.venue}
                          </p>
                          <p className={`text-[11px] mt-0.5 font-medium flex items-center gap-1 ${
                            isOverdue ? 'text-red-700 font-bold' : 'text-gray-500'
                          }`}>
                            {isOverdue && <Clock className="w-3 h-3 text-red-600 shrink-0" />}
                            <span>{currentPhaseLabel}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase font-bold sm:text-right">
                            Deal Price ({phases.length} Phases)
                          </span>
                          <span className="text-lg font-black text-gray-900">{formatINR(booking.deal_price)}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">
                          Paid: {formatINR(paidAmount)} · Rem: {formatINR(Math.max(0, booking.deal_price - paidAmount))}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
