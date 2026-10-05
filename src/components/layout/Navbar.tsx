'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { showroomConfig } from '@/config/showroom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
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

  const isDarkHeroNavbar = isHomePage && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[66px] flex items-center ${
        isDarkHeroNavbar
          ? 'bg-black/25 backdrop-blur-md border-b border-white/10 text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] text-[#0A0A0A] shadow-xs'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          
          {/* Logo Left */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-9 md:h-10 w-[105px] md:w-[125px]">
              <Image
                src="/images/kovai-motobikes-logo-transparent.png"
                alt="KOVAI MOTOBIKES"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Centered */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.1em] font-semibold transition-colors relative py-1 ${
                    active
                      ? isDarkHeroNavbar ? 'text-white' : 'text-[#0A0A0A]'
                      : isDarkHeroNavbar
                        ? 'text-gray-300 hover:text-white'
                        : 'text-[#666666] hover:text-[#0A0A0A]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D32F2F]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Action CTAs */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a
              href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors ${
                isDarkHeroNavbar
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-[#666666] hover:text-[#0A0A0A]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>WhatsApp</span>
            </a>

            <Link
              href="/contact"
              className={`btn-primary !h-9 !px-4 !text-[11px]`}
            >
              <span>ENQUIRE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/login"
              title="Staff Portal"
              className={`p-1.5 transition-colors ${
                isDarkHeroNavbar ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-[#0A0A0A]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger Right */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 flex items-center justify-center ${
              isDarkHeroNavbar ? 'text-white' : 'text-[#0A0A0A]'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-[#0A0A0A] text-white border-b border-white/10 p-6 space-y-5 animate-fade-in-up">
          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold uppercase tracking-wider text-gray-300 hover:text-white py-2 border-b border-white/10"
            >
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold uppercase tracking-wider py-2 border-b border-white/10 flex items-center justify-between ${
                  isActive(link.href) ? 'text-[#D32F2F]' : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary w-full text-center"
            >
              ENQUIRE NOW
            </Link>
            <a
              href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-secondary-light w-full text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WHATSAPP SALES & SERVICE</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
