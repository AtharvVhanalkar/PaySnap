import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { Check, Info, Lock, Loader2, Plus, Trash2, Calendar, DollarSign, Sliders, AlertCircle } from 'lucide-react';

export default function BookingFlow() {
  const { photographerId } = useParams();
  const navigate = useNavigate();
  const { getPhotographer, formatINR, currentUser, addBooking } = useApp();

  const photographer = getPhotographer(photographerId) || getPhotographer('p1');

  // Step state (1: Details & Package, 2: Schedule Breakdown, 3: Agreement, 4: Payment)
  const [step, setStep] = useState(1);

  // Form selections
  const [eventDate, setEventDate] = useState('2026-12-28');
  const [venue, setVenue] = useState('JW Marriott, Senapati Bapat Road, Pune');
  const [selectedPkgId, setSelectedPkgId] = useState(photographer?.packages[1]?.id || photographer?.packages[0]?.id);
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Payment mock state
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [newBookingId, setNewBookingId] = useState(null);

  const selectedPkg = photographer?.packages.find((p) => p.id === selectedPkgId) || photographer?.packages[0];
  const dealPrice = selectedPkg?.price || 95000;
  const bookingFee = 5000;

  // Customizable Phase Schedule state
  const [phasesList, setPhasesList] = useState([
    {
      id: 1,
      name: 'Phase 1: Advance Booking',
      amount: Math.round(dealPrice * 0.3),
      due_date: new Date().toISOString().slice(0, 10),
    },
    {
      id: 2,
      name: 'Phase 2: Pre-Event Payment',
      amount: Math.round(dealPrice * 0.4),
      due_date: '2026-12-20',
    },
    {
      id: 3,
      name: 'Phase 3: Final Delivery & Release',
      amount: dealPrice - Math.round(dealPrice * 0.3) - Math.round(dealPrice * 0.4),
      due_date: '2027-01-05',
    },
  ]);

  // When package changes, recalculate default 3 phases if user hasn't heavily customized
  const applyPresetPhases = (count) => {
    if (count === 2) {
      const half = Math.round(dealPrice * 0.5);
      setPhasesList([
        { id: 1, name: 'Phase 1: Advance Booking (50%)', amount: half, due_date: new Date().toISOString().slice(0, 10) },
        { id: 2, name: 'Phase 2: Final Delivery (50%)', amount: dealPrice - half, due_date: '2027-01-05' },
      ]);
    } else if (count === 3) {
      const p1 = Math.round(dealPrice * 0.3);
      const p2 = Math.round(dealPrice * 0.4);
      setPhasesList([
        { id: 1, name: 'Phase 1: Advance Booking (30%)', amount: p1, due_date: new Date().toISOString().slice(0, 10) },
        { id: 2, name: 'Phase 2: Pre-Event Payment (40%)', amount: p2, due_date: '2026-12-20' },
        { id: 3, name: 'Phase 3: Final Delivery (30%)', amount: dealPrice - p1 - p2, due_date: '2027-01-05' },
      ]);
    } else if (count === 4) {
      const q = Math.round(dealPrice * 0.25);
      setPhasesList([
        { id: 1, name: 'Phase 1: Booking Confirmation (25%)', amount: q, due_date: new Date().toISOString().slice(0, 10) },
        { id: 2, name: 'Phase 2: Pre-Event Shoot (25%)', amount: q, due_date: '2026-12-15' },
        { id: 3, name: 'Phase 3: Main Event Handover (25%)', amount: q, due_date: '2026-12-29' },
        { id: 4, name: 'Phase 4: Final Album & Raw Delivery (25%)', amount: dealPrice - 3 * q, due_date: '2027-01-15' },
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
    const totalCurrent = phasesList.reduce((sum, p) => sum + p.amount, 0);
    const diff = Math.max(0, dealPrice - totalCurrent);
    const newPhaseNum = phasesList.length + 1;
    setPhasesList((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: `Phase ${newPhaseNum}: Milestone Payment`,
        amount: diff > 0 ? diff : 10000,
        due_date: '2027-01-10',
      },
    ]);
  };

  const handleRemovePhase = (index) => {
    if (phasesList.length <= 1) return;
    setPhasesList((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPhasesAmount = phasesList.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const phaseDifference = dealPrice - totalPhasesAmount;
  const phase1PayAmount = phasesList[0]?.amount || Math.round(dealPrice * 0.3);

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <p>Photographer not found</p>
        </div>
      </div>
    );
  }

  // Execute payment simulation
  const handlePayPhase1 = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generatedBookingId = 'b_' + Date.now();
      const generatedBooking = {
        id: generatedBookingId,
        customer_id: currentUser?.id || 'c1',
        photographer_id: photographer.id,
        event_date: eventDate,
        venue: venue,
        package_id: selectedPkg.id,
        deal_price: dealPrice,
        booking_fee: bookingFee,
        status: 'active',
        cancellation_status: null,
        refund_amount: 0,
        total_photos_uploaded: 1847,
        created_at: new Date().toISOString().slice(0, 10),
      };

      const generatedPhases = phasesList.map((phase, idx) => ({
        id: 'pp_' + Date.now() + '_' + (idx + 1),
        booking_id: generatedBookingId,
        phase_number: idx + 1,
        name: phase.name,
        amount: Number(phase.amount),
        due_date: phase.due_date,
        paid_date: idx === 0 ? new Date().toISOString().slice(0, 10) : null,
        status: idx === 0 ? 'approved' : 'pending',
        proof_screenshot_url: idx === 0 ? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' : null,
        edit_history: [],
      }));

      addBooking(generatedBooking, generatedPhases);
      setNewBookingId(generatedBookingId);
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
            <span className={step >= 1 ? 'text-rose-600' : ''}>1. Date & Package</span>
            <span className={step >= 2 ? 'text-rose-600' : ''}>2. Milestone Plan</span>
            <span className={step >= 3 ? 'text-rose-600' : ''}>3. Digital Agreement</span>
            <span className={step >= 4 ? 'text-rose-600' : ''}>4. Secure Payment</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-600 h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* STEP 1: Date & Package Selection */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Booking Step 1</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                Select Wedding Date & Package
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Shooting with <strong className="text-gray-800">{photographer.shop_name}</strong> ({photographer.owner_name})
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Wedding Event Date
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Venue / Location in Pune
                </label>
                <input
                  type="text"
                  required
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. The Orchid Hotel, Balewadi / Koregaon Park"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Choose Photography Package
                </label>
                <div className="space-y-3">
                  {photographer.packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`block p-4 rounded-2xl border-2 cursor-pointer transition ${
                        selectedPkgId === pkg.id
                          ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="package"
                            checked={selectedPkgId === pkg.id}
                            onChange={() => {
                              setSelectedPkgId(pkg.id);
                              // Auto re-balance phases when switching package
                              const p1 = Math.round(pkg.price * 0.3);
                              const p2 = Math.round(pkg.price * 0.4);
                              setPhasesList([
                                { id: 1, name: 'Phase 1: Advance Booking (30%)', amount: p1, due_date: new Date().toISOString().slice(0, 10) },
                                { id: 2, name: 'Phase 2: Pre-Event Payment (40%)', amount: p2, due_date: '2026-12-20' },
                                { id: 3, name: 'Phase 3: Final Delivery (30%)', amount: pkg.price - p1 - p2, due_date: '2027-01-05' },
                              ]);
                            }}
                            className="text-rose-600 focus:ring-rose-500 h-4 w-4"
                          />
                          <div>
                            <span className="font-extrabold text-gray-900 text-sm">{pkg.name} Package</span>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {pkg.items.join(' · ')}
                            </div>
                          </div>
                        </div>
                        <span className="font-extrabold text-gray-900 text-base">{formatINR(pkg.price)}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <Link to={`/photographer/${photographer.id}`} className="text-xs font-semibold text-gray-500 hover:text-gray-800">
                ← Back to profile
              </Link>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 cursor-pointer"
              >
                Review & Customize Plan →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Schedule Customization */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Booking Step 2</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                Customize Milestone Schedule ({phasesList.length} Phases)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                The total package price is locked at <strong className="text-rose-600">{formatINR(dealPrice)}</strong>. Customize the number of phases, due dates, and amount for each phase.
              </p>
            </div>

            {/* Quick Presets for Phase Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-rose-600" />
                Quick Milestone Presets:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyPresetPhases(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    phasesList.length === 2 ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  2 Phases (50 / 50)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPhases(3)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    phasesList.length === 3 ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  3 Phases (30 / 40 / 30)
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetPhases(4)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    phasesList.length === 4 ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  4 Phases (25 / 25 / 25 / 25)
                </button>
              </div>
            </div>

            {/* Locked Deal Summary Banner */}
            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">Locked Deal Price</span>
                <p className="text-2xl font-black text-rose-950">{formatINR(dealPrice)}</p>
              </div>
              <div className="text-left sm:text-right text-xs text-gray-600">
                <p className="font-bold">{selectedPkg.name} Package</p>
                <p>Event: {eventDate} · {venue}</p>
              </div>
            </div>

            {/* Total Allocated vs Deal Price check */}
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              phaseDifference === 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <span>
                Total Scheduled: <strong>{formatINR(totalPhasesAmount)}</strong> of <strong>{formatINR(dealPrice)}</strong>
              </span>
              {phaseDifference === 0 ? (
                <span className="font-bold flex items-center gap-1 text-emerald-700">
                  <Check className="w-3.5 h-3.5" /> Perfectly Balanced
                </span>
              ) : phaseDifference > 0 ? (
                <span className="font-bold text-amber-700">
                  ₹{phaseDifference.toLocaleString('en-IN')} remaining unallocated
                </span>
              ) : (
                <span className="font-bold text-red-600">
                  ₹{Math.abs(phaseDifference).toLocaleString('en-IN')} over-allocated
                </span>
              )}
            </div>

            {/* Customizable Phases List */}
            <div className="space-y-4">
              {phasesList.map((p, idx) => (
                <div key={p.id || idx} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold uppercase text-gray-500">
                        Milestone {idx + 1} {idx === 0 && '(Advance Due Today)'}
                      </span>
                    </div>

                    {phasesList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhase(idx)}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-gray-50 transition cursor-pointer"
                        title="Remove Phase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        required
                        value={p.name}
                        onChange={(e) => handleUpdatePhase(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={p.amount}
                        onChange={(e) => handleUpdatePhase(idx, 'amount', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                        Payment Due Date
                      </label>
                      <input
                        type="date"
                        required
                        value={p.due_date}
                        onChange={(e) => handleUpdatePhase(idx, 'due_date', e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-gray-300 focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Phase Button */}
            <button
              type="button"
              onClick={handleAddPhase}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-rose-300 hover:border-rose-500 text-rose-600 hover:bg-rose-50/50 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Another Milestone Phase
            </button>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                ← Back to step 1
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 cursor-pointer"
              >
                Review Digital Agreement →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Digital Agreement */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Booking Step 3</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                Digital Service Agreement
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Transparent rules binding both customer and photographer to agreed scope, customized milestones, and cancellation terms.
              </p>
            </div>

            {/* Scrollable Agreement Box */}
            <div className="max-h-64 overflow-y-auto p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 font-mono space-y-3 leading-relaxed">
              <p className="font-bold text-gray-900 uppercase">
                PAYSNAP WEDDING PHOTOGRAPHY SERVICE AGREEMENT #PS-{Date.now().toString().slice(-6)}
              </p>
              <p>
                <strong>Photographer Studio:</strong> {photographer.shop_name} ({photographer.owner_name})<br />
                <strong>Customer:</strong> {currentUser?.name || 'Priya Mehta'}<br />
                <strong>Event Date:</strong> {eventDate}<br />
                <strong>Venue:</strong> {venue}<br />
                <strong>Package:</strong> {selectedPkg.name} ({formatINR(dealPrice)})
              </p>
              <p className="font-bold text-gray-900">1. CUSTOMIZED PAYMENT PHASES ({phasesList.length} MILESTONES)</p>
              {phasesList.map((p, i) => (
                <p key={p.id || i}>
                  - {p.name}: {formatINR(p.amount)} (Due: {p.due_date})
                </p>
              ))}
              <p className="font-bold text-gray-900">2. CANCELLATION & REFUND POLICY</p>
              <p>
                - Non-refundable booking fee: A standard minimum fee of {formatINR(bookingFee)} is strictly non-refundable upon confirmation to cover calendar reserve losses.<br />
                - Cancellation after booking: All amounts paid beyond the non-refundable fee of {formatINR(bookingFee)} will be returned via platform refund processing.
              </p>
              <p className="font-bold text-gray-900">3. PHOTO DELIVERY</p>
              <p>
                Photographer will upload the complete set of edited digital photos. 10 watermarked preview photos will be shown. The remaining full-resolution download package unlocks upon final milestone payment approval.
              </p>
            </div>

            {/* Checkbox consent */}
            <label className="flex items-start gap-3 p-3 rounded-xl border border-rose-200 bg-rose-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-0.5 text-rose-600 focus:ring-rose-500 h-4 w-4 rounded"
              />
              <span className="text-xs text-gray-800 font-semibold leading-normal">
                I have read and agree to the PaySnap Service Agreement, locked price of {formatINR(dealPrice)}, customized {phasesList.length}-phase milestone schedule, and non-refundable {formatINR(bookingFee)} booking fee terms.
              </span>
            </label>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                ← Back to schedule
              </button>
              <button
                type="button"
                disabled={!agreementChecked}
                onClick={() => setStep(4)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
                  agreementChecked
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-900/20'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Accept & Proceed to Pay Phase 1 ({formatINR(phase1PayAmount)}) →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Mock Payment for Phase 1 */}
        {step === 4 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Booking Step 4</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                Pay Phase 1 Advance ({formatINR(phase1PayAmount)})
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Simulated payment gateway with direct settlement to {photographer.shop_name}.
              </p>
            </div>

            {paymentSuccess ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">
                  Phase 1 Advance Paid Successfully!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your wedding shoot with <strong>{photographer.shop_name}</strong> is confirmed with your customized {phasesList.length}-phase schedule. Status updated to <strong>"Phase 1 Paid"</strong>.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <Link
                    to={`/booking/${newBookingId}`}
                    className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md"
                  >
                    View Booking Details & Delivery →
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="px-6 py-3 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-sm"
                  >
                    Go to My Bookings
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Payment Tabs */}
                <div className="flex border-b border-gray-200 space-x-6 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`pb-2 border-b-2 cursor-pointer ${
                      paymentMethod === 'upi' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-400'
                    }`}
                  >
                    UPI / QR (GPay, PhonePe)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`pb-2 border-b-2 cursor-pointer ${
                      paymentMethod === 'card' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-400'
                    }`}
                  >
                    Debit / Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`pb-2 border-b-2 cursor-pointer ${
                      paymentMethod === 'netbanking' ? 'border-rose-600 text-rose-600' : 'border-transparent text-gray-400'
                    }`}
                  >
                    Net Banking
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okaxis"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-hidden focus:border-rose-500"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                      <div className="w-32 h-32 bg-white border border-gray-300 rounded-xl mx-auto flex items-center justify-center p-2 mb-2 shadow-xs">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=paysnap@okhdfcbank"
                          alt="PaySnap Demo UPI QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">Scan to pay with any UPI app</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4111 2222 3333 4444"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Expiry</label>
                        <input
                          type="text"
                          defaultValue="12/28"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">CVV</label>
                        <input
                          type="password"
                          defaultValue="789"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Select Bank</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium">
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India</option>
                      <option>Axis Bank</option>
                    </select>
                  </div>
                )}

                {/* Amount to pay */}
                <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-800">Total Payable Now</span>
                    <p className="text-xl font-black text-rose-950">{formatINR(phase1PayAmount)}</p>
                  </div>
                  <span className="text-xs text-gray-500">Includes {formatINR(bookingFee)} calendar lock deposit</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    ← Back to agreement
                  </button>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePayPhase1}
                    className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 cursor-pointer flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
                      </>
                    ) : (
                      <>Pay {formatINR(phase1PayAmount)} Securely →</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
