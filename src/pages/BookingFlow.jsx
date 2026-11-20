import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { Check, Info, Lock, Loader2 } from 'lucide-react';

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

  const selectedPkg = photographer.packages.find((p) => p.id === selectedPkgId) || photographer.packages[0];
  const dealPrice = selectedPkg.price;
  const bookingFee = 5000;

  // 3-Phase default breakdown: 30%, 40%, 30%
  const phase1Amount = Math.round(dealPrice * 0.3);
  const phase2Amount = Math.round(dealPrice * 0.4);
  const phase3Amount = dealPrice - phase1Amount - phase2Amount;

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
        total_photos_uploaded: 1847, // Default demo count
        created_at: new Date().toISOString().slice(0, 10),
      };

      const generatedPhases = [
        {
          id: 'pp_' + Date.now() + '_1',
          booking_id: generatedBookingId,
          phase_number: 1,
          name: 'Advance Booking Payment',
          amount: phase1Amount,
          due_date: new Date().toISOString().slice(0, 10),
          paid_date: new Date().toISOString().slice(0, 10),
          status: 'approved', // Paid right now!
          proof_screenshot_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          edit_history: [],
        },
        {
          id: 'pp_' + Date.now() + '_2',
          booking_id: generatedBookingId,
          phase_number: 2,
          name: 'Pre-Event Assurance',
          amount: phase2Amount,
          due_date: '2026-12-20',
          paid_date: null,
          status: 'pending',
          proof_screenshot_url: null,
          edit_history: [],
        },
        {
          id: 'pp_' + Date.now() + '_3',
          booking_id: generatedBookingId,
          phase_number: 3,
          name: 'Final Delivery & Release',
          amount: phase3Amount,
          due_date: '2027-01-05',
          paid_date: null,
          status: 'pending',
          proof_screenshot_url: null,
          edit_history: [],
        },
      ];

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
                            onChange={() => setSelectedPkgId(pkg.id)}
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
                Review Payment Plan →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Schedule Preview */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Booking Step 2</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
                Agreed Deal & 3-Phase Schedule
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                The total agreed deal price of <strong className="text-rose-600">{formatINR(dealPrice)}</strong> is locked on PaySnap. No unexpected discounts or unagreed deductions.
              </p>
            </div>

            {/* Locked Deal Summary Banner */}
            <div className="p-4 bg-rose-50/80 rounded-2xl border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-rose-800 tracking-wider">Locked Deal Price</span>
                <p className="text-2xl font-black text-rose-950">{formatINR(dealPrice)}</p>
              </div>
              <div className="text-right text-xs text-gray-600">
                <p className="font-bold">{selectedPkg.name} Package</p>
                <p>{eventDate}</p>
              </div>
            </div>

            {/* 3 Phases Detailed */}
            <div className="space-y-3">
              {/* Phase 1 */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Phase 1: Advance Booking (30%)</h4>
                    <p className="text-xs text-gray-500">Due today to lock photographer's calendar</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-gray-900 text-base">{formatINR(phase1Amount)}</span>
                  <span className="block text-[10px] text-amber-600 font-bold">Due at confirmation</span>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Phase 2: Pre-Event Payment (40%)</h4>
                    <p className="text-xs text-gray-500">Due 5 days before the wedding shoot</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-gray-900 text-base">{formatINR(phase2Amount)}</span>
                  <span className="block text-[10px] text-gray-400">Due 20 Dec 2026</span>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="p-4 rounded-2xl border border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">Phase 3: Final Delivery (30%)</h4>
                    <p className="text-xs text-gray-500">Pay only after seeing 10 watermarked demo previews</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-gray-900 text-base">{formatINR(phase3Amount)}</span>
                  <span className="block text-[10px] text-gray-400">Unlocks full gallery</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Photographer flexibility:</strong> Payment percentages and specific calendar dates can also be mutually fine-tuned from your photographer's dashboard with logged change history.</span>
            </div>

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
                Transparent rules binding both customer and photographer to agreed scope and cancellation terms.
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
              <p className="font-bold text-gray-900">1. PAYMENT PHASES</p>
              <p>
                - Phase 1 (Advance Booking): {formatINR(phase1Amount)} due immediately to secure shoot dates.<br />
                - Phase 2 (Pre-Event): {formatINR(phase2Amount)} due prior to wedding commencement.<br />
                - Phase 3 (Final Delivery): {formatINR(phase3Amount)} due after review of 10 demo preview photos.
              </p>
              <p className="font-bold text-gray-900">2. CANCELLATION & REFUND POLICY (SECTION 10)</p>
              <p>
                - Non-refundable booking fee: A standard minimum fee of {formatINR(bookingFee)} is strictly non-refundable upon confirmation to cover calendar reserve losses.<br />
                - Cancellation after booking: All amounts paid beyond the non-refundable fee of {formatINR(bookingFee)} will be returned via platform refund processing.<br />
                Example: If {formatINR(phase1Amount + phase2Amount)} has been paid and customer cancels, refund returned is {formatINR(phase1Amount + phase2Amount - bookingFee)}.
              </p>
              <p className="font-bold text-gray-900">3. PHOTO DELIVERY</p>
              <p>
                Photographer will upload the complete set of edited digital photos. 10 watermarked preview photos will be shown. The remaining full-resolution download package unlocks upon Phase 3 payment approval.
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
                I have read and agree to the PaySnap Service Agreement, locked price of {formatINR(dealPrice)}, 3-phase milestone schedule, and non-refundable {formatINR(bookingFee)} booking fee terms.
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
                Accept & Proceed to Pay Phase 1 →
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
                Pay Phase 1 Advance ({formatINR(phase1Amount)})
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
                  Your wedding shoot with <strong>{photographer.shop_name}</strong> is confirmed. Status updated to <strong>"Phase 1 Paid"</strong>.
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
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Enter UPI ID
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="priya@okhdfcbank"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-hidden focus:border-rose-500"
                    />
                    <p className="text-[11px] text-gray-500">
                      *Demo mock: No real money will be charged.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-700 uppercase mb-1">Card Number</label>
                      <input
                        type="text"
                        disabled
                        value="•••• •••• •••• 4242 (Demo)"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 uppercase mb-1">Expiry</label>
                        <input
                          type="text"
                          disabled
                          value="12/28"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 uppercase mb-1">CVV</label>
                        <input
                          type="text"
                          disabled
                          value="•••"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                    HDFC Bank, ICICI Bank, SBI, Axis Bank (simulated gateway)
                  </div>
                )}

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-500 block">Total Due Now</span>
                    <span className="text-xl font-black text-rose-700">{formatINR(phase1Amount)}</span>
                  </div>
                  <span className="text-[11px] text-rose-600 font-semibold bg-white px-2 py-1 rounded-md border border-rose-200 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Gateway Protected
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayPhase1}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing Payment via Gateway...
                    </>
                  ) : (
                    `Pay ${formatINR(phase1Amount)} & Confirm Booking`
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
