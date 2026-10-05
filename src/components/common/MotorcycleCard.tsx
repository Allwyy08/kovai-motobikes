'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Motorcycle } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onEnquire?: (bike: Motorcycle) => void;
}

export default function MotorcycleCard({ motorcycle }: MotorcycleCardProps) {
  const priceDisplay = motorcycle.starting_price_formatted || `₹${motorcycle.price.toLocaleString('en-IN')}`;
  
  // Extract brand if name starts with a known brand, or fallback to category
  const nameParts = motorcycle.name.split(' ');
  const brand = nameParts.length > 1 ? nameParts[0].toUpperCase() : motorcycle.category.toUpperCase();
  const modelName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : motorcycle.name;

  return (
    <div className="group bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] transition-colors duration-300 flex flex-col h-full font-sans">
      
      {/* Large Photography Presentation */}
      <div className="relative h-60 sm:h-64 w-full bg-[#F6F6F4] overflow-hidden border-b border-[#E5E5E5]">
        <Image
          src={motorcycle.image_url || '/images/delivery-1.jpg'}
          alt={motorcycle.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Minimal Category Tag */}
        <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1">
          {motorcycle.category}
        </div>
      </div>

      {/* Product Content Under Image */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Brand */}
          <span className="text-[11px] uppercase tracking-[0.15em] text-[#666666] font-bold block">
            {brand}
          </span>

          {/* Model Name */}
          <h3 className="text-xl font-bold tracking-tight text-[#0A0A0A] group-hover:text-[#D32F2F] transition-colors line-clamp-1">
            {modelName}
          </h3>

          {/* Key Engine Spec */}
          <p className="text-xs text-[#666666] pt-1 font-medium">
            {motorcycle.engine_capacity_cc} cc · {motorcycle.mileage || 'High Efficiency'}
          </p>
        </div>

        <div className="pt-3 border-t border-[#E5E5E5] flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#666666] block font-medium">
              Starting from
            </span>
            <span className="text-base font-bold text-[#0A0A0A] tracking-tight">
              {priceDisplay}
            </span>
          </div>

          <Link
            href={`/motorcycles/${motorcycle.slug}`}
            className="link-arrow text-xs"
          >
            <span>VIEW MOTORCYCLE</span>
            <ArrowRight className="w-3.5 h-3.5 arrow-icon text-[#D32F2F]" />
          </Link>
        </div>

      </div>
    </div>
  );
}
