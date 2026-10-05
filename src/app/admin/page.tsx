'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Motorcycle, 
  ServiceBooking, 
  TestRideRequest, 
  CustomerEnquiry, 
  GalleryImage, 
  DashboardStats,
  BookingStatus,
  EnquiryStatus
} from '@/lib/types';
import { 
  fetchMotorcycles, 
  saveMotorcycle, 
  deleteMotorcycle,
  fetchServiceBookings,
  updateBookingStatus,
  fetchTestRideRequests,
  updateTestRideStatus,
  fetchCustomerEnquiries,
  updateEnquiryStatus,
  fetchGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
  getDashboardStats
} from '@/lib/data-store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  LogOut,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'motorcycles' | 'bookings' | 'test-rides' | 'enquiries' | 'gallery'>('overview');

  // Dashboard data state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [testRides, setTestRides] = useState<TestRideRequest[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [bikeModalOpen, setBikeModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Partial<Motorcycle> | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [newGallery, setNewGallery] = useState<{ title: string; category: any; image_url: string; caption: string }>({
    title: '',
    category: 'Showroom',
    image_url: '',
    caption: ''
  });

  const [selectedEnquiry, setSelectedEnquiry] = useState<CustomerEnquiry | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    async function initDashboard() {
      if (typeof window === 'undefined') return;

      const localSession = localStorage.getItem('showroom_admin_session');
      if (!localSession) {
        router.push('/admin/login');
        return;
      }

      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn('No active Supabase Auth session found. Redirecting to login.');
          localStorage.removeItem('showroom_admin_session');
          router.push('/admin/login');
          return;
        }
      }

      setIsAuthenticated(true);
      loadAllData();
    }
    initDashboard();
  }, [router]);

  const loadAllData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [st, mList, bList, tList, eList, gList] = await Promise.all([
        getDashboardStats(),
        fetchMotorcycles(),
        fetchServiceBookings(),
        fetchTestRideRequests(),
        fetchCustomerEnquiries(),
        fetchGalleryImages()
      ]);
      setStats(st);
      setMotorcycles(mList);
      setBookings(bList);
      setTestRides(tList);
      setEnquiries(eList);
      setGallery(gList);
    } catch (e: any) {
      console.error('Failed loading admin data from Supabase:', e);
      setFetchError(e.message || 'Failed to load records from Supabase database.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('showroom_admin_session');
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin/login');
  };

  // Motorcycle Save / Delete
  const handleSaveBike = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBike || !editingBike.name || !editingBike.price || !editingBike.engine) return;

    try {
      await saveMotorcycle({
        ...editingBike,
        name: editingBike.name,
        price: Number(editingBike.price),
        category: editingBike.category || 'Sport',
        engine: editingBike.engine,
        description: editingBike.description || 'Premium motorcycle in stock.',
        image_url: editingBike.image_url || '/images/hero-bike.jpg'
      } as any);
      setBikeModalOpen(false);
      setEditingBike(null);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBike = async (id: string) => {
    if (confirm('Are you sure you want to delete this motorcycle model?')) {
      await deleteMotorcycle(id);
      loadAllData();
    }
  };

  // Status updates
  const handleBookingStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status);
    loadAllData();
  };

  const handleTestRideStatus = async (id: string, status: BookingStatus) => {
    await updateTestRideStatus(id, status);
    loadAllData();
  };

  const handleEnquiryStatus = async (id: string, status: EnquiryStatus) => {
    await updateEnquiryStatus(id, status);
    loadAllData();
  };

  // Gallery Save / Delete
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title || !newGallery.image_url) return;
    await createGalleryImage(newGallery);
    setGalleryModalOpen(false);
    setNewGallery({ title: '', category: 'Showroom', image_url: '', caption: '' });
    loadAllData();
  };

  const handleDeleteGallery = async (id: string) => {
    if (confirm('Delete this gallery photo?')) {
      await deleteGalleryImage(id);
      loadAllData();
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F6F6F4] text-[#0A0A0A] font-sans pb-24">
      
      {/* 2. ADMIN DASHBOARD HEADER (66px Height, Minimal White Header) */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] h-[66px] flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1360px] mx-auto w-full flex items-center justify-between">
          
          {/* Left: KMB Transparent Logo + ADMIN Badge */}
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-[115px]">
              <Image
                src="/images/kovai-motobikes-logo-transparent.png"
                alt="KOVAI MOTOBIKES"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#D32F2F] bg-red-50 border border-red-200 px-2 py-0.5 rounded-[4px]">
              ADMIN
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={loadAllData}
              className="text-xs font-semibold uppercase tracking-wider text-[#666666] hover:text-[#0A0A0A] flex items-center gap-1.5 transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">REFRESH</span>
            </button>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold uppercase tracking-wider text-[#D32F2F] hover:text-[#B71C1C] flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 3. DASHBOARD INTRO */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E5E5E5] pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D32F2F] block mb-1">
              DEALERSHIP SYSTEM
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A] uppercase">
              ADMIN OVERVIEW
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              KOVAI MOTOBIKES dealership operations at a glance.
            </p>
          </div>

          <div className="text-xs text-[#666666] font-mono">
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Supabase Error Alert */}
        {fetchError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-[6px] text-red-800 text-xs font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#D32F2F] shrink-0" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px] text-[#D32F2F]">Database Connection Alert</span>
              <span>{fetchError}</span>
            </div>
          </div>
        )}

        {/* 4. STATISTICS KPI STRIP */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div 
              onClick={() => setActiveTab('enquiries')}
              className="bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] p-5 rounded-[8px] space-y-2 cursor-pointer transition-colors"
            >
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                CUSTOMER ENQUIRIES
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-[#0A0A0A] tracking-tight">{stats.totalEnquiries}</span>
                {stats.newEnquiries > 0 && (
                  <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 border border-red-200 px-2 py-0.5 rounded-[4px]">
                    {stats.newEnquiries} NEW
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('bookings')}
              className="bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] p-5 rounded-[8px] space-y-2 cursor-pointer transition-colors"
            >
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                SERVICE BOOKINGS
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-[#0A0A0A] tracking-tight">{stats.totalServiceBookings}</span>
                {stats.newServiceBookings > 0 && (
                  <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 border border-red-200 px-2 py-0.5 rounded-[4px]">
                    {stats.newServiceBookings} NEW
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('test-rides')}
              className="bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] p-5 rounded-[8px] space-y-2 cursor-pointer transition-colors"
            >
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                TEST RIDE REQUESTS
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-[#0A0A0A] tracking-tight">{stats.totalTestRides}</span>
                {stats.newTestRides > 0 && (
                  <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 border border-red-200 px-2 py-0.5 rounded-[4px]">
                    {stats.newTestRides} NEW
                  </span>
                )}
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('motorcycles')}
              className="bg-white border border-[#E5E5E5] hover:border-[#0A0A0A] p-5 rounded-[8px] space-y-2 cursor-pointer transition-colors"
            >
              <span className="text-[10px] uppercase font-bold text-[#666666] tracking-wider block">
                MOTORCYCLES INVENTORY
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-[#0A0A0A] tracking-tight">{stats.totalMotorcycles}</span>
                <span className="text-[10px] font-semibold text-[#666666] uppercase">ACTIVE</span>
              </div>
            </div>

          </div>
        )}

        {/* 5. ADMIN HORIZONTAL NAVIGATION BAR */}
        <div className="border-b border-[#E5E5E5] flex items-center gap-8 overflow-x-auto no-scrollbar pt-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'motorcycles', label: 'Motorcycles' },
            { id: 'bookings', label: 'Service Bookings' },
            { id: 'test-rides', label: 'Test Rides' },
            { id: 'enquiries', label: 'Customer Enquiries' },
            { id: 'gallery', label: 'Gallery' }
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs uppercase tracking-[0.1em] font-semibold transition-colors py-3 relative whitespace-nowrap ${
                  active ? 'text-[#D32F2F]' : 'text-[#666666] hover:text-[#0A0A0A]'
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D32F2F]" />
                )}
              </button>
            );
          })}
        </div>

        {/* 6. TAB 1: OVERVIEW & RECENT ACTIVITY */}
        {activeTab === 'overview' && (
          <div className="space-y-6 pt-2">
            <h2 className="text-xs uppercase tracking-[0.15em] font-bold text-[#666666]">
              RECENT ACTIVITY
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Service Bookings Column */}
              <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <h3 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                    SERVICE BOOKINGS
                  </h3>
                  <button onClick={() => setActiveTab('bookings')} className="link-arrow text-xs">
                    <span>VIEW ALL</span>
                  </button>
                </div>

                <div className="divide-y divide-[#E5E5E5] text-xs">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-[#0A0A0A] block">{b.customer_name}</span>
                        <span className="text-[#666666] text-[11px] block">{b.motorcycle_model} · {b.registration_number}</span>
                        <span className="text-[#D32F2F] text-[10px] font-semibold">{b.service_type}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-[4px] border ${
                          b.status === 'NEW' ? 'bg-red-50 text-[#D32F2F] border-red-200' :
                          b.status === 'CONFIRMED' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                          b.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-[#666666] block font-mono mt-1">{b.preferred_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Rides Column */}
              <div className="bg-white border border-[#E5E5E5] p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
                  <h3 className="text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                    TEST RIDE REQUESTS
                  </h3>
                  <button onClick={() => setActiveTab('test-rides')} className="link-arrow text-xs">
                    <span>VIEW ALL</span>
                  </button>
                </div>

                <div className="divide-y divide-[#E5E5E5] text-xs">
                  {testRides.slice(0, 5).map((t) => (
                    <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <span className="font-bold text-[#0A0A0A] block">{t.customer_name}</span>
                        <span className="text-[#D32F2F] text-[11px] font-bold block">{t.motorcycle_model}</span>
                        <span className="text-[#666666] text-[10px] block">Phone: {t.phone}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-[4px] border ${
                          t.status === 'NEW' ? 'bg-red-50 text-[#D32F2F] border-red-200' :
                          t.status === 'CONFIRMED' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                          t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {t.status}
                        </span>
                        <span className="text-[10px] text-[#666666] block font-mono mt-1">{t.preferred_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 9. TAB 2: MOTORCYCLES INVENTORY */}
        {activeTab === 'motorcycles' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">MOTORCYCLE INVENTORY</h2>
                <p className="text-xs text-[#666666]">Dealership inventory management system.</p>
              </div>

              <button
                onClick={() => {
                  setEditingBike({
                    name: '',
                    category: 'Sport',
                    price: 150000,
                    engine: '150cc Air-Cooled BS6 Engine',
                    engine_capacity_cc: 150,
                    power: '14 HP',
                    torque: '13.5 Nm',
                    mileage: '45 km/L',
                    transmission: '5-Speed',
                    fuel_capacity: '12 Litres',
                    brakes: 'Single Disc ABS',
                    seat_height: '790 mm',
                    weight: '138 kg',
                    description: 'New motorcycle model in stock.',
                    image_url: '/images/delivery-1.jpg'
                  });
                  setBikeModalOpen(true);
                }}
                className="btn-primary !h-9 !px-4 !text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>ADD MOTORCYCLE</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0A0A0A]">
                <thead className="bg-[#F6F6F4] text-[#666666] uppercase text-[10px] border-b border-[#E5E5E5] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">IMAGE</th>
                    <th className="p-3">MODEL</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">ENGINE</th>
                    <th className="p-3">PRICE</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {motorcycles.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F6F6F4]">
                      <td className="p-3">
                        <div className="relative w-12 h-9 bg-[#F6F6F4] border border-[#E5E5E5] overflow-hidden">
                          <Image src={b.image_url || '/images/delivery-1.jpg'} alt={b.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-3 font-bold text-[#0A0A0A]">{b.name}</td>
                      <td className="p-3"><span className="px-2 py-0.5 bg-gray-100 rounded-[4px] text-[10px] font-bold border border-[#E5E5E5]">{b.category}</span></td>
                      <td className="p-3 text-[#666666]">{b.engine}</td>
                      <td className="p-3 font-bold text-[#0A0A0A]">₹{b.price.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-[4px] text-[10px] font-bold">
                          IN STOCK
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingBike(b);
                            setBikeModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-[#E5E5E5] text-[#0A0A0A] text-[10px] font-bold uppercase rounded-[4px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBike(b.id)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 text-[#D32F2F] text-[10px] font-bold uppercase rounded-[4px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. TAB 3: SERVICE BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">SERVICE BOOKINGS</h2>
                <p className="text-xs text-[#666666]">{bookings.length} total appointments</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0A0A0A]">
                <thead className="bg-[#F6F6F4] text-[#666666] uppercase text-[10px] border-b border-[#E5E5E5] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">CUSTOMER</th>
                    <th className="p-3">CONTACT</th>
                    <th className="p-3">VEHICLE & REG</th>
                    <th className="p-3">SERVICE</th>
                    <th className="p-3">DATE / TIME</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">UPDATE STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F6F6F4]">
                      <td className="p-3 font-bold text-[#0A0A0A]">{b.customer_name}</td>
                      <td className="p-3">
                        <div className="font-mono">{b.phone}</div>
                        <div className="text-[10px] text-[#666666]">{b.email}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{b.motorcycle_model}</div>
                        <div className="text-[#D32F2F] font-mono text-[10px] font-bold">{b.registration_number}</div>
                      </td>
                      <td className="p-3 font-medium">{b.service_type}</td>
                      <td className="p-3 text-[#666666] font-mono">{b.preferred_date} @ {b.preferred_time}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-[4px] border uppercase ${
                          b.status === 'NEW' ? 'bg-red-50 text-[#D32F2F] border-red-200' :
                          b.status === 'CONFIRMED' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                          b.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => handleBookingStatus(b.id, e.target.value as BookingStatus)}
                          className="bg-white border border-[#E5E5E5] rounded-[4px] px-2 py-1 text-[10px] font-bold text-[#0A0A0A] focus:outline-none focus:border-[#D32F2F]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 11. TAB 4: TEST RIDES */}
        {activeTab === 'test-rides' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">TEST RIDE REQUESTS</h2>
                <p className="text-xs text-[#666666]">{testRides.length} total test ride requests</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0A0A0A]">
                <thead className="bg-[#F6F6F4] text-[#666666] uppercase text-[10px] border-b border-[#E5E5E5] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">CUSTOMER</th>
                    <th className="p-3">CONTACT</th>
                    <th className="p-3">MOTORCYCLE</th>
                    <th className="p-3">REQUESTED DATE</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">UPDATE STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {testRides.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F6F6F4]">
                      <td className="p-3 font-bold text-[#0A0A0A]">{t.customer_name}</td>
                      <td className="p-3">
                        <div className="font-mono">{t.phone}</div>
                        <div className="text-[10px] text-[#666666]">{t.email}</div>
                      </td>
                      <td className="p-3 font-bold text-[#D32F2F]">{t.motorcycle_model}</td>
                      <td className="p-3 text-[#666666] font-mono">{t.preferred_date} @ {t.preferred_time}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-[4px] border uppercase ${
                          t.status === 'NEW' ? 'bg-red-50 text-[#D32F2F] border-red-200' :
                          t.status === 'CONFIRMED' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                          t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={t.status}
                          onChange={(e) => handleTestRideStatus(t.id, e.target.value as BookingStatus)}
                          className="bg-white border border-[#E5E5E5] rounded-[4px] px-2 py-1 text-[10px] font-bold text-[#0A0A0A] focus:outline-none focus:border-[#D32F2F]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12. TAB 5: CUSTOMER ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">CUSTOMER ENQUIRIES</h2>
                <p className="text-xs text-[#666666]">{enquiries.length} total customer inquiries</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#0A0A0A]">
                <thead className="bg-[#F6F6F4] text-[#666666] uppercase text-[10px] border-b border-[#E5E5E5] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">CUSTOMER</th>
                    <th className="p-3">SUBJECT</th>
                    <th className="p-3">MESSAGE</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5E5]">
                  {enquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-[#F6F6F4]">
                      <td className="p-3 font-bold text-[#0A0A0A]">
                        <div>{e.customer_name}</div>
                        <div className="text-[10px] text-[#666666] font-mono">{e.phone}</div>
                      </td>
                      <td className="p-3 font-bold text-[#D32F2F]">{e.subject}</td>
                      <td className="p-3 text-[#666666] max-w-xs truncate">{e.message}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-[4px] border uppercase ${
                          e.status === 'NEW' ? 'bg-red-50 text-[#D32F2F] border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedEnquiry(e)}
                          className="px-2.5 py-1 bg-white hover:bg-gray-100 border border-[#E5E5E5] text-[#0A0A0A] text-[10px] font-bold uppercase rounded-[4px]"
                        >
                          View
                        </button>
                        <select
                          value={e.status}
                          onChange={(ev) => handleEnquiryStatus(e.id, ev.target.value as EnquiryStatus)}
                          className="bg-white border border-[#E5E5E5] rounded-[4px] px-2 py-1 text-[10px] font-bold text-[#0A0A0A] focus:outline-none focus:border-[#D32F2F]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 13. TAB 6: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="bg-white border border-[#E5E5E5] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] uppercase tracking-tight">GALLERY MANAGER</h2>
                <p className="text-xs text-[#666666]">Visual showroom & delivery photo management.</p>
              </div>

              <button
                onClick={() => setGalleryModalOpen(true)}
                className="btn-primary !h-9 !px-4 !text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>ADD PHOTO</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gallery.map((g) => (
                <div key={g.id} className="relative h-52 border border-[#E5E5E5] bg-[#0A0A0A] group overflow-hidden">
                  <Image src={g.image_url} alt={g.title} fill className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-[#D32F2F] font-bold uppercase tracking-widest">{g.category}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase">{g.title}</h4>
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        className="mt-2 text-xs text-red-400 hover:text-red-300 font-bold uppercase flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MOTORCYCLE EDIT/ADD MODAL */}
      {bikeModalOpen && editingBike && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 max-w-2xl w-full relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setBikeModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-[#0A0A0A]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                INVENTORY MANAGEMENT
              </span>
              <h3 className="text-xl font-bold text-[#0A0A0A] uppercase">
                {editingBike.id ? 'EDIT MOTORCYCLE' : 'ADD NEW MOTORCYCLE'}
              </h3>
            </div>

            <form onSubmit={handleSaveBike} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={editingBike.name || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Category *</label>
                  <select
                    value={editingBike.category || 'Sport'}
                    onChange={(e) => setEditingBike({ ...editingBike, category: e.target.value as any })}
                    className="input-field"
                  >
                    <option value="Sport">Sport</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Naked">Naked</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Touring">Touring</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingBike.price || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, price: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Engine Capacity (cc) *</label>
                  <input
                    type="number"
                    required
                    value={editingBike.engine_capacity_cc || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, engine_capacity_cc: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Engine Specs *</label>
                <input
                  type="text"
                  required
                  value={editingBike.engine || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, engine: e.target.value })}
                  placeholder="e.g. 124cc 4-Stroke Air-Cooled BS6 Engine"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingBike.image_url || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, image_url: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Max Power</label>
                  <input
                    type="text"
                    value={editingBike.power || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, power: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingBike.description || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, description: e.target.value })}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full !h-11"
              >
                SAVE MOTORCYCLE MODEL
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY ADD MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 max-w-md w-full space-y-4 relative">
            <button onClick={() => setGalleryModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-[#0A0A0A]">
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                GALLERY
              </span>
              <h3 className="text-xl font-bold text-[#0A0A0A] uppercase">ADD GALLERY PHOTO</h3>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Category</label>
                <select
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                  className="input-field"
                >
                  <option value="Showroom">Showroom</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Bikes">Bikes</option>
                  <option value="Events">Events</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={newGallery.image_url}
                  onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })}
                  placeholder="/images/delivery-1.jpg or https://..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-[#0A0A0A] font-bold uppercase mb-1">Caption</label>
                <input
                  type="text"
                  value={newGallery.caption}
                  onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary w-full !h-11">
                ADD PHOTO TO GALLERY
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ENQUIRY DETAILS VIEW MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E5] p-6 sm:p-8 max-w-lg w-full space-y-4 relative">
            <button onClick={() => setSelectedEnquiry(null)} className="absolute top-6 right-6 text-gray-400 hover:text-[#0A0A0A]">
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#D32F2F] font-bold block mb-1">
                CUSTOMER ENQUIRY
              </span>
              <h3 className="text-lg font-bold text-[#0A0A0A] uppercase">{selectedEnquiry.subject}</h3>
            </div>

            <div className="space-y-2 text-xs text-[#0A0A0A] border-t border-b border-[#E5E5E5] py-3 font-medium">
              <p><span className="text-[#666666]">Customer:</span> {selectedEnquiry.customer_name}</p>
              <p><span className="text-[#666666]">Phone:</span> <span className="font-mono">{selectedEnquiry.phone}</span></p>
              <p><span className="text-[#666666]">Email:</span> <span className="font-mono">{selectedEnquiry.email}</span></p>
              <p><span className="text-[#666666]">Submitted:</span> {new Date(selectedEnquiry.created_at).toLocaleString()}</p>
            </div>

            <div>
              <span className="text-[10px] text-[#666666] uppercase block mb-1 font-bold">Message Content</span>
              <p className="text-xs text-[#0A0A0A] bg-[#F6F6F4] p-4 border border-[#E5E5E5] whitespace-pre-line leading-relaxed">
                {selectedEnquiry.message}
              </p>
            </div>

            <button
              onClick={() => setSelectedEnquiry(null)}
              className="btn-secondary w-full !h-10 text-xs"
            >
              CLOSE WINDOW
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
