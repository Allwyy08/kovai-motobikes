# KOVAI MOTOBIKES — All Two-Wheeler Sales & Service Web Application

A production-grade, commercial web application designed and art-directed specifically for **KOVAI MOTOBIKES** (`Motorcycle dealer in Coimbatore South, Tamil Nadu`). Built using Next.js 16, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

---

## 📍 Business & Location Details

- **Business Name**: `KOVAI MOTOBIKES`
- **Business Category**: Motorcycle dealer in Coimbatore South, Tamil Nadu
- **Full Address**: 
  `100/100, Podanur Main Rd, opposite by Rasi Food, Thirumarai Nagar, Coimbatore, Tamil Nadu 641023`
- **Operating Hours**:
  - Monday – Saturday: 9:00 AM – 8:30 PM
  - Sunday: 9:00 AM – 2:00 PM

---

## 🎨 Real Brand & Asset Integration

1. **Official KMB Logo**: Uses [`public/images/logo.jpg`](file:///d:/Website%20dev%20project%2001/public/images/logo.jpg) in Navbar, Footer, and brand cards.
2. **Showroom Exterior Facade**: Uses [`public/images/showroom-exterior.png`](file:///d:/Website%20dev%20project%2001/public/images/showroom-exterior.png) showing the real KOVAI MOTOBIKES storefront with Tamil & English signage.
3. **Showroom Floor Inventory**: Uses [`public/images/showroom-bikes.jpg`](file:///d:/Website%20dev%20project%2001/public/images/showroom-bikes.jpg) showing real display bikes (Hero Splendor, Honda Activa, Suzuki Access).
4. **Customer Delivery Moments**: Uses real delivery key handover photos ([`delivery-1.jpg`](file:///d:/Website%20dev%20project%2001/public/images/delivery-1.jpg), [`delivery-2.jpg`](file:///d:/Website%20dev%20project%2001/public/images/delivery-2.jpg), [`delivery-3.jpg`](file:///d:/Website%20dev%20project%2001/public/images/delivery-3.jpg)).

---

## 🚀 Key Pages & Features

- **Home (`/`)**: Staggered entrance animation, KOVAI MOTOBIKES branding, hero composition with real showroom photo, location badge (`Coimbatore South · Podanur Main Road`), featured model cards, real delivery moments, enquiry form, location map.
- **Motorcycles Catalogue (`/motorcycles`)**: Interactive model filters (Category, Engine Capacity, Price Sorting, Search) with quick enquiry modal.
- **Motorcycle Specs (`/motorcycles/[slug]`)**: Detailed technical matrix, color options, photo gallery viewer, test ride CTA, direct WhatsApp button.
- **Services (`/services`)**: Workshop options (General Service, Oil Change, Brake System, Engine Tuning, Electrical Diagnostics, Tyre Balancing, Periodic Maintenance, Computer Diagnostics, Detailing).
- **Book a Service (`/book-service`)**: Appointment booking form with validation, registration number input, date/time slot picker, and reference ID generation.
- **Test Ride (`/test-ride`)**: Test drive booking form with target model dropdown and driver's license confirmation.
- **About Us (`/about`)**: Story of KOVAI MOTOBIKES with real showroom photographs and truthful facts.
- **Gallery (`/gallery`)**: Asymmetric editorial layout with Lightbox modal viewer (*Showroom, Workshop, Motorcycles, Deliveries*).
- **Contact (`/contact`)**: Tap-to-copy full address, direct phone/WhatsApp links, business hours, enquiry form, Google Maps embed.
- **Admin Login (`/admin/login`)**: Protected login supporting Supabase Auth and demo evaluation credentials (`admin@showroom.com` / `admin123`).
- **Admin Dashboard (`/admin`)**: Overview stats, Motorcycle Inventory CRUD, Service Bookings manager, Test Ride Requests manager, Enquiry inspector, Gallery manager.

---

## 💻 Local Development & Build

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
```

---

## 🔑 Admin Access (Demo Evaluation)

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@showroom.com`
- **Password**: `admin123`
