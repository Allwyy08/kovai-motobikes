'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  ShieldCheck
} from 'lucide-react';
import { showroomConfig } from '@/config/showroom';

export default function Footer() {
  return (
    <footer className="bg-[#07090e] text-gray-400 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: KOVAI MOTOBIKES Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-36 bg-white/95 rounded-lg p-1.5 border border-white/20">
                <Image
                  src="/images/logo.jpg"
                  alt="KOVAI MOTOBIKES Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              {showroomConfig.name} — {showroomConfig.tagline}. {showroomConfig.category}. Destination for new motorcycles, scooters, and multi-brand two-wheeler maintenance.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-mono text-gray-400 block uppercase tracking-wider">Serving Coimbatore South & Podanur</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-red-600 pl-3 font-mono">
              Quick Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/motorcycles" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  Two-Wheeler Inventory
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  Services & Repairs
                </Link>
              </li>
              <li>
                <Link href="/book-service" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  Book Service Appointment
                </Link>
              </li>
              <li>
                <Link href="/test-ride" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  Book a Test Ride
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  Showroom & Delivery Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-red-500" />
                  About KOVAI MOTOBIKES
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Showroom Address */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-red-600 pl-3 font-mono">
              Showroom Address
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-white block">{showroomConfig.name}</span>
                  <span>{showroomConfig.address},</span><br />
                  <span>{showroomConfig.landmark},</span><br />
                  <span>{showroomConfig.area}, {showroomConfig.city},</span><br />
                  <span>{showroomConfig.state} {showroomConfig.pincode}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`tel:${showroomConfig.phone}`} className="hover:text-white font-mono">{showroomConfig.phone}</a>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a 
                  href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-mono text-emerald-400 font-bold"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Business Hours */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-red-600 pl-3 font-mono">
              Operating Hours
            </h3>
            <div className="space-y-2 text-xs bg-[#121721] p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                <Clock className="w-4 h-4" />
                <span>Showroom & Workshop</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-gray-400">Monday - Saturday:</span>
                <span className="text-gray-200 font-mono">9:00 AM - 8:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sunday:</span>
                <span className="text-gray-200 font-mono">9:00 AM - 2:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {showroomConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-gray-300">Contact Us</Link>
            <Link href="/admin/login" className="hover:text-red-400 text-gray-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Staff Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
