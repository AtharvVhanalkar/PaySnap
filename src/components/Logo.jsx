import React from 'react';

export default function Logo({ size = 'md', className = '', showBadge = true, variant = 'full' }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* PaySnap Custom SVG Emblem */}
      <div
        className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 p-0.5 shadow-md shadow-rose-900/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}
      >
        <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center p-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-rose-600"
          >
            {/* Camera Body */}
            <path
              d="M3 8C3 6.89543 3.89543 6 5 6H7.17157C7.70201 6 8.21071 5.78929 8.58579 5.41421L9.41421 4.58579C9.78929 4.21071 10.298 4 10.8284 4H13.1716C13.702 4 14.2107 4.21071 14.5858 4.58579L15.4142 5.41421C15.7893 5.78929 16.298 6 16.8284 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8Z"
              stroke="url(#roseGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Shutter / Lens with Golden Amber Center */}
            <circle cx="12" cy="13" r="4" stroke="url(#roseGrad)" strokeWidth="1.8" />
            <circle cx="12" cy="13" r="1.8" fill="url(#amberGrad)" />
            {/* Snap / Flash Sparkle */}
            <path
              d="M17.5 8.5L18.5 7.5M18.5 7.5L19.5 8.5M18.5 7.5V6M18.5 7.5V9"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="roseGrad" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e11d48" />
                <stop offset="1" stopColor="#9f1239" />
              </linearGradient>
              <linearGradient id="amberGrad" x1="10" y1="11" x2="14" y2="15" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {variant === 'full' && (
        <div className="flex items-center">
          <span className={`font-black tracking-tight ${textSizes[size] || textSizes.md} text-gray-900`}>
            Pay<span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">Snap</span>
          </span>
          {showBadge && (
            <span className="hidden sm:inline-block ml-2 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Wedding Shield
            </span>
          )}
        </div>
      )}
    </div>
  );
}

