import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';
import { Check, Shield, Sparkles, Phone, Mail, Lock, Key, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useApp();

  const isStudioParam = searchParams.get('tab') === 'photographer';
  const [isStudio, setIsStudio] = useState(isStudioParam);

  // Client mode: 'signin' | 'create'
  const [clientMode, setClientMode] = useState('signin');

  // Studio mode: 'signin' | 'create' (default to 'signin' per user requirement)
  const [studioMode, setStudioMode] = useState('signin');

  useEffect(() => {
    setIsStudio(searchParams.get('tab') === 'photographer');
    // Ensure studio defaults to signin as requested
    setStudioMode('signin');
  }, [searchParams]);

  // Client Sign In form state
  const [clientSignInForm, setClientSignInForm] = useState({
    emailOrPhone: 'priya.mehta@email.com',
    password: 'password123',
  });

  // Client Create Account form state (Full name, phone or email, OTP)
  const [clientCreateForm, setClientCreateForm] = useState({
    fullName: '',
    phoneOrEmail: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState('');

  // Photographer state
  const [photoSignInForm, setPhotoSignInForm] = useState({
    emailOrPhone: 'rahul@capturedmoments.in',
    password: 'password123',
  });

  const [photoCreateForm, setPhotoCreateForm] = useState({
    shopName: '',
    ownerName: '',
    mapsLink: '',
    avgPrice: '',
    phone: '',
    email: '',
    password: '',
  });

  // Forgot password modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Handlers
  const handleClientSignIn = (e) => {
    e.preventDefault();
    login('customer', 'c1');
    navigate('/dashboard');
  };

  const handleSendOtp = () => {
    if (!clientCreateForm.phoneOrEmail) {
      alert('Please enter your phone number or email first.');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setDemoOtpCode(code);
    setOtpSent(true);
    // Pre-fill OTP for convenience in demo
    setClientCreateForm((prev) => ({ ...prev, otp: code }));
  };

  const handleClientCreateAccount = (e) => {
    e.preventDefault();
    if (!clientCreateForm.fullName || !clientCreateForm.phoneOrEmail) {
      alert('Please fill in your name and phone/email.');
      return;
    }
    if (!clientCreateForm.otp) {
      alert('Please request and enter the verification OTP.');
      return;
    }
    // Simulate successful account creation & login
    login('customer', 'c1');
    navigate('/dashboard');
  };

  const handleStudioSignIn = (e) => {
    e.preventDefault();
    login('photographer', 'p1');
    navigate('/photographer-dashboard');
  };

  const handleStudioCreateAccount = (e) => {
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
            <h1 className="text-2xl font-black text-gray-900 mt-2">
              {isStudio
                ? studioMode === 'create'
                  ? 'Join as Studio'
                  : 'Studio Sign In'
                : clientMode === 'create'
                ? 'Create Client Account'
                : 'Client Sign In'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm">
              {isStudio
                ? studioMode === 'create'
                  ? 'Register your studio profile to accept 3-phase protected wedding shoots'
                  : 'Sign in to access your studio shoots, milestones & gateway settlements'
                : clientMode === 'create'
                ? 'Sign up with full name and OTP verification to protect your wedding shoot'
                : 'Sign in to access your wedding bookings, demo previews and milestones'}
            </p>
          </div>

          {/* ========================================================= */}
          {/* CLIENT PORTAL: SIGN IN AS CLIENT & CREATE ACCOUNT BELOW */}
          {/* ========================================================= */}
          {!isStudio && (
            <div>
              {clientMode === 'signin' ? (
                /* 1. Client Sign In Option */
                <form onSubmit={handleClientSignIn} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={clientSignInForm.emailOrPhone}
                      onChange={(e) => setClientSignInForm({ ...clientSignInForm, emailOrPhone: e.target.value })}
                      placeholder="priya.mehta@email.com or 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider">
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
                      value={clientSignInForm.password}
                      onChange={(e) => setClientSignInForm({ ...clientSignInForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
                  >
                    Sign In as Client
                  </button>

                  {/* Create Account Option Placed Below Sign In as Client */}
                  <div className="pt-4 border-t border-gray-100 text-center space-y-2">
                    <p className="text-xs text-gray-600 font-medium">
                      Don't have an account yet?
                    </p>
                    <button
                      type="button"
                      onClick={() => setClientMode('create')}
                      className="w-full py-2.5 px-4 rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                    >
                      Create Account (Full Name, Phone/Email & OTP) →
                    </button>
                  </div>
                </form>
              ) : (
                /* 2. Create Account Option (Full Name, Phone or Email, OTP) */
                <form onSubmit={handleClientCreateAccount} className="space-y-4">
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl text-xs text-rose-900">
                    <span className="font-bold block">Quick Verification Registration</span>
                    Sign up with your phone number or email and verify via instant OTP.
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={clientCreateForm.fullName}
                      onChange={(e) => setClientCreateForm({ ...clientCreateForm, fullName: e.target.value })}
                      placeholder="e.g. Priya Mehta"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                    />
                  </div>

                  {/* Phone Number or Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number or Email Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={clientCreateForm.phoneOrEmail}
                        onChange={(e) => setClientCreateForm({ ...clientCreateForm, phoneOrEmail: e.target.value })}
                        placeholder="9988776655 or priya@email.com"
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap"
                      >
                        {otpSent ? 'Resend OTP' : 'Send OTP'}
                      </button>
                    </div>
                  </div>

                  {/* OTP Notification Banner */}
                  {otpSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>OTP dispatched! Demo code: <strong className="font-mono text-sm text-emerald-800">{demoOtpCode}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* OTP Input */}
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Enter 4-Digit OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={clientCreateForm.otp}
                      onChange={(e) => setClientCreateForm({ ...clientCreateForm, otp: e.target.value })}
                      placeholder="e.g. 4291"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm font-mono tracking-widest text-center font-bold"
                    />
                  </div>

                  {/* Create Account Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
                  >
                    Create Account & Proceed
                  </button>

                  {/* Option to return to Sign In as Client */}
                  <div className="pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setClientMode('signin')}
                        className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                      >
                        Sign In as Client
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STUDIO PORTAL: DEFAULT TO STUDIO SIGNIN & JOIN AS STUDIO BELOW */}
          {/* ========================================================= */}
          {isStudio && (
            <div>
              {studioMode === 'signin' ? (
                /* 1. Default Studio Sign In Form */
                <form onSubmit={handleStudioSignIn} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Studio Email or Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={photoSignInForm.emailOrPhone}
                      onChange={(e) => setPhotoSignInForm({ ...photoSignInForm, emailOrPhone: e.target.value })}
                      placeholder="rahul@capturedmoments.in or 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider">
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
                      value={photoSignInForm.password}
                      onChange={(e) => setPhotoSignInForm({ ...photoSignInForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-xs font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
                  >
                    Sign In to Studio Dashboard
                  </button>

                  {/* Join as Studio option placed below Studio Sign In Button */}
                  <div className="pt-4 border-t border-gray-100 text-center space-y-2">
                    <p className="text-xs text-gray-600 font-medium">
                      Don't have a photographer studio account?
                    </p>
                    <button
                      type="button"
                      onClick={() => setStudioMode('create')}
                      className="w-full py-2.5 px-4 rounded-xl border-2 border-amber-300 bg-amber-50/60 hover:bg-amber-100/60 text-amber-900 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Join as Studio (New Photographer Registration) →</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* 2. Join as Studio (New Registration) Form */
                <form onSubmit={handleStudioCreateAccount} className="space-y-3">
                  <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-2xl mb-1">
                    <span className="font-bold block">Join PaySnap Studio Network</span>
                    0% commission on shoots. Payments settle directly into your bank.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Shop / Studio Name
                      </label>
                      <input
                        type="text"
                        required
                        value={photoCreateForm.shopName}
                        onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, shopName: e.target.value })}
                        placeholder="Captured Moments"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Owner Name
                      </label>
                      <input
                        type="text"
                        required
                        value={photoCreateForm.ownerName}
                        onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, ownerName: e.target.value })}
                        placeholder="Rahul Sharma"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Google Maps Link (Pune Location)
                    </label>
                    <input
                      type="url"
                      required
                      value={photoCreateForm.mapsLink}
                      onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, mapsLink: e.target.value })}
                      placeholder="https://maps.google.com/?q=Koregaon+Park,Pune"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Avg Price / Day (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={photoCreateForm.avgPrice}
                        onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, avgPrice: e.target.value })}
                        placeholder="25000"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={photoCreateForm.phone}
                        onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, phone: e.target.value })}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={photoCreateForm.email}
                      onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, email: e.target.value })}
                      placeholder="rahul@capturedmoments.in"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={photoCreateForm.password}
                      onChange={(e) => setPhotoCreateForm({ ...photoCreateForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
                  >
                    Register Studio Profile & Start
                  </button>

                  {/* Return to Studio Sign In */}
                  <div className="pt-3 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-600">
                      Already registered your studio?{' '}
                      <button
                        type="button"
                        onClick={() => setStudioMode('signin')}
                        className="font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                      >
                        Studio Sign In
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Quick Footer Links */}
          <div className="text-center pt-6 mt-4 border-t border-gray-100">
            {isStudio ? (
              <button
                type="button"
                onClick={() => {
                  setIsStudio(false);
                  setClientMode('signin');
                  setSearchParams({});
                }}
                className="text-xs text-gray-500 hover:text-rose-600 font-medium cursor-pointer"
              >
                Looking for wedding photography? <strong className="text-rose-600">Switch to Client Sign In →</strong>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsStudio(true);
                  setStudioMode('signin');
                  setSearchParams({ tab: 'photographer' });
                }}
                className="text-xs text-gray-500 hover:text-rose-600 font-medium cursor-pointer"
              >
                Are you a professional photographer? <strong className="text-rose-600">Switch to Studio Portal →</strong>
              </button>
            )}
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
