import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { previewPhotos } from '../data/mockData';
import { AlertTriangle, Lock, Unlock, Check, Camera, Shield, Download, CheckCircle, X, AlertCircle } from 'lucide-react';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const {
    getBooking,
    getPhotographer,
    getPhasesForBooking,
    submitPaymentProof,
    cancelBooking,
    isPhaseOverdue,
    hasOverduePhase,
    formatINR,
  } = useApp();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [payModalPhase, setPayModalPhase] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  const booking = getBooking(bookingId);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Booking not found</h2>
            <Link to="/my-bookings" className="text-rose-600 underline text-sm mt-2 block">
              Back to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const photographer = getPhotographer(booking.photographer_id);
  const phases = getPhasesForBooking(booking.id);

  const totalPaid = phases
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const remainingBalance = Math.max(0, booking.deal_price - totalPaid);

  // Check if final phase is approved (unlocks full gallery)
  const isFinalPhaseApproved = phases.length > 0 && phases[phases.length - 1].status === 'approved';

  // Check if any phase is overdue
  const isBookingOverdue = hasOverduePhase(booking.id);

  // Calculate potential refund
  const refundableAmount = Math.max(0, totalPaid - booking.booking_fee);

  const handleSimulatePayment = () => {
    if (!payModalPhase) return;
    setIsProcessingPayment(true);
    setTimeout(() => {
      submitPaymentProof(payModalPhase.id);
      setIsProcessingPayment(false);
      setPayModalPhase(null);
    }, 1200);
  };

  const handleConfirmCancel = () => {
    cancelBooking(booking.id);
    setCancelModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link to="/my-bookings" className="hover:text-rose-600">My Bookings</Link>
          <span>/</span>
          <span className="text-gray-800">Booking #{booking.id}</span>
        </div>

        {/* Action Required Banner if overdue */}
        {isBookingOverdue && (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                    Action Required
                  </span>
                  <h3 className="font-black text-base sm:text-lg">Milestone Payment Overdue</h3>
                </div>
                <p className="text-xs text-rose-100 mt-1 max-w-xl leading-relaxed">
                  Your milestone payment date has passed without payment submission. Please complete the pending milestone to avoid delivery holds.
                </p>
              </div>
            </div>
            {phases.find(p => isPhaseOverdue(p)) && (
              <button
                type="button"
                onClick={() => setPayModalPhase(phases.find(p => isPhaseOverdue(p)))}
                className="px-5 py-2.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-black rounded-xl shadow-md transition cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
              >
                Pay Overdue Milestone →
              </button>
            )}
          </div>
        )}

        {/* Booking Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {photographer?.shop_name}
                </h1>
                {isBookingOverdue ? (
                  <StatusBadge status="action_required" />
                ) : (
                  <StatusBadge status={booking.status === 'cancelled' ? 'cancelled' : isFinalPhaseApproved ? 'completed' : 'active'} />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Owner: <strong>{photographer?.owner_name}</strong> · Venue: <strong>{booking.venue}</strong>
              </p>
              <p className="text-xs text-gray-500">
                Wedding Event Date: <strong className="text-gray-900">{booking.event_date}</strong>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Locked Deal Price</span>
              <span className="text-2xl font-black text-rose-600">{formatINR(booking.deal_price)}</span>
              <div className="text-xs text-gray-600 mt-0.5">
                Paid: <strong className="text-emerald-600">{formatINR(totalPaid)}</strong> · Remaining: <strong>{formatINR(remainingBalance)}</strong>
              </div>
            </div>
          </div>

          {/* Cancellation Alert if Cancelled */}
          {booking.status === 'cancelled' && (
            <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">This booking was cancelled.</strong>
                <p className="mt-0.5">
                  Non-refundable booking fee: {formatINR(booking.booking_fee)}. Total refund of <strong>{formatINR(booking.refund_amount)}</strong> has been processed to your original payment method.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Milestone Schedule Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Milestone Payment Schedule ({phases.length} Phases)</h2>
              <p className="text-xs text-gray-500">Each milestone secures a stage of your wedding photography.</p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Direct Gateway Settlement
            </span>
          </div>

          <div className="space-y-3">
            {phases.map((phase) => {
              const isApproved = phase.status === 'approved';
              const isSubmitted = phase.status === 'submitted';
              const isPending = phase.status === 'pending';
              const isOverdue = isPhaseOverdue(phase);

              return (
                <div
                  key={phase.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isOverdue
                      ? 'border-red-300 bg-red-50/20 ring-2 ring-red-200'
                      : isApproved
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : isSubmitted
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isOverdue
                          ? 'bg-red-600 text-white'
                          : isApproved
                          ? 'bg-emerald-600 text-white'
                          : isSubmitted
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isOverdue ? (
                        <AlertCircle className="w-5 h-5 text-white" />
                      ) : isApproved ? (
                        <Check className="w-4 h-4 mx-auto" />
                      ) : (
                        phase.phase_number
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-gray-900">{phase.name}</h4>
                        {isOverdue ? (
                          <StatusBadge status="action_required" />
                        ) : (
                          <StatusBadge status={phase.status} />
                        )}
                        {isApproved && (
                          <span className="text-[10px] text-emerald-700 font-semibold hidden md:inline">
                            (Payment verified by gateway)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Due: <span className={isOverdue ? 'text-red-600 font-bold' : ''}>{phase.due_date}</span> {phase.paid_date && `· Paid on ${phase.paid_date}`}
                      </p>

                      {isOverdue && (
                        <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Action Required: Payment date passed without payment or proof
                        </p>
                      )}

                      {isSubmitted && (
                        <p className="text-[11px] text-amber-800 font-medium mt-1">
                          Payment submitted with proof. Awaiting photographer verification.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <span className="font-black text-base text-gray-900">
                      {formatINR(phase.amount)}
                    </span>

                    {/* Pay Button for Pending/Overdue Phases */}
                    {isPending && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => setPayModalPhase(phase)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer ${
                          isOverdue
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                        }`}
                      >
                        {isOverdue ? 'Pay Overdue Milestone →' : 'Pay Milestone →'}
                      </button>
                    )}

                    {isApproved && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Cleared
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 9: Photo Previews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-black text-gray-900">
                  Customer Event Gallery & Demo Previews
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isFinalPhaseApproved
                  ? 'All deliverables unlocked! Download your full raw & edited collection.'
                  : '10 watermarked demo previews available. Complete final milestone to unlock download.'}
              </p>
            </div>

            <div>
              {isFinalPhaseApproved ? (
                <button
                  type="button"
                  onClick={() => setDownloadNotice(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download All (1,847 Photos)
                </button>
              ) : (
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Full Gallery Locked
                </span>
              )}
            </div>
          </div>

          {downloadNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Starting high-speed ZIP download for all high-res photos...</span>
            </div>
          )}

          {/* 10 Watermarked Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {previewPhotos.map((img, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden h-32 border border-gray-200">
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                {!isFinalPhaseApproved && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-white/80 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded-sm">
                      PREVIEW
                    </span>
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 10: Cancellation & Refund Option */}
        {booking.status === 'active' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Need to cancel this booking?</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Per Section 10 of the PaySnap Agreement, non-refundable booking fee is {formatINR(booking.booking_fee)}. Eligible refund: <strong>{formatINR(refundableAmount)}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>
        )}
      </main>

      {/* Payment Proof Upload Modal */}
      {payModalPhase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Pay {payModalPhase.name}
              </h3>
              <button
                type="button"
                onClick={() => setPayModalPhase(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-800">Milestone Due</span>
                <p className="text-xl font-black text-rose-950">{formatINR(payModalPhase.amount)}</p>
              </div>
              <span className="text-xs font-semibold text-gray-600">Due: {payModalPhase.due_date}</span>
            </div>

            <p className="text-xs text-gray-500">
              Simulate instant UPI transfer or upload screenshot receipt. Payment settles directly with {photographer?.shop_name}.
            </p>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
              <div className="w-28 h-28 bg-white border border-gray-300 rounded-xl mx-auto flex items-center justify-center p-2 mb-2 shadow-xs">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=paysnap@okhdfcbank"
                  alt="UPI QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[11px] text-gray-500">Scan QR to pay directly to studio</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleSimulatePayment}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                {isProcessingPayment ? 'Validating Payment...' : 'Simulate Payment & Submit Proof'}
              </button>
              <button
                type="button"
                onClick={() => setPayModalPhase(null)}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Confirm Booking Cancellation</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel this booking with <strong>{photographer?.shop_name}</strong>?
            </p>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Paid so far:</span>
                <span className="font-bold text-gray-900">{formatINR(totalPaid)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Non-refundable Booking Fee:</span>
                <span className="font-bold">- {formatINR(booking.booking_fee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-bold text-emerald-700 text-sm">
                <span>Refund Processed to You:</span>
                <span>{formatINR(refundableAmount)}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Yes, Cancel & Refund
              </button>
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
