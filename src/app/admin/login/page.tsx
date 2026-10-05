'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
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
        let authResult = await supabase.auth.signInWithPassword({
          email,
          password
        });

        // Auto-provision admin user in Supabase Auth if needed
        if (
          authResult.error &&
          (authResult.error.message.includes('Invalid login credentials') ||
            authResult.error.message.includes('User not found'))
        ) {
          const signUpRes = await supabase.auth.signUp({
            email,
            password
          });
          if (!signUpRes.error && signUpRes.data?.session) {
            authResult = {
              data: { user: signUpRes.data.user!, session: signUpRes.data.session },
              error: null
            };
          } else {
            const signIn2 = await supabase.auth.signInWithPassword({ email, password });
            if (!signIn2.error && signIn2.data?.session) {
              authResult = signIn2;
            }
          }
        }

        if (!authResult.error && authResult.data?.session) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(
              'showroom_admin_session',
              JSON.stringify({
                user: authResult.data.session.user,
                token: authResult.data.session.access_token
              })
            );
          }
          router.push('/admin');
          return;
        } else if (authResult.error) {
          console.error('Supabase admin authentication error:', authResult.error);
          setError(`Supabase Auth Error: ${authResult.error.message}`);
          return;
        }
      }

      // 2. Demo mode fallback login check when Supabase is NOT configured
      if (email === 'admin@showroom.com' && password === 'admin123') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'showroom_admin_session',
            JSON.stringify({
              user: { email: 'admin@showroom.com', name: 'Dealership Admin' },
              token: 'demo-admin-token-12345'
            })
          );
        }
        router.push('/admin');
      } else {
        setError('Invalid credentials. For evaluation demo, use: admin@showroom.com / admin123');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#0A0A0A] font-sans flex flex-col justify-center">
      
      {/* Container: Split Screen on Desktop, Stacked on Mobile */}
      <div className="w-full max-w-[1100px] mx-auto min-h-[640px] bg-white border border-[#E5E5E5] grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-xs my-8 md:my-16">
        
        {/* LEFT ~55%: Showroom Image & Dark Automotive Branding */}
        <div className="lg:col-span-7 relative min-h-[220px] lg:min-h-full bg-[#0A0A0A] text-white flex flex-col justify-between p-8 lg:p-12 overflow-hidden">
          
          <Image
            src="/images/showroom-exterior.png"
            alt="KOVAI MOTOBIKES Showroom"
            fill
            priority
            className="object-cover object-center opacity-45 filter contrast-[1.05]"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/50 to-transparent" />

          {/* Top Branding Tag */}
          <div className="relative z-10 hidden lg:block">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#D32F2F] block">
              KOVAI MOTOBIKES
            </span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block pt-0.5">
              DEALERSHIP MANAGEMENT SYSTEM
            </span>
          </div>

          {/* Bottom Descriptive Statement */}
          <div className="relative z-10 space-y-2 mt-auto">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight uppercase leading-tight text-white font-sans">
              PORTAL OPERATIONS
            </h2>
            <p className="text-xs lg:text-sm text-gray-300 max-w-md leading-relaxed font-normal">
              Manage motorcycle inventory, customer enquiries, certified workshop service bookings, and test ride requests for {showroomConfig.name}.
            </p>
          </div>

        </div>

        {/* RIGHT ~45%: Clean White Login Form Panel */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-center bg-white space-y-6">
          
          {/* Top Logo & Heading */}
          <div className="space-y-4">
            <div className="relative h-9 w-[120px]">
              <Image
                src="/images/kovai-motobikes-logo-transparent.png"
                alt="KOVAI MOTOBIKES"
                fill
                className="object-contain object-left"
              />
            </div>
            
            <div>
              <h1 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">
                ADMIN PORTAL
              </h1>
              <p className="text-xs text-[#666666] pt-1 font-medium">
                Sign in to manage dealership operations.
              </p>
            </div>
          </div>

          {/* Demo Credentials Alert Banner */}
          <div className="p-3.5 bg-[#F6F6F4] border border-[#E5E5E5] rounded-[6px] text-xs space-y-1">
            <span className="text-[#D32F2F] font-bold uppercase text-[10px] tracking-wider block">
              DEMO ACCESS CREDENTIALS
            </span>
            <p className="text-xs text-[#666666]">
              Email: <code className="text-[#0A0A0A] font-mono font-bold">admin@showroom.com</code>
            </p>
            <p className="text-xs text-[#666666]">
              Password: <code className="text-[#0A0A0A] font-mono font-bold">admin123</code>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-[6px] text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#D32F2F] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            
            <div>
              <label className="block text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@showroom.com"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0A0A0A] uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !h-[46px] rounded-[6px]"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Security Note */}
          <div className="pt-2 text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold block">
              Authorized Personnel Only · KOVAI MOTOBIKES
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
