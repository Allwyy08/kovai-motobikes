'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycles, createTestRideRequest } from '@/lib/data-store';
import { Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function TestRideContent() {
  const searchParams = useSearchParams();
  const modelParam = searchParams.get('model') || '';

  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    email: '',
    motorcycle_model: modelParam || '',
    preferred_date: '',
    preferred_time: '11:00 AM',
    has_license: true,
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [requestRef, setRequestRef] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadBikes() {
      try {
        const bikes = await fetchMotorcycles();
        setMotorcycles(bikes);
        if (!modelParam && bikes.length > 0) {
          setFormData((prev) => ({ ...prev, motorcycle_model: bikes[0].name }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadBikes();
  }, [modelParam]);

  useEffect(() => {
    if (modelParam) {
      setFormData((prev) => ({ ...prev, motorcycle_model: modelParam }));
    }
  }, [modelParam]);

  const timeSlots = ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

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
      setErrorMessage('Please select a motorcycle model.');
      return;
    }
    if (!formData.preferred_date) {
      setErrorMessage('Please pick your preferred test ride date.');
      return;
    }
    if (!formData.has_license) {
      setErrorMessage('A valid driver license is required for test rides.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await createTestRideRequest({
        customer_name: formData.customer_name,
        phone: formData.phone,
        email: formData.email || 'N/A',
        motorcycle_model: formData.motorcycle_model,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        message: formData.message
      });

      setRequestRef(res.id);
      setStatus('success');
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit test ride request.');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Top Editorial Hero Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0A0A0A] text-white p-8 md:p-12">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
            EXPERIENCE
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase leading-none">
            TAKE THE NEXT RIDE.
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed font-normal">
            Experience acceleration, braking, and real-road handling at KOVAI MOTOBIKES. Select your preferred vehicle and schedule your visit.
          </p>
        </div>

        <div className="lg:col-span-5 relative h-64 border border-white/20 overflow-hidden">
          <Image
            src="/images/hero-bike.jpg"
            alt="Motorcycle Test Ride"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {status === 'success' ? (
        <div className="bg-white border border-emerald-300 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto">
          <Check className="w-10 h-10 text-emerald-600 mx-auto" />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#0A0A0A] uppercase">TEST RIDE SCHEDULED</h2>
            <p className="text-xs text-[#666666]">
              Our sales representative will prepare your target bike on the requested date.
            </p>
          </div>

          <div className="bg-[#F6F6F4] border border-[#E5E5E5] p-5 text-left text-xs space-y-2">
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666] font-semibold">Reference:</span>
              <span className="text-[#D32F2F] font-bold">{requestRef}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666] font-semibold">Customer:</span>
              <span className="text-[#0A0A0A] font-bold">{formData.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-[#E5E5E5] pb-2">
              <span className="text-[#666666] font-semibold">Model:</span>
              <span className="text-[#0A0A0A] font-bold">{formData.motorcycle_model}</span>
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
                  motorcycle_model: motorcycles[0]?.name || '',
                  preferred_date: '',
                  preferred_time: '11:00 AM',
                  has_license: true,
                  message: ''
                });
              }}
              className="btn-secondary !h-10 !px-4"
            >
              Book Another Ride
            </button>
            <Link href="/motorcycles" className="btn-primary !h-10 !px-4">
              Browse Catalogue
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] p-8 sm:p-12 max-w-2xl mx-auto space-y-6">
          
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            
            <div>
              <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                Motorcycle Model *
              </label>
              <select
                value={formData.motorcycle_model}
                onChange={(e) => setFormData({ ...formData, motorcycle_model: e.target.value })}
                className="input-field"
              >
                {motorcycles.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

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
                Rider Experience / Notes
              </label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention any specific trade-in or model questions..."
                className="input-field"
              />
            </div>

            <label className="flex items-center gap-3 p-3.5 bg-[#F6F6F4] border border-[#E5E5E5] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.has_license}
                onChange={(e) => setFormData({ ...formData, has_license: e.target.checked })}
                className="w-4 h-4 accent-[#D32F2F]"
              />
              <span className="text-[11px] text-[#666666]">
                I confirm that I possess a valid two-wheeler driving license.
              </span>
            </label>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-primary w-full"
            >
              {status === 'submitting' ? 'REQUESTING...' : 'REQUEST TEST RIDE'}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

export default function TestRidePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-24 text-center font-mono text-gray-400">Loading form...</div>}>
      <TestRideContent />
    </Suspense>
  );
}
