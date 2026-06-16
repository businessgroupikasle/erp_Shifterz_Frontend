"use client";

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [carPosition, setCarPosition] = useState(-400);

  useEffect(() => {
    setMounted(true);
    // Animate car crashing into 404
    const interval = setInterval(() => {
      setCarPosition(prev => {
        if (prev < 200) {
          return prev + 4;
        }
        return prev;
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-100 via-blue-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Cloud background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Clouds - top left */}
        <div className="absolute top-12 left-8 w-32 h-16 bg-blue-200 rounded-full blur-xl opacity-60"></div>
        <div className="absolute top-20 left-24 w-40 h-20 bg-blue-150 rounded-full blur-2xl opacity-50"></div>

        {/* Clouds - top right */}
        <div className="absolute top-16 right-12 w-36 h-18 bg-blue-200 rounded-full blur-xl opacity-60"></div>
        <div className="absolute top-28 right-32 w-44 h-20 bg-blue-150 rounded-full blur-2xl opacity-50"></div>

        {/* Clouds - middle */}
        <div className="absolute top-1/2 left-1/4 w-40 h-20 bg-blue-200 rounded-full blur-xl opacity-50"></div>
        <div className="absolute top-2/3 right-1/4 w-36 h-18 bg-blue-150 rounded-full blur-2xl opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">

        {/* 404 Crash Section */}
        <div className="relative h-48 md:h-64 flex items-center justify-center mb-8 perspective">

          {/* Broken "404" Numbers */}
          <div className="relative flex items-center justify-center overflow-hidden">

            {/* "4" - Broken left */}
            <div className="relative mr-2 md:mr-4">
              <div className="text-7xl md:text-9xl font-black text-gray-800" style={{
                transform: `skewY(-5deg) rotate(-8deg)`,
                opacity: carPosition > 100 ? 0.7 : 1
              }}>
                4
              </div>
              {carPosition > 100 && (
                <div className="absolute top-4 left-2 text-4xl md:text-6xl text-red-500">✕</div>
              )}
            </div>

            {/* "0" - Hit in the middle */}
            <div className="relative mx-1 md:mx-3">
              <div className="text-7xl md:text-9xl font-black text-gray-800" style={{
                transform: carPosition > 80 ? `scaleX(0.9) skewX(${Math.min(15, (carPosition - 80) / 2)}deg)` : 'scaleX(1)',
                opacity: carPosition > 100 ? 0.6 : 1
              }}>
                0
              </div>
              {carPosition > 100 && (
                <>
                  <div className="absolute top-2 left-0 text-2xl md:text-5xl text-red-500">💥</div>
                  <div className="absolute top-6 right-0 text-2xl md:text-4xl text-red-400">⚡</div>
                </>
              )}
            </div>

            {/* "4" - Broken right */}
            <div className="relative ml-2 md:ml-4">
              <div className="text-7xl md:text-9xl font-black text-gray-800" style={{
                transform: `skewY(5deg) rotate(8deg)`,
                opacity: carPosition > 100 ? 0.7 : 1
              }}>
                4
              </div>
              {carPosition > 100 && (
                <div className="absolute top-4 right-2 text-4xl md:text-6xl text-red-500">✕</div>
              )}
            </div>

            {/* Animated Car */}
            <div className="absolute" style={{
              left: `calc(${carPosition}px)`,
              transition: carPosition < 200 ? 'none' : 'left 0.3s ease-out'
            }}>
              <svg className="w-32 md:w-48 h-32 md:h-48" viewBox="0 0 200 120" fill="none">
                {/* Car body */}
                <rect x="20" y="60" width="160" height="40" rx="10" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>

                {/* Car cabin */}
                <rect x="60" y="30" width="80" height="35" rx="8" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2"/>

                {/* Windows */}
                <circle cx="75" cy="45" r="8" fill="#B0C4DE" opacity="0.6"/>
                <circle cx="125" cy="45" r="8" fill="#B0C4DE" opacity="0.6"/>

                {/* Wheels */}
                <circle cx="50" cy="105" r="12" fill="#374151" stroke="#1F2937" strokeWidth="2"/>
                <circle cx="150" cy="105" r="12" fill="#374151" stroke="#1F2937" strokeWidth="2"/>

                {/* Wheel details */}
                <circle cx="50" cy="105" r="6" fill="#1F2937"/>
                <circle cx="150" cy="105" r="6" fill="#1F2937"/>

                {/* Bumper */}
                <rect x="10" y="75" width="15" height="15" fill="#4B5563"/>

                {/* Impact lines */}
                {carPosition > 80 && (
                  <>
                    <line x1="5" y1="50" x2="0" y2="45" stroke="#EF4444" strokeWidth="2"/>
                    <line x1="10" y1="60" x2="3" y2="65" stroke="#EF4444" strokeWidth="2"/>
                    <line x1="15" y1="45" x2="8" y2="40" stroke="#EF4444" strokeWidth="2"/>
                  </>
                )}
              </svg>

              {/* Dust/smoke effect */}
              {carPosition > 100 && (
                <div className="absolute top-12 right-0 text-2xl animate-pulse">
                  ☁️ ☁️
                </div>
              )}
            </div>
          </div>

          {/* Dashed line */}
          <div className="absolute bottom-4 w-full border-t-2 border-dashed border-gray-400"></div>
        </div>

        {/* Message */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            We can't find the page you are looking for.
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            {carPosition > 100
              ? "Oops! The page got hit by the car 🚗💥"
              : "Page not found..."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-xl transition-all border-2 border-gray-300 hover:border-gray-400 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center w-full z-10">
        <p className="text-gray-600 text-xs md:text-sm font-medium">⚡ SHIFTERZ ERP SYSTEM</p>
      </div>
    </div>
  );
}
