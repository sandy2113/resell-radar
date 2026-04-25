import type { CategoryMeta, City, Dealer } from "../types/discovery";

export const mockCities: City[] = [
  {
    id: 1,
    name: "Mumbai",
    slug: "mumbai",
    region: "Maharashtra",
    country: { code: "IN", name: "India" },
  },
  {
    id: 2,
    name: "Delhi",
    slug: "delhi",
    region: "NCT",
    country: { code: "IN", name: "India" },
  },
  {
    id: 3,
    name: "Bengaluru",
    slug: "bengaluru",
    region: "Karnataka",
    country: { code: "IN", name: "India" },
  },
  {
    id: 4,
    name: "Hyderabad",
    slug: "hyderabad",
    region: "Telangana",
    country: { code: "IN", name: "India" },
  },
];

export const mockCategories: CategoryMeta[] = [
  {
    id: 1,
    slug: "home-decor",
    name: "Home Decor",
    description: "Ambience, lighting, and room upgrades that read well in short video.",
    tagline: "Looks premium, often lean on cost",
    sortOrder: 10,
  },
  {
    id: 2,
    slug: "kitchen",
    name: "Kitchen",
    description: "Practical tools and small gadgets for everyday use.",
    tagline: "High saves, easy demos",
    sortOrder: 20,
  },
  {
    id: 3,
    slug: "tech-accessories",
    name: "Tech Accessories",
    description: "Stands, chargers, and desk upgrades for phone-first life.",
    tagline: "Always relevant to buyers",
    sortOrder: 30,
  },
  {
    id: 4,
    slug: "health-wellness",
    name: "Health & Wellness",
    description: "Posture, comfort, and small wellness wins with clear story angles.",
    tagline: "Obvious “pain to relief” arc",
    sortOrder: 40,
  },
  {
    id: 5,
    slug: "travel",
    name: "Travel",
    description: "Compact travel comfort with steady, gift-friendly interest.",
    tagline: "Seasonless, scroll-stopping",
    sortOrder: 50,
  },
];

export const mockDealers: Dealer[] = [
  {
    id: 1,
    cityId: 1,
    name: "SparkTrade Wholesale",
    area: "Andheri",
    phone: "+91-90000-10001",
    whatsapp: null,
    website: "https://example.com",
    notes: "B2B + small lot",
  },
  {
    id: 2,
    cityId: 1,
    name: "Metro Goods Hub",
    area: "Borivali",
    phone: "+91-90000-10002",
    whatsapp: null,
    website: "https://example.com",
    notes: "Evening pickup",
  },
  {
    id: 3,
    cityId: 2,
    name: "Capital Mart Supply",
    area: "Karol Bagh",
    phone: "+91-90000-20001",
    whatsapp: null,
    website: "https://example.com",
    notes: "Bulk pricing",
  },
];
