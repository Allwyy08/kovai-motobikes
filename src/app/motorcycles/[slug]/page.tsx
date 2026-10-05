'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycleBySlug, createCustomerEnquiry } from '@/lib/data-store';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { 
  Zap, 
  Gauge, 
  Fuel, 
  Wrench, 
  ShieldCheck, 
  Compass, 
  MessageSquare, 
  ChevronLeft, 
  ArrowRight,
  Flame,
  Check,
  X,
  Palette,
  AlertCircle
} from 'lucide-react';

export default function MotorcycleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [bike, setBike] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const found = await fetchMotorcycleBySlug(slug);
        setBike(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-mono text-gray-400">Loading model specifications...</p>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-[#121824] rounded-3xl border border-white/10 my-12 space-y-4">
        <h2 className="text-2xl font-bold text-white font-mono">Motorcycle Model Not Found</h2>
        <p className="text-sm text-gray-400">The model you requested might have been moved or updated in our showroom inventory.</p>
        <Link
          href="/motorcycles"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-xl font-mono"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Motorcycles Catalogue
        </Link>
      </div>
    );
  }

  const galleryImages = bike.gallery_urls && bike.gallery_urls.length > 0 
    ? bike.gallery_urls 
    : [bike.image_url];

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.phone) return;

    setFormStatus('submitting');
    try {
      await createCustomerEnquiry({
        customer_name: form.name,
        phone: form.phone,
        email: form.email || 'N/A',
        subject: `Enquiry for ${bike.name}`,
        message: form.message || `Customer interested in purchasing or getting quote for ${bike.name}.`
      });
      setFormStatus('success');
      setTimeout(() => {
        setShowEnquiryModal(false);
        setFormStatus('idle');
      }, 2000);
    } catch (e: any) {
      setFormStatus('error');
      setFormError(e.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      
      {/* Breadcrumb Nav */}
      <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
        <Link href="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link href="/motorcycles" className="hover:text-gray-900">Motorcycles</Link>
        <span>/</span>
        <span className="text-[#d32f2f] font-bold">{bike.name}</span>
      </div>

      {/* Main Spec & Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Image Gallery Viewer */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Main Image */}
          <div className="relative h-[400px] sm:h-[500px] w-full bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            <Image
              src={galleryImages[activeImageIndex] || bike.image_url}
              alt={bike.name}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute top-4 left-4 bg-[#d32f2f] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              {bike.category}
            </div>
            {bike.is_featured && (
              <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider px-3 py-1 rounded flex items-center gap-1 shadow-sm">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Featured Model
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx 
                      ? 'border-[#d32f2f] shadow-sm opacity-100' 
                      : 'border-gray-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={imgUrl} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Available Color Options */}
          {bike.available_colors && bike.available_colors.length > 0 && (
            <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-gray-900 text-xs font-bold uppercase">
                <Palette className="w-4 h-4 text-[#d32f2f]" />
                <span>Available Color Options</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {bike.available_colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-1.5 rounded bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Model Specs & Call to Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
              Official Dealer Inventory
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight uppercase">
              {bike.name}
            </h1>
            <p className="text-xs text-gray-600 mt-2">Engine: {bike.engine}</p>
          </div>

          {/* Price Header Box */}
          <div className="bg-white border border-gray-200 p-6 rounded-xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs text-gray-500 uppercase block font-semibold">Ex-Showroom Starting Price</span>
              <span className="text-3xl font-extrabold text-[#d32f2f] tracking-tight">
                ₹{bike.price.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase rounded">
              In Stock
            </span>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href={`/test-ride?model=${encodeURIComponent(bike.name)}`}
                className="py-3.5 px-4 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Compass className="w-4 h-4" />
                Book Test Ride
              </Link>

              <button
                onClick={() => setShowEnquiryModal(true)}
                className="py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 text-[#d32f2f]" />
                Enquire Now
              </button>
            </div>

            <WhatsAppButton
              variant="button"
              message={`Hello, I would like to inquire about price quote and test ride availability for ${bike.name}.`}
              label={`WhatsApp Us About ${bike.name}`}
              className="w-full justify-center !py-3.5 !text-xs"
            />
          </div>

          {/* Technical Specification Matrix */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-2 border-[#d32f2f] pl-3">
              KEY TECHNICAL SPECIFICATIONS
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Engine Displacement</span>
                <span className="text-gray-900 font-bold">{bike.engine_capacity_cc} cc</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Maximum Power</span>
                <span className="text-gray-900 font-bold">{bike.power}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Maximum Torque</span>
                <span className="text-gray-900 font-bold">{bike.torque}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Fuel Efficiency</span>
                <span className="text-gray-900 font-bold">{bike.mileage}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Transmission</span>
                <span className="text-gray-900 font-bold">{bike.transmission}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Fuel Tank Capacity</span>
                <span className="text-gray-900 font-bold">{bike.fuel_capacity}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Braking System</span>
                <span className="text-gray-900 font-bold">{bike.brakes}</span>
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-1 shadow-sm">
                <span className="text-[10px] text-gray-500 uppercase block font-semibold">Seat Height / Weight</span>
                <span className="text-gray-900 font-bold">{bike.seat_height || 'N/A'} / {bike.weight || 'N/A'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Description Section */}
      <div className="bg-white border border-gray-200 p-8 rounded-2xl space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 border-l-2 border-[#d32f2f] pl-3 uppercase">
          DETAILED OVERVIEW & FEATURES
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {bike.description}
        </p>
      </div>

      {/* Direct Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 relative shadow-2xl">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
                Model Enquiry
              </span>
              <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
            </div>

            {formStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">Enquiry Received!</h4>
                <p className="text-xs text-gray-600">Our dealership team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#d32f2f] shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98422 00000"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={`Inquire about financing options or delivery date for ${bike.name}...`}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-sm uppercase rounded-md transition-all min-h-[44px]"
                >
                  {formStatus === 'submitting' ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
