export type Supplier = {
  name: string;
  url: string;
  price: number;
};

export type ContentIdea = {
  reelHook: string;
  demoIdea: string;
  caption: string;
  hashtags: string[];
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  costPrice: number;
  sellingPrice: number;
  profitMargin: number;
  trendScore: number;
  demandScore: number;
  competitionLevel: "low" | "medium" | "high";
  targetAudience: string;
  suppliers: Supplier[];
  content: ContentIdea;
  createdAt: string;
};
