import type { Product } from "../types/product";

export const mockProducts: Product[] = [
  {
    id: "p-001",
    name: "LED Galaxy Star Projector",
    category: "Home Decor",
    description:
      "Bestselling room ambience projector with bluetooth speaker. High-perceived value, low cost — perfect for reels.",
    imageUrl:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800",
    costPrice: 350,
    sellingPrice: 999,
    profitMargin: 65,
    trendScore: 92,
    demandScore: 88,
    competitionLevel: "medium",
    targetAudience: "Gen-Z, students, couples decorating bedrooms",
    suppliers: [
      {
        name: "Meesho",
        url: "https://www.meesho.com/search?q=galaxy+projector",
        price: 380,
      },
      {
        name: "IndiaMART",
        url: "https://dir.indiamart.com/search.mp?ss=galaxy+projector",
        price: 320,
      },
      {
        name: "Alibaba",
        url: "https://www.alibaba.com/trade/search?SearchText=galaxy+projector",
        price: 280,
      },
    ],
    content: {
      reelHook: "POV: Your room turned into a galaxy in 10 seconds",
      demoIdea:
        "Lights off → flick projector on → slow pan across ceiling stars → reveal price",
      caption:
        "Turn any room into a vibe in 10 seconds ✨ Link in bio. Limited stock.",
      hashtags: [
        "#roomdecor",
        "#aestheticroom",
        "#bedroomvibes",
        "#galaxyprojector",
        "#indianreseller",
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-002",
    name: "Mini Portable Sealing Machine",
    category: "Kitchen",
    description:
      "Handheld bag sealer for snacks. Practical, demo-friendly, and a viral-proven category.",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    costPrice: 120,
    sellingPrice: 399,
    profitMargin: 70,
    trendScore: 81,
    demandScore: 76,
    competitionLevel: "high",
    targetAudience: "Homemakers, hostel students, food storage seekers",
    suppliers: [
      {
        name: "Meesho",
        url: "https://www.meesho.com/search?q=mini+sealer",
        price: 150,
      },
      {
        name: "IndiaMART",
        url: "https://dir.indiamart.com/search.mp?ss=mini+bag+sealer",
        price: 110,
      },
    ],
    content: {
      reelHook: "Stop using clips — this seals chips bags in 2 seconds",
      demoIdea:
        "Open chips bag → seal with one stroke → turn upside down → nothing falls out",
      caption: "Snacks. Sealed. Forever fresh. 🔥 Link in bio.",
      hashtags: [
        "#kitchenhacks",
        "#kitchengadgets",
        "#minisealer",
        "#homehacks",
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-003",
    name: "Magnetic Wireless Charger Stand",
    category: "Tech Accessories",
    description:
      "MagSafe-style charger stand. Premium look at low cost. High repeat-purchase category.",
    imageUrl:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800",
    costPrice: 280,
    sellingPrice: 799,
    profitMargin: 64,
    trendScore: 87,
    demandScore: 90,
    competitionLevel: "medium",
    targetAudience: "iPhone users, work-from-home professionals",
    suppliers: [
      {
        name: "IndiaMART",
        url: "https://dir.indiamart.com/search.mp?ss=magsafe+charger+stand",
        price: 260,
      },
      {
        name: "Alibaba",
        url: "https://www.alibaba.com/trade/search?SearchText=magsafe+stand",
        price: 220,
      },
    ],
    content: {
      reelHook: "Your iPhone deserves better than that ugly cable",
      demoIdea:
        "Cluttered desk → swap to magnetic stand → snap iPhone on → clean reveal",
      caption: "Your desk just got an upgrade. Magnetic. Wireless. ₹799.",
      hashtags: [
        "#deskaccessories",
        "#magsafe",
        "#wirelesscharger",
        "#deskvibes",
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-004",
    name: "Posture Corrector Belt",
    category: "Health & Wellness",
    description:
      "Adjustable posture corrector. Strong demand from desk workers. Demo-driven sales.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    costPrice: 180,
    sellingPrice: 599,
    profitMargin: 70,
    trendScore: 74,
    demandScore: 82,
    competitionLevel: "high",
    targetAudience: "Office workers, students, gym beginners",
    suppliers: [
      {
        name: "Meesho",
        url: "https://www.meesho.com/search?q=posture+corrector",
        price: 200,
      },
      {
        name: "IndiaMART",
        url: "https://dir.indiamart.com/search.mp?ss=posture+corrector+belt",
        price: 170,
      },
    ],
    content: {
      reelHook: "Wearing this for 7 days fixed my back pain",
      demoIdea:
        "Slouching at desk → put on belt → instant straight posture transition",
      caption:
        "Bad posture? This is the cheat code 🪄 Comment YES for the link.",
      hashtags: [
        "#posturecorrection",
        "#healthhacks",
        "#workfromhome",
        "#backpainrelief",
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-005",
    name: "Self-Stirring Coffee Mug",
    category: "Kitchen",
    description:
      "Battery-operated stirring mug. Highly visual, perfect for short demo reels.",
    imageUrl:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800",
    costPrice: 220,
    sellingPrice: 699,
    profitMargin: 68,
    trendScore: 79,
    demandScore: 71,
    competitionLevel: "medium",
    targetAudience: "Coffee lovers, gifting buyers, gadget enthusiasts",
    suppliers: [
      {
        name: "Meesho",
        url: "https://www.meesho.com/search?q=self+stirring+mug",
        price: 240,
      },
      {
        name: "Alibaba",
        url: "https://www.alibaba.com/trade/search?SearchText=self+stirring+mug",
        price: 180,
      },
    ],
    content: {
      reelHook: "Lazy people, this mug is for you",
      demoIdea:
        "Pour coffee + sugar → press button → mug stirs itself → satisfying close-up",
      caption: "Stir-free mornings. ☕ One press = smooth coffee.",
      hashtags: [
        "#coffeegadgets",
        "#lazyhacks",
        "#kitchengadgets",
        "#giftideas",
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-006",
    name: "Foldable Travel Neck Pillow",
    category: "Travel",
    description:
      "Memory foam travel pillow that folds into a small pouch. Steady year-round demand.",
    imageUrl:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
    costPrice: 160,
    sellingPrice: 549,
    profitMargin: 71,
    trendScore: 68,
    demandScore: 72,
    competitionLevel: "low",
    targetAudience: "Travelers, IT professionals, bus/train commuters",
    suppliers: [
      {
        name: "Meesho",
        url: "https://www.meesho.com/search?q=neck+pillow+travel",
        price: 180,
      },
      {
        name: "IndiaMART",
        url: "https://dir.indiamart.com/search.mp?ss=foldable+neck+pillow",
        price: 150,
      },
    ],
    content: {
      reelHook: "Long flights but no neck pain — here's how",
      demoIdea:
        "Pillow tightly folded in pouch → pull out → expand → wrap around neck",
      caption: "Travel-sized comfort. Folds smaller than your phone.",
      hashtags: ["#travelessentials", "#travelhacks", "#flightcomfort"],
    },
    createdAt: new Date().toISOString(),
  },
];
