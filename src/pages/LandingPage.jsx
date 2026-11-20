import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { Sparkles, AlertTriangle, X, Shield, Check } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdf8f3] text-gray-800 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-950 via-rose-900 to-rose-950 text-white">
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600"
            alt="Indian Wedding Celebration"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span>Safe, Agreed & Transparent Wedding Deals in Pune</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight sm:leading-tight">
            Your wedding memories, protected. <br className="hidden sm:inline" />
            <span className="text-amber-300">Your payments, guaranteed.</span>
          </h1>
          <p className="mt-6 text-base sm:text-xl text-rose-100 max-w-2xl font-normal leading-relaxed">
            Protecting wedding photographers from uncollected dues, while giving couples complete trust with agreed pricing, 3-phase milestones, and preview verification before final delivery.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-white shadow-lg shadow-rose-900/30 transition transform hover:-translate-y-0.5 text-center"
            >
              Find a Photographer in Pune →
            </Link>
          </div>
        </div>
      </section>

      {/* The Real Problem & Solution Context */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-rose-600 font-bold mb-2">The Challenge in Wedding Photography</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Why both photographers & couples need clarity
          </p>
          <p className="text-sm sm:text-base text-gray-600 mt-3">
            In informal arrangements, fixed prices like ₹40,000 often get squeezed down to ₹25,000 after the shoot, or deliverables stall with no clear milestone tracking.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-red-100 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">The Common Pitfalls</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Last-minute discount demands before final album hand-over.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Informal UPI/cash with no binding digital scope or locked price.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Photographers chasing clients for months after the event.</span>
              </li>
              <li className="flex items-start gap-2">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Clients uncertain if their photo count and quality will be honoured.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">The PaySnap Solution</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Agreed Locked Deal:</strong> Price cannot be arbitrarily discounted later.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Structured 3 Phases:</strong> Advance, Pre-Event, and Final Delivery milestones.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>10 Demo Previews:</strong> Customer verifies photo quality with watermarked samples.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Total Transparency:</strong> Live photo count uploaded, unlocked upon final phase.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3-Phase Milestone Explainer */}
      <section className="bg-white py-16 border-y border-rose-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
              Protected Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3">
              How the 3-Phase Protection Works
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Fair and balanced for both sides — neither party is left exposed.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fdf8f3] border border-rose-100 relative">
              <div className="text-xs font-bold text-rose-600 mb-2 uppercase tracking-wide">Phase 1 · 30%</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Advance Booking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Locks the photographer's calendar for your wedding date. Backed by a clear Digital Agreement with non-refundable booking terms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdf8f3] border border-rose-100 relative">
              <div className="text-xs font-bold text-rose-600 mb-2 uppercase tracking-wide">Phase 2 · 40%</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pre-Event Assurance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Paid a few days before the shoot so the photography team can book gear, travel, and schedule camera operators with full confidence.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdf8f3] border border-rose-100 relative">
              <div className="text-xs font-bold text-rose-600 mb-2 uppercase tracking-wide">Phase 3 · 30%</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Final Photo Delivery</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Photographer uploads all event photos. You inspect 10 watermarked demo photos. Once satisfied, release the final balance to unlock full high-res downloads!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-rose-100 bg-white py-8 text-center text-xs text-gray-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" showBadge={false} />
            <span>— Pune, Maharashtra</span>
          </div>
          <div className="flex gap-4">
            <Link to="/support" className="hover:text-rose-600">Cancellation Policy</Link>
            <Link to="/pricing" className="hover:text-rose-600">Photographer Pricing</Link>
            <Link to="/support" className="hover:text-rose-600">Help & FAQs</Link>
          </div>
          <p>© 2026 PaySnap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
