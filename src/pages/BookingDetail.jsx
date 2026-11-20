import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { previewPhotos } from '../data/mockData';
import { AlertTriangle, Lock, Unlock, Check, Camera, Shield, Download, CheckCircle, X } from 'lucide-react';

export default function BookingDetail() {
  const { bookingId } = useParams();
  const { getBooking, getPhotographer, getPhasesForBooking, submitPaymentProof, cancelBooking, formatINR } = useApp();

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

  // Check if Phase 3 is approved (unlocks full gallery)
  const isPhase3Approved = phases.find((p) => p.phase_number === 3)?.status === 'approved';

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

        {/* Booking Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  {photographer?.shop_name}
                </h1>
                <StatusBadge status={booking.status === 'cancelled' ? 'cancelled' : isPhase3Approved ? 'completed' : 'active'} />
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

        {/* 3-Phase Milestone Tracker */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">3-Phase Payment Schedule</h2>
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

              return (
                <div
                  key={phase.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isApproved
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : isSubmitted
                      ? 'border-amber-200 bg-amber-50/40'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isApproved
                          ? 'bg-emerald-600 text-white'
                          : isSubmitted
                          ? 'bg-amber-400 text-amber-950'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isApproved ? <Check className="w-4 h-4 mx-auto" /> : phase.phase_number}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-gray-900">{phase.name}</h4>
                        <StatusBadge status={phase.status} />
                        {isApproved && (
                          <span className="text-[10px] text-emerald-700 font-semibold hidden md:inline">
                            (Payment verified by gateway)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Due: {phase.due_date} {phase.paid_date && `· Paid on ${phase.paid_date}`}
                      </p>

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

                    {/* Pay Button for Pending Phases */}
                    {isPending && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => setPayModalPhase(phase)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        Pay Milestone →
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
              <p className="text-xs text-gray-600 mt-1">
                <strong>{booking.total_photos_uploaded || 1847} photos uploaded</strong> to studio cloud · <strong>10 demo previews shown</strong>
              </p>
            </div>

            {isPhase3Approved ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <Unlock className="w-3.5 h-3.5" /> Full Resolution Gallery Unlocked
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Full Gallery Unlocks After Phase 3
              </span>
            )}
          </div>

          {!isPhase3Approved && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong>Watermarked Quality Previews:</strong> These 10 sample photos allow you to inspect color grading, focus, and capture quality. Right-click and downloads are disabled. Once you approve the final phase, all 1,847 photos will be instantly downloadable without watermark.
              </div>
            </div>
          )}

          {/* 10 Watermarked Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
            {previewPhotos.map((img, idx) => (
              <div
                key={idx}
                onContextMenu={(e) => e.preventDefault()}
                className="relative h-36 rounded-2xl overflow-hidden bg-gray-900 shadow-2xs group select-none"
              >
                {/* Photo: slightly blurred if Phase 3 unpaid */}
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  draggable="false"
                  className={`w-full h-full object-cover transition duration-300 ${
                    !isPhase3Approved ? 'filter blur-[1.5px] opacity-90' : 'hover:scale-105'
                  }`}
                />

                {/* CSS Watermark Overlay (Centered) if Phase 3 unpaid */}
                {!isPhase3Approved && (
                  <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-white text-[9px] font-black uppercase tracking-wider text-center border border-white/20 shadow-md">
                      PREVIEW · {photographer?.shop_name || 'STUDIO'}
                    </div>
                  </div>
                )}

                {/* Number Badge */}
                <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                  #{idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Full Resolution Gallery Status & Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-500">
              {isPhase3Approved ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Complete raw & edited collection available for download</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Remaining 1,837 high-res captures locked until Phase 3 final payment</span>
                </span>
              )}
            </div>

            {isPhase3Approved ? (
              <button
                onClick={() => setDownloadNotice(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download All 1,847 Photos (ZIP)
              </button>
            ) : (
              <button
                disabled
                className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-400 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <Lock className="w-4 h-4" /> Download Locked (Pay Phase 3)
              </button>
            )}
          </div>

          {downloadNotice && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex justify-between items-center border border-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Simulated demo download: Your 18.4 GB wedding archive is downloading in background!</span>
              </span>
              <button onClick={() => setDownloadNotice(false)} className="p-1 hover:bg-emerald-100 rounded-lg cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Section 10: Cancellation & Refund Policy Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Cancellation & Refund Terms</h2>
          <div className="p-4 rounded-2xl bg-gray-50 text-xs text-gray-600 space-y-2 leading-relaxed">
            <p>
              • <strong>Non-Refundable Booking Fee:</strong> A minimum booking fee of <strong>₹5,000</strong> is strictly retained upon cancellation to cover dates held and shoot preparation.
            </p>
            <p>
              • <strong>Fair Refund Guarantee:</strong> All amounts paid beyond the non-refundable booking fee are 100% refunded to your original payment method within 7 business days.
            </p>
            <p className="font-semibold text-gray-800">
              Current Calculation: Paid {formatINR(totalPaid)} - ₹5,000 non-refundable fee = <span className="text-emerald-600">{formatINR(refundableAmount)} refund</span> if cancelled now.
            </p>
          </div>

          {booking.status !== 'cancelled' && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel Booking & Request Refund
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Pay Milestone Modal */}
      {payModalPhase && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900">
              Pay Milestone: {payModalPhase.name}
            </h3>
            <p className="text-xs text-gray-500">
              Simulate gateway transfer of <strong>{formatINR(payModalPhase.amount)}</strong> to {photographer?.shop_name}.
            </p>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-xs">
              <span className="text-gray-500 block">Milestone Amount</span>
              <span className="text-2xl font-black text-rose-700">{formatINR(payModalPhase.amount)}</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-gray-700 uppercase">Payment Simulation Method</label>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 font-mono text-gray-700">
                UPI: priya@okhdfcbank (Auto-Verified)
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleSimulatePayment}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessingPayment ? 'Processing Gateway...' : `Confirm & Pay ${formatINR(payModalPhase.amount)}`}
              </button>
              <button
                type="button"
                onClick={() => setPayModalPhase(null)}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-gray-900">Cancel Wedding Booking?</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel your shoot with <strong>{photographer?.shop_name}</strong>?
            </p>

            <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-950 space-y-1">
              <p>Total Paid So Far: <strong>{formatINR(totalPaid)}</strong></p>
              <p>Non-Refundable Booking Fee: <strong>-₹5,000</strong></p>
              <p className="pt-1 border-t border-red-200 font-bold text-sm text-red-700">
                Total Refund to be Processed: {formatINR(refundableAmount)}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Yes, Cancel & Refund {formatINR(refundableAmount)}
              </button>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
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
