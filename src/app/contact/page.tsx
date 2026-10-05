'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { showroomConfig } from '@/config/showroom';
import { createCustomerEnquiry } from '@/lib/data-store';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { Check, AlertCircle, Copy } from 'lucide-react';

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
      setErrorMessage('Please enter your message.');
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
      setErrorMessage(err.message || 'Failed to submit enquiry.');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-8 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
          LOCATION & CONTACT
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase">
          VISIT KOVAI MOTOBIKES
        </h1>
        <p className="text-[#666666] text-sm max-w-xl leading-relaxed">
          Visit our dealership on Podanur Main Road, Coimbatore, or send us an enquiry online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Dealership Information */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-white border border-[#E5E5E5] p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                DEALERSHIP
              </span>
              <h2 className="text-2xl font-bold text-[#0A0A0A] uppercase tracking-tight">
                {showroomConfig.name}
              </h2>
            </div>

            <div className="space-y-4 text-xs text-[#666666] leading-relaxed">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A] block">Address</span>
                <p className="text-[#0A0A0A] font-medium pt-0.5">{showroomConfig.fullAddress}</p>
                <button
                  onClick={handleCopyAddress}
                  className="mt-2 text-[10px] uppercase font-bold text-[#D32F2F] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Address Copied' : 'Copy Address'}
                </button>
              </div>

              <div className="border-t border-[#E5E5E5] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A] block">Phone Contact</span>
                <a href={`tel:${showroomConfig.phone}`} className="text-[#0A0A0A] font-mono font-bold text-sm hover:text-[#D32F2F]">
                  {showroomConfig.phone}
                </a>
              </div>

              <div className="border-t border-[#E5E5E5] pt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A0A0A] block">Operating Hours</span>
                <p className="text-[#0A0A0A] font-medium pt-0.5">
                  Monday - Saturday: 9:00 AM - 8:30 PM<br />
                  Sunday: 10:00 AM - 2:00 PM
                </p>
              </div>
            </div>

            <div className="pt-2">
              <WhatsAppButton
                variant="button"
                label="WHATSAPP SUPPORT"
                className="w-full"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Google Maps & Enquiry Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Map Embed */}
          <div className="h-64 border border-[#E5E5E5] bg-gray-200 relative">
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

          {/* Form */}
          <div className="bg-white border border-[#E5E5E5] p-8 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                ONLINE INQUIRY
              </span>
              <h3 className="text-xl font-bold text-[#0A0A0A] uppercase">
                SEND A MESSAGE
              </h3>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === 'success' ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#0A0A0A] uppercase">Enquiry Submitted</h4>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-secondary !h-9 !px-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Pricing / Service Query"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you today?..."
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary w-full"
                >
                  {status === 'submitting' ? 'SUBMITTING...' : 'SUBMIT ENQUIRY'}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-24 text-center font-mono text-gray-400">Loading contact page...</div>}>
      <ContactContent />
    </Suspense>
  );
}
