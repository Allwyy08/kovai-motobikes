import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { showroomConfig } from "@/config/showroom";

export const metadata: Metadata = {
  title: {
    default: `${showroomConfig.name} | Authorized Motorbike Dealership & Service Center`,
    template: `%s | ${showroomConfig.name}`
  },
  description: `${showroomConfig.tagline}. Explore flagship new motorcycles, schedule test rides, and book certified factory maintenance.`,
  keywords: ["motorcycle showroom", "motorbike dealership", "superbike sales", "motorcycle service center", "test ride booking"],
  authors: [{ name: showroomConfig.name }],
  openGraph: {
    title: `${showroomConfig.name} | Premier Motorcycle Dealership`,
    description: showroomConfig.tagline,
    url: "https://showroom-demo.com",
    siteName: showroomConfig.name,
    images: [
      {
        url: "/images/hero-bike.jpg",
        width: 1200,
        height: 630,
        alt: showroomConfig.name
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: showroomConfig.name,
    description: showroomConfig.tagline,
    images: ["/images/hero-bike.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#090d14] text-gray-100 min-h-screen flex flex-col selection:bg-red-600 selection:text-white antialiased">
        <Navbar />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
