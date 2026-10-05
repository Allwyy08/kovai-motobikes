import { 
  Motorcycle, 
  ServiceBooking, 
  TestRideRequest, 
  CustomerEnquiry, 
  GalleryImage, 
  DashboardStats,
  BookingStatus,
  EnquiryStatus
} from './types';
import { supabase, isSupabaseConfigured } from './supabase';

const INITIAL_MOTORCYCLES: Motorcycle[] = [
  {
    id: 'm-burgman',
    name: 'Suzuki Burgman Street 125',
    slug: 'suzuki-burgman-street-125',
    category: 'Scooter',
    price: 94800,
    starting_price_formatted: '₹94,800',
    engine: '124cc Single-Cylinder Air-Cooled SEP Fi',
    engine_capacity_cc: 124,
    power: '8.7 PS @ 6,750 RPM',
    torque: '10.0 Nm @ 5,500 RPM',
    mileage: '50 km/L',
    transmission: 'CVT Automatic',
    fuel_capacity: '5.5 Litres',
    brakes: 'Front Disc / Rear Drum with CBS',
    seat_height: '780 mm',
    weight: '111 kg',
    available_colors: ['Matte Black', 'Pearl Mirage White', 'Metallic Matte Bordeaux Red'],
    description: 'European maxi-scooter styling with comfortable footboards, LED headlight, Bluetooth digital console with turn-by-turn navigation, and USB charging socket. Perfect for city commuting in Coimbatore.',
    image_url: '/images/delivery-1.jpg',
    gallery_urls: [
      '/images/delivery-1.jpg',
      '/images/showroom-exterior.png',
      '/images/showroom-bikes.jpg'
    ],
    is_featured: true,
    is_in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm-avenis',
    name: 'Suzuki Avenis 125 Race Edition',
    slug: 'suzuki-avenis-125',
    category: 'Scooter',
    price: 92300,
    starting_price_formatted: '₹92,300',
    engine: '124cc Air-Cooled Single Cylinder SOHC',
    engine_capacity_cc: 124,
    power: '8.7 PS @ 6,750 RPM',
    torque: '10.0 Nm @ 5,500 RPM',
    mileage: '52 km/L',
    transmission: 'CVT Automatic',
    fuel_capacity: '5.2 Litres',
    brakes: 'Front Disc / Rear Drum CBS',
    seat_height: '780 mm',
    weight: '106 kg',
    available_colors: ['GP Racing Edition Red/Black', 'Matte Fibroin Grey', 'Pearl Blaze Orange'],
    description: 'Sporty aggressive street scooter featuring aerodynamic bodywork, external fuel cap, sporty dual-tone mirrors, and responsive acceleration for dynamic riding.',
    image_url: '/images/delivery-2.jpg',
    gallery_urls: [
      '/images/delivery-2.jpg',
      '/images/showroom-bikes.jpg'
    ],
    is_featured: true,
    is_in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm-splendor',
    name: 'Hero Splendor Plus XTEC',
    slug: 'hero-splendor-plus-xtec',
    category: 'Commuter',
    price: 79900,
    starting_price_formatted: '₹79,900',
    engine: '97.2cc Air-Cooled 4-Stroke Single Cylinder OHC',
    engine_capacity_cc: 97,
    power: '8.02 PS @ 8,000 RPM',
    torque: '8.05 Nm @ 6,000 RPM',
    mileage: '65 km/L',
    transmission: '4-Speed Constant Mesh',
    fuel_capacity: '9.8 Litres',
    brakes: '130mm Drum Front & Rear (IBS)',
    seat_height: '785 mm',
    weight: '112 kg',
    available_colors: ['Black with Silver', 'Matte Shield Gold', 'Candy Blazing Red'],
    description: "India's most trusted mileage bike upgraded with full digital speedometer, Bluetooth connectivity, call/SMS alerts, real-time mileage indicator, and i3S stop-start technology.",
    image_url: '/images/showroom-bikes.jpg',
    gallery_urls: [
      '/images/showroom-bikes.jpg',
      '/images/showroom-exterior.png'
    ],
    is_featured: true,
    is_in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm-dio',
    name: 'Honda Dio Sports Edition',
    slug: 'honda-dio-sports',
    category: 'Scooter',
    price: 77500,
    starting_price_formatted: '₹77,500',
    engine: '109.51cc Fan Cooled 4-Stroke SI Engine',
    engine_capacity_cc: 110,
    power: '7.76 PS @ 8,000 RPM',
    torque: '9.03 Nm @ 5,250 RPM',
    mileage: '55 km/L',
    transmission: 'CVT Automatic',
    fuel_capacity: '5.3 Litres',
    brakes: 'Combi Brake System (CBS)',
    seat_height: '765 mm',
    weight: '105 kg',
    available_colors: ['Sports Red', 'Matte Axis Grey Metallic', 'Dazzle Yellow Metallic'],
    description: 'Youthful moto-scooter with signature LED position lamp, split grab rail, engine start/stop switch, telescopic front suspension, and eSP technology.',
    image_url: '/images/delivery-3.jpg',
    gallery_urls: [
      '/images/delivery-3.jpg',
      '/images/showroom-exterior.png'
    ],
    is_featured: true,
    is_in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm-apache',
    name: 'TVS Apache RTR 160 4V',
    slug: 'tvs-apache-rtr-160-4v',
    category: 'Naked',
    price: 124500,
    starting_price_formatted: '₹1,24,500',
    engine: '159.7cc Oil-Cooled Single Cylinder 4-Valve',
    engine_capacity_cc: 160,
    power: '17.55 PS @ 9,250 RPM',
    torque: '14.73 Nm @ 7,250 RPM',
    mileage: '45 km/L',
    transmission: '5-Speed Super-Slick Gearbox',
    fuel_capacity: '12.0 Litres',
    brakes: 'Front 270mm Petal Disc with Single Channel Super-Moto ABS',
    seat_height: '800 mm',
    weight: '144 kg',
    available_colors: ['Racing Red', 'Matte Black', 'Knight Black'],
    description: 'Race-derived streetfighter offering 3 ride modes (Sport, Urban, Rain), SmartXonnect Bluetooth console, glide through technology, and aggressive bullpup exhaust sound.',
    image_url: '/images/hero-bike.jpg',
    gallery_urls: [
      '/images/hero-bike.jpg'
    ],
    is_featured: false,
    is_in_stock: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'm-r15',
    name: 'Yamaha YZF-R15 V4',
    slug: 'yamaha-yzf-r15-v4',
    category: 'Sport',
    price: 182000,
    starting_price_formatted: '₹1,82,000',
    engine: '155cc Liquid-Cooled SOHC 4-Valve VVA',
    engine_capacity_cc: 155,
    power: '18.4 PS @ 10,000 RPM',
    torque: '14.2 Nm @ 7,500 RPM',
    mileage: '40 km/L',
    transmission: '6-Speed with Assist & Slipper Clutch & Quickshifter',
    fuel_capacity: '11.0 Litres',
    brakes: 'Dual Channel ABS with Traction Control System',
    seat_height: '815 mm',
    weight: '141 kg',
    available_colors: ['Racing Blue', 'Intensity White', 'Dark Knight'],
    description: 'Track-focused supersport bike featuring Variable Valve Actuation (VVA), upside-down front forks, traction control system, aerodynamic M1-style cowl, and Y-Connect app integration.',
    image_url: '/images/showroom-bikes.jpg',
    gallery_urls: [
      '/images/showroom-bikes.jpg'
    ],
    is_featured: false,
    is_in_stock: true,
    created_at: new Date().toISOString()
  }
];

