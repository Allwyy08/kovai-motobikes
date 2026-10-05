-- =========================================================
-- MOTORBIKE SHOWROOM & SERVICE CENTER DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL
-- =========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MOTORCYCLES TABLE
CREATE TABLE IF NOT EXISTS public.motorcycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Sport', 'Cruiser', 'Adventure', 'Naked', 'Scooter', 'Touring')),
    price NUMERIC(12, 2) NOT NULL,
    engine VARCHAR(255) NOT NULL,
    engine_capacity_cc INT NOT NULL,
    power VARCHAR(255) NOT NULL,
    torque VARCHAR(255) NOT NULL,
    mileage VARCHAR(255) NOT NULL,
    transmission VARCHAR(255) NOT NULL,
    fuel_capacity VARCHAR(255) NOT NULL,
    brakes VARCHAR(255) NOT NULL,
    seat_height VARCHAR(100),
    weight VARCHAR(100),
    available_colors TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.service_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    motorcycle_model VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEST RIDE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.test_ride_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    motorcycle_model VARCHAR(255) NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.customer_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('Showroom', 'Workshop', 'Bikes', 'Events')),
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADMIN PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'staff')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_motorcycles_category ON public.motorcycles(category);
CREATE INDEX IF NOT EXISTS idx_motorcycles_slug ON public.motorcycles(slug);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON public.service_bookings(status);
CREATE INDEX IF NOT EXISTS idx_test_rides_status ON public.test_ride_requests(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.customer_enquiries(status);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.motorcycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_ride_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Motorcycles: Anyone can view, only authenticated admins can insert/update/delete
CREATE POLICY "Motorcycles public read" ON public.motorcycles FOR SELECT USING (true);
CREATE POLICY "Motorcycles admin write" ON public.motorcycles FOR ALL USING (auth.role() = 'authenticated');

-- Gallery: Anyone can view, only authenticated admins can manage
CREATE POLICY "Gallery public read" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Gallery admin write" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- Service Bookings: Anyone can create, authenticated admins can select/update/delete
CREATE POLICY "Service bookings public insert" ON public.service_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Service bookings admin view" ON public.service_bookings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Service bookings admin update" ON public.service_bookings FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Service bookings admin delete" ON public.service_bookings FOR DELETE USING (auth.role() = 'authenticated');

-- Test Rides: Anyone can create, authenticated admins can view/update/delete
CREATE POLICY "Test rides public insert" ON public.test_ride_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Test rides admin view" ON public.test_ride_requests FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Test rides admin update" ON public.test_ride_requests FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Test rides admin delete" ON public.test_ride_requests FOR DELETE USING (auth.role() = 'authenticated');

-- Enquiries: Anyone can create, authenticated admins can view/update/delete
CREATE POLICY "Enquiries public insert" ON public.customer_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Enquiries admin view" ON public.customer_enquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Enquiries admin update" ON public.customer_enquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enquiries admin delete" ON public.customer_enquiries FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: Admins can read their profile
CREATE POLICY "Profiles read own" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- =========================================================
-- SEED DATA (INITIAL DEMO INVENTORY & GALLERY)
-- =========================================================

INSERT INTO public.motorcycles (name, slug, category, price, engine, engine_capacity_cc, power, torque, mileage, transmission, fuel_capacity, brakes, seat_height, weight, available_colors, description, image_url, is_featured)
VALUES 
(
  'Apex R-1000 Carbon Edition',
  'apex-r-1000-carbon',
  'Sport',
  18999.00,
  '998cc Liquid-Cooled Inline 4-Cylinder DOHC',
  998,
  '207 HP @ 13,750 RPM',
  113 Nm @ 11,000 RPM',
  '15.5 km/L',
  '6-Speed Bi-Directional Quickshifter',
  '16.5 Litres',
  'Brembo Stylema Monobloc Dual 320mm Disc with Cornering ABS',
  '835 mm',
  '197 kg',
  ARRAY['Carbon Black / Racing Red', 'Stealth Matte Grey', 'Grand Prix Blue'],
  'The ultimate track-bred flagship superbike featuring full carbon fiber fairings, titanium exhaust system, Öhlins electronic suspension, and 6-axis IMU rider aids.',
  '/images/hero-bike.jpg',
  true
),
(
  'Thunderbolt V-Twin 1200',
  'thunderbolt-v-twin-1200',
  'Cruiser',
  14499.00,
  '1200cc Air-Cooled V-Twin Engine',
  1200,
  '94 HP @ 6,250 RPM',
  108 Nm @ 3,500 RPM',
  '18.2 km/L',
  '6-Speed Constant Mesh',
  '18.0 Litres',
  'Dual Front 300mm Discs with Dual-Channel ABS',
  '705 mm',
  '268 kg',
  ARRAY['Deep Crimson Metallic', 'Satin Gloss Black', 'Chrome & Obsidian'],
  'Commanding road presence with relaxed ergonomics, deep resonant V-Twin exhaust pulse, premium leather rider seat, and modern electronic cruise control.',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
  true
),
(
  'Terra Trek 850 Rally',
  'terra-trek-850-rally',
  'Adventure',
  12999.00,
  '853cc Parallel-Twin Liquid-Cooled Engine',
  853,
  '95 HP @ 8,250 RPM',
  92 Nm @ 6,500 RPM',
  '21.0 km/L',
  '6-Speed Slipper Clutch',
  '23.0 Litres',
  'Floating 305mm Discs with Switchable Off-Road ABS',
  '860 mm',
  '218 kg',
  ARRAY['Dakar Yellow', 'Kalahari Sand', 'Alpine White'],
  'Unstoppable long-distance adventure touring machine equipped with spoke wheels, long-travel WP suspension, tubeless knobby tyres, and 7-inch TFT navigation system.',
  'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop',
  true
),
(
  'Street Venom 750',
  'street-venom-750',
  'Naked',
  9899.00,
  '749cc Inline-3 Liquid-Cooled DOHC',
  749,
  '118 HP @ 11,500 RPM',
  79 Nm @ 9,250 RPM',
  '19.5 km/L',
  '6-Speed Assist & Slipper',
  '14.0 Litres',
  'Nissin Radial 4-Piston Calipers with ABS',
  '820 mm',
  '186 kg',
  ARRAY['Matte Acid Green', 'Dark Graphite', 'Silver Metallic'],
  'Agile urban roadster offering explosive mid-range punch, razor-sharp chassis response, aggressive twin-LED headlight mask, and customizable ride modes.',
  'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1200&auto=format&fit=crop',
  true
),
(
  'Urban Cruiser 300 Max',
  'urban-cruiser-300-max',
  'Scooter',
  5499.00,
  '292cc Single-Cylinder Liquid-Cooled 4-Valve',
  292,
  '28 HP @ 7,250 RPM',
  29 Nm @ 5,750 RPM',
  '31.0 km/L',
  'CVT Automatic Transmission',
  '12.5 Litres',
  'Single 267mm Front Disc with Dual-Channel ABS',
  '770 mm',
  '179 kg',
  ARRAY['Gunmetal Grey', 'Pearl White', 'Matte Bronze'],
  'Premium maxi-scooter built for sophisticated city commuting. Keyless smart ignition, large under-seat storage for 2 helmets, and smartphone connectivity.',
  'https://images.unsplash.com/photo-1571188654248-7a89213915f7?q=80&w=1200&auto=format&fit=crop',
  false
),
(
  'Grand Tourer 1600 Spec-X',
  'grand-tourer-1600-spec-x',
  'Touring',
  26999.00,
  '1649cc 6-Cylinder In-Line Engine',
  1649,
  '160 HP @ 6,750 RPM',
  180 Nm @ 5,250 RPM',
  '16.0 km/L',
  '6-Speed Shaft Drive with Reverse Gear',
  '26.5 Litres',
  'Linked ABS Pro with Dynamic Brake Control',
  '750 mm',
  '344 kg',
  ARRAY['Metallic Sapphire Blue', 'Bespoke Gloss Black', 'Titanium Silver'],
  'The pinnacle of continental luxury touring. Electric windscreen adjustment, heated seats & grips, integrated panniers, audio system, and semi-active suspension.',
  'https://images.unsplash.com/photo-1609630875171-b1321377ee65?q=80&w=1200&auto=format&fit=crop',
  false
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.gallery_images (title, category, image_url, caption)
VALUES
('Flagship Showroom Floor', 'Showroom', '/images/showroom-interior.jpg', 'Our state-of-the-art climate controlled customer showroom.'),
('Master Service Bay', 'Workshop', '/images/service-workshop.jpg', 'Equipped with original diagnostic tools and hydraulic bike lifts.'),
('Apex R-1000 Unveiling', 'Bikes', '/images/hero-bike.jpg', 'Special customer delivery ceremony at our dealership.'),
('Track Day Event', 'Events', 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop', 'Annual owner track day organized by our team.');
