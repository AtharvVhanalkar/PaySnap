import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function PricingPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => {
      login('photographer', 'p1');
      navigate('/photographer-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black uppercase tracking-wider">
            Photographer Subscription
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mt-3 leading-tight">
            Stop chasing payments. <br />
            <span className="text-rose-600">Protect every wedding shoot.</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-4 leading-relaxed">
            Zero commission on bookings. Payments settle directly into your bank account. Keep 100% of your agreed shoot price.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border-2 border-amber-400 shadow-xl relative overflow-hidden">
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-amber-950 font-black text-[11px] px-4 py-1 rounded-bl-2xl uppercase tracking-wider">
            🏅 Founding Member Rate
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-gray-900">Founding Studio Plan</h3>
            <p className="text-xs text-gray-500 mt-0.5">Exclusive early-access rate for wedding photographers</p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900">₹99</span>
              <span className="text-gray-500 font-bold text-sm">/ month</span>
              <span className="text-xs text-gray-400 line-through ml-2">₹299/mo regular</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              ✓ Price locked for life for founding members
            </p>
          </div>

          {/* Value Props List */}
          <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-gray-700">
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span><strong>0% Commission:</strong> Keep 100% of all client bookings.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span><strong>Direct Settlement:</strong> Money goes straight to your gateway account.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span><strong>3-Phase Milestone Shield:</strong> Advance, Pre-event & Delivery milestones.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span><strong>Watermarked 10 Preview Photos:</strong> Show quality without giving away full gallery.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span><strong>Digital Agreements:</strong> Enforce ₹5,000 non-refundable booking fee terms.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-500 font-bold text-base">✓</span>
              <span><strong>Founding Member Badge:</strong> Prominent badge on your public studio profile.</span>
            </div>
          </div>

          {/* Action */}
          <div className="mt-8">
            {subscribed ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 animate-in zoom-in-95">
                🎉 Subscription Activated! Redirecting to dashboard...
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubscribe}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-900/20 transition cursor-pointer"
              >
                Start Founding Membership (₹99/mo) →
              </button>
            )}
            <p className="text-[11px] text-gray-400 text-center mt-2.5">
              *Demo mock: No credit card required. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Business Model Clarification Note */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>🛡️</span> How Payments & Settlements Work
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-1">Direct Settlement to Your Bank</h4>
              <p>
                UpStart integrates with authorized payment gateways (Razorpay / Cashfree route). When a couple pays a milestone, it settles directly into your designated bank account. UpStart never holds your money in its own accounts.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-1">Zero Commission Policy</h4>
              <p>
                Unlike traditional marketplaces that take 15% to 25% of your wedding fee, UpStart is a pure software utility. You pay ₹99/month, and every single rupee of your ₹40,000 or ₹80,000 package stays yours.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-3">
          <h3 className="text-base font-bold text-gray-900">Photographer Subscription FAQs</h3>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">Do couples pay anything to use UpStart?</h4>
            <p className="text-gray-600">
              No. Couples use the platform completely free of charge. They simply pay your agreed package price in the 3 clear milestone phases.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">Can I customize milestone amounts and dates?</h4>
            <p className="text-gray-600">
              Yes! While the default is 30% advance, 40% pre-event, and 30% final delivery, you can edit the milestone titles, due dates, and amounts anytime from your customer management portal.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">How does the 10 preview photo watermark work?</h4>
            <p className="text-gray-600">
              When you upload the shoot, you pick 10 sample photos. UpStart renders a semi-transparent, centered watermark with your studio name and disables right-click/downloads. The client inspects quality and releases final payment with peace of mind.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
