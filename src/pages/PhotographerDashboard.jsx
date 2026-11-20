import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import {
  Eye,
  Star,
  Check,
  Lock,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle,
  X,
  FileText,
  ExternalLink,
  ShieldCheck,
  Calendar,
  MapPin,
} from 'lucide-react';

export default function PhotographerDashboard() {
  const {
    currentUser,
    getPhotographer,
    getBookingsForPhotographer,
    getCustomer,
    getPhasesForBooking,
    isPhaseOverdue,
    approveBooking,
    formatINR,
  } = useApp();

  // Filter mode: 'all' | 'pending_approval' | 'action_required' | 'active'
  const [filterMode, setFilterMode] = useState('all');

  // Screenshot modal preview state
  const [screenshotModalBooking, setScreenshotModalBooking] = useState(null);
  const [approvalToast, setApprovalToast] = useState(null);

  const photographerId = currentUser?.id || 'p1';
  const photographer = getPhotographer(photographerId);
  const bookings = getBookingsForPhotographer(photographerId);

  // Financial & count calculations
  let totalReceivedAcrossAll = 0;
  let remainingBalanceTotal = 0;
  let activeBookingsCount = 0;
  let pendingProofCount = 0;
  let overdueCount = 0;
  let pendingApprovalCount = 0;

  bookings.forEach((b) => {
    const phases = getPhasesForBooking(b.id);
    const paid = phases
      .filter((p) => p.status === 'approved')
      .reduce((sum, p) => sum + p.amount, 0);

    totalReceivedAcrossAll += paid;

    if (b.status === 'pending_approval') {
      pendingApprovalCount++;
    }

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
    if (filterMode === 'pending_approval') return b.status === 'pending_approval';
    if (filterMode === 'action_required') return isOverdue || phases.some((p) => p.status === 'submitted');
    if (filterMode === 'active') return b.status === 'active';
    return true;
  });

  const pendingApprovalList = bookings.filter((b) => b.status === 'pending_approval');

  const handleApproveBooking = (bookingId, customerName) => {
    approveBooking(bookingId);
    if (screenshotModalBooking?.id === bookingId) {
      setScreenshotModalBooking(null);
    }
    setApprovalToast(`Booking for ${customerName} approved! ₹5,000 received. You can now customize milestones.`);
    setTimeout(() => setApprovalToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Toast alert */}
        {approvalToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-lg flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              <span>{approvalToast}</span>
            </div>
            <button
              onClick={() => setApprovalToast(null)}
              className="text-emerald-100 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

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

          {/* Card 3: New Booking Requests (Pending Approval) */}
          <div className={`bg-white rounded-3xl p-5 border shadow-xs flex flex-col justify-between ${
            pendingApprovalCount > 0 ? 'border-purple-300 ring-2 ring-purple-100' : 'border-purple-100'
          }`}>
            <div>
              <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> New Bookings
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <p className="text-2xl sm:text-3xl font-black text-purple-700">
                  {pendingApprovalCount}
                </p>
                <span className="text-xs font-semibold text-gray-500">pending approval</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
              <span>₹5,000 fee proofs</span>
              {pendingApprovalCount > 0 && (
                <span className="text-purple-700 font-extrabold text-[10px] bg-purple-50 px-2 py-0.5 rounded-md animate-pulse">
                  Approve Now
                </span>
              )}
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

        {/* Dedicated Section: New Bookings Awaiting Approval */}
        {pendingApprovalList.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 via-white to-rose-50 rounded-3xl p-6 sm:p-7 border-2 border-purple-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-gray-900">
                      New Booking Requests ({pendingApprovalList.length})
                    </h2>
                    <span className="bg-purple-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full animate-pulse">
                      Action Needed
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Clients have paid the ₹5,000 non-refundable booking fee and uploaded payment screenshots. Review and approve below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {pendingApprovalList.map((booking) => {
                const customer = getCustomer(booking.customer_id);
                const screenshot =
                  booking.booking_fee_screenshot ||
                  getPhasesForBooking(booking.id)[0]?.proof_screenshot_url ||
                  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800';

                return (
                  <div
                    key={booking.id}
                    className="p-4 sm:p-5 bg-white rounded-2xl border border-purple-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Screenshot thumbnail with quick preview button */}
                      <button
                        type="button"
                        onClick={() =>
                          setScreenshotModalBooking({
                            ...booking,
                            screenshot,
                            customerName: customer?.name || 'Customer',
                          })
                        }
                        className="relative group shrink-0 cursor-pointer"
                        title="Click to view full screenshot"
                      >
                        <img
                          src={screenshot}
                          alt="Proof Screenshot"
                          className="w-14 h-14 rounded-xl object-cover border-2 border-purple-300 group-hover:scale-105 transition shadow-xs"
                        />
                        <div className="absolute inset-0 bg-purple-900/40 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </button>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-gray-900">
                            {customer?.name || 'Customer'}
                          </h3>
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200">
                            ₹5,000 Booking Fee Paid
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            • Non-Refundable
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 flex items-center gap-2 flex-wrap">
                          <span>Date: <strong className="text-gray-900">{booking.event_date}</strong></span>
                          <span>•</span>
                          <span>Venue: {booking.venue}</span>
                        </p>
                        <p className="text-[11px] text-purple-800 font-semibold">
                          Total Package Deal: {formatINR(booking.deal_price)} · Balance after approval: {formatINR(booking.deal_price - 5000)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                      <button
                        type="button"
                        onClick={() =>
                          setScreenshotModalBooking({
                            ...booking,
                            screenshot,
                            customerName: customer?.name || 'Customer',
                          })
                        }
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Screenshot
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApproveBooking(booking.id, customer?.name || 'Customer')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve Booking
                      </button>

                      <Link
                        to={`/photographer-dashboard/customer/${booking.id}`}
                        className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
                        title="Open profile & setup milestones"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section: Booked Wedding Clients with Filters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                All Bookings & Clients ({bookings.length})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Review payment screenshots, approve bookings, and customize milestone schedules.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-bold flex-wrap">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  filterMode === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                All ({bookings.length})
              </button>
              {pendingApprovalCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilterMode('pending_approval')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                    filterMode === 'pending_approval'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pending Approval ({pendingApprovalCount})</span>
                </button>
              )}
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

          {/* Bookings List */}
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

                const isPendingApproval = booking.status === 'pending_approval';
                const hasSubmittedProof = phases.some((p) => p.status === 'submitted');
                const overduePhases = phases.filter((p) => isPhaseOverdue(p));
                const isOverdue = overduePhases.length > 0;
                const approvedCount = phases.filter((p) => p.status === 'approved').length;

                let currentPhaseLabel = `Phase 1 Pending (${phases.length} phases total)`;
                let badgeStatus = 'pending';

                if (isPendingApproval) {
                  currentPhaseLabel = 'New Booking: ₹5,000 Fee Screenshot Submitted (Awaiting Approval)';
                  badgeStatus = 'pending_approval';
                } else if (booking.status === 'cancelled') {
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

                const screenshot =
                  booking.booking_fee_screenshot ||
                  phases.find((p) => p.proof_screenshot_url)?.proof_screenshot_url ||
                  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800';

                return (
                  <div
                    key={booking.id}
                    className={`p-5 rounded-2xl border transition group shadow-2xs ${
                      isPendingApproval
                        ? 'border-purple-300 bg-purple-50/20 hover:border-purple-400'
                        : isOverdue
                        ? 'border-red-300 bg-red-50/20 hover:bg-red-50/40 hover:border-red-400'
                        : 'border-gray-200 hover:border-rose-400 hover:bg-rose-50/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl font-extrabold flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform ${
                            isPendingApproval
                              ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200'
                              : isOverdue
                              ? 'bg-red-100 text-red-700 ring-2 ring-red-200'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {customer?.name ? customer.name.charAt(0) : 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-base text-gray-900 group-hover:text-rose-600 transition">
                              {customer?.name || 'Customer'}
                            </h3>
                            <StatusBadge status={badgeStatus} />
                            {isPendingApproval && (
                              <span className="bg-purple-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                                <Sparkles className="w-3 h-3" /> New Request
                              </span>
                            )}
                            {isOverdue && (
                              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                                <AlertCircle className="w-3 h-3" /> Action Required (Unpaid)
                              </span>
                            )}
                            {hasSubmittedProof && !isOverdue && !isPendingApproval && (
                              <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                                Verify Proof
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Date: <strong className="text-gray-800">{booking.event_date}</strong> · Venue: {booking.venue}
                          </p>
                          <p
                            className={`text-[11px] mt-0.5 font-medium flex items-center gap-1 ${
                              isPendingApproval
                                ? 'text-purple-700 font-bold'
                                : isOverdue
                                ? 'text-red-700 font-bold'
                                : 'text-gray-500'
                            }`}
                          >
                            {isOverdue && <Clock className="w-3 h-3 text-red-600 shrink-0" />}
                            <span>{currentPhaseLabel}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 gap-2">
                        <div>
                          <span className="text-[10px] text-gray-400 block uppercase font-bold sm:text-right">
                            Deal Price ({phases.length} Phases)
                          </span>
                          <span className="text-lg font-black text-gray-900">{formatINR(booking.deal_price)}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {(isPendingApproval || hasSubmittedProof) && (
                            <button
                              type="button"
                              onClick={() =>
                                setScreenshotModalBooking({
                                  ...booking,
                                  screenshot,
                                  customerName: customer?.name || 'Customer',
                                })
                              }
                              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Proof
                            </button>
                          )}

                          {isPendingApproval && (
                            <button
                              type="button"
                              onClick={() => handleApproveBooking(booking.id, customer?.name || 'Customer')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                          )}

                          <Link
                            to={`/photographer-dashboard/customer/${booking.id}`}
                            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            Manage Milestones →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Screenshot Modal Viewer */}
        {screenshotModalBooking && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 space-y-4 p-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    Payment Proof Screenshot
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900 mt-1">
                    {screenshotModalBooking.customerName} · ₹5,000 Booking Fee
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setScreenshotModalBooking(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Screenshot Image Container */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 max-h-[380px] flex items-center justify-center">
                <img
                  src={screenshotModalBooking.screenshot}
                  alt="Payment Receipt"
                  className="w-full h-auto max-h-[380px] object-contain"
                />
              </div>

              {/* Modal Details & Action */}
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Event Date:</span>
                    <strong className="text-gray-800">{screenshotModalBooking.event_date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Deal Price:</span>
                    <strong className="text-gray-800">{formatINR(screenshotModalBooking.deal_price)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking Fee Paid:</span>
                    <strong className="text-emerald-600">₹5,000 (Non-Refundable)</strong>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setScreenshotModalBooking(null)}
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
                  >
                    Close
                  </button>
                  {screenshotModalBooking.status === 'pending_approval' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleApproveBooking(
                          screenshotModalBooking.id,
                          screenshotModalBooking.customerName
                        )
                      }
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Approve Booking Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
