import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';

export default function MyBookings() {
  const { currentUser, getBookingsForCustomer, getPhotographer, getPhasesForBooking, formatINR } = useApp();
  const [activeTab, setActiveTab] = useState('active');

  const customerId = currentUser?.id || 'c1';
  const customerBookings = getBookingsForCustomer(customerId);

  const activeBookings = customerBookings.filter((b) => b.status === 'active');
  const pastBookings = customerBookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const displayedBookings = activeTab === 'active' ? activeBookings : pastBookings;

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-12">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              My Wedding Bookings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Track 3-phase milestones, review demo photos, and release balances.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition"
          >
            + Book Another Studio
          </Link>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-200 mb-6 space-x-6 text-xs sm:text-sm font-bold">
          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <span>💍</span> Active Shoots ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'past'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <span>📜</span> Completed & Cancelled ({pastBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {displayedBookings.length > 0 ? (
          <div className="space-y-4">
            {displayedBookings.map((b) => {
              const photographer = getPhotographer(b.photographer_id);
              const phases = getPhasesForBooking(b.id);
              const paidAmount = phases
                .filter((p) => p.status === 'approved')
                .reduce((sum, p) => sum + p.amount, 0);
              const remainingAmount = Math.max(0, b.deal_price - paidAmount);

              // Determine current phase description
              const approvedCount = phases.filter((p) => p.status === 'approved').length;
              let phaseBadgeStatus = 'pending';
              let phaseDescription = 'Phase 1 Pending';

              if (b.status === 'cancelled') {
                phaseBadgeStatus = 'cancelled';
                phaseDescription = 'Booking Cancelled';
              } else if (b.status === 'completed' || approvedCount === 3) {
                phaseBadgeStatus = 'completed';
                phaseDescription = 'All Phases Paid';
              } else if (approvedCount === 2) {
                phaseBadgeStatus = 'submitted';
                phaseDescription = 'Phase 3 Awaiting Delivery';
              } else if (approvedCount === 1) {
                phaseBadgeStatus = 'paid';
                phaseDescription = 'Phase 1 Paid · Phase 2 Pending';
              }

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-3xl p-6 border border-rose-100 shadow-2xs hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={photographer?.portfolio_images[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200'}
                      alt={photographer?.shop_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-gray-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                          {photographer?.shop_name}
                        </h3>
                        <StatusBadge status={phaseBadgeStatus} />
                      </div>
                      <p className="text-xs text-gray-500">
                        Event Date: <strong className="text-gray-800">{b.event_date}</strong> · Venue: {b.venue}
                      </p>

                      {/* 3-Phase Milestone Indicators */}
                      <div className="mt-3 flex items-center gap-2">
                        {phases.map((p, idx) => (
                          <div key={p.id} className="flex items-center gap-1.5 text-[11px]">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] ${
                                p.status === 'approved'
                                  ? 'bg-emerald-500 text-white'
                                  : p.status === 'submitted'
                                  ? 'bg-amber-400 text-amber-950'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {p.status === 'approved' ? '✓' : idx + 1}
                            </span>
                            <span className="hidden md:inline text-gray-600">
                              Phase {p.phase_number}
                            </span>
                            {idx < phases.length - 1 && <span className="text-gray-300">→</span>}
                          </div>
                        ))}
                      </div>

                      {b.status === 'cancelled' && (
                        <p className="text-xs font-bold text-red-600 mt-2">
                          Refund Processed: {formatINR(b.refund_amount)} (Non-refundable booking fee ₹5,000 deducted)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Financial Breakdown & Action */}
                  <div className="w-full sm:w-auto sm:text-right pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 flex sm:flex-col justify-between items-center sm:items-end gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Agreed Deal</span>
                      <span className="text-lg font-black text-gray-900">{formatINR(b.deal_price)}</span>
                      <div className="text-xs text-gray-500">
                        Paid: <span className="font-bold text-emerald-600">{formatINR(paidAmount)}</span> · Rem: {formatINR(remainingAmount)}
                      </div>
                    </div>

                    <Link
                      to={`/booking/${b.id}`}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      View Details & Previews →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <span className="text-4xl block mb-2">📅</span>
            <h3 className="text-lg font-bold text-gray-800">No {activeTab} bookings</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Ready to safeguard your wedding shoot? Explore verified Pune studios and book with 3-phase milestones.
            </p>
            <Link
              to="/dashboard"
              className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-xs"
            >
              Browse Photographers in Pune →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
