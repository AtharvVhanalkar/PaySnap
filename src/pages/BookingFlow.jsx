import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import {
  Check,
  AlertCircle,
  Upload,
  Camera,
  CheckCircle,
  Copy,
  Lock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function BookingFlow() {
  const { photographerId } = useParams();
  const navigate = useNavigate();
  const { getPhotographer, formatINR, currentUser, addBooking } = useApp();

  const photographer = getPhotographer(photographerId) || getPhotographer('p1');

  // Booking selections
  const [eventDate, setEventDate] = useState('2026-12-28');
  const [venue, setVenue] = useState('JW Marriott, Senapati Bapat Road, Pune');
  const [selectedPkgId, setSelectedPkgId] = useState(
    photographer?.packages[1]?.id || photographer?.packages[0]?.id
  );
  const [clientNotes, setClientNotes] = useState('');

  // Fixed Non-Refundable Booking Fee
  const bookingFee = 5000;

  // Commitment checkbox state
  const [commitmentChecked, setCommitmentChecked] = useState(false);

  // Payment proof screenshot state
  const [screenshotUrl, setScreenshotUrl] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [newBookingId, setNewBookingId] = useState(null);

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-gray-600 font-semibold">Photographer not found</p>
        </div>
      </div>
    );
  }

  const selectedPkg =
    photographer.packages.find((p) => p.id === selectedPkgId) ||
    photographer.packages[0];
  const dealPrice = selectedPkg?.price || 40000;
  const upiId = `${photographer.shop_name.toLowerCase().replace(/[^a-z0-9]/g, '')}@hdfcbank`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setScreenshotUrl(fakeUrl);
      setScreenshotName(file.name);
    }
  };

  const handleUseSampleReceipt = () => {
    setScreenshotUrl('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800');
    setScreenshotName('sample_upi_payment_5000.png');
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (!commitmentChecked || !screenshotUrl) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedBookingId = 'b_' + Date.now();
      const newBooking = {
        id: generatedBookingId,
        customer_id: currentUser?.id || 'c1',
        photographer_id: photographer.id,
        event_date: eventDate,
        venue: venue,
        package_id: selectedPkg.id,
        deal_price: dealPrice,
        booking_fee: bookingFee,
        status: 'pending_approval',
        booking_fee_screenshot: screenshotUrl,
        commitment_agreed: true,
        cancellation_status: null,
        refund_amount: 0,
        total_photos_uploaded: 0,
        created_at: new Date().toISOString().slice(0, 10),
      };

      const initialPhases = [
        {
          id: 'pp_' + Date.now() + '_1',
          booking_id: generatedBookingId,
          phase_number: 1,
          name: 'Booking Token (Non-Refundable)',
          amount: bookingFee,
          due_date: new Date().toISOString().slice(0, 10),
          paid_date: new Date().toISOString().slice(0, 10),
          status: 'submitted',
          proof_screenshot_url: screenshotUrl,
          edit_history: [
            {
              timestamp: new Date().toISOString(),
              changes: 'Submitted non-refundable booking fee proof',
            },
          ],
        },
      ];

      addBooking(newBooking, initialPhases);
      setNewBookingId(generatedBookingId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 w-full flex-1">
        {isSubmitted ? (
          /* Confirmation Screen after booking fee submission */
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-100 shadow-lg text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-extrabold px-3 py-1 bg-purple-100 text-purple-800 rounded-full uppercase tracking-wider">
                Booking Request Submitted · Pending Approval
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                Booking Fee Paid Successfully!
              </h1>
              <p className="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                Your payment screenshot of <strong className="text-gray-900 font-extrabold">{formatINR(bookingFee)}</strong> has been sent to{' '}
                <strong className="text-rose-600">{photographer.shop_name}</strong>.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-5 bg-gray-50 rounded-2xl text-left border border-gray-200 text-xs space-y-2.5">
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Studio / Photographer</span>
                <span className="font-extrabold text-gray-900">{photographer.shop_name}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Wedding Date</span>
                <span className="font-extrabold text-gray-900">{eventDate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Venue</span>
                <span className="font-extrabold text-gray-900">{venue}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-200">
                <span className="text-gray-500 font-medium">Package</span>
                <span className="font-extrabold text-gray-900">{selectedPkg.name} ({formatINR(dealPrice)})</span>
              </div>
              <div className="flex justify-between items-center py-1 pt-2">
                <span className="text-gray-900 font-bold">Booking Fee Paid (Non-Refundable)</span>
                <span className="font-black text-rose-600 text-sm">{formatINR(bookingFee)}</span>
              </div>
            </div>

            {/* Next Steps Notification */}
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-left flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-900 space-y-1">
                <p className="font-bold">What happens next?</p>
                <p className="text-purple-700 leading-relaxed">
                  The photographer will review your uploaded screenshot in their bookings dashboard. Once approved, the photographer will customize your remaining milestone schedule ({formatINR(dealPrice - bookingFee)}), and your booking status will become active!
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/my-bookings"
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition text-center"
              >
                Track in My Bookings →
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition text-center"
              >
                Back to Explore Studios
              </Link>
            </div>
          </div>
        ) : (
          /* Single-Page Simple Booking Flow */
          <form onSubmit={handleSubmitBooking} className="space-y-6">
            {/* Studio Header Card */}
            <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={photographer.profile_photo}
                  alt={photographer.owner_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-200 shadow-xs"
                />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Book Wedding Studio
                  </span>
                  <h1 className="text-xl font-black text-gray-900 mt-1">
                    {photographer.shop_name}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Lead Photographer: <strong className="text-gray-800">{photographer.owner_name}</strong> · {photographer.location.area}, Pune
                  </p>
                </div>
              </div>
              <Link
                to={`/photographer/${photographer.id}`}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 underline shrink-0 hidden sm:block"
              >
                View Profile
              </Link>
            </div>

            {/* Section 1: Event Details & Package */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-xs space-y-5">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                1. Wedding Event Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Wedding Event Date
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Venue / Location in Pune
                  </label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. JW Marriott, Senapati Bapat Road, Pune"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {photographer.packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`block p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                        selectedPkgId === pkg.id
                          ? 'border-rose-600 bg-rose-50/50 shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="package"
                        checked={selectedPkgId === pkg.id}
                        onChange={() => setSelectedPkgId(pkg.id)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-gray-900 text-xs">{pkg.name}</span>
                        {selectedPkgId === pkg.id && (
                          <Check className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </div>
                      <p className="text-base font-black text-rose-600 mb-1">{formatINR(pkg.price)}</p>
                      <p className="text-[10px] text-gray-500 line-clamp-2">
                        {pkg.items.join(' · ')}
                      </p>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Non-Refundable Booking Fee Announcement Card */}
            <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 rounded-3xl p-6 sm:p-7 border-2 border-rose-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    Step 2 · Initial Token
                  </span>
                  <h2 className="text-lg font-black text-gray-900">
                    Booking Fee (Date Lock)
                  </h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Pay only the initial reservation token today to secure the photographer.
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {formatINR(bookingFee)}
                  </span>
                  <div className="text-[11px] font-black text-red-600 uppercase tracking-wider flex items-center sm:justify-end gap-1 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                    Strictly Non-Refundable
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/80 rounded-2xl border border-rose-100 text-xs text-gray-700 space-y-1.5 leading-relaxed">
                <p className="font-bold text-gray-900">
                  Why is this fee non-refundable?
                </p>
                <p className="text-gray-600">
                  This ₹5,000 non-refundable booking fee officially locks {photographer.shop_name}'s crew and date on their calendar, turning away any other inquiries for that wedding date.
                </p>
                <p className="text-gray-600 pt-1">
                  The remaining balance of <strong className="text-gray-900 font-extrabold">{formatINR(dealPrice - bookingFee)}</strong> will be scheduled into custom milestone phases directly by your photographer upon approving your booking.
                </p>
              </div>

              {/* Commitment Checkbox */}
              <label className="flex items-start gap-3 p-4 bg-rose-100/60 rounded-2xl border-2 border-rose-300 cursor-pointer hover:bg-rose-100/90 transition">
                <input
                  type="checkbox"
                  required
                  checked={commitmentChecked}
                  onChange={(e) => setCommitmentChecked(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-rose-600 rounded-md border-gray-300 focus:ring-rose-500 shrink-0"
                />
                <div className="text-xs">
                  <span className="font-extrabold text-gray-900 block">
                    Commitment Confirmation (Required)
                  </span>
                  <span className="text-gray-700 leading-normal block mt-0.5">
                    I confirm my commitment to book <strong>{photographer.shop_name}</strong> for my wedding date on <strong>{eventDate}</strong>. I understand and agree that this <strong>₹5,000 booking fee is strictly non-refundable</strong> under any circumstances.
                  </span>
                </div>
              </label>
            </div>

            {/* Section 3: Payment & Screenshot Upload */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-100 shadow-xs space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                  Step 3 · Pay & Upload Proof
                </span>
                <h2 className="text-base font-extrabold text-gray-900 mt-0.5">
                  Transfer ₹5,000 Booking Fee & Upload Screenshot
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Transfer via UPI to the photographer's direct account and upload the transaction screenshot below.
                </p>
              </div>

              {/* UPI Transfer Details Box */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 w-full sm:w-auto">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Photographer UPI ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-extrabold text-gray-900 bg-white px-3 py-1.5 rounded-lg border border-gray-300 select-all">
                      {upiId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
                      title="Copy UPI ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {copiedUpi && (
                      <span className="text-[11px] font-bold text-emerald-600">Copied!</span>
                    )}
                  </div>
                </div>

                <div className="text-center sm:text-right w-full sm:w-auto">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block">Amount to Transfer</span>
                  <span className="text-xl font-black text-rose-600">₹5,000</span>
                </div>
              </div>

              {/* Upload Screenshot Area */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Payment Screenshot (Required)
                </label>

                {screenshotUrl ? (
                  <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={screenshotUrl}
                        alt="Uploaded Screenshot"
                        className="w-16 h-16 rounded-xl object-cover border border-emerald-200 shadow-xs"
                      />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Screenshot Attached
                        </span>
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xs font-mono">
                          {screenshotName || 'payment_proof.png'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotUrl(null);
                        setScreenshotName('');
                      }}
                      className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-rose-400 transition bg-gray-50/40">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-700">
                      Upload your ₹5,000 payment screenshot
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1 mb-3">
                      PNG, JPG, or WEBP from GPay, PhonePe, Paytm, etc.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <label className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs transition">
                        <span>Browse File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={handleUseSampleReceipt}
                        className="px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs shadow-2xs transition"
                      >
                        ⚡ Use Sample Receipt (Demo)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Final Submit Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={!commitmentChecked || !screenshotUrl || isSubmitting}
                className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                  !commitmentChecked || !screenshotUrl || isSubmitting
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 shadow-rose-900/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting Booking Proof...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Submit Booking & Payment Proof (₹5,000)
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                <Lock className="w-3 h-3" />
                <span>Zero commission platform · Direct payment to verified studio</span>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
