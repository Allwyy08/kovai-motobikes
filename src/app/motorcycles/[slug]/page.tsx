'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycleBySlug, createCustomerEnquiry } from '@/lib/data-store';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { ChevronLeft, Check, X, AlertCircle } from 'lucide-react';

export default function MotorcycleDetailsPage() {
  const params = useParams();
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
      <div className="max-w-[1360px] mx-auto px-4 py-32 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Loading Model...</p>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0A0A0A] uppercase">Motorcycle Model Not Found</h2>
        <Link href="/motorcycles" className="btn-secondary">
          <ChevronLeft className="w-4 h-4" /> Back to Catalogue
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
        message: form.message || `Customer interested in ${bike.name}.`
      });
      setFormStatus('success');
      setTimeout(() => {
        setShowEnquiryModal(false);
        setFormStatus('idle');
      }, 2000);
    } catch (e: any) {
      setFormStatus('error');
      setFormError(e.message || 'Failed to submit enquiry.');
    }
  };

  const nameParts = bike.name.split(' ');
  const brand = nameParts.length > 1 ? nameParts[0].toUpperCase() : bike.category.toUpperCase();
  const modelName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : bike.name;

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#666666] uppercase tracking-wider">
        <Link href="/" className="hover:text-[#0A0A0A]">Home</Link>
        <span>/</span>
        <Link href="/motorcycles" className="hover:text-[#0A0A0A]">Motorcycles</Link>
        <span>/</span>
        <span className="text-[#D32F2F]">{bike.name}</span>
      </div>

      {/* Main Spec & Configurator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
        
        {/* Left Column: Large Photography Gallery */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Large Photo */}
          <div className="relative h-[380px] sm:h-[480px] md:h-[540px] w-full bg-white border border-[#E5E5E5] overflow-hidden">
            <Image
              src={galleryImages[activeImageIndex] || bike.image_url}
              alt={bike.name}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 border transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#D32F2F] opacity-100'
                      : 'border-[#E5E5E5] opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={imgUrl} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Vehicle Configurator Panel */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-2 border-b border-[#E5E5E5] pb-6">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#666666] block">
              {brand}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight uppercase text-[#0A0A0A]">
              {modelName}
            </h1>
            <p className="text-xs text-[#666666] pt-1 leading-relaxed">
              {bike.description}
            </p>
          </div>

          {/* Price Header */}
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-[#666666] block font-semibold">
              EX-SHOWROOM STARTING PRICE
            </span>
            <span className="text-3xl font-bold text-[#0A0A0A] tracking-tight">
              ₹{bike.price.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Key Specifications - Clean Rows System */}
          <div className="space-y-3 pt-4 border-t border-[#E5E5E5]">
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A]">
              TECHNICAL SPECIFICATIONS
            </h3>

            <div className="divide-y divide-[#E5E5E5] text-xs pt-1">
              <div className="py-2.5 flex justify-between">
                <span className="text-[#666666] font-medium uppercase">ENGINE DISPLACEMENT</span>
                <span className="font-bold text-[#0A0A0A]">{bike.engine_capacity_cc} cc</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#666666] font-medium uppercase">MAXIMUM POWER</span>
                <span className="font-bold text-[#0A0A0A]">{bike.power}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#666666] font-medium uppercase">MAXIMUM TORQUE</span>
                <span className="font-bold text-[#0A0A0A]">{bike.torque}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#666666] font-medium uppercase">TRANSMISSION</span>
                <span className="font-bold text-[#0A0A0A]">{bike.transmission}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#666666] font-medium uppercase">FUEL TANK / MILEAGE</span>
                <span className="font-bold text-[#0A0A0A]">{bike.fuel_capacity} · {bike.mileage}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-[#666666] font-medium uppercase">WEIGHT</span>
                <span className="font-bold text-[#0A0A0A]">{bike.weight || 'Standard'}</span>
              </div>
            </div>
          </div>

          {/* Available Colors */}
          {bike.available_colors && bike.available_colors.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-[#E5E5E5]">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#0A0A0A]">
                AVAILABLE COLOURS
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {bike.available_colors.map((color, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white border border-[#E5E5E5] text-xs font-medium text-[#0A0A0A]"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-[#E5E5E5]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setShowEnquiryModal(true)}
                className="btn-primary w-full"
              >
                ENQUIRE NOW
              </button>

              <Link
                href={`/test-ride?model=${encodeURIComponent(bike.name)}`}
                className="btn-secondary w-full"
              >
                BOOK TEST RIDE
              </Link>
            </div>

            <WhatsAppButton
              variant="button"
              message={`Hello KOVAI MOTOBIKES, I would like to inquire about price and test ride for ${bike.name}.`}
              label="WHATSAPP INQUIRY"
              className="w-full"
            />
          </div>

        </div>

      </div>

      {/* Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 max-w-md w-full relative space-y-5">
            <button
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                ENQUIRE NOW
              </span>
              <h3 className="text-xl font-bold text-[#0A0A0A] uppercase">{bike.name}</h3>
            </div>

            {formStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#0A0A0A] uppercase">Enquiry Received</h4>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98422 12345"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Ask about pricing or delivery schedule..."
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="btn-primary w-full"
                >
                  {formStatus === 'submitting' ? 'SUBMITTING...' : 'SUBMIT ENQUIRY'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
