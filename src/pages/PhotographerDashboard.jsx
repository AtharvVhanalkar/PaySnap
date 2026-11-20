import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { Eye, Star, Check, Lock } from 'lucide-react';

export default function PhotographerDashboard() {
  const { currentUser, getPhotographer, getBookingsForPhotographer, getCustomer, getPhasesForBooking, formatINR } = useApp();

  const photographerId = currentUser?.id || 'p1';
  const photographer = getPhotographer(photographerId);
  const bookings = getBookingsForPhotographer(photographerId);

  // Financial calculations
  let totalReceivedAcrossAll = 0;
  let totalDealValueActive = 0;
  let activeBookingsCount = 0;
  let pendingProofCount = 0;

  bookings.forEach((b) => {
    const phases = getPhasesForBooking(b.id);
    const approvedPhasesSum = phases
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    totalReceivedAcrossAll += approvedPhasesSum;

    if (b.status === 'active') {
      totalDealValueActive += b.deal_price;
      activeBookingsCount++;
    }

    // Check if any phase is submitted and awaiting approval
    const hasSubmitted = phases.some((p) => p.status === 'submitted');
    if (hasSubmitted) pendingProofCount++;
  });

  const remainingBalanceTotal = Math.max(0, totalDealValueActive - totalReceivedAcrossAll);

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Photographer Welcome Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={photographer?.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
              alt={photographer?.owner_name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {photographer?.shop_name}
                </h1>
                {photographer?.founding_member && (
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2 py-0.5 rounded-full">
                    Founding Member
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
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
              className="px-4 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" /> Membership (₹99/mo)
            </Link>
          </div>
        </div>

        {/* Section 8.1: Top Financial Summary Cards */}
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

          {/* Card 4: Action Required */}
          <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                Pending Approvals
              </span>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {pendingProofCount}
              </p>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
              Payment proofs to verify
            </p>
          </div>
        </div>

        {/* Section 8.2: Customer List */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Booked Wedding Clients ({bookings.length})
              </h2>
              <p className="text-xs text-gray-500">
                Manage payment schedules, review transaction proofs, and upload preview photos.
              </p>
            </div>
            <span className="text-xs text-gray-400">Click any customer to open detail control panel</span>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => {
              const customer = getCustomer(booking.customer_id);
              const phases = getPhasesForBooking(booking.id);
              const paidAmount = phases
                .filter((p) => p.status === 'approved')
                .reduce((sum, p) => sum + p.amount, 0);

              const hasSubmittedProof = phases.some((p) => p.status === 'submitted');
              const approvedCount = phases.filter((p) => p.status === 'approved').length;

              let currentPhaseLabel = 'Phase 1 Pending';
              let badgeStatus = 'pending';

              if (booking.status === 'cancelled') {
                currentPhaseLabel = 'Cancelled';
                badgeStatus = 'cancelled';
              } else if (hasSubmittedProof) {
                currentPhaseLabel = 'Proof Submitted (Verify)';
                badgeStatus = 'submitted';
              } else if (approvedCount === 3) {
                currentPhaseLabel = 'Completed';
                badgeStatus = 'completed';
              } else if (approvedCount === 2) {
                currentPhaseLabel = 'Phase 3 Awaiting Delivery';
                badgeStatus = 'pending';
              } else if (approvedCount === 1) {
                currentPhaseLabel = 'Phase 2 Pre-Event Pending';
                badgeStatus = 'paid';
              }

              return (
                <Link
                  key={booking.id}
                  to={`/photographer-dashboard/customer/${booking.id}`}
                  className="block p-5 rounded-2xl border border-gray-200 hover:border-rose-400 hover:bg-rose-50/20 transition group shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 font-extrabold flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                        {customer?.name ? customer.name.charAt(0) : 'P'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-gray-900 group-hover:text-rose-600 transition">
                            {customer?.name || 'Priya Mehta'}
                          </h3>
                          <StatusBadge status={badgeStatus} />
                          {hasSubmittedProof && (
                            <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                              Action Needed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Date: <strong className="text-gray-800">{booking.event_date}</strong> · Venue: {booking.venue}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Status: {currentPhaseLabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold sm:text-right">Deal Price</span>
                        <span className="text-lg font-black text-gray-900">{formatINR(booking.deal_price)}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        Paid: {formatINR(paidAmount)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
