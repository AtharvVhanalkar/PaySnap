import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import { useApp } from '../context/AppContext';
import { Check, AlertCircle, Calendar, ArrowRight, ShieldAlert, CreditCard } from 'lucide-react';

export default function CustomerProfile() {
  const { customerId: paramCustomerId } = useParams();
  const {
    currentUser,
    getCustomer,
    getBookingsForCustomer,
    getPhotographer,
    getPhasesForBooking,
    isPhaseOverdue,
    hasOverduePhase,
    getOverduePhasesForBooking,
    formatINR,
  } = useApp();

  const customerId = paramCustomerId || currentUser?.id || 'c1';
  const customer = getCustomer(customerId) || {
    id: customerId,
    name: customerId === 'c2' ? 'Ananya Deshmukh' : 'Priya Mehta',
    email: customerId === 'c2' ? 'ananya.deshmukh@gmail.com' : 'priya.mehta@email.com',
    phone: customerId === 'c2' ? '9876501234' : '9988776655',
  };

  const bookings = getBookingsForCustomer(customerId);

  // Check if any booking for this customer has an overdue milestone
  const overdueBookings = bookings.filter((b) => hasOverduePhase(b.id));
  const hasAnyOverdue = overdueBookings.length > 0;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    city: 'Pune, Maharashtra',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Customer Profile
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage personal contact details, milestone schedules, and wedding shoot preferences.
            </p>
          </div>
          {hasAnyOverdue && (
            <div className="self-start sm:self-auto">
              <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Action Required (Unpaid Overdue)
              </span>
            </div>
          )}
        </div>

        {/* Action Required Alert Banner if customer has overdue payments */}
        {hasAnyOverdue && (
          <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-2xs">
                    Action Required
                  </span>
                  <h3 className="font-black text-base sm:text-lg">Unpaid Milestone Past Due Date</h3>
                </div>
                <p className="text-xs text-rose-100 mt-1 max-w-xl leading-relaxed">
                  One or more milestone payment dates have passed without payment or verification screenshot. Complete pending milestones to prevent photo release holds.
                </p>
              </div>
            </div>
            <Link
              to={`/booking/${overdueBookings[0]?.id}`}
              className="px-5 py-2.5 bg-white text-rose-700 hover:bg-rose-50 text-xs font-black rounded-xl shadow-md transition cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Pay Overdue Milestone →
            </Link>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-gray-100 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-rose-400 text-white text-2xl font-black flex items-center justify-center shadow-md">
                {formData.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                  <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                  {hasAnyOverdue ? (
                    <StatusBadge status="action_required" />
                  ) : (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider">
                      Good Standing
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{formData.email}</p>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Verified Client · Pune
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 hover:border-rose-400 text-xs font-bold rounded-xl transition cursor-pointer text-gray-700 hover:text-rose-600"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 pt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 font-medium focus:outline-hidden focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 font-medium focus:outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 font-medium focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Default City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 font-medium focus:outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 text-xs">
              <div>
                <span className="text-gray-400 block font-bold uppercase text-[10px]">Contact Phone</span>
                <span className="font-extrabold text-gray-800 text-sm">{formData.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold uppercase text-[10px]">Location</span>
                <span className="font-extrabold text-gray-800 text-sm">{formData.city}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-bold uppercase text-[10px]">Registered Shoots</span>
                <span className="font-extrabold text-rose-600 text-sm">{bookings.length} Bookings</span>
              </div>
            </div>
          )}
        </div>

        {/* Bookings / Shoots Associated with Customer */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-gray-900">
                Wedding Shoots & Milestone Status
              </h2>
              <p className="text-xs text-gray-500">
                Track status across shoots. Overdue payments trigger Action Required badges.
              </p>
            </div>
            <Link
              to="/my-bookings"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">No bookings found for this customer.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const photographer = getPhotographer(b.photographer_id);
                const phases = getPhasesForBooking(b.id);
                const isOverdue = hasOverduePhase(b.id);
                const overduePhases = getOverduePhasesForBooking(b.id);

                const totalPaid = phases
                  .filter((p) => p.status === 'approved')
                  .reduce((sum, p) => sum + p.amount, 0);

                return (
                  <div
                    key={b.id}
                    className={`p-5 rounded-2xl border transition ${
                      isOverdue
                        ? 'border-red-300 bg-red-50/20 ring-2 ring-red-200'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-base text-gray-900">
                            {photographer?.shop_name || 'Photography Studio'}
                          </h3>
                          {isOverdue ? (
                            <StatusBadge status="action_required" />
                          ) : (
                            <StatusBadge status={b.status} />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Shoot Date: <strong>{b.event_date}</strong> · Venue: {b.venue} · Deal: <strong>{formatINR(b.deal_price)}</strong>
                        </p>

                        {isOverdue && (
                          <div className="mt-2 text-xs text-red-700 font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>
                              Payment overdue for {overduePhases.map(p => `${p.name} (${formatINR(p.amount)})`).join(', ')}. Action required to unlock deliverables.
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Link
                          to={`/booking/${b.id}`}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                            isOverdue
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          {isOverdue ? 'Clear Payment Now →' : 'View Milestones'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Activity Shortcuts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/my-bookings"
            className="p-5 bg-white rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-sm text-gray-900">Manage My Bookings</h3>
              <p className="text-xs text-gray-500 mt-0.5">Track deliverables, preview photos, and payments</p>
            </div>
            <span className="text-rose-600 font-bold text-lg">→</span>
          </Link>

          <Link
            to="/dashboard"
            className="p-5 bg-white rounded-3xl border border-rose-100 shadow-2xs hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-sm text-gray-900">Browse Pune Studios</h3>
              <p className="text-xs text-gray-500 mt-0.5">Explore nearby photographers with locked pricing</p>
            </div>
            <span className="text-rose-600 font-bold text-lg">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
