import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';
import { Award, Check, CheckCircle, Shield, Sparkles } from 'lucide-react';

export default function PricingPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'
  const [subscribedPlan, setSubscribedPlan] = useState(null);

  const handleSubscribe = (plan) => {
    setSubscribedPlan(plan);
    setTimeout(() => {
      login('photographer', 'p1');
      navigate('/photographer-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-12 w-full flex-1">
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-8">
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

          {/* Billing Cycle Switcher */}
          <div className="mt-8 inline-flex items-center p-1.5 bg-white rounded-2xl border border-rose-200 shadow-xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly Billing (₹99/mo)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Yearly Plan (₹999/yr)</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                billingCycle === 'yearly' ? 'bg-amber-300 text-amber-950' : 'bg-emerald-100 text-emerald-800'
              }`}>
                Save 16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1: Monthly Founding Plan */}
          <div
            className={`bg-white rounded-3xl p-8 border-2 transition flex flex-col justify-between relative ${
              billingCycle === 'monthly'
                ? 'border-rose-500 shadow-xl ring-2 ring-rose-200'
                : 'border-gray-200 shadow-sm opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider">
                  Flexible Monthly
                </span>
              </div>

              <h3 className="text-2xl font-black text-gray-900">Monthly Plan</h3>
              <p className="text-xs text-gray-500 mt-1">Ideal for testing the waters and active wedding seasons</p>

              <div className="mt-6 flex items-baseline gap-2 pb-6 border-b border-gray-100">
                <span className="text-5xl font-black text-gray-900">₹99</span>
                <span className="text-gray-500 font-bold text-sm">/ month</span>
                <span className="text-xs text-gray-400 line-through ml-2">₹299/mo</span>
              </div>

              {/* Value Props */}
              <div className="space-y-3 pt-6 text-xs text-gray-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>0% Commission:</strong> Keep 100% of all client fees.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Custom Milestone Phases:</strong> Set custom dates, amounts & count.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Watermarked 10 Preview Gallery:</strong> Full delivery protection.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Digital Service Agreements:</strong> Binding non-refundable terms.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Direct Bank Settlement:</strong> Straight via gateway.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              {subscribedPlan === 'monthly' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 animate-in zoom-in-95">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Monthly Activated! Redirecting...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-black text-sm rounded-2xl shadow-md transition cursor-pointer"
                >
                  Start Monthly (₹99/mo) →
                </button>
              )}
            </div>
          </div>

          {/* Plan 2: Yearly Founding Plan at ₹999 */}
          <div
            className={`bg-white rounded-3xl p-8 border-2 transition flex flex-col justify-between relative overflow-hidden ${
              billingCycle === 'yearly'
                ? 'border-amber-400 shadow-2xl ring-2 ring-amber-300'
                : 'border-gray-200 shadow-sm'
            }`}
          >
            {/* Top Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-amber-950 font-black text-[11px] px-4 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" /> Best Value · Annual Studio Pass
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" /> Annual Studio Pass
                </span>
              </div>

              <h3 className="text-2xl font-black text-gray-900">Yearly Plan</h3>
              <p className="text-xs text-gray-500 mt-1">Full 12-month coverage for full-time wedding photographers</p>

              <div className="mt-6 flex items-baseline gap-2 pb-6 border-b border-gray-100">
                <span className="text-5xl font-black text-rose-600">₹999</span>
                <span className="text-gray-500 font-bold text-sm">/ year</span>
                <span className="text-xs text-gray-400 line-through ml-2">₹1,188/yr</span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Effective ~₹83/mo · Save ₹189 instantly vs monthly</span>
              </div>

              {/* Value Props */}
              <div className="space-y-3 pt-6 text-xs text-gray-700">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 font-bold" />
                  <span><strong>Everything in Monthly, plus:</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Verified Founding Studio Gold Badge</strong> on search profile.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Priority Search Placement:</strong> Featured top in Pune region.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Unlimited Active Wedding Shoots:</strong> Zero cap on client deals.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Overdue Payment Automation:</strong> Instant Action Required flags.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Rate Locked for Life:</strong> Renews at ₹999/yr forever.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              {subscribedPlan === 'yearly' ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 animate-in zoom-in-95">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Annual Subscription Activated! Redirecting...</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubscribe('yearly')}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 hover:from-rose-700 hover:to-amber-800 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-900/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Start Yearly Plan (₹999/yr) →</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Business Model Clarification Note */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-600" /> How Payments & Settlements Work
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-1">Direct Settlement to Your Bank</h4>
              <p>
                PaySnap integrates with authorized payment gateways (Razorpay / Cashfree route). When a couple pays a milestone, it settles directly into your designated bank account. PaySnap never holds your money in its own accounts.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <h4 className="font-bold text-gray-900 mb-1">Zero Commission Policy</h4>
              <p>
                Unlike traditional marketplaces that take 15% to 25% of your wedding fee, PaySnap is a pure software utility. You pay ₹99/month or ₹999/year, and every single rupee of your shoot package stays yours.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 space-y-3">
          <h3 className="text-base font-bold text-gray-900">Photographer Subscription FAQs</h3>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">What is the difference between Monthly and Yearly plans?</h4>
            <p className="text-gray-600">
              The Monthly plan is ₹99/month. The Yearly plan is ₹999/year (~₹83/mo effective), locking in your founding price for a full 12 months with priority Pune search listing and savings of ₹189.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">Do couples pay anything to use PaySnap?</h4>
            <p className="text-gray-600">
              No. Couples use the platform completely free of charge. They simply pay your agreed package price in the clear milestone phases you set.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">Can I customize milestone amounts, dates, and number of phases?</h4>
            <p className="text-gray-600">
              Yes! You have 100% control to customize the number of milestone phases (e.g. 2, 3, 4, or 5 phases), the specific due dates, and the exact amount for every phase directly from your studio dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">How does the Action Required alert work for overdue payments?</h4>
            <p className="text-gray-600">
              If a customer passes their milestone payment due date without completing payment or submitting proof, an immediate <strong>"Action Required: Overdue"</strong> badge highlights that client on your dashboard, so you never lose track of unpaid shoots.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
