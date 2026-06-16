"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

        {/* 404 Image Section */}
        <div className="relative flex items-center justify-center mb-8 perspective">
          <Image 
            src="/404_page.png" 
            alt="404 Page Not Found" 
            width={600} 
            height={400} 
            className="w-full max-w-lg h-auto drop-shadow-2xl"
            priority 
          />
        </div>

        {/* Message */}
        <div className="text-center mb-12 px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            We can't find the page you are looking for.
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            It looks like this page doesn't exist or was moved.
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
