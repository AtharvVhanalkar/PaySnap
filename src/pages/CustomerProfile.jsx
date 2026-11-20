import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

export default function CustomerProfile() {
  const { currentUser, getCustomer, getBookingsForCustomer } = useApp();

  const customerId = currentUser?.id || 'c1';
  const customer = getCustomer(customerId) || {
    id: 'c1',
    name: 'Priya Mehta',
    email: 'priya.mehta@email.com',
    phone: '9988776655',
  };

  const bookings = getBookingsForCustomer(customerId);

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

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Customer Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your personal contact details and wedding shoot preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            ✓ Profile details updated successfully!
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
                <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{formData.email}</p>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Verified Bride / Client
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
