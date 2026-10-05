'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Motorcycle } from '@/lib/types';
import { Compass, Eye, MessageSquare, Zap, Gauge } from 'lucide-react';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onEnquire?: (bike: Motorcycle) => void;
}

export default function MotorcycleCard({ motorcycle, onEnquire }: MotorcycleCardProps) {
  const priceDisplay = motorcycle.starting_price_formatted || `₹${motorcycle.price.toLocaleString('en-IN')}`;

  return (
    <div className="group bg-white rounded-xl overflow-hidden flex flex-col h-full border border-gray-200 hover:border-[#d32f2f] transition-all duration-300 shadow-sm hover:shadow-md">
      
      {/* Image Container with Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 border-b border-gray-100">
        <Image
          src={motorcycle.image_url || '/images/delivery-1.jpg'}
          alt={motorcycle.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#d32f2f] text-white shadow-sm font-sans">
            {motorcycle.category}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md border border-gray-200 px-3 py-1 rounded-md shadow-sm">
          <span className="text-[10px] text-gray-500 block font-sans leading-none font-semibold">Ex-Showroom Starting</span>
          <span className="text-base font-extrabold text-[#d32f2f] font-sans tracking-tight">{priceDisplay}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 font-sans">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#d32f2f] transition-colors line-clamp-1">
            {motorcycle.name}
          </h3>
          <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
            {motorcycle.description}
          </p>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#d32f2f] shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-gray-500 block uppercase font-semibold">Engine</span>
                <span className="text-gray-900 font-bold text-[11px] truncate">{motorcycle.engine_capacity_cc} cc</span>
              </div>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-[#d32f2f] shrink-0" />
              <div className="truncate">
                <span className="text-[9px] text-gray-500 block uppercase font-semibold">Mileage</span>
                <span className="text-gray-900 font-bold text-[11px] truncate">{motorcycle.mileage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/motorcycles/${motorcycle.slug}`}
              className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-center text-gray-800 bg-white hover:bg-gray-50 rounded-md transition-all border border-gray-300 flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <Eye className="w-3.5 h-3.5 text-[#d32f2f]" />
              View Details
            </Link>

            <Link
              href={`/test-ride?model=${encodeURIComponent(motorcycle.name)}`}
              className="py-2.5 px-3 text-xs font-bold uppercase tracking-wider text-center text-white bg-[#d32f2f] hover:bg-[#b71c1c] rounded-md transition-all shadow-sm flex items-center justify-center gap-1.5 min-h-[40px]"
            >
              <Compass className="w-3.5 h-3.5" />
              Test Ride
            </Link>
          </div>

          {onEnquire ? (
            <button
              onClick={() => onEnquire(motorcycle)}
              className="w-full py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 rounded-md border border-gray-200 transition-all flex items-center justify-center gap-1.5 min-h-[36px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#d32f2f]" />
              Quick Enquiry
            </button>
          ) : (
            <Link
              href={`/contact?subject=${encodeURIComponent(`Enquiry for ${motorcycle.name}`)}`}
              className="w-full py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 rounded-md border border-gray-200 transition-all flex items-center justify-center gap-1.5 min-h-[36px]"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#d32f2f]" />
              Enquire Now
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
