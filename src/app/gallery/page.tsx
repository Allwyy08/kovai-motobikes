'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/lib/types';
import { fetchGalleryImages } from '@/lib/data-store';
import Lightbox from '@/components/common/Lightbox';
import { Maximize2, ImageIcon } from 'lucide-react';
import { showroomConfig } from '@/config/showroom';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Lightbox index
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGalleryImages();
        setImages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['All', 'Showroom', 'Workshop', 'Motorcycles', 'Deliveries'];

  const filteredImages = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 font-sans bg-[#F6F6F4] text-[#0A0A0A]">
      
      {/* Header */}
      <div className="border-b border-[#E5E5E5] pb-8 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
          PHOTOGRAPHY
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#0A0A0A] uppercase">
          SHOWROOM & DELIVERIES
        </h1>
        <p className="text-[#666666] text-sm max-w-xl leading-relaxed">
          Real moments from {showroomConfig.name} showroom, workshop service bays, and vehicle handovers.
        </p>
      </div>

      {/* Understated Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs uppercase tracking-wider font-bold px-4 py-2 transition-colors border ${
              activeCategory === cat
                ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                : 'bg-white text-[#666666] hover:text-[#0A0A0A] border-[#E5E5E5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Asymmetric Photo Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-200 border border-gray-300" />
          ))}
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className={`group relative border border-[#E5E5E5] bg-[#0A0A0A] cursor-pointer overflow-hidden ${
                idx % 4 === 0 ? 'h-96 sm:col-span-2' : 'h-80'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Subtle Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-6 flex flex-col justify-end">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block">
                      {img.category}
                    </span>
                    <h3 className="text-sm font-bold text-white uppercase">{img.title}</h3>
                  </div>

                  <div className="p-2 text-white bg-black/40 border border-white/20 group-hover:bg-[#D32F2F] transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white border border-[#E5E5E5] p-8">
          <ImageIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#0A0A0A] uppercase">No photographs in this category</h3>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}

    </div>
  );
}
