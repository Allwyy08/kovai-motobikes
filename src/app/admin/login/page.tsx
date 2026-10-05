'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { showroomConfig } from '@/config/showroom';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('admin@showroom.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. If Supabase is configured, attempt Supabase Auth
      if (isSupabaseConfigured && supabase) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!authError && data?.session) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('showroom_admin_session', JSON.stringify({
              user: data.session.user,
              token: data.session.access_token
            }));
          }
          router.push('/admin');
          return;
        }
      }

      // 2. Demo mode / fallback login check for evaluation
      if (email === 'admin@showroom.com' && password === 'admin123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('showroom_admin_session', JSON.stringify({
            user: { email: 'admin@showroom.com', name: 'Dealership Admin' },
            token: 'demo-admin-token-12345'
          }));
        }
        router.push('/admin');
      } else {
        setError('Invalid admin credentials. For evaluation demo, use: admin@showroom.com / admin123');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8 font-sans">
      
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#d32f2f] text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          DEALERSHIP ADMIN PORTAL
        </h1>
        <p className="text-xs text-gray-600">
          Authorized Management System for {showroomConfig.name}
        </p>
      </div>

      <div className="bg-white border border-gray-200 p-8 rounded-2xl shadow-sm space-y-6">
        
        {/* Notice Badge */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
          <span className="font-bold block">Demo Evaluation Mode Active:</span>
          <p className="text-gray-700">Default Admin Email: <code className="text-amber-900 font-bold">admin@showroom.com</code></p>
          <p className="text-gray-700">Default Password: <code className="text-amber-900 font-bold">admin123</code></p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#d32f2f] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@showroom.com"
                className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#d32f2f] focus:ring-1 focus:ring-[#d32f2f]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
}
