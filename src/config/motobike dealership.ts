export interface ShowroomConfig {
    name: string;
    category: string;
    tagline: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    hours: {
        weekdays: string;
        saturday: string;
        sunday: string;
    };
    social: {
        facebook: string;
        instagram: string;
        youtube: string;
        twitter: string;
    };
    googleMapsUrl: string;
    googleMapsEmbed: string;
}

export const showroomConfig: ShowroomConfig = {
    name: "KOVAI MOTOBIKES",
    category: "Motorcycle dealer in Coimbatore South, Tamil Nadu",
    tagline: "ALL TWO WHEELER SALES & SERVICE",
    phone: process.env.NEXT_PUBLIC_SHOWROOM_PHONE || "+91 98422 12345",
    whatsapp: process.env.NEXT_PUBLIC_SHOWROOM_WHATSAPP || "+919842212345",
    email: process.env.NEXT_PUBLIC_SHOWROOM_EMAIL || "contact@kovaimotobikes.com",
    address: "100/100, Podanur Main Rd",
    landmark: "opposite by Rasi Food",
    area: "Thirumarai Nagar",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "641023",
    fullAddress: "100/100, Podanur Main Rd, opposite by Rasi Food, Thirumarai Nagar, Coimbatore, Tamil Nadu 641023",
    hours: {
        weekdays: "Mon - Sat: 9:00 AM - 8:30 PM",
        saturday: "Mon - Sat: 9:00 AM - 8:30 PM",
        sunday: "Sun: 10:00 AM - 2:00 PM",
    },
    social: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        twitter: "https://twitter.com",
    },
    googleMapsUrl: "https://maps.google.com/?q=100/100,+Podanur+Main+Rd,+opposite+by+Rasi+Food,+Thirumarai+Nagar,+Coimbatore,+Tamil+Nadu+641023",
    googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.8!2d76.97!3d10.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a0f0000000%3A0x0!2sPodanur+Main+Rd%2C+Coimbatore%2C+Tamil+Nadu+641023!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
};
