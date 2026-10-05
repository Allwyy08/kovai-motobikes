'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycles, createCustomerEnquiry } from '@/lib/data-store';
import MotorcycleCard from '@/components/common/MotorcycleCard';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { showroomConfig } from '@/config/showroom';
import { ArrowRight, Check, AlertCircle, MapPin, Phone, Clock } from 'lucide-react';

export default function HomePage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Direct Enquiry Form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Showroom Inquiry',
    message: ''
  });
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [enquiryError, setEnquiryError] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMotorcycles();
        setMotorcycles(data);
      } catch (err) {
        console.error('Failed to load bikes', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const categories = ['All', 'Commuter', 'Scooter', 'Sport', 'Cruiser', 'Naked'];

  const filteredBikes = activeCategory === 'All'
    ? motorcycles
    : motorcycles.filter((b) => b.category === activeCategory);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryError('');
    if (!enquiryForm.name || !enquiryForm.phone || !enquiryForm.message) return;

    setEnquiryStatus('submitting');
    try {
      await createCustomerEnquiry({
        customer_name: enquiryForm.name,
        phone: enquiryForm.phone,
        email: enquiryForm.email || 'N/A',
        subject: enquiryForm.subject,
        message: enquiryForm.message
      });
      setEnquiryStatus('success');
      setEnquiryForm({ name: '', phone: '', email: '', subject: 'General Showroom Inquiry', message: '' });
    } catch (err: any) {
      setEnquiryStatus('error');
      setEnquiryError(err.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-24 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* ================= 1. HERO SECTION (REAL SHOWROOM PHOTOGRAPH) ================= */}
      <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-end justify-start overflow-hidden bg-[#0A0A0A] pt-24 pb-16 md:pb-24">
        
        {/* Real Showroom Exterior Photo - Focused on Sign & Entrance */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/showroom-exterior.png"
            alt="KOVAI MOTOBIKES Showroom Facade"
            fill
            priority
            className="object-cover object-[center_15%] md:object-center filter contrast-[1.02] opacity-85"
            sizes="100vw"
          />
          
          {/* Restrained cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent" />
        </div>

        {/* Hero Structure */}
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            
            {/* Primary Brand Title */}
            <h1 className="text-[30px] sm:text-[34px] md:text-[52px] lg:text-[58px] font-bold text-white tracking-[-0.025em] leading-[1.02] uppercase font-sans">
              KOVAI MOTOBIKES
            </h1>

            {/* Secondary Supporting Headline */}
            <h2 className="text-[13px] sm:text-[15px] md:text-[18px] lg:text-[20px] font-semibold text-gray-300 tracking-[0.18em] uppercase leading-snug font-sans pt-1">
              ALL TWO-WHEELER SALES & SERVICE
            </h2>

            {/* Short Description */}
            <p className="text-xs sm:text-base md:text-lg text-gray-300 leading-relaxed font-normal max-w-[340px] md:max-w-[620px]">
              Your trusted destination for motorcycles, scooters and professional two-wheeler service in Coimbatore.
            </p>

            {/* Action CTAs with Explicit Hierarchy */}
            <div className="space-y-3 pt-4 w-full">
              {/* Primary Action (Top Row - Full Width on Mobile) */}
              <div>
                <Link
                  href="/motorcycles"
                  className="btn-primary w-full md:w-auto md:min-w-[220px] h-[46px] rounded-[6px] flex items-center justify-center gap-2"
                >
                  <span>EXPLORE MOTORCYCLES</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Secondary Actions (Second Row - Side-by-Side on Mobile) */}
              <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
                <Link
                  href="/book-service"
                  className="flex-1 md:flex-initial h-[42px] px-3 md:px-6 rounded-[6px] border border-white/20 bg-black/40 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-colors hover:bg-white hover:text-black"
                >
                  <span>BOOK A SERVICE</span>
                </Link>

                <a
                  href={`https://wa.me/${showroomConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial h-[42px] px-3 md:px-6 rounded-[6px] bg-[#0F6F5F] hover:bg-[#0C594C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-colors"
                >
                  <span>WHATSAPP SALES</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. HOMEPAGE SECTION 2: EDITORIAL FEATURING ================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 pb-16 border-b border-[#E5E5E5]">
          
          {/* Editorial Split Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-16">
            <div className="md:col-span-6">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-3">
                OUR APPROACH
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase leading-tight">
                BUILT AROUND<br />YOUR RIDE.
              </h2>
            </div>
            
            <div className="md:col-span-6 md:pt-8 text-base text-[#666666] leading-relaxed space-y-4">
              <p>
                At KOVAI MOTOBIKES, we simplify two-wheeler ownership. Whether you are choosing a brand new commuter motorcycle, a high-performance model, or seeking dependable workshop servicing, our process is built on clarity, genuine parts, and transparent guidance.
              </p>
            </div>
          </div>

          {/* Three Simple Feature Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-8 border-t border-[#E5E5E5]">
            <div className="space-y-3">
              <div className="w-8 h-[2px] bg-[#D32F2F]" />
              <h3 className="text-lg font-bold text-[#0A0A0A] uppercase tracking-wide">
                MULTI-BRAND SALES
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Explore a wide spectrum of scooters and motorcycles with clear on-road pricing and prompt registration support.
              </p>
              <div>
                <Link href="/motorcycles" className="link-arrow text-xs pt-1">
                  <span>VIEW MOTORCYCLES</span>
                  <ArrowRight className="w-3.5 h-3.5 arrow-icon text-[#D32F2F]" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-[2px] bg-[#D32F2F]" />
              <h3 className="text-lg font-bold text-[#0A0A0A] uppercase tracking-wide">
                CERTIFIED WORKSHOP
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Periodic maintenance, engine tuning, brake servicing, and electrical diagnostics performed by experienced technicians.
              </p>
              <div>
                <Link href="/book-service" className="link-arrow text-xs pt-1">
                  <span>BOOK SERVICE</span>
                  <ArrowRight className="w-3.5 h-3.5 arrow-icon text-[#D32F2F]" />
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-8 h-[2px] bg-[#D32F2F]" />
              <h3 className="text-lg font-bold text-[#0A0A0A] uppercase tracking-wide">
                GENUINE PARTS
              </h3>
              <p className="text-sm text-[#666666] leading-relaxed">
                Original spare components and factory-recommended lubricants engineered for vehicle longevity and safety.
              </p>
              <div>
                <Link href="/services" className="link-arrow text-xs pt-1">
                  <span>EXPLORE SERVICES</span>
                  <ArrowRight className="w-3.5 h-3.5 arrow-icon text-[#D32F2F]" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ================= 3. MOTORCYCLE SHOWCASE (AUTOMOTIVE CATALOGUE) ================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E5E5E5]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-2">
              CATALOGUE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A0A0A] uppercase">
              FIND YOUR NEXT RIDE
            </h2>
          </div>

          {/* Understated Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-wider font-bold px-4 py-2 transition-colors border ${
                  activeCategory === cat
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white text-[#666666] hover:text-[#0A0A0A] border-[#E5E5E5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Showcase Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-88 bg-gray-200 border border-gray-300" />
            ))}
          </div>
        ) : filteredBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBikes.slice(0, 6).map((bike) => (
              <MotorcycleCard key={bike.id} motorcycle={bike} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center border border-[#E5E5E5] bg-white p-8">
            <h3 className="text-sm font-bold text-[#0A0A0A] uppercase">No motorcycles in this category</h3>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/motorcycles" className="link-arrow text-xs">
            <span>VIEW COMPLETE MOTORCYCLE CATALOGUE ({motorcycles.length})</span>
            <ArrowRight className="w-4 h-4 arrow-icon text-[#D32F2F]" />
          </Link>
        </div>

      </section>

      {/* ================= 4. REAL SHOWROOM & WORKSHOP PRESENTATION ================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0A0A] text-white p-8 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
                WORKSHOP & CARE
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight">
                PRECISION SERVICE.<br />PROFESSIONAL CARE.
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed max-w-md">
                Our workshop is outfitted with computerized diagnostic scanners and dedicated service bays. From routine periodic oil changes to comprehensive engine overhauls, your vehicle receives precision care.
              </p>
              
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link href="/book-service" className="btn-primary">
                  <span>BOOK A SERVICE</span>
                </Link>
                <Link href="/services" className="btn-secondary-light">
                  <span>EXPLORE SERVICES</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative h-72 md:h-96 border border-white/20 overflow-hidden">
              <Image
                src="/images/service-workshop.jpg"
                alt="KOVAI MOTOBIKES Workshop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= 5. REAL CUSTOMER DELIVERY MOMENTS ================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#E5E5E5]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-1">
              PHYSICAL DEALERSHIP
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A] uppercase">
              DELIVERY MOMENTS
            </h2>
          </div>
          <Link href="/gallery" className="link-arrow text-xs">
            <span>VIEW GALLERY</span>
            <ArrowRight className="w-3.5 h-3.5 arrow-icon text-[#D32F2F]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="relative h-72 bg-[#0A0A0A] border border-[#E5E5E5] overflow-hidden group">
            <Image
              src="/images/delivery-1.jpg"
              alt="Delivery Moment at KOVAI MOTOBIKES"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold">Key Handover</span>
              <h3 className="text-xs font-bold text-white uppercase">Burgman Street Handover</h3>
            </div>
          </div>

          <div className="relative h-72 bg-[#0A0A0A] border border-[#E5E5E5] overflow-hidden group">
            <Image
              src="/images/delivery-2.jpg"
              alt="Special Delivery Moment"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold">Showroom Floor</span>
              <h3 className="text-xs font-bold text-white uppercase">Special Customer Moment</h3>
            </div>
          </div>

          <div className="relative h-72 bg-[#0A0A0A] border border-[#E5E5E5] overflow-hidden group">
            <Image
              src="/images/delivery-3.jpg"
              alt="Honda Dio Handover"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-5 flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold">Showroom Facade</span>
              <h3 className="text-xs font-bold text-white uppercase">Honda Dio Delivery</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. DIRECT ENQUIRY & LOCATION ================= */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#E5E5E5] pt-16">
          
          {/* Clean Direct Enquiry Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-2">
                CONTACT
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#0A0A0A] uppercase tracking-tight">
                SEND AN ENQUIRY
              </h3>
              <p className="text-xs text-[#666666] mt-1">
                Inquire about vehicle pricing, upcoming models, or workshop services.
              </p>
            </div>

            {enquiryStatus === 'success' ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 text-center space-y-4">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#0A0A0A] uppercase">Enquiry Received</h4>
                <p className="text-xs text-[#666666]">
                  Thank you for contacting KOVAI MOTOBIKES. We will get back to you promptly.
                </p>
                <button
                  onClick={() => setEnquiryStatus('idle')}
                  className="btn-secondary !h-9 !px-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                {enquiryError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                    <span>{enquiryError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 98422 12345"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A0A0A] mb-1">
                    Message / Enquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="Ask about motorcycle pricing, test ride availability, or service schedules..."
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquiryStatus === 'submitting'}
                  className="btn-primary w-full"
                >
                  {enquiryStatus === 'submitting' ? 'SUBMITTING...' : 'SUBMIT ENQUIRY'}
                </button>
              </form>
            )}
          </div>

          {/* Location & Operating Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5E5E5] p-6 space-y-5">
              <h3 className="text-base font-bold text-[#0A0A0A] uppercase border-l-2 border-[#D32F2F] pl-3">
                DEALERSHIP LOCATION
              </h3>
              
              <div className="space-y-4 text-xs text-[#666666]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#D32F2F] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold text-[#0A0A0A] block">{showroomConfig.name}</span>
                    <p>{showroomConfig.fullAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-[#E5E5E5] pt-3">
                  <Phone className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#0A0A0A] block">Phone Contact</span>
                    <a href={`tel:${showroomConfig.phone}`} className="font-mono text-[#0A0A0A] hover:text-[#D32F2F] font-bold">
                      {showroomConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-[#E5E5E5] pt-3">
                  <Clock className="w-4 h-4 text-[#D32F2F] shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#0A0A0A] block">Operating Hours</span>
                    <p className="text-[#0A0A0A]">Mon - Sat: 9:00 AM - 8:30 PM | Sun: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Container */}
            <div className="h-60 border border-[#E5E5E5] bg-gray-200 relative">
              <iframe
                title="KOVAI MOTOBIKES Google Maps Location"
                src={showroomConfig.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
