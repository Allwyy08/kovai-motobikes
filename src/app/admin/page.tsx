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
  ShieldCheck, 
  Bike, 
  Wrench, 
  Compass, 
  MessageSquare, 
  ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  X, 
  LogOut,
  Search,
  Filter,
  Eye,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication check
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'motorcycles' | 'bookings' | 'test-rides' | 'enquiries' | 'gallery'>('overview');

  // Dashboard state
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
          console.warn('No active Supabase Auth session found. Redirecting to admin login.');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#d32f2f] text-white flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase text-[#d32f2f] block font-bold">Dealership Management Portal</span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">ADMIN DASHBOARD</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg border border-gray-300 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-red-50 hover:bg-red-600 text-[#d32f2f] hover:text-white border border-red-200 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Supabase Fetch Error Alert */}
      {fetchError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-[#d32f2f] shrink-0" />
          <div>
            <span className="font-bold block uppercase tracking-wider text-[11px] text-[#d32f2f]">Supabase Database Error</span>
            <span>{fetchError}</span>
          </div>
        </div>
      )}

      {/* Overview Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div 
            onClick={() => setActiveTab('enquiries')} 
            className="bg-white border border-gray-200 p-5 rounded-xl space-y-2 cursor-pointer hover:border-[#d32f2f] transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Customer Enquiries</span>
              <MessageSquare className="w-4 h-4 text-[#d32f2f]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">{stats.totalEnquiries}</span>
              {stats.newEnquiries > 0 && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {stats.newEnquiries} New
                </span>
              )}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('bookings')} 
            className="bg-white border border-gray-200 p-5 rounded-xl space-y-2 cursor-pointer hover:border-[#d32f2f] transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Service Bookings</span>
              <Wrench className="w-4 h-4 text-[#d32f2f]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">{stats.totalServiceBookings}</span>
              {stats.newServiceBookings > 0 && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {stats.newServiceBookings} New
                </span>
              )}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('test-rides')} 
            className="bg-white border border-gray-200 p-5 rounded-xl space-y-2 cursor-pointer hover:border-[#d32f2f] transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Test Ride Requests</span>
              <Compass className="w-4 h-4 text-[#d32f2f]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-900">{stats.totalTestRides}</span>
              {stats.newTestRides > 0 && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {stats.newTestRides} New
                </span>
              )}
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('motorcycles')} 
            className="bg-white border border-gray-200 p-5 rounded-xl space-y-2 cursor-pointer hover:border-[#d32f2f] transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Motorcycle Inventory</span>
              <Bike className="w-4 h-4 text-[#d32f2f]" />
            </div>
            <span className="text-3xl font-black text-gray-900">{stats.totalMotorcycles}</span>
          </div>
        </div>
      )}

      {/* Tab Navigation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: ShieldCheck },
          { id: 'motorcycles', label: 'Motorcycles Inventory', icon: Bike },
          { id: 'bookings', label: 'Service Bookings', icon: Wrench },
          { id: 'test-rides', label: 'Test Rides', icon: Compass },
          { id: 'enquiries', label: 'Customer Enquiries', icon: MessageSquare },
          { id: 'gallery', label: 'Gallery Photos', icon: ImageIcon }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#d32f2f] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Bookings Feed */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#d32f2f]" /> Recent Service Appointments
              </h3>
              <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#d32f2f] hover:underline font-bold">View All</button>
            </div>

            <div className="space-y-3">
              {bookings.slice(0, 4).map((b) => (
                <div key={b.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-900 font-bold block">{b.customer_name}</span>
                    <span className="text-gray-600 block">{b.motorcycle_model} ({b.registration_number})</span>
                    <span className="text-[#d32f2f] text-[10px] font-semibold">{b.service_type}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      b.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {b.status}
                    </span>
                    <span className="text-gray-500 block text-[10px] mt-1">{b.preferred_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Test Rides Feed */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#d32f2f]" /> Recent Test Ride Requests
              </h3>
              <button onClick={() => setActiveTab('test-rides')} className="text-xs text-[#d32f2f] hover:underline font-bold">View All</button>
            </div>

            <div className="space-y-3">
              {testRides.slice(0, 4).map((t) => (
                <div key={t.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-gray-900 font-bold block">{t.customer_name}</span>
                    <span className="text-gray-600 block">Requested: {t.motorcycle_model}</span>
                    <span className="text-gray-500 text-[10px]">Phone: {t.phone}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {t.status}
                    </span>
                    <span className="text-gray-500 block text-[10px] mt-1">{t.preferred_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MOTORCYCLES INVENTORY */}
      {activeTab === 'motorcycles' && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">MOTORCYCLE INVENTORY</h3>
              <p className="text-xs text-gray-600">Add, edit specs, or manage available bikes.</p>
            </div>

            <button
              onClick={() => {
                setEditingBike({
                  name: '',
                  category: 'Sport',
                  price: 9999,
                  engine: '750cc Liquid-Cooled',
                  engine_capacity_cc: 750,
                  power: '100 HP',
                  torque: '80 Nm',
                  mileage: '20 km/L',
                  transmission: '6-Speed',
                  fuel_capacity: '15 Litres',
                  brakes: 'Dual Disc ABS',
                  seat_height: '810 mm',
                  weight: '190 kg',
                  description: 'High performance motorcycle.',
                  image_url: '/images/delivery-1.jpg'
                });
                setBikeModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase rounded-lg flex items-center gap-1.5 shadow-sm min-h-[40px]"
            >
              <Plus className="w-4 h-4" /> Add New Motorcycle
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] border-b border-gray-200 font-bold">
                <tr>
                  <th className="p-3">Model</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Engine</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {motorcycles.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900 flex items-center gap-3">
                      <div className="relative w-10 h-8 rounded overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                        <Image src={b.image_url || '/images/delivery-1.jpg'} alt={b.name} fill className="object-cover" />
                      </div>
                      <span>{b.name}</span>
                    </td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] border border-gray-200 font-semibold">{b.category}</span></td>
                    <td className="p-3 font-bold text-[#d32f2f]">₹{b.price.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-gray-600">{b.engine}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                        In Stock
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingBike(b);
                          setBikeModalOpen(true);
                        }}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 border border-gray-300"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteBike(b.id)}
                        className="p-1.5 bg-red-50 hover:bg-red-600 rounded text-[#d32f2f] hover:text-white border border-red-200"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SERVICE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">SERVICE BOOKINGS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] border-b border-gray-200 font-bold">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Bike & Reg</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">{b.customer_name}</td>
                    <td className="p-3">
                      <div>{b.phone}</div>
                      <div className="text-[10px] text-gray-500">{b.email}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">{b.motorcycle_model}</div>
                      <div className="text-[#d32f2f] text-[10px] font-bold">{b.registration_number}</div>
                    </td>
                    <td className="p-3">{b.service_type}</td>
                    <td className="p-3 text-gray-600">{b.preferred_date} @ {b.preferred_time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        b.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        b.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={b.status}
                        onChange={(e) => handleBookingStatus(b.id, e.target.value as BookingStatus)}
                        className="bg-white border border-gray-300 rounded px-2 py-1 text-[10px] text-gray-900 focus:outline-none focus:border-[#d32f2f]"
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

      {/* TAB 4: TEST RIDES */}
      {activeTab === 'test-rides' && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">TEST RIDE REQUESTS</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] border-b border-gray-200 font-bold">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Requested Model</th>
                  <th className="p-3">Date / Time</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testRides.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">{t.customer_name}</td>
                    <td className="p-3">
                      <div>{t.phone}</div>
                      <div className="text-[10px] text-gray-500">{t.email}</div>
                    </td>
                    <td className="p-3 text-[#d32f2f] font-bold">{t.motorcycle_model}</td>
                    <td className="p-3 text-gray-600">{t.preferred_date} @ {t.preferred_time}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        t.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        t.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={t.status}
                        onChange={(e) => handleTestRideStatus(t.id, e.target.value as BookingStatus)}
                        className="bg-white border border-gray-300 rounded px-2 py-1 text-[10px] text-gray-900 focus:outline-none focus:border-[#d32f2f]"
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

      {/* TAB 5: CUSTOMER ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900">CUSTOMER ENQUIRIES</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-800">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] border-b border-gray-200 font-bold">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Message Snippet</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">
                      <div>{e.customer_name}</div>
                      <div className="text-[10px] text-gray-500">{e.phone}</div>
                    </td>
                    <td className="p-3 font-bold text-[#d32f2f]">{e.subject}</td>
                    <td className="p-3 text-gray-600 max-w-xs truncate">{e.message}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        e.status === 'NEW' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedEnquiry(e)}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded text-gray-800 border border-gray-300"
                        title="View Full Message"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <select
                        value={e.status}
                        onChange={(ev) => handleEnquiryStatus(e.id, ev.target.value as EnquiryStatus)}
                        className="bg-white border border-gray-300 rounded px-2 py-1 text-[10px] text-gray-900 focus:outline-none focus:border-[#d32f2f]"
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

      {/* TAB 6: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">GALLERY MANAGEMENT</h3>
            <button
              onClick={() => setGalleryModalOpen(true)}
              className="px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold text-xs uppercase rounded-lg flex items-center gap-1.5 min-h-[40px]"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="relative h-48 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 shadow-sm">
                <Image src={g.image_url} alt={g.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/70 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-red-400 font-bold uppercase">{g.category}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{g.title}</h4>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
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

      {/* MOTORCYCLE EDIT/ADD MODAL */}
      {bikeModalOpen && editingBike && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setBikeModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900">
              {editingBike.id ? 'EDIT MOTORCYCLE' : 'ADD NEW MOTORCYCLE'}
            </h3>

            <form onSubmit={handleSaveBike} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Model Name *</label>
                  <input
                    type="text"
                    required
                    value={editingBike.name || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, name: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Category *</label>
                  <select
                    value={editingBike.category || 'Sport'}
                    onChange={(e) => setEditingBike({ ...editingBike, category: e.target.value as any })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
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
                  <label className="block text-gray-700 font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingBike.price || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, price: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Engine Capacity (cc) *</label>
                  <input
                    type="number"
                    required
                    value={editingBike.engine_capacity_cc || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, engine_capacity_cc: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Engine Full Specs *</label>
                <input
                  type="text"
                  required
                  value={editingBike.engine || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, engine: e.target.value })}
                  placeholder="e.g. 124cc 4-Stroke Air-Cooled BS6 Engine"
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingBike.image_url || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, image_url: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Max Power</label>
                  <input
                    type="text"
                    value={editingBike.power || ''}
                    onChange={(e) => setEditingBike({ ...editingBike, power: e.target.value })}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingBike.description || ''}
                  onChange={(e) => setEditingBike({ ...editingBike, description: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold uppercase rounded-md min-h-[44px]"
              >
                Save Motorcycle Model
              </button>
            </form>
          </div>
        </div>
      )}

      {/* GALLERY ADD MODAL */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-4 relative shadow-2xl">
            <button onClick={() => setGalleryModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-gray-900">ADD GALLERY PHOTO</h3>
            <form onSubmit={handleSaveGallery} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Category</label>
                <select
                  value={newGallery.category}
                  onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                >
                  <option value="Showroom">Showroom</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Bikes">Bikes</option>
                  <option value="Events">Events</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Image URL *</label>
                <input
                  type="text"
                  required
                  value={newGallery.image_url}
                  onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })}
                  placeholder="/images/delivery-1.jpg or https://..."
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">Caption</label>
                <input
                  type="text"
                  value={newGallery.caption}
                  onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:border-[#d32f2f]"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-bold uppercase rounded-md min-h-[44px]">
                Add Photo to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ENQUIRY DETAILS VIEW MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-4 relative shadow-2xl">
            <button onClick={() => setSelectedEnquiry(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs text-[#d32f2f] uppercase font-bold">Enquiry Details</span>
            <h3 className="text-lg font-bold text-gray-900">{selectedEnquiry.subject}</h3>
            <div className="space-y-2 text-xs text-gray-700 border-t border-b border-gray-200 py-3">
              <p><strong className="text-gray-900">Customer:</strong> {selectedEnquiry.customer_name}</p>
              <p><strong className="text-gray-900">Phone:</strong> {selectedEnquiry.phone}</p>
              <p><strong className="text-gray-900">Email:</strong> {selectedEnquiry.email}</p>
              <p><strong className="text-gray-900">Submitted:</strong> {new Date(selectedEnquiry.created_at).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase block mb-1 font-bold">Message Content</span>
              <p className="text-xs text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-200 whitespace-pre-line">
                {selectedEnquiry.message}
              </p>
            </div>
            <button
              onClick={() => setSelectedEnquiry(null)}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-md uppercase border border-gray-300"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
