'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const serviceCategories = [
    {
      id: 'general-service',
      name: 'GENERAL SERVICE',
      description: 'Comprehensive multi-point safety inspection, chain tensioning, clutch alignment, battery load check, and full road test.',
      details: ['40-point safety check', 'Chain clean & lube', 'Throttle & clutch calibration', 'Road performance test']
    },
    {
      id: 'oil-filter',
      name: 'OIL & FILTER',
      description: 'Premium synthetic engine oil change with original OEM filter replacement and drain plug washer fitment.',
      details: ['OEM oil filter replacement', 'Factory specification synthetic oil', 'Drain washer refresh', 'Oil pressure check']
    },
    {
      id: 'brake-service',
      name: 'BRAKE SERVICE',
      description: 'Disc rotor resurfacing, brake pad thickness inspection, hydraulic line flush, and ABS sensor check.',
      details: ['Brake pad inspection', 'DOT 4 fluid replacement', 'Caliper pin lubrication', 'ABS module test']
    },
    {
      id: 'engine-service',
      name: 'ENGINE SERVICE',
      description: 'Precision valve clearance adjustment, throttle body synchronization, spark plug renewal, and ECU fuel mapping.',
      details: ['Valve clearance check', 'Throttle body sync', 'Iridium spark plug renewal', 'Compression analysis']
    },
    {
      id: 'diagnostics',
      name: 'DIAGNOSTICS',
      description: 'Computerized OBD-II scanner diagnostics for pinpoint fault detection, error code clearing, and software updates.',
      details: ['Computer diagnostic scan', 'Error code clearing', 'Live sensor telemetry', 'ECU software check']
    },
    {
      id: 'periodic-maintenance',
      name: 'PERIODIC MAINTENANCE',
      description: 'Scheduled odometer milestone maintenance according to factory manufacturer service manuals.',
      details: ['Official warranty logbook maintenance', 'Drive belt/chain replacement', 'Coolant flush & renew', 'Fork oil seal service']
    }
  ];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Hero: Large Workshop Image */}
      <div className="relative min-h-[420px] md:min-h-[480px] bg-[#0A0A0A] text-white flex items-end p-8 md:p-16 overflow-hidden">
        <Image
          src="/images/service-workshop.jpg"
          alt="KOVAI MOTOBIKES Workshop"
          fill
          priority
          className="object-cover opacity-60 filter contrast-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
            CERTIFIED WORKSHOP
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-none">
            PRECISION SERVICE.<br />PROFESSIONAL CARE.
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
            Keep your motorcycle or scooter operating at peak performance with factory-trained technicians, genuine spare parts, and computerized diagnostic tools.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href="/book-service" className="btn-primary">
              <span>BOOK A SERVICE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <WhatsAppButton variant="button" label="WHATSAPP WORKSHOP" />
          </div>
        </div>
      </div>

      {/* Service Categories - Simple Clean Rows / Sections */}
      <div className="space-y-12">
        <div className="border-b border-[#E5E5E5] pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-1">
            CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase text-[#0A0A0A]">
            WORKSHOP SERVICES
          </h2>
        </div>

        <div className="divide-y divide-[#E5E5E5] border-t border-b border-[#E5E5E5] bg-white">
          {serviceCategories.map((service) => (
            <div key={service.id} className="py-8 px-6 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Service Title */}
              <div className="md:col-span-4 space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block">
                  CATEGORY
                </span>
                <h3 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">
                  {service.name}
                </h3>
              </div>

              {/* Middle Column: Description & Specs */}
              <div className="md:col-span-5 space-y-3">
                <p className="text-xs text-[#666666] leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#0A0A0A] font-semibold">
                  {service.details.map((item, idx) => (
                    <span key={idx}>· {item}</span>
                  ))}
                </div>
              </div>

              {/* Right Column: CTA */}
              <div className="md:col-span-3 flex md:justify-end items-center">
                <Link
                  href={`/book-service?service=${encodeURIComponent(service.name)}`}
                  className="link-arrow text-xs"
                >
                  <span>BOOK {service.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 arrow-icon text-[#D32F2F]" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
