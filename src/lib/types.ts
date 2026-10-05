export type MotorcycleCategory = 'Commuter' | 'Scooter' | 'Sport' | 'Cruiser' | 'Adventure' | 'Naked' | 'Touring';

export interface Motorcycle {
  id: string;
  name: string;
  slug: string;
  category: MotorcycleCategory;
  price: number;
  starting_price_formatted?: string;
  engine: string;
  engine_capacity_cc: number;
  power: string;
  torque: string;
  mileage: string;
  transmission: string;
  fuel_capacity: string;
  brakes: string;
  seat_height?: string;
  weight?: string;
  available_colors: string[];
  description: string;
  image_url: string;
  gallery_urls?: string[];
  is_featured?: boolean;
  is_in_stock?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type BookingStatus = 'NEW' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface ServiceBooking {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  motorcycle_model: string;
  registration_number: string;
  preferred_date: string;
  preferred_time: string;
  service_type: string;
  message?: string;
  status: BookingStatus;
  created_at: string;
}

export interface TestRideRequest {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  motorcycle_model: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status: BookingStatus;
  created_at: string;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';

export interface CustomerEnquiry {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  category: 'Showroom' | 'Workshop' | 'Motorcycles' | 'Deliveries';
  image_url: string;
  caption?: string;
  created_at?: string;
}

export interface DashboardStats {
  totalEnquiries: number;
  newEnquiries: number;
  totalServiceBookings: number;
  newServiceBookings: number;
  totalTestRides: number;
  newTestRides: number;
  totalMotorcycles: number;
}
