'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { showroomConfig } from '@/config/showroom';
import { createCustomerEnquiry } from '@/lib/data-store';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { MapPin, Phone, Mail, Clock, Check, AlertCircle, Send, Copy } from 'lucide-react';

function ContactContent() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject') || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: subjectParam || 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (subjectParam) {
      setFormData((prev) => ({ ...prev, subject: subjectParam }));
    }
  }, [subjectParam]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(showroomConfig.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setErrorMessage('Please provide a valid phone number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please enter your enquiry message.');
      return;
    }

    setStatus('submitting');
    try {
      await createCustomerEnquiry({
        customer_name: formData.name,
        phone: formData.phone,
        email: formData.email || 'N/A',
        subject: formData.subject,
        message: formData.message
      });

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 font-sans">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
          Location & Contact
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight uppercase">
          VISIT KOVAI MOTOBIKES
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
          Visit our two-wheeler sales & service center in Podanur Main Road, Coimbatore South, or send us a message online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Online Enquiry Form */}
        <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl space-y-6 shadow-sm">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
              Direct Enquiry
            </span>
            <h2 className="text-xl font-bold text-gray-900 uppercase">
              SEND A SHOWROOM INQUIRY
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Our sales and service team will respond to your phone or message promptly.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#d32f2f] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status === 'success' ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-4 animate-in fade-in duration-300">
              <Check className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 uppercase">ENQUIRY SUBMITTED!</h3>
              <p className="text-xs text-gray-600">
                Thank you for reaching out to KOVAI MOTOBIKES. We will get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase rounded-md border border-gray-300"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98422 12345"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Vehicle Price / Service Booking"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can KOVAI MOTOBIKES assist you today?..."
                  className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-md transition-all shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Send className="w-4 h-4" />
                {status === 'submitting' ? 'Submitting...' : 'Submit Customer Enquiry'}
              </button>
            </form>
          )}

        </div>

        {/* Right Column: Address Details & Google Maps */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 uppercase border-l-2 border-[#d32f2f] pl-3">
              SHOWROOM DETAILS
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d32f2f] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-gray-500 uppercase text-[10px] block font-bold">Showroom Address</span>
                  <span className="text-gray-900 font-bold block">{showroomConfig.name}</span>
                  <p className="text-gray-700 leading-relaxed text-xs">
                    {showroomConfig.address},<br />
                    {showroomConfig.landmark},<br />
                    {showroomConfig.area}, {showroomConfig.city},<br />
                    {showroomConfig.state} {showroomConfig.pincode}
                  </p>

                  <button
                    onClick={handleCopyAddress}
                    className="mt-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border border-gray-300 flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Copy className="w-3 h-3 text-[#d32f2f]" />
                    {copied ? 'Address Copied!' : 'Copy Full Address'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                <Phone className="w-4 h-4 text-[#d32f2f] shrink-0" />
                <div>
                  <span className="text-gray-500 uppercase text-[10px] block font-bold">Phone Contact</span>
                  <a href={`tel:${showroomConfig.phone}`} className="text-gray-900 font-bold hover:text-[#d32f2f]">{showroomConfig.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                <Clock className="w-4 h-4 text-[#d32f2f] shrink-0" />
                <div>
                  <span className="text-gray-500 uppercase text-[10px] block font-bold">Operating Hours</span>
                  <span className="text-gray-700">Mon - Sat: 9:00 AM - 8:30 PM | Sun: 9:00 AM - 2:00 PM</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <WhatsAppButton
                variant="button"
                label="Direct WhatsApp Support"
                className="w-full justify-center !py-3 !text-xs"
              />
            </div>
          </div>

          {/* Embedded Map */}
          <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 relative shadow-sm">
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

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-20 text-center font-mono text-gray-400">Loading contact details...</div>}>
      <ContactContent />
    </Suspense>
  );
}
