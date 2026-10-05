'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { showroomConfig } from '@/config/showroom';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-[#151515] pt-16 pb-12 font-sans">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-[130px]">
                <Image
                  src="/images/kovai-motobikes-logo-transparent.png"
                  alt="KOVAI MOTOBIKES"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs uppercase tracking-widest text-[#D32F2F] font-bold">
              {showroomConfig.tagline}
            </p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm font-normal">
              Your trusted destination for multi-brand motorcycle sales, genuine parts, and expert workshop service in Coimbatore.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
              NAVIGATION
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/motorcycles" className="text-gray-300 hover:text-[#D32F2F] transition-colors">
                  Motorcycles
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-[#D32F2F] transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/test-ride" className="text-gray-300 hover:text-[#D32F2F] transition-colors">
                  Test Ride
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#D32F2F] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-300 hover:text-[#D32F2F] transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-[#D32F2F] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Dealership */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-400">
              DEALERSHIP CONTACT
            </h4>
            <div className="text-xs text-gray-300 leading-relaxed space-y-2">
              <p className="font-semibold text-white">{showroomConfig.name}</p>
              <p className="text-gray-400">{showroomConfig.fullAddress}</p>
              <div className="pt-2 space-y-1">
                <p>
                  <span className="text-gray-500 uppercase text-[10px] font-bold">Phone: </span>
                  <a href={`tel:${showroomConfig.phone}`} className="hover:text-[#D32F2F] font-mono text-gray-200">
                    {showroomConfig.phone}
                  </a>
                </p>
                <p>
                  <span className="text-gray-500 uppercase text-[10px] font-bold">WhatsApp: </span>
                  <a
                    href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 font-mono text-emerald-400"
                  >
                    WhatsApp Sales & Support
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} {showroomConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-gray-300">Showroom Location</Link>
            <Link href="/admin/login" className="hover:text-gray-300">Staff Login</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
