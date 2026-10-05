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
  message = "Hello! I would like to inquire about motorcycle availability and services at KOVAI MOTOBIKES.",
  className = "",
  variant = 'floating',
  label = "WhatsApp Sales"
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
        className={`inline-flex items-center justify-center gap-2 bg-[#0F6F5F] hover:bg-[#0C594C] text-white font-bold text-xs uppercase tracking-wider h-[46px] px-5 rounded-[4px] transition-colors duration-200 ${className}`}
      >
        <MessageSquare className="w-4 h-4 shrink-0" />
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
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#0A0A0A] text-white hover:bg-[#151515] border border-white/20 px-4 py-3 rounded-[4px] shadow-lg transition-all duration-200"
    >
      <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
      <span className="text-xs font-bold uppercase tracking-wider">
        WHATSAPP
      </span>
    </a>
  );
}
