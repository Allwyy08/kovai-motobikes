'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { showroomConfig } from '@/config/showroom';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'floating' | 'button';
  label?: string;
}

export default function WhatsAppButton({
  message = "Hello! I would like to inquire about motorcycle availability and services at your showroom.",
  className = "",
  variant = 'floating',
  label = "WhatsApp Us"
}: WhatsAppButtonProps) {
  const cleanNumber = showroomConfig.whatsapp.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;

  if (variant === 'button') {
    return (
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span>{label}</span>
      </a>
    );
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl shadow-emerald-600/50 transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white/20"
    >
      <MessageSquare className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-extrabold uppercase tracking-wider pr-1">
        Chat with Sales & Service
      </span>
    </a>
  );
}
