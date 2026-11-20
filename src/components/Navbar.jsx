import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Calendar, User, Shield, BarChart3, Eye, Star, LogOut, HelpCircle, Send, Check, X, Code } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const { currentUser, logout, getCustomer, getPhotographer } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Help & Developer Feedback Modal state
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [devFeedbackForm, setDevFeedbackForm] = useState({
    name: currentUser?.type === 'customer' ? 'Priya Mehta' : 'Rahul Sharma',
    email: currentUser?.type === 'customer' ? 'priya.mehta@email.com' : 'rahul@capturedmoments.in',
    category: 'Bug / Technical Issue',
    message: '',
  });
  const [devFeedbackSuccess, setDevFeedbackSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const handleSendDevFeedback = (e) => {
    e.preventDefault();
    const generated = 'DEV-' + Math.floor(100000 + Math.random() * 900000);
    setTicketNumber(generated);
    setDevFeedbackSuccess(true);
  };

  const user = currentUser?.type === 'customer'
    ? getCustomer(currentUser.id)
    : currentUser?.type === 'photographer'
    ? getPhotographer(currentUser.id)
    : null;

  const displayName = user?.name || user?.owner_name || (currentUser?.type === 'customer' ? 'Priya Mehta' : 'Rahul Sharma');
  const userSubtitle = currentUser?.type === 'customer' ? 'Customer' : 'Photographer';

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-xs border-b border-rose-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to={currentUser?.type === 'photographer' ? '/photographer-dashboard' : currentUser?.type === 'customer' ? '/dashboard' : '/'}
          className="group flex items-center"
        >
          <Logo size="md" />
        </Link>

        {/* Center Links for Customer / Guest */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          {currentUser?.type === 'customer' ? (
            <>
              <Link to="/dashboard" className={`hover:text-rose-600 transition ${location.pathname === '/dashboard' ? 'text-rose-600 font-bold' : ''}`}>
                Explore Studios
              </Link>
              <Link to="/my-bookings" className={`hover:text-rose-600 transition ${location.pathname.startsWith('/my-bookings') || location.pathname.startsWith('/booking/') ? 'text-rose-600 font-bold' : ''}`}>
                My Bookings
              </Link>
              <Link to="/support" className={`hover:text-rose-600 transition ${location.pathname === '/support' ? 'text-rose-600 font-bold' : ''}`}>
                Help & FAQs
              </Link>
            </>
          ) : currentUser?.type === 'photographer' ? (
            <>
              <Link to="/photographer-dashboard" className={`hover:text-rose-600 transition ${location.pathname === '/photographer-dashboard' ? 'text-rose-600 font-bold' : ''}`}>
                Photographer Dashboard
              </Link>
              <Link to="/pricing" className={`hover:text-rose-600 transition ${location.pathname === '/pricing' ? 'text-rose-600 font-bold' : ''}`}>
                Founding Membership (₹999/yr)
              </Link>
              <Link to="/support" className={`hover:text-rose-600 transition ${location.pathname === '/support' ? 'text-rose-600 font-bold' : ''}`}>
                Help & FAQs
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-rose-600 transition">
                Browse Photographers
              </Link>
              <Link to="/pricing" className="hover:text-rose-600 transition">
                Pricing (₹999/yr)
              </Link>
              <Link to="/support" className="hover:text-rose-600 transition">
                Help & FAQs
              </Link>
            </>
          )}
        </div>

        {/* Right Action: Help Button & Profile / Auth */}
        <div className="flex items-center gap-3">
          {/* Help button that triggers Send Feedback/Issue to Developer Team */}
          <button
            type="button"
            onClick={() => {
              setDevFeedbackSuccess(false);
              setHelpModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition cursor-pointer shadow-2xs"
            title="Need help? Click to send feedback or report issue to our developer team"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-gray-200 hover:border-rose-300 hover:bg-rose-50/50 transition cursor-pointer"
              >
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-gray-800 leading-tight">{displayName}</p>
                  <p className="text-[10px] text-rose-600 font-semibold uppercase tracking-wider">{userSubtitle}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {displayName.charAt(0)}
                </div>
                <span className="text-gray-400 text-xs pr-1">▾</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{displayName}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700">
                      {currentUser.type === 'customer' ? 'Wedding Client' : 'Studio Owner'}
                    </span>
                  </div>

                  {currentUser.type === 'customer' && (
                    <>
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <Search className="w-4 h-4 text-gray-500" /> Browse Studios
                      </Link>
                      <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <Calendar className="w-4 h-4 text-gray-500" /> My Bookings & Delivery
                      </Link>
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <User className="w-4 h-4 text-gray-500" /> My Profile
                      </Link>
                      <Link to="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <Shield className="w-4 h-4 text-gray-500" /> Help & Dispute Center
                      </Link>
                    </>
                  )}

                  {currentUser.type === 'photographer' && (
                    <>
                      <Link to="/photographer-dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <BarChart3 className="w-4 h-4 text-gray-500" /> Active Shoots & Revenue
                      </Link>
                      <Link to={`/photographer/${currentUser.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <Eye className="w-4 h-4 text-gray-500" /> View My Public Profile
                      </Link>
                      <Link to="/pricing" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <Star className="w-4 h-4 text-gray-500" /> Founding Plan (₹999/yr)
                      </Link>
                      <Link to="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                        <HelpCircle className="w-4 h-4 text-gray-500" /> Help & Developer Feedback
                      </Link>
                    </>
                  )}

                  <div className="border-t border-gray-100 my-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-700 hover:text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/login?tab=photographer"
                className="text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl shadow-xs transition"
              >
                Join as Studio
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Help & Developer Team Feedback Modal */}
      {helpModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                  <Code className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Send Feedback or Issue to Developer Team
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct line to PaySnap engineering for bug fixes and feedback.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {devFeedbackSuccess ? (
              <div className="p-6 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-gray-900">
                  Message Delivered to Developer Team!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your ticket <strong className="font-mono text-emerald-800">#{ticketNumber}</strong> has been forwarded directly to our engineering desk. A developer will investigate and follow up with you.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setHelpModalOpen(false)}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Done
                  </button>
                  <Link
                    to="/support"
                    onClick={() => setHelpModalOpen(false)}
                    className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-50"
                  >
                    View FAQs
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendDevFeedback} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={devFeedbackForm.name}
                      onChange={(e) => setDevFeedbackForm({ ...devFeedbackForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={devFeedbackForm.email}
                      onChange={(e) => setDevFeedbackForm({ ...devFeedbackForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={devFeedbackForm.category}
                    onChange={(e) => setDevFeedbackForm({ ...devFeedbackForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold bg-white focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="Bug / Technical Issue">Bug / Technical Glitch</option>
                    <option value="Payment / Gateway Issue">Payment & Escrow Milestone Issue</option>
                    <option value="Feature Suggestion">Feature Suggestion for Developers</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Issue Description / Developer Feedback
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={devFeedbackForm.message}
                    onChange={(e) => setDevFeedbackForm({ ...devFeedbackForm, message: e.target.value })}
                    placeholder="Describe the issue, what happened, or your thoughts for the developer team..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:outline-hidden focus:border-rose-500"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setHelpModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-900/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Send to Developer Team
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
