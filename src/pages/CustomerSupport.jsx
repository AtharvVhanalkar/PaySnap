import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { faqs } from '../data/mockData';
import { Lock, Camera, Shield, Check, Phone, Mail, HelpCircle, Code, Send, MessageSquare, AlertCircle } from 'lucide-react';

export default function CustomerSupport() {
  const [openFaq, setOpenFaq] = useState(0);

  // Developer Feedback & Issue Form state
  const [name, setName] = useState('Priya Mehta');
  const [email, setEmail] = useState('priya.mehta@email.com');
  const [category, setCategory] = useState('Bug / Technical Issue');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    const generatedTicket = 'DEV-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedTicket);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Developer Support & FAQ Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900">
            Help Center & Developer Resolution
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Have a question, feedback, or facing an issue? Send it straight to our engineering team or explore frequently asked questions below.
          </p>
        </div>

        {/* 3 Pillar Guarantee Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-2xs">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Locked Price Shield</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Agreed shoot fees cannot be changed without mutual consent on the platform.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-2xs">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-3">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Photo Preview Quality</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Inspect 10 sample watermarked previews before authorizing the final phase payment.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-2xs">
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-900">Transparent Refunds</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Non-refundable fee fixed at ₹5,000. All additional advance payments returned if cancelled.
            </p>
          </div>
        </div>

        {/* Two-Section Layout: Help & Developer Feedback Form NEXT TO FAQs Section */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* SECTION 1: Help & Send Feedback/Issue to Developer Team */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Code className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-gray-900">
                    Send Feedback or Issue to Developer Team
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Click and submit your technical issue, bug report, or feature feedback directly to our developers.
                  </p>
                </div>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Feedback Sent to Developer Team!
                </h3>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>! Your ticket <strong className="font-mono text-emerald-800">#{ticketId}</strong> has been logged in our engineering sprint tracker. A developer will review and email you at <strong>{email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-2 px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer shadow-2xs"
                >
                  Send another message to developers
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Feedback / Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold bg-white focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="Bug / Technical Issue">Technical Glitch / Bug Report</option>
                    <option value="Payment / Gateway Issue">Payment Gateway or Proof Issue</option>
                    <option value="Feature Suggestion">Feature Request / Suggestion</option>
                    <option value="Phase Customization Query">Milestone Phase Customization</option>
                    <option value="General Feedback">General Feedback for Developer Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Detailed Message / Bug Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe what happened, error details, or your feedback for our engineering team..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-rose-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">
                    Direct channel to PaySnap Core Developers
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-900/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send to Developer Team
                  </button>
                </div>
              </form>
            )}

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-600" />
                <span>Helpline: <strong className="text-gray-800">1800-419-7878</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-600" />
                <span>Devs: <strong className="text-gray-800">developers@paysnap.in</strong></span>
              </div>
            </div>
          </div>

          {/* SECTION 2: FAQ Section Inside Different Section Next to Help */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-lg font-black text-gray-900">
                    Frequently Asked Questions ({faqs.length} Answers)
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Clear answers to questions regarding payments, customized phases, and policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-2xl overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full text-left p-3.5 flex items-center justify-between font-bold text-xs sm:text-sm text-gray-800 hover:text-rose-600 cursor-pointer"
                  >
                    <span className="pr-2">{faq.q}</span>
                    <span className="text-rose-600 font-extrabold text-base shrink-0">
                      {openFaq === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-[#fdf8f3]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