const INITIAL_GALLERY: GalleryImage[] = [
  {
    id: 'g-ext',
    title: 'KOVAI MOTOBIKES Main Showroom Facade',
    category: 'Showroom',
    image_url: '/images/showroom-exterior.png',
    caption: 'Official entrance facade at Podanur Main Road, Coimbatore.'
  },
  {
    id: 'g-bikes',
    title: 'Showroom Floor Display Lineup',
    category: 'Showroom',
    image_url: '/images/showroom-bikes.jpg',
    caption: 'New motorcycles and scooters on display in our climate-controlled floor.'
  },
  {
    id: 'g-del-1',
    title: 'Suzuki Burgman Key Delivery',
    category: 'Deliveries',
    image_url: '/images/delivery-1.jpg',
    caption: 'Congratulations to our happy customer on taking delivery of Suzuki Burgman Street!'
  },
  {
    id: 'g-del-2',
    title: 'Night Delivery Celebration',
    category: 'Deliveries',
    image_url: '/images/delivery-2.jpg',
    caption: 'Special evening delivery moment at KOVAI MOTOBIKES.'
  },
  {
    id: 'g-del-3',
    title: 'Honda Dio Delivery Moment',
    category: 'Deliveries',
    image_url: '/images/delivery-3.jpg',
    caption: 'Happy customer receiving key handover in front of our showroom facade.'
  },
  {
    id: 'g-workshop',
    title: 'Two-Wheeler Service & Workshop Bay',
    category: 'Workshop',
    image_url: '/images/service-workshop.jpg',
    caption: 'Equipped for two-wheeler servicing, periodic oil changes, and diagnostics.'
  }
];

