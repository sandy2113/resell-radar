import type { CategoryMeta, City, Dealer } from "@/types/discovery";
import type { Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed with ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function qs(
  p: Record<string, string | number | undefined | null>
): string {
  const u = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) {
    if (v == null || v === "") {
      continue;
    }
    u.set(k, String(v));
  }
  const s = u.toString();
  return s ? `?${s}` : "";
}

export const api = {
  listProducts: (opts?: {
    city?: string;
    cityId?: number;
    category?: string;
    minMargin?: number;
    maxPrice?: number;
  }) =>
    request<Product[]>(
      `/api/products${qs({
        city: opts?.city,
        cityId: opts?.cityId,
        category: opts?.category,
        minMargin: opts?.minMargin,
        maxPrice: opts?.maxPrice,
      })}`
    ),
  getProduct: (id: string) => request<Product>(`/api/products/${id}`),
  listTrending: (opts?: { city?: string; cityId?: number }) =>
    request<Product[]>(
      `/api/trending${qs({
        city: opts?.city,
        cityId: opts?.cityId,
      })}`
    ),
  listCities: () => request<City[]>("/api/cities"),
  listCategories: () => request<CategoryMeta[]>("/api/categories"),
  listDealers: (cityId: number) =>
    request<Dealer[]>(`/api/dealers?cityId=${cityId}`),
  listKeywords: () =>
    request<
      { keyword: string; searchVolume: number; trendScore: number }[]
    >("/api/trending/keywords"),
};
