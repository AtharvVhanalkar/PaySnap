import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import { useApp } from '../context/AppContext';
import { MapPin, Search, Map, Grid, Award, X, Camera } from 'lucide-react';

export default function CustomerDashboard() {
  const { photographers, formatINR } = useApp();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [maxDistance, setMaxDistance] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-12-15');
  const [showMap, setShowMap] = useState(false);
  const [activePin, setActivePin] = useState(null);

  // Available styles
  const allStyles = ['Candid', 'Cinematic', 'Traditional', 'Drone'];

  // Filtered Photographers
  const filteredPhotographers = useMemo(() => {
    return photographers.filter((p) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.shop_name.toLowerCase().includes(q) || p.owner_name.toLowerCase().includes(q) || p.location.area.toLowerCase().includes(q);
        if (!matchName) return false;
      }

      // Price
      if (minPrice && p.avg_price_per_day < Number(minPrice)) return false;
      if (maxPrice && p.avg_price_per_day > Number(maxPrice)) return false;

      // Rating
      if (minRating !== 'all' && p.rating < Number(minRating)) return false;

      // Style
      if (selectedStyle !== 'all' && !p.styles.includes(selectedStyle)) return false;

      // Distance
      if (maxDistance !== 'all' && p.distance_km > Number(maxDistance)) return false;

      return true;
    });
  }, [photographers, searchQuery, minPrice, maxPrice, minRating, selectedStyle, maxDistance]);

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setMinRating('all');
    setSelectedStyle('all');
    setMaxDistance('all');
  };

  const hasActiveFilters = searchQuery || minPrice || maxPrice || minRating !== 'all' || selectedStyle !== 'all' || maxDistance !== 'all';

  return (
    <div className="min-h-screen bg-[#fdf8f3] flex flex-col">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {/* Header with City & Map Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Wedding Photographers in Pune
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Verified local studios with 3-phase payment protection & clear deliverables.
            </p>
          </div>

          {/* Map View Toggle Button */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs sm:text-sm font-bold shadow-2xs transition cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              {showMap ? <Grid className="w-4 h-4" /> : <Map className="w-4 h-4" />}
              {showMap ? 'Show Grid' : 'Map View'}
            </span>
            <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
              {showMap ? 'Hide Map' : 'Pune Pins'}
            </span>
          </button>
        </div>

        {/* Search & Filter Panel */}
        <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-xs mb-8">
          {/* Search bar input */}
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by studio name, photographer name, or area (e.g. Koregaon Park, Baner)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-hidden focus:border-rose-500 text-sm bg-[#fdf8f3]/60 focus:bg-white transition"
            />
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {/* Price Range */}
            <div>
              <label className="block text-gray-600 font-bold mb-1">Max Price / Day</label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-rose-500"
              >
                <option value="">Any Budget</option>
                <option value="20000">Up to ₹20,000</option>
                <option value="30000">Up to ₹30,000</option>
                <option value="40000">Up to ₹40,000</option>
                <option value="60000">Up to ₹60,000</option>
              </select>
            </div>

            {/* Distance from Pune Center */}
            <div>
              <label className="block text-gray-600 font-bold mb-1">Distance (Pune)</label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-rose-500"
              >
                <option value="all">Any Distance</option>
                <option value="3">Within 3 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-gray-600 font-bold mb-1">Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-rose-500"
              >
                <option value="all">Any Rating</option>
                <option value="4.5">4.5 & above</option>
                <option value="4.7">4.7 & above</option>
              </select>
            </div>

            {/* Style */}
            <div>
              <label className="block text-gray-600 font-bold mb-1">Shoot Style</label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-rose-500"
              >
                <option value="all">All Styles</option>
                {allStyles.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Event Date Availability */}
            <div>
              <label className="block text-gray-600 font-bold mb-1">Shoot Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium focus:outline-hidden focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          {/* Quick Filter Style Chips */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-400 uppercase mr-1">Styles:</span>
              {['All', ...allStyles].map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style === 'All' ? 'all' : style)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    (selectedStyle === 'all' && style === 'All') || selectedStyle === style
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Map View Section (when toggled) */}
        {showMap && (
          <div className="mb-8 bg-white rounded-3xl p-5 border border-rose-200 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600" /> Studio Locations in Pune, Maharashtra
              </h3>
              <span className="text-xs text-gray-500">Click a pin to view quick studio summary</span>
            </div>

            <div className="relative w-full h-72 sm:h-80 bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center">
              {/* Simulated map grid lines */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:24px_24px]"></div>

              {/* Road illustration lines */}
              <svg className="absolute inset-0 w-full h-full opacity-30 stroke-gray-400 stroke-2" fill="none">
                <path d="M 0 100 Q 200 150 400 80 T 800 200" />
                <path d="M 100 0 Q 300 200 350 400" />
                <path d="M 400 300 Q 600 200 900 350" />
              </svg>

              <div className="absolute top-3 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 shadow-2xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-600" /> Pune Metro Region
              </div>

              {/* Pins placed relative to Pune locations */}
              {photographers.map((p, idx) => {
                // Approximate coordinate offsets for visual placement
                const pinPositions = [
                  { top: '35%', left: '42%' }, // Koregaon Park
                  { top: '25%', left: '20%' }, // Baner
                  { top: '30%', left: '65%' }, // Viman Nagar
                  { top: '65%', left: '25%' }, // Kothrud
                ];
                const pos = pinPositions[idx] || { top: '50%', left: '50%' };
                const isSelected = activePin?.id === p.id;

                return (
                  <div
                    key={p.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <button
                      onClick={() => setActivePin(isSelected ? null : p)}
                      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-md text-xs font-bold cursor-pointer transition transform hover:scale-110 ${
                        isSelected
                          ? 'bg-rose-600 text-white ring-4 ring-rose-200 scale-105'
                          : 'bg-white text-gray-900 border border-rose-300 hover:bg-rose-50'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5 text-rose-600" />
                      <span className="hidden sm:inline">{p.shop_name}</span>
                      <span className="text-[10px] opacity-80">({p.distance_km}km)</span>
                    </button>
                  </div>
                );
              })}

              {/* Pin detail popup */}
              {activePin && (
                <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl p-4 shadow-xl border border-rose-200 z-20 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">{activePin.shop_name}</h4>
                      <p className="text-xs text-gray-500">{activePin.location.area} · {activePin.distance_km} km away</p>
                    </div>
                    <button
                      onClick={() => setActivePin(null)}
                      className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                    <span className="text-xs font-bold text-rose-600">{formatINR(activePin.avg_price_per_day)}/day</span>
                    <Link
                      to={`/photographer/${activePin.id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs sm:text-sm font-bold text-gray-700">
            Showing <span className="text-rose-600">{filteredPhotographers.length}</span> verified studios nearby
          </p>
          <span className="text-xs text-gray-400">All prices in Indian Rupees (₹)</span>
        </div>

        {/* Studios Grid */}
        {filteredPhotographers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotographers.map((photographer) => (
              <div
                key={photographer.id}
                className="bg-white rounded-3xl overflow-hidden border border-rose-100 shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={photographer.portfolio_images[0]}
                    alt={photographer.shop_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Founding Member Badge */}
                  {photographer.founding_member && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded-full uppercase shadow-xs flex items-center gap-1">
                      <Award className="w-3 h-3" /> Founding Member
                    </div>
                  )}

                  {/* Distance Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white font-medium text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-300" /> {photographer.distance_km} km away
                  </div>

                  {/* Owner Avatar & Area at bottom of image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <img
                        src={photographer.profile_photo}
                        alt={photographer.owner_name}
                        className="w-7 h-7 rounded-full border-2 border-white object-cover"
                      />
                      <span className="text-xs font-medium text-rose-100">
                        {photographer.owner_name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {photographer.location.area}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-rose-600 transition">
                        {photographer.shop_name}
                      </h3>
                    </div>

                    <div className="mb-3">
                      <StarRating rating={photographer.rating} count={photographer.review_count} />
                    </div>

                    {/* Styles Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {photographer.styles.map((style) => (
                        <span
                          key={style}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">Avg. Shoot Price</span>
                      <span className="text-base font-extrabold text-gray-900">
                        {formatINR(photographer.avg_price_per_day)}
                        <span className="text-xs font-normal text-gray-500"> / day</span>
                      </span>
                    </div>

                    <Link
                      to={`/photographer/${photographer.id}`}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">No studios match your filter criteria</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your price range, distance, or shoot style to find available wedding photographers in Pune.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
