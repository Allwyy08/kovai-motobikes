'use client';

import React, { useEffect, useState } from 'react';
import { Motorcycle, MotorcycleCategory } from '@/lib/types';
import { fetchMotorcycles, createCustomerEnquiry } from '@/lib/data-store';
import MotorcycleCard from '@/components/common/MotorcycleCard';
import { Search, Filter, SlidersHorizontal, Bike, X, Check, AlertCircle } from 'lucide-react';

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [capacityRange, setCapacityRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'capacity-desc'>('featured');

  // Quick Enquiry Modal state
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

  const categories: string[] = ['All', 'Sport', 'Cruiser', 'Adventure', 'Naked', 'Scooter', 'Touring'];

  const capacityOptions = [
    { label: 'All Capacities', value: 'All' },
    { label: 'Under 300cc', value: 'under-300' },
    { label: '300cc - 800cc', value: '300-800' },
    { label: '800cc - 1200cc', value: '800-1200' },
    { label: 'Above 1200cc', value: 'above-1200' },
  ];

  // Filtering logic
  const filteredBikes = motorcycles.filter((bike) => {
    // Search match
    const matchesSearch = bike.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bike.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bike.engine.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category match
    const matchesCategory = selectedCategory === 'All' || bike.category === selectedCategory;

    // Engine capacity match
    let matchesCapacity = true;
    if (capacityRange === 'under-300') matchesCapacity = bike.engine_capacity_cc < 300;
    else if (capacityRange === '300-800') matchesCapacity = bike.engine_capacity_cc >= 300 && bike.engine_capacity_cc <= 800;
    else if (capacityRange === '800-1200') matchesCapacity = bike.engine_capacity_cc > 800 && bike.engine_capacity_cc <= 1200;
    else if (capacityRange === 'above-1200') matchesCapacity = bike.engine_capacity_cc > 1200;

    return matchesSearch && matchesCategory && matchesCapacity;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'capacity-desc') return b.engine_capacity_cc - a.engine_capacity_cc;
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
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
        message: modalForm.message || `Customer inquired about pricing and availability for ${enquiryModalBike.name}.`
      });
      setModalStatus('success');
      setTimeout(() => {
        setEnquiryModalBike(null);
        setModalStatus('idle');
        setModalForm({ name: '', phone: '', email: '', message: '' });
      }, 2500);
    } catch (e: any) {
      setModalStatus('error');
      setModalError(e.message || 'Failed to submit enquiry. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-8 space-y-3 text-left">
        <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
          Full Showroom Inventory
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          MOTORCYCLE MODELS & CATALOGUE
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
          Browse our complete selection of motorcycles, scooters, commuter bikes, and performance models at KOVAI MOTOBIKES.
        </p>
      </div>

      {/* Control Bar: Search, Category Tabs, Filters, Sort */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
        
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Bar */}
          <div className="md:col-span-7 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model name, engine specs, or keywords..."
              className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Engine Capacity Dropdown */}
          <div className="md:col-span-3">
            <select
              value={capacityRange}
              onChange={(e) => setCapacityRange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
            >
              {capacityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="capacity-desc">Engine Capacity</option>
            </select>
          </div>

        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-gray-100 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#d32f2f] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>Showing {filteredBikes.length} {filteredBikes.length === 1 ? 'Motorcycle' : 'Motorcycles'}</span>
        {(searchQuery || selectedCategory !== 'All' || capacityRange !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setCapacityRange('All');
            }}
            className="text-[#d32f2f] hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      {/* Motorcycle Catalogue Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 bg-gray-100 rounded-2xl border border-gray-200 animate-pulse" />
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
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No motorcycles match your filter criteria</h3>
          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
            Try adjusting your search keywords, engine capacity range, or category filter to discover models.
          </p>
        </div>
      )}

      {/* Quick Enquiry Modal */}
      {enquiryModalBike && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            
            <button
              onClick={() => setEnquiryModalBike(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d32f2f] block mb-1 font-bold">
                Quick Model Enquiry
              </span>
              <h3 className="text-xl font-bold text-gray-900">{enquiryModalBike.name}</h3>
              <p className="text-xs text-gray-600 mt-1">Starting Price: ₹{enquiryModalBike.price.toLocaleString('en-IN')}</p>
            </div>

            {modalStatus === 'success' ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-gray-900">Enquiry Sent!</h4>
                <p className="text-xs text-gray-600">We will reach out to you with details on {enquiryModalBike.name}.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
                {modalError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#d32f2f] shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={modalForm.phone}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="+91 98422 00000"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
                  <input
                    type="email"
                    value={modalForm.email}
                    onChange={(e) => setModalForm({ ...modalForm, email: e.target.value })}
                    placeholder="ramesh@example.com"
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Additional Message</label>
                  <textarea
                    rows={3}
                    value={modalForm.message}
                    onChange={(e) => setModalForm({ ...modalForm, message: e.target.value })}
                    placeholder="Ask about financing, colors, or availability date..."
                    className="w-full bg-white border border-gray-300 rounded-md px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalStatus === 'submitting'}
                  className="w-full py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-sm uppercase rounded-md transition-all shadow-sm min-h-[44px]"
                >
                  {modalStatus === 'submitting' ? 'Sending...' : 'Send Enquiry'}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
