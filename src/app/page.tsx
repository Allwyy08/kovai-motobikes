'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycles, createCustomerEnquiry } from '@/lib/data-store';
import MotorcycleCard from '@/components/common/MotorcycleCard';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { showroomConfig } from '@/config/showroom';
import { 
  Bike, 
  Wrench, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  Check,
  Send,
  AlertCircle
} from 'lucide-react';

export default function HomePage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Enquiry form state
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
    : motorcycles.filter(b => b.category === activeCategory);

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
    <div className="space-y-20 pb-16">
      
      {/* ================= 1. HERO SECTION (REAL SHOWROOM PHOTOGRAPH) ================= */}
      <section className="relative min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] flex items-center justify-center overflow-hidden -mt-24 pt-28 bg-[#090b0e]">
        
        {/* Full-Width Real Showroom Photo Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/showroom-exterior.png"
            alt="KOVAI MOTOBIKES Real Showroom Facade"
            fill
            priority
            className="object-cover object-[center_top] sm:object-center opacity-85 sm:opacity-90 filter contrast-[1.08] transition-transform duration-1000 ease-out scale-[1.02]"
            sizes="100vw"
          />
          
          {/* Subtle Directional Gradient Mask for Left Text Legibility without Hiding the Storefront */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b0e]/95 via-[#090b0e]/75 sm:via-[#090b0e]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-[#090b0e]/50" />
        </div>

        {/* Integrated Hero Text Content (No Floating Image Card on Right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 w-full">
          <div className="max-w-3xl space-y-6 text-left">
            
            {/* Location Tag */}
            <div className="animate-fade-in-up delay-100 inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#090b0e]/75 border border-white/15 backdrop-blur-md text-[11px] font-sans text-red-400 font-semibold tracking-wider uppercase shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-[#d32f2f]" />
              <span>Coimbatore South · Podanur Main Road</span>
            </div>

            {/* Main Primary Hero Heading & Hierarchy */}
            <div className="animate-fade-in-up delay-200 space-y-3">
              <h1 className="text-3xl xs:text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-[-0.03em] sm:tracking-[-0.04em] leading-[0.98] sm:leading-[0.95] uppercase font-sans drop-shadow-lg break-words">
                KOVAI MOTOBIKES
              </h1>
              <h2 className="text-base sm:text-2xl lg:text-3xl font-semibold text-white tracking-tight leading-snug font-sans">
                All Two-Wheeler <span className="text-[#d32f2f]">Sales & Service</span>
              </h2>
            </div>

            {/* Concise Supporting Copy */}
            <p className="animate-fade-in-up delay-300 text-xs sm:text-base text-gray-200 max-w-xl leading-relaxed font-sans drop-shadow">
              Your trusted destination for motorcycles, scooters and professional two-wheeler service in Coimbatore. Experience transparent sales, genuine parts, and expert maintenance.
            </p>

            {/* Integrated Action Buttons */}
            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3 font-sans">
              <Link
                href="/motorcycles"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-lg transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Bike className="w-4 h-4" />
                Explore Motorcycles
              </Link>

              <Link
                href="/book-service"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#090b0e]/80 hover:bg-[#090b0e] text-white font-bold text-xs uppercase tracking-wider border border-white/20 rounded-md backdrop-blur-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Wrench className="w-4 h-4 text-red-400" />
                Book a Service
              </Link>

              <WhatsAppButton 
                variant="button" 
                label="WhatsApp Sales" 
                className="w-full sm:w-auto !px-5 !py-3.5 !text-xs !font-sans uppercase justify-center min-h-[44px]" 
              />
            </div>

          </div>
        </div>
      </section>

      {/* ================= 2. QUICK BUSINESS HIGHLIGHTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 font-sans">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 text-[#d32f2f] flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 uppercase">Multi-Brand Sales</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Explore motorcycles and scooters with on-road pricing, clear specs, and hassle-free documentation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 font-sans">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 text-[#d32f2f] flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 uppercase">Certified Workshop</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Periodic maintenance, oil changes, brake service, engine tuning, and electronic diagnostics.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3 font-sans">
            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 text-[#d32f2f] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 uppercase">Genuine Components</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We install original spare parts and factory-recommended lubricants for long-term engine life.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 3. FEATURED MOTORCYCLES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
              Current Inventory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
              FEATURED TWO-WHEELERS
            </h2>
          </div>
          <Link
            href="/motorcycles"
            className="text-xs font-bold text-[#d32f2f] hover:text-[#b71c1c] flex items-center gap-1 uppercase"
          >
            View Complete Catalogue ({motorcycles.length})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#d32f2f] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Motorcycles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-88 bg-gray-100 rounded-xl border border-gray-200" />
            ))}
          </div>
        ) : filteredBikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBikes.slice(0, 6).map((bike) => (
              <MotorcycleCard key={bike.id} motorcycle={bike} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-6">
            <Bike className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-gray-900">No models match this category</h3>
          </div>
        )}
      </section>

      {/* ================= 4. REAL SHOWROOM & DELIVERY MOMENTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
              Customer Experience
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
              DELIVERY MOMENTS AT KOVAI MOTOBIKES
            </h2>
          </div>
          <Link href="/gallery" className="text-xs font-bold text-[#d32f2f] hover:text-[#b71c1c] flex items-center gap-1 uppercase">
            View Gallery <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200 group shadow-sm bg-white">
            <Image
              src="/images/delivery-1.jpg"
              alt="Suzuki Burgman Delivery at KOVAI MOTOBIKES"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] uppercase text-red-400 font-bold tracking-wider">Key Handover</span>
              <h3 className="text-xs font-bold text-white uppercase">Suzuki Burgman Street Delivery</h3>
            </div>
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200 group shadow-sm bg-white">
            <Image
              src="/images/delivery-2.jpg"
              alt="Suzuki Avenis Night Delivery"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] uppercase text-red-400 font-bold tracking-wider">Celebration</span>
              <h3 className="text-xs font-bold text-white uppercase">Special Delivery Moment</h3>
            </div>
          </div>

          <div className="relative h-64 rounded-xl overflow-hidden border border-gray-200 group shadow-sm bg-white">
            <Image
              src="/images/delivery-3.jpg"
              alt="Honda Dio Delivery at KOVAI MOTOBIKES Facade"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
              <span className="text-[10px] uppercase text-red-400 font-bold tracking-wider">Showroom Entrance</span>
              <h3 className="text-xs font-bold text-white uppercase">Honda Dio Handover</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SERVICE BOOKING CTA BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-50 via-white to-gray-50 border border-red-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="px-3 py-1 rounded bg-red-100 text-[#d32f2f] border border-red-200 text-[10px] uppercase tracking-widest inline-block font-bold">
              Certified Workshop
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase leading-tight">
              NEED SERVICE OR REPAIR FOR YOUR BIKE?
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              Schedule your appointment online. Our mechanics will inspect, service, and prepare your vehicle on time.
            </p>
          </div>
          <Link
            href="/book-service"
            className="px-6 py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-all shrink-0 flex items-center gap-2 min-h-[44px]"
          >
            <Wrench className="w-4 h-4" />
            Book Service Slot
          </Link>
        </div>
      </section>

      {/* ================= 6. ENQUIRY & LOCATION SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Direct Customer Enquiry Form */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl space-y-5 shadow-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
                Customer Support
              </span>
              <h3 className="text-xl font-bold text-gray-900 uppercase">
                SEND AN ENQUIRY TO KOVAI MOTOBIKES
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Inquire about motorcycle pricing, upcoming models, or service availability.
              </p>
            </div>

            {enquiryStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                <Check className="w-7 h-7 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900 uppercase">Enquiry Submitted!</h4>
                <p className="text-xs text-gray-600">
                  Thank you for contacting KOVAI MOTOBIKES. We will respond promptly.
                </p>
                <button
                  onClick={() => setEnquiryStatus('idle')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase rounded-md text-gray-800 mt-2"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                {enquiryError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#d32f2f] shrink-0" />
                    <span>{enquiryError}</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                      placeholder="+91 98422 00000"
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Message / Enquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    placeholder="Ask about model availability, test rides, or service queries..."
                    className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={enquiryStatus === 'submitting'}
                  className="w-full py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Send className="w-4 h-4" />
                  {enquiryStatus === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Location & Showroom Address */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 uppercase border-l-2 border-[#d32f2f] pl-3">
                VISIT KOVAI MOTOBIKES
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#d32f2f] shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="text-gray-500 uppercase block text-[10px] font-bold">Showroom Address</span>
                    <span className="text-gray-900 font-bold">{showroomConfig.name}</span><br />
                    <span className="text-gray-700">{showroomConfig.address},</span><br />
                    <span className="text-gray-700">{showroomConfig.landmark},</span><br />
                    <span className="text-gray-700">{showroomConfig.area}, {showroomConfig.city}, {showroomConfig.state} {showroomConfig.pincode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <Phone className="w-4 h-4 text-[#d32f2f] shrink-0" />
                  <div>
                    <span className="text-gray-500 uppercase block text-[10px] font-bold">Call Direct</span>
                    <a href={`tel:${showroomConfig.phone}`} className="text-gray-900 font-bold hover:text-[#d32f2f]">{showroomConfig.phone}</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                  <Clock className="w-4 h-4 text-[#d32f2f] shrink-0" />
                  <div>
                    <span className="text-gray-500 uppercase block text-[10px] font-bold">Showroom & Workshop Hours</span>
                    <span className="text-gray-700">Mon - Sat: 9:00 AM - 8:30 PM | Sun: 9:00 AM - 2:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Container */}
            <div className="h-56 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 relative shadow-sm">
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
