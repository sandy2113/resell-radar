export type Country = {
  id: number;
  code: string;
  name: string;
};

export type City = {
  id: number;
  name: string;
  slug: string;
  region: string | null;
  country: Pick<Country, "code" | "name">;
};

export type CategoryMeta = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  tagline: string | null;
  sortOrder: number;
};

export type Dealer = {
  id: number;
  cityId: number;
  name: string;
  area: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  notes: string | null;
};