const INITIAL_BOOKINGS: ServiceBooking[] = [
  {
    id: 'sb-101',
    customer_name: 'Karthik Subramanian',
    phone: '+91 98940 12345',
    email: 'karthik.s@example.com',
    motorcycle_model: 'Suzuki Burgman Street 125',
    registration_number: 'TN-37-BY-4512',
    preferred_date: '2026-10-10',
    preferred_time: '10:00 AM',
    service_type: 'General Maintenance Service',
    message: 'Please check front disc brake pad wear and engine oil level.',
    status: 'CONFIRMED',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const INITIAL_TEST_RIDES: TestRideRequest[] = [
  {
    id: 'tr-201',
    customer_name: 'Anand Kumar',
    phone: '+91 97890 54321',
    email: 'anand.k@example.com',
    motorcycle_model: 'Suzuki Avenis 125',
    preferred_date: '2026-10-12',
    preferred_time: '11:30 AM',
    message: 'Interested in test riding for daily Podanur commute.',
    status: 'NEW',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const INITIAL_ENQUIRIES: CustomerEnquiry[] = [
  {
    id: 'eq-301',
    customer_name: 'Suresh Rajan',
    phone: '+91 94430 98765',
    email: 'suresh.r@example.com',
    subject: 'On-Road Price & Exchange Offer',
    message: 'Looking for on-road price in Coimbatore for Suzuki Burgman 125 and two-wheeler exchange valuation.',
    status: 'NEW',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// Helper to get state from local storage or fallback
function getLocal<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  try {
    const item = localStorage.getItem(`km_showroom_${key}`);
    return item ? JSON.parse(item) : initial;
  } catch (err) {
    return initial;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`km_showroom_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage set error:', err);
  }
}

export async function fetchMotorcycles(): Promise<Motorcycle[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('motorcycles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Motorcycle[];
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store');
    }
  }
  return getLocal<Motorcycle[]>('motorcycles', INITIAL_MOTORCYCLES);
}

export async function fetchMotorcycleBySlug(slug: string): Promise<Motorcycle | null> {
  const motorcycles = await fetchMotorcycles();
  return motorcycles.find(m => m.slug === slug) || null;
}

export async function saveMotorcycle(bike: Partial<Motorcycle> & { name: string; price: number; category: any; engine: string; description: string; image_url: string }): Promise<Motorcycle> {
  const slug = bike.slug || bike.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newBike: Motorcycle = {
    id: bike.id || `m_${Date.now()}`,
    name: bike.name,
    slug,
    category: bike.category || 'Scooter',
    price: Number(bike.price),
    starting_price_formatted: `₹${Number(bike.price).toLocaleString('en-IN')}`,
    engine: bike.engine,
    engine_capacity_cc: bike.engine_capacity_cc || parseInt(bike.engine) || 125,
    power: bike.power || '8.5 PS',
    torque: bike.torque || '10 Nm',
    mileage: bike.mileage || '50 km/L',
    transmission: bike.transmission || 'Automatic',
    fuel_capacity: bike.fuel_capacity || '5.5 Litres',
    brakes: bike.brakes || 'Disc / Drum CBS',
    seat_height: bike.seat_height || '780 mm',
    weight: bike.weight || '110 kg',
    available_colors: bike.available_colors && bike.available_colors.length > 0 ? bike.available_colors : ['Standard Black', 'White'],
    description: bike.description,
    image_url: bike.image_url || '/images/delivery-1.jpg',
    gallery_urls: bike.gallery_urls || [bike.image_url || '/images/delivery-1.jpg'],
    is_featured: bike.is_featured ?? true,
    is_in_stock: bike.is_in_stock ?? true,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (bike.id) {
        await supabase.from('motorcycles').update(newBike).eq('id', bike.id);
      } else {
        await supabase.from('motorcycles').insert([newBike]);
      }
    } catch (e) {
      console.warn('Supabase save failed');
    }
  }

  const current = getLocal<Motorcycle[]>('motorcycles', INITIAL_MOTORCYCLES);
  const existingIdx = current.findIndex(m => m.id === newBike.id);
  let updatedList: Motorcycle[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = newBike;
  } else {
    updatedList = [newBike, ...current];
  }
  setLocal('motorcycles', updatedList);
  return newBike;
}

export async function deleteMotorcycle(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('motorcycles').delete().eq('id', id);
    } catch (e) {}
  }
  const current = getLocal<Motorcycle[]>('motorcycles', INITIAL_MOTORCYCLES);
  const updated = current.filter(m => m.id !== id);
  setLocal('motorcycles', updated);
}

// SERVICE BOOKINGS
export async function createServiceBooking(data: Omit<ServiceBooking, 'id' | 'created_at' | 'status'>): Promise<ServiceBooking> {
  const newBooking: ServiceBooking = {
    ...data,
    id: `sb-${Date.now()}`,
    status: 'NEW',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: res } = await supabase.from('service_bookings').insert([newBooking]).select().single();
      if (res) return res as ServiceBooking;
    } catch (e) {}
  }

  const current = getLocal<ServiceBooking[]>('service_bookings', INITIAL_BOOKINGS);
  const updated = [newBooking, ...current];
  setLocal('service_bookings', updated);
  return newBooking;
}

export async function fetchServiceBookings(): Promise<ServiceBooking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('service_bookings').select('*').order('created_at', { ascending: false });
      if (data) return data as ServiceBooking[];
    } catch (e) {}
  }
  return getLocal<ServiceBooking[]>('service_bookings', INITIAL_BOOKINGS);
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('service_bookings').update({ status }).eq('id', id);
    } catch (e) {}
  }
  const current = getLocal<ServiceBooking[]>('service_bookings', INITIAL_BOOKINGS);
  const updated = current.map(b => b.id === id ? { ...b, status } : b);
  setLocal('service_bookings', updated);
}

// TEST RIDES
export async function createTestRideRequest(data: Omit<TestRideRequest, 'id' | 'created_at' | 'status'>): Promise<TestRideRequest> {
  const newRequest: TestRideRequest = {
    ...data,
    id: `tr-${Date.now()}`,
    status: 'NEW',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: res } = await supabase.from('test_ride_requests').insert([newRequest]).select().single();
      if (res) return res as TestRideRequest;
    } catch (e) {}
  }

  const current = getLocal<TestRideRequest[]>('test_ride_requests', INITIAL_TEST_RIDES);
  const updated = [newRequest, ...current];
  setLocal('test_ride_requests', updated);
  return newRequest;
}

export async function fetchTestRideRequests(): Promise<TestRideRequest[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('test_ride_requests').select('*').order('created_at', { ascending: false });
      if (data) return data as TestRideRequest[];
    } catch (e) {}
  }
  return getLocal<TestRideRequest[]>('test_ride_requests', INITIAL_TEST_RIDES);
}

export async function updateTestRideStatus(id: string, status: BookingStatus): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('test_ride_requests').update({ status }).eq('id', id);
    } catch (e) {}
  }
  const current = getLocal<TestRideRequest[]>('test_ride_requests', INITIAL_TEST_RIDES);
  const updated = current.map(t => t.id === id ? { ...t, status } : t);
  setLocal('test_ride_requests', updated);
}

// ENQUIRIES
export async function createCustomerEnquiry(data: Omit<CustomerEnquiry, 'id' | 'created_at' | 'status'>): Promise<CustomerEnquiry> {
  const newEnquiry: CustomerEnquiry = {
    ...data,
    id: `eq-${Date.now()}`,
    status: 'NEW',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: res } = await supabase.from('customer_enquiries').insert([newEnquiry]).select().single();
      if (res) return res as CustomerEnquiry;
    } catch (e) {}
  }

  const current = getLocal<CustomerEnquiry[]>('customer_enquiries', INITIAL_ENQUIRIES);
  const updated = [newEnquiry, ...current];
  setLocal('customer_enquiries', updated);
  return newEnquiry;
}

export async function fetchCustomerEnquiries(): Promise<CustomerEnquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('customer_enquiries').select('*').order('created_at', { ascending: false });
      if (data) return data as CustomerEnquiry[];
    } catch (e) {}
  }
  return getLocal<CustomerEnquiry[]>('customer_enquiries', INITIAL_ENQUIRIES);
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('customer_enquiries').update({ status }).eq('id', id);
    } catch (e) {}
  }
  const current = getLocal<CustomerEnquiry[]>('customer_enquiries', INITIAL_ENQUIRIES);
  const updated = current.map(e => e.id === id ? { ...e, status } : e);
  setLocal('customer_enquiries', updated);
}

// GALLERY
export async function fetchGalleryImages(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) return data as GalleryImage[];
    } catch (e) {}
  }
  return getLocal<GalleryImage[]>('gallery', INITIAL_GALLERY);
}

export async function createGalleryImage(data: Omit<GalleryImage, 'id' | 'created_at'>): Promise<GalleryImage> {
  const newImage: GalleryImage = {
    ...data,
    id: `g-${Date.now()}`,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: res } = await supabase.from('gallery_images').insert([newImage]).select().single();
      if (res) return res as GalleryImage;
    } catch (e) {}
  }

  const current = getLocal<GalleryImage[]>('gallery', INITIAL_GALLERY);
  const updated = [newImage, ...current];
  setLocal('gallery', updated);
  return newImage;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('gallery_images').delete().eq('id', id);
    } catch (e) {}
  }
  const current = getLocal<GalleryImage[]>('gallery', INITIAL_GALLERY);
  const updated = current.filter(g => g.id !== id);
  setLocal('gallery', updated);
}

// DASHBOARD STATS
export async function getDashboardStats(): Promise<DashboardStats> {
  const [bikes, bookings, testRides, enquiries] = await Promise.all([
    fetchMotorcycles(),
    fetchServiceBookings(),
    fetchTestRideRequests(),
    fetchCustomerEnquiries()
  ]);

  return {
    totalMotorcycles: bikes.length,
    totalServiceBookings: bookings.length,
    newServiceBookings: bookings.filter(b => b.status === 'NEW').length,
    totalTestRides: testRides.length,
    newTestRides: testRides.filter(t => t.status === 'NEW').length,
    totalEnquiries: enquiries.length,
    newEnquiries: enquiries.filter(e => e.status === 'NEW').length
  };
}
