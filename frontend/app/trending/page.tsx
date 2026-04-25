import Link from "next/link";
import { CityPills } from "@/components/CityPills";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const DEFAULT = "mumbai";

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: { city?: string };
}) {
  const city = (searchParams.city ?? DEFAULT).toLowerCase();
  let products: Product[] = [];
  let cities = await api.listCities().catch(() => [] as Awaited<ReturnType<typeof api.listCities>>);
  let error: string | null = null;
  try {
    products = await api.listTrending({ city });
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed";
  }

  const active = cities.find((c) => c.slug === city)?.slug ?? DEFAULT;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900 md:text-4xl">
          Trending board
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          City-specific ordering when <code className="rounded bg-slate-100 px-1">product_city_trend</code> is
          populated; otherwise you still get the national stack.
        </p>
      </div>

      {cities.length > 0 ? (
        <CityPills cities={cities} activeSlug={active} basePath="/trending" />
      ) : null}

      {error ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <p className="text-center text-sm text-slate-500">
        Want the story behind a product?{" "}
        <Link href="/products" className="font-semibold text-cyan-700 hover:underline">
          Open the full catalogue
        </Link>
        .
      </p>
    </div>
  );
}
