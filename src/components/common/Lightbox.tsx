'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/lib/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const current = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200 font-sans">
      
      {/* Top Bar Controls */}
      <div className="w-full max-w-7xl flex items-center justify-between text-white border-b border-white/15 pb-3">
        <div className="pr-4 truncate">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#d32f2f] block">
            {current.category} Gallery ({currentIndex + 1} / {images.length})
          </span>
          <h4 className="text-sm sm:text-lg font-bold text-white uppercase truncate">{current.title}</h4>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-300 hover:text-white bg-white/10 hover:bg-[#d32f2f] rounded-full transition-colors shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Display with Nav Buttons */}
      <div className="relative w-full max-w-5xl h-[52vh] sm:h-[68vh] my-auto flex items-center justify-center">
        {currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-1 sm:left-4 z-20 p-2.5 sm:p-3 bg-black/70 hover:bg-[#d32f2f] text-white rounded-full backdrop-blur-md transition-all border border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10">
          <Image
            src={current.image_url}
            alt={current.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>

        {currentIndex < images.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-1 sm:right-4 z-20 p-2.5 sm:p-3 bg-black/70 hover:bg-[#d32f2f] text-white rounded-full backdrop-blur-md transition-all border border-white/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption Bar */}
      {current.caption && (
        <div className="w-full max-w-3xl text-center bg-[#111827] border border-white/10 p-3 rounded-xl text-xs text-gray-300">
          <p>{current.caption}</p>
        </div>
      )}
    </div>
  );
}
