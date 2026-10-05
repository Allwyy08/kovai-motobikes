'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { showroomConfig } from '@/config/showroom';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Top Header */}
      <div className="border-b border-[#E5E5E5] pb-8 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
          PROFILE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase">
          OUR STORY
        </h1>
        <p className="text-[#666666] text-sm max-w-2xl leading-relaxed">
          {showroomConfig.name} is a dedicated two-wheeler dealership and workshop situated on Podanur Main Road, Coimbatore.
        </p>
      </div>

      {/* Main Story Hero Photo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Real Showroom Exterior Photo */}
        <div className="lg:col-span-6 relative h-[380px] sm:h-[440px] border border-[#E5E5E5] bg-[#0A0A0A]">
          <Image
            src="/images/showroom-exterior.png"
            alt="KOVAI MOTOBIKES Facade"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
            <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold">Physical Facility</span>
            <h3 className="text-sm font-bold text-white uppercase">{showroomConfig.name} — Podanur Main Rd</h3>
          </div>
        </div>

        {/* Editorial Story Content */}
        <div className="lg:col-span-6 space-y-6 text-[#666666] text-xs sm:text-sm leading-relaxed">
          <h2 className="text-2xl font-bold text-[#0A0A0A] uppercase tracking-tight border-l-2 border-[#D32F2F] pl-3">
            TWO-WHEELER SALES & SERVICE IN COIMBATORE
          </h2>

          <p>
            Established at <strong className="text-[#0A0A0A]">{showroomConfig.fullAddress}</strong>, KOVAI MOTOBIKES serves rider requirements across Coimbatore South and Podanur with straightforward multi-brand sales and expert maintenance.
          </p>

          <p>
            We eliminate dealership opacity. From transparent pricing on new vehicle inventory to structured workshop estimates and original spare parts, every aspect of our operations is designed to build long-term local trust.
          </p>
        </div>

      </div>

      {/* Four Dealership Pillars */}
      <div className="space-y-8 pt-8 border-t border-[#E5E5E5]">
        <div className="border-b border-[#E5E5E5] pb-4">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-1">
            CORE CAPABILITIES
          </span>
          <h2 className="text-2xl font-bold tracking-tight uppercase text-[#0A0A0A]">
            DEALERSHIP PILLARS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
            <div className="w-6 h-[2px] bg-[#D32F2F]" />
            <h3 className="text-base font-bold text-[#0A0A0A] uppercase">SALES</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Multi-brand selection of motorcycles and scooters with transparent pricing and efficient registration support.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
            <div className="w-6 h-[2px] bg-[#D32F2F]" />
            <h3 className="text-base font-bold text-[#0A0A0A] uppercase">SERVICE</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Certified multi-bay workshop equipped for routine servicing, brake work, engine tuning, and electronic diagnostics.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
            <div className="w-6 h-[2px] bg-[#D32F2F]" />
            <h3 className="text-base font-bold text-[#0A0A0A] uppercase">GENUINE PARTS</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Exclusive use of OEM spare parts, factory filters, and grade-recommended synthetic lubricants.
            </p>
          </div>

          <div className="bg-white border border-[#E5E5E5] p-6 space-y-3">
            <div className="w-6 h-[2px] bg-[#D32F2F]" />
            <h3 className="text-base font-bold text-[#0A0A0A] uppercase">CUSTOMER CARE</h3>
            <p className="text-xs text-[#666666] leading-relaxed">
              Direct phone support, online booking convenience, and dedicated after-sales assistance.
            </p>
          </div>

        </div>
      </div>

      {/* Showroom Floor Photography & CTAs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-white border border-[#E5E5E5] p-8 md:p-12">
        <div className="lg:col-span-6 relative h-72 sm:h-80 border border-[#E5E5E5] bg-[#0A0A0A]">
          <Image
            src="/images/showroom-bikes.jpg"
            alt="Showroom Lineup"
            fill
            className="object-cover"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
            VISIT OUR SHOWROOM
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#0A0A0A]">
            EXPLORE IN PERSON
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Our showroom on Podanur Main Road is open Monday through Saturday from 9:00 AM to 8:30 PM. Visit us to inspect vehicles or consult our service managers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/motorcycles" className="btn-primary">
              <span>EXPLORE MOTORCYCLES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <WhatsAppButton variant="button" label="WHATSAPP SALES" />
          </div>
        </div>
      </div>

    </div>
  );
}
