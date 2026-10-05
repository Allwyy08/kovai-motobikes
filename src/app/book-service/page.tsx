'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createServiceBooking } from '@/lib/data-store';
import { Wrench, Calendar, Clock, Check, AlertCircle, ShieldCheck, Phone } from 'lucide-react';
import Link from 'next/link';
import { showroomConfig } from '@/config/showroom';

function ServiceBookingContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    motorcycle_model: '',
    registration_number: '',
    preferred_date: '',
    preferred_time: '10:00 AM',
    service_type: serviceParam || 'General Maintenance Service',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [bookingRef, setBookingRef] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service_type: serviceParam }));
    }
  }, [serviceParam]);

  const serviceOptions = [
    'General Maintenance Service',
    'Engine Oil & Filter Change',
    'Brake System Maintenance',
    'Engine Overhaul & Tuning',
    'Electrical & Diagnostic Scan',
    'Tyre Fitment & Balancing',
    'Periodic Milestone Maintenance',
    'Advanced Computer Diagnostics',
    'Showroom Detailing & Wash'
  ];

  const timeSlots = [
    '09:00 AM',
    '10:30 AM',
    '12:00 PM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customer_name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setErrorMessage('Please enter a valid phone number.');
      return;
    }
    if (!formData.motorcycle_model.trim()) {
      setErrorMessage('Please specify your motorcycle model.');
      return;
    }
    if (!formData.registration_number.trim()) {
      setErrorMessage('Please provide your motorcycle registration number.');
      return;
    }
    if (!formData.preferred_date) {
      setErrorMessage('Please pick a preferred appointment date.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await createServiceBooking({
        customer_name: formData.customer_name,
        phone: formData.phone,
        email: formData.email || 'N/A',
        motorcycle_model: formData.motorcycle_model,
        registration_number: formData.registration_number,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        service_type: formData.service_type,
        message: formData.message
      });

      setBookingRef(res.id);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit service booking. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6 space-y-2">
        <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
          Workshop Appointment
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tight">
          BOOK A SERVICE APPOINTMENT
        </h1>
        <p className="text-gray-600 text-xs sm:text-sm max-w-xl leading-relaxed">
          Reserve your service slot at KOVAI MOTOBIKES workshop. We will confirm your appointment via call or WhatsApp.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-white border border-emerald-300 p-8 rounded-2xl text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <Check className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-gray-900 uppercase">SERVICE BOOKING CONFIRMED!</h2>
            <p className="text-xs text-gray-600">Your appointment request has been logged in our workshop system.</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl text-left space-y-2 text-xs text-gray-800">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Booking Reference:</span>
              <span className="text-[#d32f2f] font-bold">{bookingRef}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Customer:</span>
              <span className="text-gray-900 font-bold">{formData.customer_name} ({formData.phone})</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Vehicle:</span>
              <span className="text-gray-900 font-bold">{formData.motorcycle_model} ({formData.registration_number})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Scheduled Date:</span>
              <span className="text-emerald-700 font-bold">{formData.preferred_date} @ {formData.preferred_time}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setStatus('idle');
                setFormData({
                  customer_name: '',
                  phone: '',
                  email: '',
                  motorcycle_model: '',
                  registration_number: '',
                  preferred_date: '',
                  preferred_time: '10:00 AM',
                  service_type: 'General Maintenance Service',
                  message: ''
                });
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase rounded-md border border-gray-300"
            >
              Book Another Service
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase rounded-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        /* Two Column Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Workshop Prep & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 uppercase border-l-2 border-[#d32f2f] pl-3">
                WORKSHOP PREPARATION
              </h3>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                When bringing your motorcycle or scooter to KOVAI MOTOBIKES workshop at Podanur Main Road:
              </p>

              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d32f2f] shrink-0" />
                  <span>Bring vehicle registration & RC copy.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d32f2f] shrink-0" />
                  <span>Mention any specific engine or brake symptoms.</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#d32f2f] shrink-0" />
                  <span>Original spare parts & oil changes guaranteed.</span>
                </li>
              </ul>
            </div>

            <div className="relative h-56 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <Image
                src="/images/service-workshop.jpg"
                alt="KOVAI MOTOBIKES Workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
            
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#d32f2f] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Customer Info */}
              <div className="space-y-3">
                <span className="text-[10px] text-[#d32f2f] uppercase font-bold tracking-widest block">1. Customer Information</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98422 12345"
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-[#d32f2f] uppercase font-bold tracking-widest block">2. Motorcycle / Scooter Info</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Vehicle Model *</label>
                    <input
                      type="text"
                      required
                      value={formData.motorcycle_model}
                      onChange={(e) => setFormData({ ...formData, motorcycle_model: e.target.value })}
                      placeholder="e.g. Suzuki Burgman 125"
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Registration / Number Plate *</label>
                    <input
                      type="text"
                      required
                      value={formData.registration_number}
                      onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                      placeholder="e.g. TN-37-AB-1234"
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 uppercase focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* Service & Date */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-[#d32f2f] uppercase font-bold tracking-widest block">3. Service & Schedule</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Service Type *</label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.preferred_date}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Time Slot *</label>
                    <select
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f] min-h-[44px]"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Additional Service Notes</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention any specific issue or additional work needed..."
                    className="w-full bg-white border border-gray-300 rounded-md px-3.5 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Wrench className="w-4 h-4" />
                {status === 'submitting' ? 'Confirming Appointment...' : 'Submit Service Booking'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function BookServicePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center text-gray-400 font-mono">Loading service booking...</div>}>
      <ServiceBookingContent />
    </Suspense>
  );
}
