'use client';

import React, { useEffect, useState } from 'react';
import { Motorcycle } from '@/lib/types';
import { fetchMotorcycles, createCustomerEnquiry } from '@/lib/data-store';
import MotorcycleCard from '@/components/common/MotorcycleCard';
import { Search, X, Check, AlertCircle } from 'lucide-react';

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Quick Enquiry Modal
  const [enquiryModalBike, setEnquiryModalBike] = useState<Motorcycle | null>(null);
  const [modalForm, setModalForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [modalStatus, setModalStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [modalError, setModalError] = useState<string>('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMotorcycles();
        setMotorcycles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories: string[] = ['All', 'Commuter', 'Scooter', 'Sport', 'Cruiser', 'Naked'];

  const filteredBikes = motorcycles.filter((bike) => {
    const matchesSearch =
      bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.engine.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || bike.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!enquiryModalBike || !modalForm.name || !modalForm.phone) return;

    setModalStatus('submitting');
    try {
      await createCustomerEnquiry({
        customer_name: modalForm.name,
        phone: modalForm.phone,
        email: modalForm.email || 'N/A',
        subject: `Enquiry for ${enquiryModalBike.name}`,
        message: modalForm.message || `Customer inquired about ${enquiryModalBike.name}.`
      });
      setModalStatus('success');
      setTimeout(() => {
        setEnquiryModalBike(null);
        setModalStatus('idle');
        setModalForm({ name: '', phone: '', email: '', message: '' });
      }, 2000);
    } catch (e: any) {
      setModalStatus('error');
      setModalError(e.message || 'Failed to submit enquiry.');
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Top Header */}
      <div className="border-b border-[#E5E5E5] pb-8 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
          CATALOGUE
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase">
          MOTORCYCLES
        </h1>
        <p className="text-[#666666] text-sm max-w-xl leading-relaxed">
          Explore our range of motorcycles and scooters.
        </p>
      </div>

      {/* Control Bar: Search & Understated Filters */}
      <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search model name or keywords..."
            className="input-field !pl-10 !py-2.5 text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0A0A0A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clean Understated Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-[#E5E5E5] no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs uppercase tracking-wider font-bold px-4 py-2 transition-colors border ${
                selectedCategory === cat
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                  : 'bg-white text-[#666666] hover:text-[#0A0A0A] border-[#E5E5E5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-gray-200 border border-gray-300 animate-pulse" />
          ))}
        </div>
      ) : filteredBikes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBikes.map((bike) => (
            <MotorcycleCard
              key={bike.id}
              motorcycle={bike}
              onEnquire={(b) => setEnquiryModalBike(b)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#E5E5E5] p-8">
          <h3 className="text-base font-bold text-[#0A0A0A] uppercase">No motorcycles match your criteria</h3>
          <p className="text-xs text-[#666666] mt-1">Try resetting your search or category filter.</p>
        </div>
      )}

      {/* Quick Enquiry Modal */}
      {enquiryModalBike && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 max-w-md w-full relative space-y-5">
            <button
              onClick={() => setEnquiryModalBike(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                ENQUIRY
              </span>
              <h3 className="text-xl font-bold text-[#0A0A0A] uppercase">{enquiryModalBike.name}</h3>
            </div>

            {modalStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-[#0A0A0A] uppercase">Enquiry Sent</h4>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={modalForm.phone}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="+91 98422 12345"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={modalForm.message}
                    onChange={(e) => setModalForm({ ...modalForm, message: e.target.value })}
                    placeholder="Inquire about delivery timeline or financing..."
                    className="input-field"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalStatus === 'submitting'}
                  className="btn-primary w-full"
                >
                  {modalStatus === 'submitting' ? 'SENDING...' : 'SEND ENQUIRY'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
