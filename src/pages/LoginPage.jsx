import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useApp();

  const initialRole = searchParams.get('tab') === 'photographer' ? 'photographer' : 'customer';
  const [role, setRole] = useState(initialRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('tab') === 'photographer') {
      setRole('photographer');
    }
  }, [searchParams]);

  // Customer state
  const [customerForm, setCustomerForm] = useState({
    name: 'Priya Mehta',
    emailOrPhone: 'priya.mehta@email.com',
    password: 'password123',
  });

  // Photographer state
  const [photoForm, setPhotoForm] = useState({
    shopName: 'Captured Moments Studio',
    ownerName: 'Rahul Sharma',
    mapsLink: 'https://maps.google.com/?q=Koregaon+Park,Pune',
    avgPrice: '25000',
    phone: '9876543210',
    email: 'rahul@capturedmoments.in',
    password: 'password123',
  });

  const handleCustomerSubmit = (e) => {
    e.preventDefault();
    login('customer', 'c1');
    navigate('/dashboard');
  };

  const handlePhotographerSubmit = (e) => {
    e.preventDefault();
    login('photographer', 'p1');
    navigate('/photographer-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-rose-100 p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-3xl">📸</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-2">Welcome to UpStart</h1>
            <p className="text-sm text-gray-500 mt-1">
              Select your role to access your personalized portal
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[#fdf8f3] rounded-2xl border border-rose-100 mb-6">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                role === 'customer'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>👤</span> Customer / Bride & Groom
            </button>
            <button
              type="button"
              onClick={() => setRole('photographer')}
              className={`py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2 ${
                role === 'photographer'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>📷</span> Studio / Photographer
            </button>
          </div>

          {/* Sign In vs Sign Up Toggle */}
          <div className="flex justify-center items-center gap-6 text-sm mb-6 pb-4 border-b border-gray-100 font-semibold">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                !isSignUp
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                isSignUp
                  ? 'border-rose-600 text-rose-600 font-bold'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Customer Form */}
          {role === 'customer' && (
            <form onSubmit={handleCustomerSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    placeholder="e.g. Priya Mehta"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email or Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={customerForm.emailOrPhone}
                  onChange={(e) => setCustomerForm({ ...customerForm, emailOrPhone: e.target.value })}
                  placeholder="priya.mehta@email.com or 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setForgotPasswordOpen(true)}
                      className="text-xs text-rose-600 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={customerForm.password}
                  onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
              >
                {isSignUp ? 'Create Customer Account & Explore' : 'Sign In as Customer'}
              </button>
            </form>
          )}

          {/* Photographer Form */}
          {role === 'photographer' && (
            <form onSubmit={handlePhotographerSubmit} className="space-y-4">
              {isSignUp ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Shop Name
                      </label>
                      <input
                        type="text"
                        required
                        value={photoForm.shopName}
                        onChange={(e) => setPhotoForm({ ...photoForm, shopName: e.target.value })}
                        placeholder="Captured Moments"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        required
                        value={photoForm.ownerName}
                        onChange={(e) => setPhotoForm({ ...photoForm, ownerName: e.target.value })}
                        placeholder="Rahul Sharma"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Google Maps Link (Pune Location)
                    </label>
                    <input
                      type="url"
                      required
                      value={photoForm.mapsLink}
                      onChange={(e) => setPhotoForm({ ...photoForm, mapsLink: e.target.value })}
                      placeholder="https://maps.google.com/?q=Koregaon+Park,Pune"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Avg Price / Day (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={photoForm.avgPrice}
                        onChange={(e) => setPhotoForm({ ...photoForm, avgPrice: e.target.value })}
                        placeholder="25000"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={photoForm.phone}
                        onChange={(e) => setPhotoForm({ ...photoForm, phone: e.target.value })}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={photoForm.email}
                      onChange={(e) => setPhotoForm({ ...photoForm, email: e.target.value })}
                      placeholder="rahul@capturedmoments.in"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={photoForm.password}
                      onChange={(e) => setPhotoForm({ ...photoForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Photographer Email or Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={photoForm.email}
                      onChange={(e) => setPhotoForm({ ...photoForm, email: e.target.value })}
                      placeholder="rahul@capturedmoments.in"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setForgotPasswordOpen(true)}
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      value={photoForm.password}
                      onChange={(e) => setPhotoForm({ ...photoForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
              >
                {isSignUp ? 'Register Studio Profile & Start' : 'Sign In to Studio Dashboard'}
              </button>
            </form>
          )}

          {/* Quick Demo Shortcuts Card */}
          <div className="mt-8 pt-6 border-t border-gray-100 bg-[#fdf8f3] -mx-6 -mb-6 p-6 rounded-b-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800 text-center mb-3">
              ⚡ 1-Click Demo Evaluation Sign In
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { login('customer', 'c1'); navigate('/dashboard'); }}
                className="py-2.5 px-3 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-xs font-bold text-gray-800 shadow-2xs text-left cursor-pointer transition hover:bg-rose-50/50"
              >
                <div className="flex items-center gap-1.5 text-rose-600 font-extrabold">
                  <span>👤</span> Customer
                </div>
                <div className="text-[11px] text-gray-500 font-normal truncate">Priya Mehta (Active Bookings)</div>
              </button>

              <button
                type="button"
                onClick={() => { login('photographer', 'p1'); navigate('/photographer-dashboard'); }}
                className="py-2.5 px-3 rounded-xl bg-white border border-rose-200 hover:border-rose-400 text-xs font-bold text-gray-800 shadow-2xs text-left cursor-pointer transition hover:bg-rose-50/50"
              >
                <div className="flex items-center gap-1.5 text-amber-700 font-extrabold">
                  <span>📷</span> Photographer
                </div>
                <div className="text-[11px] text-gray-500 font-normal truncate">Rahul (Captured Moments)</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Reset Password</h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter your registered email address to receive password reset instructions.
            </p>

            {forgotSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs mb-4">
                ✓ Reset link has been dispatched to your email (simulated for demo).
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500"
                />
                <button
                  type="button"
                  onClick={() => setForgotSuccess(true)}
                  className="w-full py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 cursor-pointer"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => { setForgotPasswordOpen(false); setForgotSuccess(false); }}
              className="w-full py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
