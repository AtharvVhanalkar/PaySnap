import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { previewPhotos } from '../data/mockData';

export default function PhotographerCustomerDetail() {
  const { bookingId } = useParams();
  const { getBooking, getCustomer, getPhotographer, getPhasesForBooking, approvePhase, rejectPhase, updatePhase, formatINR } = useApp();

  const booking = getBooking(bookingId);

  // Edit phase modal/form state
  const [editingPhaseId, setEditingPhaseId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '', due_date: '' });

  // Reject modal state
  const [rejectModalPhaseId, setRejectModalPhaseId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Payment screenshot details do not match bank statement.');

  // Photo upload mock state
  const [photoCount, setPhotoCount] = useState(booking?.total_photos_uploaded || 1847);
  const [selectedPreviews, setSelectedPreviews] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [uploadToast, setUploadToast] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState(null);

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Booking not found</h2>
            <Link to="/photographer-dashboard" className="text-rose-600 underline text-sm mt-2 block">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const customer = getCustomer(booking.customer_id);
  const photographer = getPhotographer(booking.photographer_id);
  const phases = getPhasesForBooking(booking.id);

  const totalPaid = phases
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const remainingBalance = Math.max(0, booking.deal_price - totalPaid);

  const startEditPhase = (phase) => {
    setEditingPhaseId(phase.id);
    setEditForm({
      name: phase.name,
      amount: phase.amount.toString(),
      due_date: phase.due_date,
    });
  };

  const handleSavePhaseEdit = (e) => {
    e.preventDefault();
    if (!editingPhaseId) return;
    updatePhase(editingPhaseId, {
      name: editForm.name,
      amount: Number(editForm.amount),
      due_date: editForm.due_date,
    });
    setEditingPhaseId(null);
  };

  const handleApprove = (phaseId) => {
    approvePhase(phaseId);
  };

  const handleReject = () => {
    if (!rejectModalPhaseId) return;
    rejectPhase(rejectModalPhaseId, rejectReason);
    setRejectModalPhaseId(null);
  };

  const handleMockUpload = () => {
    setPhotoCount((prev) => prev + 150);
    setUploadToast(true);
    setTimeout(() => setUploadToast(false), 3000);
  };

  const togglePreviewSelection = (index) => {
    setSelectedPreviews((prev) => {
      if (prev.includes(index)) {
        if (prev.length <= 1) return prev; // Keep at least 1
        return prev.filter((i) => i !== index);
      } else {
        if (prev.length >= 10) return prev; // Max 10 demo previews
        return [...prev, index];
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link to="/photographer-dashboard" className="hover:text-rose-600">Photographer Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800">Customer: {customer?.name || 'Priya Mehta'}</span>
        </div>

        {/* Section 8.3a: Customer Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {customer?.name ? customer.name.charAt(0) : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                    {customer?.name || 'Priya Mehta'}
                  </h1>
                  <StatusBadge status={booking.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  📞 {customer?.phone || '9988776655'} · ✉️ {customer?.email || 'priya@email.com'}
                </p>
                <p className="text-xs text-gray-500">
                  Booking ID: <strong className="font-mono text-gray-800">#{booking.id}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Locked Deal Price</span>
              <span className="text-2xl font-black text-rose-600">{formatINR(booking.deal_price)}</span>
              <div className="text-xs text-gray-600 mt-0.5">
                Paid: <strong className="text-emerald-600">{formatINR(totalPaid)}</strong> · Remaining: <strong>{formatINR(remainingBalance)}</strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div>
              <span className="text-gray-400 block font-bold uppercase text-[10px]">Shoot Date</span>
              <span className="font-extrabold text-gray-800 text-sm">{booking.event_date}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-bold uppercase text-[10px]">Venue</span>
              <span className="font-extrabold text-gray-800 text-sm">{booking.venue}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-bold uppercase text-[10px]">Non-refundable Fee</span>
              <span className="font-extrabold text-gray-800 text-sm">{formatINR(booking.booking_fee)}</span>
            </div>
          </div>
        </div>

        {/* Section 8.3b & c: Payment Schedule & Verification */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Payment Schedule & Verification
              </h2>
              <p className="text-xs text-gray-500">
                You can adjust milestone names, amounts, and due dates. Approving a proof unlocks the next milestone.
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Direct Bank Settlement
            </span>
          </div>

          {/* Phase Cards */}
          <div className="space-y-4">
            {phases.map((phase) => {
              const isApproved = phase.status === 'approved';
              const isSubmitted = phase.status === 'submitted';
              const isEditing = editingPhaseId === phase.id;

              return (
                <div
                  key={phase.id}
                  className={`p-5 rounded-2xl border transition ${
                    isApproved
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : isSubmitted
                      ? 'border-amber-300 bg-amber-50/30 ring-2 ring-amber-200'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Phase Editor */
                    <form onSubmit={handleSavePhaseEdit} className="space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-rose-600 uppercase">
                          Editing Phase {phase.phase_number}
                        </span>
                        <span className="text-[11px] text-gray-400">Edits are logged with timestamp</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Phase Title</label>
                          <input
                            type="text"
                            required
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Amount (₹)</label>
                          <input
                            type="number"
                            required
                            value={editForm.amount}
                            onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">Due Date</label>
                          <input
                            type="date"
                            required
                            value={editForm.due_date}
                            onChange={(e) => setEditForm({ ...editForm, due_date: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingPhaseId(null)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                        >
                          Save Changes & Log Edit
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Display Mode */
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                          {isApproved ? '✓' : phase.phase_number}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-sm text-gray-900">{phase.name}</h4>
                            <StatusBadge status={phase.status} />
                            {isApproved && (
                              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/60 px-2 py-0.5 rounded">
                                Payment verified by gateway
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Amount: <strong className="text-gray-900">{formatINR(phase.amount)}</strong> · Due Date: {phase.due_date} {phase.paid_date && `· Paid on ${phase.paid_date}`}
                          </p>

                          {/* Edit History Log */}
                          {phase.edit_history && phase.edit_history.length > 0 && (
                            <div className="mt-1 text-[10px] text-gray-400">
                              🕒 Last modified: {phase.edit_history[phase.edit_history.length - 1].timestamp.slice(0, 16).replace('T', ' ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Actions: Proof, Approve, Reject, Edit */}
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        {/* Proof screenshot preview */}
                        {phase.proof_screenshot_url && (
                          <button
                            type="button"
                            onClick={() => setPreviewScreenshot(phase.proof_screenshot_url)}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-[11px] font-bold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-1"
                          >
                            <span>🧾</span> View Proof
                          </button>
                        )}

                        {/* Submitted actions: Approve or Reject */}
                        {isSubmitted && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(phase.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
                            >
                              <span>✓</span> Approve Payment
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectModalPhaseId(phase.id)}
                              className="px-3 py-1.5 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 font-bold text-xs transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* Edit Phase Button */}
                        {!isApproved && (
                          <button
                            type="button"
                            onClick={() => startEditPhase(phase)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                            title="Edit Phase Schedule"
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 8.3d: Customer Photos & 10 Previews Selection */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Customer Event Photos & Preview Selection
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload photos and choose which 10 photos appear in the client's watermarked preview gallery.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-xl">
                📁 {photoCount} Photos in Cloud
              </span>
            </div>
          </div>

          {/* Upload Area Mock */}
          <div
            onClick={handleMockUpload}
            className="border-2 border-dashed border-rose-300 rounded-3xl p-8 text-center bg-[#fdf8f3]/60 hover:bg-rose-50/50 transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 text-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              ☁️
            </div>
            <h3 className="font-extrabold text-sm text-gray-900">
              Click to Upload Event Raw & Edited Photos (Demo)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Supports high-resolution JPG, PNG, and CR3 / ARW raw formats.
            </p>
            <span className="inline-block mt-3 px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs">
              + Simulate Uploading 150 Photos
            </span>
          </div>

          {uploadToast && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
              ✓ Successfully synced 150 wedding photos to encrypted storage!
            </div>
          )}

          {/* 10 Selected Previews Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">
                10 Demo Previews Selected ({selectedPreviews.length}/10 selected)
              </h3>
              <span className="text-[11px] text-gray-500">
                Watermark overlay "PREVIEW · {photographer?.shop_name}" will be automatically applied for customer.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {previewPhotos.map((img, idx) => {
                const isSelected = selectedPreviews.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => togglePreviewSelection(idx)}
                    className={`relative h-32 rounded-2xl overflow-hidden cursor-pointer border-2 transition ${
                      isSelected ? 'border-rose-600 ring-2 ring-rose-200' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt={`Preview pick ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 left-1.5">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-rose-600 text-white' : 'bg-white/80 text-gray-600'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </span>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded font-bold">
                      #{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Proof Screenshot Lightbox */}
      {previewScreenshot && (
        <div
          onClick={() => setPreviewScreenshot(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 cursor-pointer"
        >
          <div className="bg-white rounded-3xl p-4 max-w-sm w-full">
            <h4 className="text-xs font-bold text-gray-800 mb-2">Customer Payment Screenshot</h4>
            <img src={previewScreenshot} alt="Payment receipt" className="w-full rounded-2xl object-cover mb-3" />
            <p className="text-[11px] text-gray-500 text-center">Click anywhere to close preview</p>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalPhaseId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Reject Payment Proof</h3>
            <p className="text-xs text-gray-500">
              Provide a reason to notify the customer why the payment could not be validated.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 text-xs font-medium focus:outline-hidden focus:border-rose-500"
            ></textarea>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReject}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl hover:bg-red-700 cursor-pointer"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => setRejectModalPhaseId(null)}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
