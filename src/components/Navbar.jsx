import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { currentUser, login, logout, getCustomer, getPhotographer } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const user = currentUser?.type === 'customer'
    ? getCustomer(currentUser.id)
    : currentUser?.type === 'photographer'
    ? getPhotographer(currentUser.id)
    : null;

  const displayName = user?.name || user?.owner_name || (currentUser?.type === 'customer' ? 'Priya Mehta' : 'Rahul Sharma');
  const userSubtitle = currentUser?.type === 'customer' ? 'Customer' : 'Photographer';

  return (
    <>
      {/* Demo Switcher Utility Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white text-xs py-1.5 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-amber-400 text-rose-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">Live Demo</span>
            <span className="hidden sm:inline text-rose-100">3-Phase Payment & Delivery Protection for Wedding Photographers & Couples</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-rose-200">Switch View:</span>
            <button
              onClick={() => { login('customer', 'c1'); navigate('/dashboard'); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition ${currentUser?.type === 'customer' ? 'bg-white text-rose-900 font-bold shadow-sm' : 'bg-rose-900/60 hover:bg-rose-900 text-white'}`}
            >
              👤 Customer (Priya)
            </button>
            <button
              onClick={() => { login('photographer', 'p1'); navigate('/photographer-dashboard'); }}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition ${currentUser?.type === 'photographer' ? 'bg-white text-rose-900 font-bold shadow-sm' : 'bg-rose-900/60 hover:bg-rose-900 text-white'}`}
            >
              📷 Photographer (Rahul)
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white/95 backdrop-blur-md shadow-xs border-b border-rose-100 sticky top-7 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to={currentUser?.type === 'photographer' ? '/photographer-dashboard' : currentUser?.type === 'customer' ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 group"
          >
            <span className="text-2xl p-1.5 bg-rose-50 rounded-xl group-hover:scale-105 transition-transform">📸</span>
            <div>
              <span className="font-extrabold text-rose-600 text-xl tracking-tight">UpStart</span>
              <span className="hidden md:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Wedding Shield
              </span>
            </div>
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
                  Support & Protection
                </Link>
              </>
            ) : currentUser?.type === 'photographer' ? (
              <>
                <Link to="/photographer-dashboard" className={`hover:text-rose-600 transition ${location.pathname === '/photographer-dashboard' ? 'text-rose-600 font-bold' : ''}`}>
                  Photographer Dashboard
                </Link>
                <Link to="/pricing" className={`hover:text-rose-600 transition ${location.pathname === '/pricing' ? 'text-rose-600 font-bold' : ''}`}>
                  Founding Membership
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="hover:text-rose-600 transition">
                  Browse Photographers
                </Link>
                <Link to="/pricing" className="hover:text-rose-600 transition">
                  For Photographers (₹99/mo)
                </Link>
                <Link to="/support" className="hover:text-rose-600 transition">
                  Payment Protection
                </Link>
              </>
            )}
          </div>

          {/* Right Action Profile / Auth */}
          <div className="flex items-center gap-3">
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
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>🔍</span> Browse Studios
                        </Link>
                        <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>📅</span> My Bookings & Delivery
                        </Link>
                        <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>👤</span> My Profile
                        </Link>
                        <Link to="/support" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>🛡️</span> Help & Cancellation Policy
                        </Link>
                      </>
                    )}

                    {currentUser.type === 'photographer' && (
                      <>
                        <Link to="/photographer-dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>📊</span> Active Shoots & Revenue
                        </Link>
                        <Link to={`/photographer/${currentUser.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>👁️</span> View My Public Profile
                        </Link>
                        <Link to="/pricing" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">
                          <span>⭐</span> Founding Plan (₹99/mo)
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                      >
                        <span>🚪</span> Sign Out
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
      </nav>
    </>
  );
}
