'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/lib/types';
import { fetchGalleryImages } from '@/lib/data-store';
import Lightbox from '@/components/common/Lightbox';
import { ImageIcon, Maximize2 } from 'lucide-react';
import { showroomConfig } from '@/config/showroom';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Lightbox state
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans">
      
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 space-y-3">
        <span className="text-xs uppercase tracking-widest text-[#d32f2f] block font-bold">
          Visual Gallery
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight uppercase">
          SHOWROOM & DELIVERY MOMENTS
        </h1>
        <p className="text-gray-600 text-sm max-w-2xl leading-relaxed">
          Photographs from our showroom floor at Podanur Main Road, workshop service bays, and vehicle delivery celebrations at {showroomConfig.name}.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[#d32f2f] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200/80 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Editorial Gallery Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-xl border border-gray-200" />
          ))}
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setLightboxIndex(idx)}
              className={`group relative rounded-xl overflow-hidden border border-gray-200 bg-white cursor-pointer shadow-sm hover:shadow-md transition-all ${
                idx === 0 ? 'h-80 sm:h-96 sm:col-span-2' : 'h-80'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold block">
                      {img.category}
                    </span>
                    <h3 className="text-sm font-bold text-white uppercase">{img.title}</h3>
                  </div>

                  <div className="p-2 rounded-md bg-white/20 text-white group-hover:bg-[#d32f2f] transition-colors backdrop-blur-md">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {img.caption && (
                  <p className="text-xs text-gray-200 mt-1 line-clamp-1 opacity-90">
                    {img.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-900">No photos in this category</h3>
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
