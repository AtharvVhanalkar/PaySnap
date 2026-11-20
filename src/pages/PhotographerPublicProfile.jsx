import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { Award, MapPin, ExternalLink, Phone, Camera, Package, Star, Search, Check } from 'lucide-react';

export default function PhotographerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPhotographer, formatINR, currentUser, login } = useApp();

  const photographer = getPhotographer(id) || getPhotographer('p1');
  const [activeTab, setActiveTab] = useState('portfolio');
  const [lightboxImg, setLightboxImg] = useState(null);

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800">Photographer not found</h2>
            <Link to="/dashboard" className="text-rose-600 underline text-sm mt-2 block">
              Return to studios
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleBookClick = () => {
    // If not logged in as customer, auto-login as Priya for seamless demo
    if (!currentUser || currentUser.type !== 'customer') {
      login('customer', 'c1');
    }
    navigate(`/book/${photographer.id}`);
  };

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col pb-24 sm:pb-12">
      <Navbar />

      {/* Cover Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-900">
        <img
          src={photographer.cover_image}
          alt={photographer.shop_name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Founding Member Badge */}
        {photographer.founding_member && (
          <div className="absolute top-4 right-4 bg-amber-400 text-amber-950 font-extrabold text-xs tracking-wider px-3 py-1 rounded-full uppercase shadow-lg flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Founding Member Studio
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 max-w-6xl mx-auto flex items-end justify-between">
          <div className="flex items-end gap-4">
            <img
              src={photographer.profile_photo}
              alt={photographer.owner_name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-xl object-cover bg-white"
            />
            <div className="text-white mb-1">
              <h1 className="text-xl sm:text-3xl font-extrabold leading-tight">
                {photographer.shop_name}
              </h1>
              <p className="text-xs sm:text-sm text-rose-200 font-medium flex items-center gap-1 mt-0.5">
                <span>Lead: {photographer.owner_name}</span>
                <span className="text-rose-300">·</span>
                <MapPin className="w-3.5 h-3.5 text-rose-300 inline" />
                <span>{photographer.location.area}, Pune</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Overview Bar */}
      <div className="bg-white border-b border-rose-100 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <StarRating rating={photographer.rating} count={photographer.review_count} />
            <span className="text-gray-300">|</span>
            <span className="font-bold text-gray-800">
              Avg. {formatINR(photographer.avg_price_per_day)} <span className="font-normal text-gray-500">/ day</span>
            </span>
            <span className="text-gray-300">|</span>
            <a
              href={photographer.map_link}
              target="_blank"
              rel="noreferrer"
              className="text-rose-600 font-semibold hover:underline flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View on Google Maps
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={`tel:${photographer.phone}`}
              className="text-gray-600 font-semibold hover:text-rose-600 flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" /> +91 {photographer.phone}
            </a>
          </div>

          {/* Desktop Book Now */}
          <button
            onClick={handleBookClick}
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md shadow-rose-900/20 transition cursor-pointer"
          >
            Book Studio with Payment Shield →
          </button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 space-x-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'portfolio'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Camera className="w-4 h-4" /> Previous Work & Portfolio ({photographer.portfolio_images.length})
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package className="w-4 h-4" /> Wedding Packages ({photographer.packages.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Star className="w-4 h-4" /> Client Reviews ({photographer.reviews.length})
          </button>
        </div>

        {/* Tab 1: Portfolio Gallery */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-600">
                Click any photo to inspect high-resolution wedding captures.
              </p>
              <div className="flex gap-2">
                {photographer.styles.map((s) => (
                  <span key={s} className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photographer.portfolio_images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setLightboxImg(img)}
                  className="group relative h-56 sm:h-72 rounded-2xl overflow-hidden cursor-pointer bg-gray-100 shadow-2xs"
                >
                  <img
                    src={img}
                    alt={`Wedding portfolio ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold">
                    <span className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                      <Search className="w-4 h-4" /> View Full Resolution
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Packages */}
        {activeTab === 'packages' && (
          <div className="grid md:grid-cols-3 gap-6">
            {photographer.packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between ${
                  idx === 1
                    ? 'border-rose-400 shadow-md ring-2 ring-rose-200'
                    : 'border-rose-100 shadow-2xs'
                }`}
              >
                <div>
                  {idx === 1 && (
                    <span className="inline-block bg-rose-600 text-white text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mb-3">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name} Package</h3>
                  <div className="mt-3 mb-6">
                    <span className="text-3xl font-extrabold text-gray-900">{formatINR(pkg.price)}</span>
                    <span className="text-xs text-gray-500 block mt-1">Locked price · 3-Phase payment</span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Deliverables Included:
                  </h4>
                  <ul className="space-y-2.5 text-xs text-gray-700 mb-6">
                    {pkg.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                    <li className="flex items-center gap-2 text-rose-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>10 Demo Previews before final release</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleBookClick}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                    idx === 1
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
                  }`}
                >
                  Select & Book {pkg.name} →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            {photographer.reviews.map((rev) => (
              <div key={rev.id} className="bg-white rounded-2xl p-5 border border-rose-100 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
                      {rev.customer_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{rev.customer_name}</h4>
                      <p className="text-[10px] text-gray-400">Wedding Shoot · {rev.date}</p>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} />
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImg}
              alt="Full view"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
            />
            <p className="text-white text-xs text-center mt-3 opacity-75">
              Click anywhere to close full preview
            </p>
          </div>
        </div>
      )}

      {/* Mobile Sticky Booking Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-rose-200 p-3 shadow-xl z-40 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block uppercase font-bold">Shoot Rate</span>
          <span className="text-base font-extrabold text-gray-900">
            {formatINR(photographer.avg_price_per_day)}
          </span>
        </div>
        <button
          onClick={handleBookClick}
          className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-900/20 cursor-pointer"
        >
          Book Now with Shield →
        </button>
      </div>
    </div>
  );
}
