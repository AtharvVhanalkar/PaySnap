import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { faqs } from '../data/mockData';

export default function CustomerSupport() {
  const [openFaq, setOpenFaq] = useState(0);

  // Contact form state
  const [name, setName] = useState('Priya Mehta');
  const [email, setEmail] = useState('priya.mehta@email.com');
  const [category, setCategory] = useState('Payment Phase Query');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Help & Protection Center</span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Customer Support & Dispute Shield
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Every booking is backed by locked agreements, clear milestones, and dedicated resolution.
          </p>
        </div>

        {/* 3 Pillar Guarantee Cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-2xs">
            <span className="text-2xl block mb-2">🔒</span>
            <h3 className="font-bold text-sm text-gray-900">Locked Price Shield</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Agreed shoot fees cannot be changed without mutual consent on the platform.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-2xs">
            <span className="text-2xl block mb-2">📸</span>
            <h3 className="font-bold text-sm text-gray-900">Photo Preview Quality</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Inspect 10 sample watermarked previews before authorizing the final phase payment.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-2xs">
            <span className="text-2xl block mb-2">🛡️</span>
            <h3 className="font-bold text-sm text-gray-900">Transparent Refunds</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Non-refundable fee fixed at ₹5,000. All additional advance payments returned if cancelled.
            </p>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-bold text-sm text-gray-800 hover:text-rose-600 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-rose-600 font-extrabold text-base ml-2">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-[#fdf8f3]/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support & Dispute Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="mb-6">
            <h2 className="text-lg font-black text-gray-900">Contact Resolution Support</h2>
            <p className="text-xs text-gray-500 mt-1">
              Need assistance with a booking, payment dispute, or photographer delivery? Our team responds within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-extrabold text-gray-900">Inquiry Submitted!</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you, {name}. A support ticket #TK-{Math.floor(100000 + Math.random() * 900000)} has been opened. We will notify you at {email}.
              </p>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setDescription(''); }}
                className="mt-2 px-4 py-2 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold hover:bg-emerald-100 cursor-pointer"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Issue Topic / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium bg-white focus:outline-hidden focus:border-rose-500"
                >
                  <option value="Payment Phase Query">Payment Phase or Milestone Query</option>
                  <option value="Refund Request">Cancellation & Refund Status</option>
                  <option value="Photo Delivery Delay">Photo Delivery & Previews Assistance</option>
                  <option value="Dispute Problem">Report a Problem / Dispute</option>
                  <option value="Other">Other Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Describe Your Issue or Dispute
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please include booking details and any specific questions..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-900/20 cursor-pointer"
                >
                  Submit Support Request →
                </button>
              </div>
            </form>
          )}

          {/* Quick Contacts */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
            <div>
              📞 Support Helpline: <strong className="text-gray-800">1800-419-7878 (Toll Free, Pune)</strong>
            </div>
            <div>
              ✉️ Email Support: <strong className="text-gray-800">protection@upstart.in</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
