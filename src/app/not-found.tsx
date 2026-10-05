'use client';

import React from 'react';
import Link from 'next/link';
import { Bike, Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mx-auto shadow-2xl">
        <Bike className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-red-500 block font-bold">
          404 Page Not Found
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-mono">
          OFF THE BEATEN TRACK
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          The page or motorbike model you are trying to access does not exist or has been relocated.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase rounded-xl font-mono shadow-lg shadow-red-600/30 flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
        <Link
          href="/motorcycles"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase rounded-xl font-mono border border-white/15 flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-red-500" /> Explore Models
        </Link>
      </div>
    </div>
  );
}
