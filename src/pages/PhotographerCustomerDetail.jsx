import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { previewPhotos } from '../data/mockData';
import {
  Phone,
  Mail,
  Check,
  Clock,
  FileText,
  Edit3,
  Folder,
  Cloud,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  ShieldAlert,
  Sliders,
  Sparkles,
  CheckCircle,
  X,
  Eye,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

export default function PhotographerCustomerDetail() {
  const { bookingId } = useParams();
  const {
    getBooking,
    getCustomer,
    getPhotographer,
    getPhasesForBooking,
    setBookingPhases,
    approvePhase,
    rejectPhase,
    approveBooking,
    isPhaseOverdue,
    hasOverduePhase,
    formatINR,
  } = useApp();

  const booking = getBooking(bookingId);

  // Local state for interactive milestone schedule customizer
  const initialPhases = booking ? getPhasesForBooking(booking.id) : [];
  const [phasesList, setPhasesList] = useState([]);
  const [saveToast, setSaveToast] = useState(false);

  // Sync initial phases when booking loads
  useEffect(() => {
    if (booking) {
      const currentPhases = getPhasesForBooking(booking.id);
      if (currentPhases.length > 0) {
        setPhasesList(currentPhases);
      } else {
        // Generate default 3 phases if none exist
        const p1 = 5000;
        const rem = Math.max(0, booking.deal_price - p1);
        const p2 = Math.round(rem * 0.5);
        const p3 = rem - p2;
        setPhasesList([
          {
            id: 'pp_' + Date.now() + '_1',
            name: 'Phase 1: Booking Token (Non-Refundable)',
            amount: p1,
            due_date: new Date().toISOString().slice(0, 10),
            status: booking.status === 'active' ? 'approved' : 'submitted',
          },
          {
            id: 'pp_' + Date.now() + '_2',
            name: 'Phase 2: Pre-Event Payment',
            amount: p2,
            due_date: '2026-12-20',
            status: 'pending',
          },
          {
            id: 'pp_' + Date.now() + '_3',
            name: 'Phase 3: Final Delivery & Album Release',
            amount: p3,
            due_date: '2027-01-05',
            status: 'pending',
          },
        ]);
      }
    }
  }, [bookingId, booking?.status]);

  // Reject modal state
  const [rejectModalPhaseId, setRejectModalPhaseId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Payment screenshot details do not match bank statement.');

  // Photo upload mock state
  const [photoCount, setPhotoCount] = useState(booking?.total_photos_uploaded || 1847);
  const [selectedPreviews, setSelectedPreviews] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [uploadToast, setUploadToast] = useState(false);
  const [previewScreenshot, setPreviewScreenshot] = useState(null);
  const [reminderSent, setReminderSent] = useState(false);

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
  const dealPrice = booking.deal_price;

  // Milestone Presets (2, 3, 4 phases)
  const applyPresetPhases = (count) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    // Keep booking fee if already paid
    const p1Amount = phasesList[0]?.amount || 5000;
    const remaining = Math.max(0, dealPrice - p1Amount);

    if (count === 2) {
      setPhasesList([
        {
          id: phasesList[0]?.id || 'pp_1',
          name: 'Phase 1: Advance Booking (50%)',
          amount: Math.round(dealPrice * 0.5),
          due_date: todayStr,
          status: phasesList[0]?.status || 'pending',
          proof_screenshot_url: phasesList[0]?.proof_screenshot_url,
        },
        {
          id: phasesList[1]?.id || 'pp_2_' + Date.now(),
          name: 'Phase 2: Final Delivery (50%)',
          amount: dealPrice - Math.round(dealPrice * 0.5),
          due_date: '2027-01-05',
          status: 'pending',
        },
      ]);
    } else if (count === 3) {
      const p1 = Math.round(dealPrice * 0.3);
      const p2 = Math.round(dealPrice * 0.4);
      setPhasesList([
        {
          id: phasesList[0]?.id || 'pp_1',
          name: 'Phase 1: Advance Booking (30%)',
          amount: p1,
          due_date: todayStr,
          status: phasesList[0]?.status || 'pending',
          proof_screenshot_url: phasesList[0]?.proof_screenshot_url,
        },
        {
          id: phasesList[1]?.id || 'pp_2_' + Date.now(),
          name: 'Phase 2: Pre-Event Payment (40%)',
          amount: p2,
          due_date: '2026-12-20',
          status: 'pending',
        },
        {
          id: phasesList[2]?.id || 'pp_3_' + Date.now(),
          name: 'Phase 3: Final Delivery & Release (30%)',
          amount: dealPrice - p1 - p2,
          due_date: '2027-01-05',
          status: 'pending',
        },
      ]);
    } else if (count === 4) {
      const q = Math.round(dealPrice * 0.25);
      setPhasesList([
        {
          id: phasesList[0]?.id || 'pp_1',
          name: 'Phase 1: Booking Confirmation (25%)',
          amount: q,
          due_date: todayStr,
          status: phasesList[0]?.status || 'pending',
          proof_screenshot_url: phasesList[0]?.proof_screenshot_url,
        },
        {
          id: phasesList[1]?.id || 'pp_2_' + Date.now(),
          name: 'Phase 2: Pre-Event Shoot (25%)',
          amount: q,
          due_date: '2026-12-15',
          status: 'pending',
        },
        {
          id: phasesList[2]?.id || 'pp_3_' + Date.now(),
          name: 'Phase 3: Main Event Handover (25%)',
          amount: q,
          due_date: '2026-12-29',
          status: 'pending',
        },
        {
          id: phasesList[3]?.id || 'pp_4_' + Date.now(),
          name: 'Phase 4: Final Album Delivery (25%)',
          amount: dealPrice - 3 * q,
          due_date: '2027-01-15',
          status: 'pending',
        },
      ]);
    }
  };

  const handleUpdatePhase = (index, field, value) => {
    setPhasesList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'amount' ? Math.max(0, Number(value) || 0) : value,
      };
      return updated;
    });
  };

  const handleAddPhase = () => {
    const totalCurrent = phasesList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const diff = Math.max(0, dealPrice - totalCurrent);
    const newPhaseNum = phasesList.length + 1;
    setPhasesList((prev) => [
      ...prev,
      {
        id: 'pp_' + Date.now() + '_' + newPhaseNum,
        name: `Phase ${newPhaseNum}: Milestone Payment`,
        amount: diff > 0 ? diff : 10000,
        due_date: '2027-01-10',
        status: 'pending',
      },
    ]);
  };

  const handleRemovePhase = (index) => {
    if (phasesList.length <= 1) return;
    setPhasesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSchedule = () => {
    setBookingPhases(booking.id, phasesList);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
  };

  const totalPhasesAmount = phasesList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const phaseDifference = dealPrice - totalPhasesAmount;

  const totalPaid = phasesList
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const remainingBalance = Math.max(0, dealPrice - totalPaid);
  const isBookingOverdue = hasOverduePhase(booking.id);
  const isPendingApproval = booking.status === 'pending_approval';

  const bookingProofScreenshot =
    booking.booking_fee_screenshot ||
    phasesList[0]?.proof_screenshot_url ||
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800';

  const handleApproveThisBooking = () => {
    approveBooking(booking.id);
  };

  const handleApprovePhase = (phaseId) => {
    approvePhase(phaseId);
    setPhasesList((prev) =>
      prev.map((p) =>
        p.id === phaseId ? { ...p, status: 'approved', paid_date: new Date().toISOString().slice(0, 10) } : p
      )
    );
  };

  const handleRejectPhase = () => {
    if (!rejectModalPhaseId) return;
    rejectPhase(rejectModalPhaseId, rejectReason);
    setPhasesList((prev) =>
      prev.map((p) =>
        p.id === rejectModalPhaseId ? { ...p, status: 'rejected', reject_reason: rejectReason } : p
      )
    );
    setRejectModalPhaseId(null);
  };

  const handleMockUpload = () => {
    setPhotoCount((prev) => prev + 150);
    setUploadToast(true);
    setTimeout(() => setUploadToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link to="/photographer-dashboard" className="hover:text-rose-600">
            Photographer Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-800">Client Profile: {customer?.name || 'Customer'}</span>
        </div>

        {/* Save Schedule Success Toast */}
        {saveToast && (
          <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-200" />
              <span>Milestone schedule successfully updated and locked for {customer?.name}! Client can see new due dates.</span>
            </div>
            <button onClick={() => setSaveToast(false)} className="text-emerald-100 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* PENDING APPROVAL BANNER: When customer just paid 5000 booking fee */}
        {isPendingApproval && (
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <Sparkles className="w-8 h-8 text-amber-200" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-300 text-amber-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                    New Booking Request
                  </span>
                  <h2 className="text-xl font-black">₹5,000 Booking Fee Paid</h2>
                </div>
                <p className="text-xs text-purple-100 leading-relaxed max-w-xl">
                  {customer?.name} has paid the <strong>₹5,000 Non-Refundable Booking Fee</strong> to lock the date on <strong>{booking.event_date}</strong>. Review their payment screenshot and approve this booking.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setPreviewScreenshot(bookingProofScreenshot)}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-4 h-4" /> View Screenshot
              </button>
              <button
                type="button"
                onClick={handleApproveThisBooking}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Check className="w-4 h-4" /> Approve Booking Now
              </button>
            </div>
          </div>
        )}

        {/* Action Required Banner for Overdue Payment */}
        {isBookingOverdue && !isPendingApproval && (
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                    Action Required
                  </span>
                  <h3 className="font-black text-lg">Milestone Payment Overdue</h3>
                </div>
                <p className="text-xs text-rose-100 mt-1 max-w-xl leading-relaxed">
                  The payment due date has passed without payment or screenshot proof. Notify {customer?.name || 'the client'} to submit payment proof.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setReminderSent(true);
                setTimeout(() => setReminderSent(false), 4000);
              }}
              className="px-5 py-2.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-black rounded-xl shadow-md transition cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Send Payment Reminder
            </button>
          </div>
        )}

        {/* Customer Information Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-rose-400 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {customer?.name ? customer.name.charAt(0) : 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                    {customer?.name || 'Customer'}
                  </h1>
                  <StatusBadge status={isPendingApproval ? 'pending_approval' : isBookingOverdue ? 'action_required' : booking.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center flex-wrap gap-2">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> {customer?.phone || '9988776655'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> {customer?.email || 'customer@email.com'}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Booking ID: <strong className="font-mono text-gray-800">#{booking.id}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Locked Deal Price
              </span>
              <span className="text-2xl font-black text-rose-600">{formatINR(dealPrice)}</span>
              <div className="text-xs text-gray-600 mt-0.5">
                Paid: <strong className="text-emerald-600">{formatINR(totalPaid)}</strong> · Remaining:{' '}
                <strong>{formatINR(remainingBalance)}</strong>
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
              <span className="font-extrabold text-emerald-600 text-sm">{formatINR(booking.booking_fee)} (Locked)</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MILESTONE SCHEDULE CUSTOMIZER (MOVED FROM CUSTOMER TO PHOTOGRAPHER PROFILE)
           ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Photographer Milestone Manager
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                  Customize Milestone Schedule ({phasesList.length} Phases)
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  The total package price is locked at <strong className="text-rose-600">{formatINR(dealPrice)}</strong>. Customize the number of phases, due dates, and amount for each phase.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddPhase}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Phase
                </button>
                <button
                  type="button"
                  onClick={handleSaveSchedule}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Save Schedule
                </button>
              </div>
            </div>
          </div>

          {/* Quick Presets for Phase Count */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-600" />
              Quick Milestone Presets:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => applyPresetPhases(2)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  phasesList.length === 2
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                2 Phases (50 / 50)
              </button>
              <button
                type="button"
                onClick={() => applyPresetPhases(3)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  phasesList.length === 3
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                3 Phases (30 / 40 / 30)
              </button>
              <button
                type="button"
                onClick={() => applyPresetPhases(4)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  phasesList.length === 4
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                4 Phases (25 / 25 / 25 / 25)
              </button>
            </div>
          </div>

          {/* Locked Deal Summary Banner */}
          <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">
                Locked Deal Price
              </span>
              <p className="text-2xl font-black text-rose-950">{formatINR(dealPrice)}</p>
            </div>
            <div className="text-left sm:text-right text-xs text-rose-900 font-medium">
              <span className="font-extrabold text-sm block">Wedding Photography Deal</span>
              <span>Event: {booking.event_date} · {booking.venue}</span>
            </div>
          </div>

          {/* Allocation Health Bar */}
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between font-bold ${
              phaseDifference === 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <span>
              Total Scheduled: <strong>{formatINR(totalPhasesAmount)}</strong> of {formatINR(dealPrice)}
            </span>
            {phaseDifference === 0 ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <Check className="w-4 h-4" /> Perfectly Balanced
              </span>
            ) : phaseDifference > 0 ? (
              <span className="text-amber-800">
                ⚠ ₹{phaseDifference.toLocaleString('en-IN')} remaining to allocate
              </span>
            ) : (
              <span className="text-red-700">
                ⚠ ₹{Math.abs(phaseDifference).toLocaleString('en-IN')} over budget!
              </span>
            )}
          </div>

          {/* Customizable Phases List */}
          <div className="space-y-4">
            {phasesList.map((p, idx) => {
              const isApproved = p.status === 'approved';
              const isSubmitted = p.status === 'submitted';
              const isOverdue = isPhaseOverdue(p);

              return (
                <div
                  key={p.id || idx}
                  className={`p-5 rounded-2xl border-2 transition ${
                    isApproved
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : isSubmitted
                      ? 'border-amber-300 bg-amber-50/40'
                      : isOverdue
                      ? 'border-red-300 bg-red-50/30'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                        Milestone {idx + 1} {idx === 0 && '(Booking Advance)'}
                      </span>
                      <StatusBadge status={isOverdue ? 'action_required' : p.status} />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Proof Button if proof exists */}
                      {(p.proof_screenshot_url || (idx === 0 && booking.booking_fee_screenshot)) && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewScreenshot(
                              p.proof_screenshot_url || booking.booking_fee_screenshot
                            )
                          }
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Proof
                        </button>
                      )}

                      {/* Approve Proof button if submitted */}
                      {isSubmitted && (
                        <button
                          type="button"
                          onClick={() => handleApprovePhase(p.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve Payment
                        </button>
                      )}

                      {/* Trash/delete phase (if more than 1 phase) */}
                      {phasesList.length > 1 && !isApproved && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhase(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                          title="Remove Phase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Input Fields for Title, Amount, Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleUpdatePhase(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:border-rose-500"
                        placeholder="e.g. Phase 2: Pre-Event Payment"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={p.amount}
                        onChange={(e) => handleUpdatePhase(idx, 'amount', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                        Payment Due Date
                      </label>
                      <input
                        type="date"
                        value={p.due_date}
                        onChange={(e) => handleUpdatePhase(idx, 'due_date', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Customizer Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleAddPhase}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-rose-600" />
              Add Another Phase
            </button>

            <button
              type="button"
              onClick={handleSaveSchedule}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save & Lock Milestone Schedule
            </button>
          </div>
        </div>

        {/* Section: Upload & Photo Release Controls */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Photo Upload & Delivery Control
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload full gallery. Watermarked previews unlocked upon Phase 1; full HD zip downloads unlock when Phase 3 is approved.
              </p>
            </div>

            <button
              type="button"
              onClick={handleMockUpload}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Cloud className="w-4 h-4" />
              Upload Photos (+150 Raw)
            </button>
          </div>

          {uploadToast && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>150 high-res photos processed and encrypted to cloud storage! Total uploaded: {photoCount}</span>
            </div>
          )}

          {/* Photo Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {previewPhotos.slice(0, 6).map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden relative group border border-gray-200">
                <img
                  src={url}
                  alt={`Shot ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded">
                    Photo #{i + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot Viewer Modal */}
        {previewScreenshot && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 space-y-4 p-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    Payment Screenshot
                  </span>
                  <h3 className="text-base font-extrabold text-gray-900 mt-1">
                    {customer?.name} · Payment Verification
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewScreenshot(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700 bg-gray-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 max-h-[400px] flex items-center justify-center">
                <img
                  src={previewScreenshot}
                  alt="Payment Receipt"
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewScreenshot(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition"
                >
                  Close Preview
                </button>
                {isPendingApproval && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApproveThisBooking();
                      setPreviewScreenshot(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> Approve Booking Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
