'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createServiceBooking } from '@/lib/data-store';
import { Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

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
    service_type: serviceParam || 'GENERAL SERVICE',
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
    'GENERAL SERVICE',
    'OIL & FILTER',
    'BRAKE SERVICE',
    'ENGINE SERVICE',
    'DIAGNOSTICS',
    'PERIODIC MAINTENANCE'
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
      setErrorMessage('Please provide your vehicle registration number.');
      return;
    }
    if (!formData.preferred_date) {
      setErrorMessage('Please select a preferred date.');
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
      setErrorMessage(err.message || 'Failed to submit service booking.');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-8 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
          WORKSHOP APPOINTMENT
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase">
          BOOK A SERVICE
        </h1>
        <p className="text-[#666666] text-sm max-w-xl leading-relaxed">
          Reserve your service slot at KOVAI MOTOBIKES workshop.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-white border border-emerald-300 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto">
          <Check className="w-10 h-10 text-emerald-600 mx-auto" />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#0A0A0A] uppercase">SERVICE APPOINTMENT LOGGED</h2>
            <p className="text-xs text-[#666666]">Our workshop representative will contact you to confirm timing.</p>
          </div>

          <div className="bg-[#F6F6F4] border border-[#E5E5E5] p-5 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666] font-semibold">Reference:</span>
              <span className="text-[#D32F2F] font-bold">{bookingRef}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666] font-semibold">Customer:</span>
              <span className="text-[#0A0A0A] font-bold">{formData.customer_name} ({formData.phone})</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666] font-semibold">Vehicle:</span>
              <span className="text-[#0A0A0A] font-bold">{formData.motorcycle_model} ({formData.registration_number})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#666666] font-semibold">Scheduled Date:</span>
              <span className="text-[#0A0A0A] font-bold">{formData.preferred_date} @ {formData.preferred_time}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-4">
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
                  service_type: 'GENERAL SERVICE',
                  message: ''
                });
              }}
              className="btn-secondary !h-10 !px-4"
            >
              Book Another Service
            </button>
            <Link href="/" className="btn-primary !h-10 !px-4">
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Large Workshop Image & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative h-72 sm:h-80 w-full border border-[#E5E5E5] bg-[#0A0A0A]">
              <Image
                src="/images/service-workshop.jpg"
                alt="KOVAI MOTOBIKES Service Bay"
                fill
                className="object-cover opacity-80"
              />
            </div>

            <div className="bg-white border border-[#E5E5E5] p-6 space-y-4 text-xs text-[#666666]">
              <h3 className="text-sm font-bold text-[#0A0A0A] uppercase border-l-2 border-[#D32F2F] pl-3">
                WORKSHOP PREPARATION
              </h3>
              <p className="leading-relaxed">
                Please bring your vehicle registration document when dropping off your motorcycle at Podanur Main Road. Our workshop manager will conduct a pre-service walkthrough and estimate turnaround time.
              </p>
            </div>
          </div>

          {/* Right Column: Clean Form */}
          <div className="lg:col-span-7 bg-white border border-[#E5E5E5] p-8 space-y-6">
            
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98422 12345"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motorcycle_model}
                    onChange={(e) => setFormData({ ...formData, motorcycle_model: e.target.value })}
                    placeholder="e.g. Suzuki Burgman 125"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                    placeholder="e.g. TN-37-AB-1234"
                    className="input-field uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Service Type *
                  </label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="input-field"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="input-field"
                  >
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mention specific symptoms or additional tasks..."
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full"
              >
                {status === 'submitting' ? 'CONFIRMING...' : 'SUBMIT SERVICE BOOKING'}
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
    <Suspense fallback={<div className="max-w-4xl mx-auto py-24 text-center font-mono text-gray-400">Loading form...</div>}>
      <ServiceBookingContent />
    </Suspense>
  );
}
