'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showroomConfig } from '@/config/showroom';
import { 
  Bike, 
  Wrench, 
  ShieldCheck, 
  MapPin, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 font-sans">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
          Dealership Profile
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight uppercase">
          ABOUT KOVAI MOTOBIKES
        </h1>
        <p className="text-gray-600 text-sm max-w-3xl leading-relaxed">
          A professional two-wheeler sales and service destination in Podanur Main Road, Coimbatore.
        </p>
      </div>

      {/* Main Story Grid with Real Photos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Real Showroom Photograph */}
        <div className="lg:col-span-6 relative h-[400px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
          <Image
            src="/images/showroom-exterior.png"
            alt="KOVAI MOTOBIKES Showroom Entrance"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex items-end">
            <div>
              <span className="text-[10px] uppercase text-red-400 font-bold block tracking-wider">Showroom Facade</span>
              <h3 className="text-base font-bold text-white">{showroomConfig.name} — Podanur Main Road</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Story Text */}
        <div className="lg:col-span-6 space-y-5 text-gray-700 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-black text-gray-900 uppercase border-l-2 border-[#d32f2f] pl-3">
            TWO-WHEELER SALES & SERVICE IN COIMBATORE
          </h2>

          <p>
            <strong className="text-gray-900">{showroomConfig.name}</strong> is a dedicated two-wheeler sales and service center situated at <span className="text-gray-900 font-semibold">{showroomConfig.address}, {showroomConfig.landmark}, {showroomConfig.area}, Coimbatore</span>.
          </p>

          <p>
            We specialize in multi-brand motorcycle and scooter sales, periodic workshop maintenance, genuine spare parts, and computerized diagnostics for riders across Coimbatore South.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[#d32f2f] font-bold uppercase block">Vehicle Sales</span>
              <p className="text-gray-600 text-[11px]">New motorcycles, scooters, transparent pricing & documentation.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
              <span className="text-[#d32f2f] font-bold uppercase block">Workshop Service</span>
              <p className="text-gray-600 text-[11px]">Oil changes, brake overhaul, engine tuning & safety checks.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Showroom Display Image & Service Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 space-y-5 text-gray-700 text-xs sm:text-sm leading-relaxed order-2 lg:order-1">
          <h2 className="text-2xl font-black text-gray-900 uppercase border-l-2 border-[#d32f2f] pl-3">
            OUR SERVICE WORKSHOP COMMITMENT
          </h2>

          <p>
            Our workshop is equipped to handle routine servicing, oil changes, engine tuning, brake replacement, and electrical troubleshooting. We focus on clear explanations, transparent cost estimations, and reliable turnaround times.
          </p>

          <ul className="space-y-2.5 text-xs text-gray-800 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d32f2f] shrink-0" />
              <span>Genuine spare parts and recommended lubricants.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d32f2f] shrink-0" />
              <span>Clear pre-service inspection & cost guidance.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d32f2f] shrink-0" />
              <span>Convenient appointment scheduling online or over phone.</span>
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/book-service"
              className="px-6 py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase rounded-md shadow-sm transition-all min-h-[44px]"
            >
              Book Service Slot
            </Link>
            <WhatsAppButton variant="button" label="WhatsApp Workshop" />
          </div>
        </div>

        <div className="lg:col-span-6 relative h-[380px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white order-1 lg:order-2">
          <Image
            src="/images/showroom-bikes.jpg"
            alt="Showroom Bikes Display"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex items-end">
            <div>
              <span className="text-[10px] uppercase text-red-400 font-bold block tracking-wider">Showroom Floor</span>
              <h3 className="text-base font-bold text-white">Two-Wheeler Lineup on Display</h3>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
