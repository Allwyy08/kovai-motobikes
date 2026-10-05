'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycles, createTestRideRequest } from '@/lib/data-store';
import { Compass, Calendar, Clock, Check, AlertCircle, ShieldCheck } from 'lucide-react';
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
      setErrorMessage('Please select a motorcycle model for your test ride.');
      return;
    }
    if (!formData.preferred_date) {
      setErrorMessage('Please pick your preferred test ride date.');
      return;
    }
    if (!formData.has_license) {
      setErrorMessage('A valid motorcycle driver license is required for test rides.');
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
      setErrorMessage(err.message || 'Failed to submit test ride request. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
          VIP Test Drive Experience
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 uppercase tracking-tight">
          BOOK YOUR TEST RIDE
        </h1>
        <p className="text-gray-600 text-sm max-w-lg mx-auto leading-relaxed">
          Experience handling, acceleration, and ergonomics firsthand at KOVAI MOTOBIKES. Select your preferred model and schedule your visit.
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-white border border-emerald-300 p-8 rounded-2xl text-center space-y-6 shadow-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 uppercase">TEST RIDE SCHEDULED!</h2>
            <p className="text-sm text-gray-600">
              Our sales representative will prepare your bike for test riding on the requested date.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs text-gray-800">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Request Reference:</span>
              <span className="text-[#d32f2f] font-bold">{requestRef}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Customer:</span>
              <span className="text-gray-900 font-bold">{formData.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-semibold">Target Model:</span>
              <span className="text-gray-900 font-bold">{formData.motorcycle_model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Date & Slot:</span>
              <span className="text-emerald-700 font-bold">{formData.preferred_date} @ {formData.preferred_time}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
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
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase rounded-md border border-gray-300"
            >
              Book Another Ride
            </button>
            <Link
              href="/motorcycles"
              className="px-6 py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase rounded-md shadow-sm"
            >
              Browse Inventory
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6 sm:p-10 rounded-2xl shadow-sm space-y-6">
          
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#d32f2f] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Model Selection */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-2 border-[#d32f2f] pl-3">
                1. SELECT MOTORCYCLE MODEL
              </h3>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Target Motorcycle Model *
                </label>
                <select
                  value={formData.motorcycle_model}
                  onChange={(e) => setFormData({ ...formData, motorcycle_model: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                >
                  {motorcycles.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.category} - {m.engine_capacity_cc}cc)
                    </option>
                  ))}
                  <option value="Other Model / Special Inquiry">Other Model / Custom Inquiry</option>
                </select>
              </div>
            </div>

            {/* Rider Details */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-2 border-[#d32f2f] pl-3">
                2. RIDER CONTACT DETAILS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98422 00000"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-l-2 border-[#d32f2f] pl-3">
                3. PREFERRED DATE & TIME
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.preferred_date}
                    onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={formData.preferred_time}
                    onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  >
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Rider Notes or Riding Experience
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us if you have trade-in questions or specific riding gear requirements..."
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                />
              </div>

              {/* License Checkbox */}
              <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.has_license}
                  onChange={(e) => setFormData({ ...formData, has_license: e.target.checked })}
                  className="w-4 h-4 accent-[#d32f2f] rounded"
                />
                <span className="text-xs text-gray-700">
                  I confirm that I possess a valid motorcycle driver's license and agree to wear protective helmet/gear during the test ride.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-sm uppercase tracking-wider rounded-md shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Compass className="w-5 h-5" />
              {status === 'submitting' ? 'Booking Test Ride...' : 'Confirm Test Ride Booking'}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}

export default function TestRidePage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center font-mono text-gray-400">Loading test ride form...</div>}>
      <TestRideContent />
    </Suspense>
  );
}
