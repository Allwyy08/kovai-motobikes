'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Wrench, 
  Droplet, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  CircleDot, 
  CalendarCheck, 
  Activity, 
  Sparkles,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export default function ServicesPage() {
  const serviceList = [
    {
      id: 'general-service',
      title: 'General Maintenance Service',
      icon: Wrench,
      description: 'Comprehensive 40-point inspection covering fluid levels, chain tension, clutch alignment, battery health, fastener torques, and road test.',
      features: ['Full 40-point safety check', 'Chain clean & lube', 'Throttle & clutch adjustment', 'Full road testing']
    },
    {
      id: 'oil-change',
      title: 'Engine Oil & Filter Change',
      icon: Droplet,
      description: 'Premium synthetic or semi-synthetic factory recommended engine oil refresh with high-flow OEM oil filter replacement.',
      features: ['OEM oil filter swap', 'Factory spec engine oil', 'Drain plug washer replacement', 'Oil level calibration']
    },
    {
      id: 'brake-service',
      title: 'Brake System Maintenance',
      icon: ShieldAlert,
      description: 'Brake pad thickness inspection, disc rotor resurfacing, brake fluid flush, hydraulic bleeding, and ABS sensor calibration.',
      features: ['Pad & disc rotor check', 'DOT 4/5.1 fluid replacement', 'Caliper pin lubrication', 'ABS module diagnostic check']
    },
    {
      id: 'engine-service',
      title: 'Engine Overhaul & Tuning',
      icon: Cpu,
      description: 'Valve clearance adjustment, throttle body sync, spark plug renewal, compression testing, and ECU fuel mapping.',
      features: ['Shim & valve clearance', 'Multi-cylinder sync', 'Iridium spark plug fitment', 'Compression test report']
    },
    {
      id: 'electrical-service',
      title: 'Electrical & Diagnostic Scan',
      icon: Zap,
      description: 'OBD-II factory scanner diagnostic check, battery load testing, charging system test, and wiring loom repair.',
      features: ['Computer diagnostic scan', 'Error code clearing', 'Stator & rectifier testing', 'Key fob reprogramming']
    },
    {
      id: 'tyre-service',
      title: 'Tyre Fitment & Balancing',
      icon: CircleDot,
      description: 'Laser wheel alignment, dynamic wheel balancing, tubeless valve replacement, and premium motorcycle tyre fitment.',
      features: ['Dynamic wheel balancing', 'Tubeless valve check', 'Rim truing (spoke wheels)', 'Tyre pressure optimization']
    },
    {
      id: 'periodic-maintenance',
      title: 'Periodic Milestone Maintenance',
      icon: CalendarCheck,
      description: 'Scheduled maintenance based on odometer mileage (10k, 20k, 30k km) according to official OEM service manuals.',
      features: ['Official warranty logbook stamp', 'Drive belt / chain replacement', 'Coolant flush & renew', 'Fork oil seal overhaul']
    },
    {
      id: 'diagnostics',
      title: 'Advanced Computer Diagnostics',
      icon: Activity,
      description: 'Pinpoint electronic faults, sensor misfires, traction control glitches, and quickshifter calibration using official dealer diagnostic tools.',
      features: ['Live sensor data telemetry', 'ECU software updates', 'Traction control recalibration', 'Quickshifter sensor check']
    },
    {
      id: 'washing-detailing',
      title: 'Showroom Detailing & Ceramic Wash',
      icon: Sparkles,
      description: 'Deep engine bay degreasing, snow foam hand wash, paint correction polishing, and ceramic hydrophobic protective coating.',
      features: ['Engine degreasing wash', 'Leather seat conditioning', 'Exhaust header polishing', 'Nano-ceramic paint coat']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 font-sans">
      
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200 p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
              Certified Motorcycle Care
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight uppercase">
              PROFESSIONAL SERVICE & MAINTENANCE
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed max-w-xl">
              Keep your two-wheeler performing at its best. Our technicians use original spare parts, factory-recommended lubricants, and multi-point safety inspections.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/book-service"
                className="px-6 py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-all min-h-[44px] flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                Book Service Appointment
              </Link>
              <WhatsAppButton variant="button" label="WhatsApp Workshop" />
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 lg:h-72 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src="/images/service-workshop.jpg"
              alt="KOVAI MOTOBIKES Service Workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
            Comprehensive Offerings
          </span>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
            OUR SPECIALIZED WORKSHOP SERVICES
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id} 
                className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-between space-y-4 hover:border-[#d32f2f] transition-all shadow-sm hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-red-50 text-[#d32f2f] flex items-center justify-center border border-red-200">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-1.5 pt-3 border-t border-gray-100 text-xs text-gray-700">
                    {service.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d32f2f] shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/book-service?service=${encodeURIComponent(service.title)}`}
                    className="w-full py-2.5 px-4 bg-gray-50 hover:bg-[#d32f2f] hover:text-white text-gray-800 text-xs font-bold uppercase rounded-md border border-gray-200 transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                  >
                    <span>Book {service.title.split(' ')[0]}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
