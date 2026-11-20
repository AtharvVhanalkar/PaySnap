import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { Check } from 'lucide-react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useApp();

  const isStudio = searchParams.get('tab') === 'photographer';
  const [isSignUp, setIsSignUp] = useState(isStudio);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    if (isStudio) {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [isStudio]);

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
          <div className="text-center mb-6 flex flex-col items-center">
            <Logo size="lg" showBadge={false} className="mb-2" />
            <h1 className="text-2xl font-extrabold text-gray-900 mt-2">
              {isStudio
                ? isSignUp
                  ? 'Join as Studio'
                  : 'Studio Sign In'
                : isSignUp
                ? 'Create Client Account'
                : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm">
              {isStudio
                ? isSignUp
                  ? 'Register your studio profile and start accepting 3-phase protected wedding shoots'
                  : 'Sign in to manage your active shoots, milestones and gateway settlements'
                : isSignUp
                ? 'Create an account to book verified Pune photographers with guaranteed deliverables'
                : 'Sign in to access your wedding bookings, demo previews and milestones'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex justify-center items-center gap-6 text-sm mb-6 pb-4 border-b border-gray-100 font-semibold">
            {isStudio ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className={`pb-1 border-b-2 transition cursor-pointer ${
                    isSignUp
                      ? 'border-rose-600 text-rose-600 font-bold'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Join as Studio
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className={`pb-1 border-b-2 transition cursor-pointer ${
                    !isSignUp
                      ? 'border-rose-600 text-rose-600 font-bold'
                      : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
                >
                  Studio Sign In
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>

          {/* Studio Forms */}
          {isStudio ? (
            <form onSubmit={handlePhotographerSubmit} className="space-y-4">
              {isSignUp ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Shop / Studio Name
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
                      Studio Email or Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={photoForm.email}
                      onChange={(e) => setPhotoForm({ ...photoForm, email: e.target.value })}
                      placeholder="rahul@capturedmoments.in or 9876543210"
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
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
              >
                {isSignUp ? 'Register Studio Profile & Start' : 'Sign In to Studio Dashboard'}
              </button>

              <div className="text-center pt-3 border-t border-gray-100">
                <Link
                  to="/login"
                  className="text-xs text-gray-500 hover:text-rose-600 font-medium"
                >
                  Looking for wedding photography? <strong className="text-rose-600">Client Sign In →</strong>
                </Link>
              </div>
            </form>
          ) : (
            /* Customer Form */
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
                className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
              >
                {isSignUp ? 'Create Customer Account & Explore' : 'Sign In as Client'}
              </button>

              <div className="text-center pt-3 border-t border-gray-100">
                <Link
                  to="/login?tab=photographer"
                  className="text-xs text-gray-500 hover:text-rose-600 font-medium"
                >
                  Are you a professional photographer? <strong className="text-rose-600">Join as Studio →</strong>
                </Link>
              </div>
            </form>
          )}
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
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Reset link has been dispatched to your email.</span>
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
