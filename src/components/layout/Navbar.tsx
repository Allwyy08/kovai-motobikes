'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Wrench, 
  Menu, 
  X, 
  ShieldCheck, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { showroomConfig } from '@/config/showroom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Motorcycles', href: '/motorcycles' },
    { name: 'Services', href: '/services' },
    { name: 'Test Ride', href: '/test-ride' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Determine navbar mode: dark when on homepage hero & not scrolled; light when scrolled or on other pages
  const isDarkNavbar = isHomePage && !isScrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDarkNavbar
        ? 'bg-[#090b0e]/75 backdrop-blur-lg border-b border-white/10 text-white py-4'
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200 text-gray-900 py-3 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* KMB Logo Container */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-28 sm:h-11 sm:w-32 bg-white rounded-md p-1 border border-gray-300 shadow-sm transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.jpg"
                alt="KOVAI MOTOBIKES Logo"
                fill
                priority
                className="object-contain p-0.5"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1 rounded-full px-3 py-1 ${
            isDarkNavbar 
              ? 'bg-[#090b0e]/60 border border-white/10 backdrop-blur-md' 
              : 'bg-gray-100/80 border border-gray-200'
          }`}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider font-sans rounded-full transition-all ${
                  isActive(link.href)
                    ? 'bg-[#d32f2f] text-white shadow-sm'
                    : isDarkNavbar
                      ? 'text-gray-300 hover:text-white hover:bg-white/10'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            <a
              href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs font-sans font-bold border ${
                isDarkNavbar
                  ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/70 hover:text-white'
                  : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/book-service"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#d32f2f] hover:bg-[#b71c1c] rounded-md transition-all font-sans flex items-center gap-1.5 shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5" />
              Book Service
            </Link>

            <Link
              href="/admin/login"
              title="Staff Login"
              className={`p-2 rounded-md transition-colors ${
                isDarkNavbar ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isDarkNavbar ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-gray-200 shadow-2xl p-5 transition-all text-gray-900 max-h-[calc(100vh-70px)] overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider font-sans rounded-lg flex items-center justify-between min-h-[44px] ${
                  isActive(link.href)
                    ? 'bg-[#d32f2f] text-white shadow-sm'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-200 flex flex-col gap-2.5 mt-2">
              <Link
                href="/book-service"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-white bg-[#d32f2f] hover:bg-[#b71c1c] rounded-lg flex items-center justify-center gap-2 shadow-md font-sans min-h-[44px]"
              >
                <Wrench className="w-4 h-4" />
                Book Service Appointment
              </Link>

              <a
                href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-2 font-sans min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                WhatsApp Sales & Service
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
